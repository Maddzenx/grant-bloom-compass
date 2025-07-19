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
    const { query } = await req.json();

    if (!openAIApiKey) {
      // Return fallback messages if no API key
      const fallbackMessages = [
        "Letar igenom alla bidrag som om det vore en skattjakt...",
        "Tar en snabb fika medan AI:n kör på högvarv...", 
        "Analyserar bidrag som om det vore hem-bak-recept...",
        "Räknar på siffror medan katten sitter på tangentbordet...",
        "Matchar din förfrågan som en professionell cupid...",
        "Polerar resultaten innan de presenteras..."
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

    console.log('Generating humorous search status messages for query:', query);

    const prompt = `Generate 6 humorous, Swedish search status messages for a grant search platform. These should be entertaining depictions of what a person tasked with completing the search might do while working.

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

IMPORTANT: Return ONLY a valid JSON array with exactly 6 strings. No other text, no explanations, just the JSON array like this:
["message 1", "message 2", "message 3", "message 4", "message 5", "message 6"]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'system',
            content: 'You are a creative writer specializing in humorous but professional Swedish text. Always respond with exactly 6 messages in a JSON array format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let generatedMessages;
    
    try {
      // Log the full AI response for debugging
      console.log('🔍 Full AI response:', JSON.stringify(aiResponse, null, 2));
      
      // Try to parse as JSON array
      const content = aiResponse.choices[0].message.content.trim();
      console.log('🎭 AI content to parse:', content);
      
      generatedMessages = JSON.parse(content);
      
      // Ensure it's an array with 6 items
      if (!Array.isArray(generatedMessages) || generatedMessages.length !== 6) {
        console.error(`❌ Invalid array format - got ${typeof generatedMessages}, length: ${generatedMessages?.length}`);
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response, using fallback. Parse error:', parseError);
      // Fallback messages related to the query theme
      generatedMessages = [
        "🔍 Letar igenom alla bidrag som om det vore en skattjakt...",
        "☕ Tar en snabb fika medan sökningen pågår...",
        "🧐 Analyserar din förfrågan med expertblick...", 
        "📊 Räknar på möjligheter medan musiken spelar...",
        "🎯 Matchar bidrag som en professionell cupid...",
        "✨ Finsliper resultaten innan de presenteras..."
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
      "✨ Polerar resultaten innan de presenteras..."
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