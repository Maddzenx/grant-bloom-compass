import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('🎭 Generating humorous search example...');

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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the cheapest model
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
        temperature: 0.9, // Higher temperature for more creativity
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const generatedExample = aiResponse.choices[0].message.content.trim();

    console.log('✅ Generated humorous example:', generatedExample);

    return new Response(
      JSON.stringify({
        success: true,
        example: generatedExample
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