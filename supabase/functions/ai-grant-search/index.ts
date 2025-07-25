
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🔍 AI Grant Search - Query:', query);

    // Fetch all grants from the database
    const { data: grants, error: grantsError } = await supabase
      .from('grant_call_details')
      .select('*');

    if (grantsError) {
      throw new Error(`Failed to fetch grants: ${grantsError.message}`);
    }

    if (!grants || grants.length === 0) {
      return new Response(JSON.stringify({ 
        rankedGrants: [],
        explanation: 'No grants found in database'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📊 Processing grants:', grants.length);

    // Prepare grants data for AI analysis
    const grantsForAI = grants.map(grant => ({
      id: grant.id,
      title: grant.title,
      subtitle: grant.subtitle,
      description: grant.description,
      search_description: grant.search_description,
      keywords: grant.keywords,
      industry_sectors: grant.industry_sectors
    }));

    const prompt = `You are an expert grant matching system. Given a user query and a list of available grants, analyze which grants best match the user's needs and rank them by relevance.

User Query: "${query}"

Available Grants:
${JSON.stringify(grantsForAI, null, 2)}

Please analyze the user query against the grant information including title, subtitle, description, search_description, keywords, and industry_sectors. 

Return a JSON response with the following structure:
{
  "rankedGrants": [
    {
      "grantId": "grant_id_here",
      "relevanceScore": 0.72
    }
  ],
  "explanation": "Brief explanation of the matching process"
}

Rules:
- Rank ALL grants by relevance (0.00 to 1.00 score, with 2 digits precision)
- Consider semantic similarity, not just keyword matching
- Be thorough in your analysis

Consider:
- Relevance to the user's project description
- Focus area alignment based on keywords and industry sectors
- Content match with title, subtitle, description, and search_description`;



    console.log('🤖 Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert grant matching assistant. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices[0].message.content;

    console.log('🤖 OpenAI response received');

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback: return grants in original order with basic scoring
      parsedResponse = {
        rankedGrants: grantsForAI.map(grant => ({
          grantId: grant.id,
          relevanceScore: 0.5
        })),
        explanation: 'Using fallback matching due to AI response parsing error'
      };
    }

    console.log('✅ AI search completed successfully');
    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-grant-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      rankedGrants: [],
      explanation: 'Search temporarily unavailable'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
