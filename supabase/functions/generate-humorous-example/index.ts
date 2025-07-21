import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

// Free models to try in order of preference
const freeModels = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemma-2-9b-it:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen-2-7b-instruct:free'
];

async function generateWithModel(model: string, prompt: string, openRouterApiKey: string): Promise<string> {
  console.log(`🔄 Trying model: ${model}`);
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openRouterApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://grant-bloom-compass.com',
      'X-Title': 'Grant Bloom Compass'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a creative writer specializing in humorous but professional business descriptions. Always respond with exactly one sentence in Swedish.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 100,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  let generatedExample = '';
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  if (!reader) {
    throw new Error('Failed to get response reader');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          break;
        }
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            generatedExample += content;
          }
        } catch (e) {
          // Skip malformed JSON chunks
          continue;
        }
      }
    }
  }

  return generatedExample.trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    console.log('🎭 Generating humorous search example with OpenRouter streaming (with model fallbacks)...');

    const prompt = `Generate a humorous, one-sentence search query example for a Swedish grant application platform. The example should:

1. Be written in Swedish
2. Describe a quirky or amusing business/research project that could realistically apply for grants
3. Be professional enough to not be offensive but amusing enough to make people smile
4. Be related to business development, research, or innovation
5. Be one sentence long (max 150 characters)
6. Follow this style: "Vi är ett [funny description] från [location] som vill [business goal/expansion]"

Examples of the style:
- "Vi är ett konsortium av pirater från Karibien som vill expandera vår verksamhet till att sälja krabbor på lokala loppmarknader"
- "Vi är en forskningsgrupp från Västernorrlands län som studerar varför katter alltid landar på sina fötter och vill utveckla detta till fallskärmsteknologi"
- "Vi är ett startup från Karlsborg som utvecklar AI-assistenter för att hjälpa plantor att nätverka med varandra"

Generate ONE new example in this style:`;

    let finalExample = '';
    let lastError = '';

    // Try each model in sequence until one works
    for (const model of freeModels) {
      try {
        finalExample = await generateWithModel(model, prompt, openRouterApiKey);
        if (finalExample && finalExample.length > 10) {
          console.log(`✅ Successfully generated example with ${model}:`, finalExample);
          break;
        }
      } catch (error) {
        lastError = error.message;
        console.warn(`❌ Model ${model} failed:`, error.message);
        // Continue to next model
        continue;
      }
    }

    // If no model worked, throw the last error
    if (!finalExample || finalExample.length <= 10) {
      throw new Error(`All models failed. Last error: ${lastError}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        example: finalExample || 'Vi är ett konsortium av pirater som vill expandera vår verksamhet till att sälja krabbor på lokala loppmarknader'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-humorous-example:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        // Fallback example
        example: 'Vi är ett konsortium av pirater som vill expandera vår verksamhet till att sälja krabbor på lokala loppmarknader'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 