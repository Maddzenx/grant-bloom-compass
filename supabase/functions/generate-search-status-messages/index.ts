import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

// Free models to try for message generation (prioritize working models)
const freeModels = [
  'google/gemma-3n-e4b-it:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemma-3n-e2b-it:free',
  'qwen/qwen3-4b:free',
  'nousresearch/deephermes-3-llama-3-8b-preview:free'
];

async function generateWithModel(model: string, prompt: string, openRouterApiKey: string, query: string): Promise<string[]> {
  console.log(`🔄 Trying model: ${model}`);
  
  // First try with non-streaming for more reliable JSON parsing
  try {
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
        messages: model.includes('google/gemma') || model.includes('microsoft/phi') ? [
          // Some models don't support system messages, combine instructions
          {
            role: 'user',
            content: `You are a helpful assistant. Always respond with valid JSON only.

Generate exactly 10 short, humorous Swedish status messages for a grant search. Return only a JSON array like this format:
["message 1", "message 2", "message 3", "message 4", "message 5", "message 6", "message 7", "message 8", "message 9", "message 10"]

Each message should be max 80 characters and describe what someone might be doing while searching for grants. Make them slightly funny but professional.

Search query: "${query.substring(0, 100)}"

Return only the JSON array, nothing else:`
          }
        ] : [
          // Standard format with separate system message
          {
            role: 'system',
            content: 'You are a helpful assistant. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: `Generate exactly 10 short, humorous Swedish status messages for a grant search. Return only a JSON array like this format:
["message 1", "message 2", "message 3", "message 4", "message 5", "message 6", "message 7", "message 8", "message 9", "message 10"]

Each message should be max 80 characters and describe what someone might be doing while searching for grants. Make them slightly funny but professional.

Search query: "${query.substring(0, 100)}"

Return only the JSON array, nothing else:`
          }
        ],
        temperature: 0.9,
        max_tokens: 600,
        stream: false, // Use non-streaming for reliable JSON
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const aiResponse = await response.json();
    
    // Log full response for debugging
    console.log('🔍 Full AI response:', JSON.stringify(aiResponse, null, 2));
    
    // Handle different response formats
    let content = '';
    if (aiResponse.choices && aiResponse.choices[0] && aiResponse.choices[0].message) {
      const message = aiResponse.choices[0].message;
      // Try content field first, then reasoning field (some models use reasoning)
      content = message.content || message.reasoning || '';
    } else if (aiResponse.content) {
      content = aiResponse.content;
    } else if (aiResponse.message) {
      content = aiResponse.message;
    } else {
      throw new Error(`Unexpected response format: ${JSON.stringify(aiResponse)}`);
    }
    
    content = content.trim();
    console.log('🎭 AI content to parse:', content);
    
    if (!content || content.length < 10) {
      throw new Error(`Empty or too short response content: "${content}"`);
    }
    
    // Clean up the content - remove any markdown formatting
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
    }
    if (content.includes('```')) {
      content = content.replace(/```.*?\n/g, '').replace(/\n```/g, '').trim();
    }
    
    // Find JSON array in the content
    let messages;
    
    // Try to parse as direct JSON
    try {
      messages = JSON.parse(content);
    } catch (parseError) {
      console.log('🔍 Direct JSON parse failed:', parseError.message);
      
      // Try to extract JSON array from text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          messages = JSON.parse(jsonMatch[0]);
        } catch (regexParseError) {
          console.log('🔍 Regex extracted JSON parse failed:', regexParseError.message);
          throw new Error(`JSON parsing failed. Content: "${content.substring(0, 200)}..."`);
        }
      } else {
        throw new Error(`No JSON array pattern found in response: "${content.substring(0, 200)}..."`);
      }
    }
    
    // Ensure it's an array with 10 items
    if (!Array.isArray(messages) || messages.length !== 10) {
      throw new Error(`Invalid array format - got ${typeof messages}, length: ${messages?.length}`);
    }

    return messages;
    
  } catch (error) {
    console.error(`❌ Non-streaming failed for ${model}:`, error.message);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!openRouterApiKey) {
      // Return fallback messages if no API key
      const fallbackMessages = [
        "Letar igenom alla bidrag som om det vore en skattjakt...",
        "Tar en snabb fika medan AI:n kör på högvarv...", 
        "Analyserar bidrag som om det vore hem-bak-recept...",
        "Räknar på siffror medan katten sitter på tangentbordet...",
        "Matchar din förfrågan som en professionell cupid...",
        "Polerar resultaten innan de presenteras...",
        "Diskuterar med kollegor över kaffemaskinen...",
        "Funderar djupt över vilka kriterier som passar bäst...",
        "Sorterar genom dokument som om det vore lego-bitar...",
        "Gör en snabb koll av alla möjligheter som finns..."
      ];
      
      return new Response(
        JSON.stringify({
          success: true,
          messages: fallbackMessages
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('🎭 Generating humorous search status messages with OpenRouter...');

    const prompt = `Generate 10 humorous, Swedish search status messages for a grant search platform. These should be entertaining depictions of what a person tasked with completing the search might do while working.

The search query is: "${query}"

Requirements:
1. Write in Swedish
2. Each message should be 1 sentence, maximum 80 characters  
3. Humor style should be slightly whimsical but professional enough for a business platform
4. Try to relate the messages to the search query theme when possible
5. Messages should depict actions a person might take while searching (doing calculations, looking at files, emailing a colleague, analyzing data, reflecting over certain aspects of the search, etc.)

Examples of the humor style:
- "Sätter mig på en parkbänk och funderar på meningen med bomullstussar"
- "Reflekterar över skillnaden i vikt mellan ärtor och pingisbollar"
- "Ringer IT-support för att fråga hur en datorskärm egentligen fungerar"

IMPORTANT: Return ONLY a valid JSON array with exactly 10 strings. No other text, no explanations, just the JSON array like this:
["message 1", "message 2", "message 3", "message 4", "message 5", "message 6", "message 7", "message 8", "message 9", "message 10"]`;

    let generatedMessages: string[] = [];
    let lastError = '';

    // Try each model in sequence until one works (NO DELAY for fast response)
    for (const model of freeModels) {
      try {
        generatedMessages = await generateWithModel(model, prompt, openRouterApiKey, query);
        if (generatedMessages && generatedMessages.length === 10) {
          console.log(`✅ Successfully generated messages with ${model}`);
          break;
        }
      } catch (error) {
        lastError = error.message;
        console.warn(`❌ Model ${model} failed:`, error.message);
        continue;
      }
    }

    // If no model worked, use fallback messages
    if (!generatedMessages || generatedMessages.length !== 10) {
      console.error('All models failed, using fallback messages. Last error:', lastError);
      generatedMessages = [
        "🔍 Letar igenom alla bidrag som om det vore en skattjakt...",
        "☕ Tar en snabb fika medan sökningen pågår...",
        "🧐 Analyserar din förfrågan med expertblick...", 
        "📊 Räknar på möjligheter medan musiken spelar...",
        "🎯 Matchar bidrag som en professionell cupid...",
        "✨ Finsliper resultaten innan de presenteras...",
        "📋 Sorterar genom alla dokument noggrant...",
        "🤔 Funderar över de bästa matchningarna...",
        "💡 Får en plötslig inspiration om nya möjligheter...",
        "🎉 Förbereder de mest relevanta resultaten..."
      ];
    }

    console.log('✅ Generated search status messages:', generatedMessages);

    return new Response(
      JSON.stringify({
        success: true,
        messages: generatedMessages
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-search-status-messages:', error);
    
    // Always return fallback messages on error
    const fallbackMessages = [
      "🔍 Letar igenom alla bidrag som om det vore en skattjakt...",
      "☕ Tar en snabb fika medan AI:n kör på högvarv...",
      "🧐 Analyserar bidrag som om det vore hem-bak-recept...",
      "📊 Räknar på siffror medan katten sitter på tangentbordet...",
      "🎯 Matchar din förfrågan som en professionell cupid...",
      "✨ Polerar resultaten innan de presenteras...",
      "📋 Organiserar alla dokument i alfabetisk ordning...",
      "🤔 Funderar djupt över alla möjligheter...",
      "💡 Brainstormar kreativa lösningar medan tiden går...",
      "🎉 Gör de sista finjusteringarna inför presentationen..."
    ];
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        messages: fallbackMessages
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 