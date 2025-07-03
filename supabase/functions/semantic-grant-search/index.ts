
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

    console.log('🔍 Semantic Grant Search - Received query:', query);

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ 
        error: 'Semantic search temporarily unavailable',
        rankedGrants: [],
        explanation: 'Semantic search temporarily unavailable - API key not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate embedding using OpenAI
    console.log('📊 Generating embedding with OpenAI...');
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
        encoding_format: "float",
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('OpenAI embedding error:', errorText);
      throw new Error(`OpenAI API error: ${embeddingResponse.status}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    console.log('✅ Embedding generated, searching for matches...');

    // Use the correct Supabase semantic search function
    const { data: matches, error: searchError } = await supabase.rpc('match_grant_call_details', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5, // Lower threshold to get more results
      match_count: 20,
    });

    if (searchError) {
      console.error('Supabase search error:', searchError);
      throw new Error(`Search failed: ${searchError.message}`);
    }

    console.log(`📊 Found ${matches?.length || 0} semantic matches`);

    if (!matches || matches.length === 0) {
      console.log('No matches found');
      return new Response(JSON.stringify({
        rankedGrants: [],
        explanation: 'No matching grants found for your search query'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate similarity scores and transform matches to expected format
    const rankedGrants = matches.map((match: any, index: number) => {
      // Calculate a relevance score based on the semantic similarity
      // The match_grant_call_details function returns results ordered by similarity
      const baseScore = 0.95 - (index * 0.03); // Start high and decrease
      const relevanceScore = Math.max(0.1, baseScore); // Ensure minimum score
      
      console.log(`📊 Match ${index + 1}: Grant ${match.id}, Score: ${relevanceScore}`);
      
      return {
        grantId: match.id,
        relevanceScore: relevanceScore,
        matchingReasons: [
          `Semantic similarity match (rank ${index + 1})`,
          `Relevance score: ${relevanceScore.toFixed(2)}`
        ]
      };
    });

    const response = {
      rankedGrants,
      explanation: `Found ${matches.length} grants using semantic search based on your query: "${query}"`
    };

    console.log(`✅ Returning ${rankedGrants.length} ranked grants`);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in semantic-grant-search:', error);
    return new Response(JSON.stringify({
      error: 'Semantic search failed - please try again',
      rankedGrants: [],
      explanation: 'Search encountered an error - please try again'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
