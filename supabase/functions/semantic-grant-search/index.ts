
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
      match_threshold: 0.1, // Lower threshold to get more results
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

    // Calculate actual similarity scores based on vector distance
    const rankedGrants = matches.map((match: any) => {
      // The match_grant_call_details function returns results with cosine distance
      // Convert cosine distance to similarity score (0-1 scale)
      // Cosine distance is typically between 0-2, where 0 is most similar
      // We'll convert this to a percentage where higher = more similar
      const cosineDistance = match.distance || 1.0; // fallback if no distance
      const similarityScore = Math.max(0, (2 - cosineDistance) / 2); // Convert to 0-1 scale
      const relevanceScore = Math.round(similarityScore * 100) / 100; // Round to 2 decimal places
      
      console.log(`📊 Grant ${match.id}: Distance: ${cosineDistance}, Similarity: ${relevanceScore}`);
      
      return {
        grantId: match.id,
        relevanceScore: relevanceScore,
        matchingReasons: [
          `Semantic similarity score: ${Math.round(relevanceScore * 100)}%`,
          `Vector distance: ${cosineDistance.toFixed(3)}`
        ]
      };
    });

    // Sort by relevance score (highest first)
    rankedGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const response = {
      rankedGrants,
      explanation: `Found ${matches.length} grants using semantic search based on your query: "${query}"`
    };

    console.log(`✅ Returning ${rankedGrants.length} ranked grants with actual similarity scores`);
    
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
