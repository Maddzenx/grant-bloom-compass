
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

    console.log('✅ Embedding generated, using direct SQL query with negative inner product...');

    // Use direct SQL query with negative inner product since the RPC function might be using cosine distance
    const { data: matches, error: searchError } = await supabase
      .from('grant_call_details')
      .select('*')
      .not('embedding', 'is', null)
      .limit(20);

    if (searchError) {
      console.error('Supabase search error:', searchError);
      throw new Error(`Search failed: ${searchError.message}`);
    }

    if (!matches || matches.length === 0) {
      console.log('No grants with embeddings found');
      return new Response(JSON.stringify({
        rankedGrants: [],
        explanation: 'No grants with embeddings found'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate negative inner product manually for each grant
    const grantsWithScores = matches
      .map((grant: any) => {
        if (!grant.embedding) return null;
        
        try {
          // Parse the embedding string to array
          const grantEmbedding = JSON.parse(grant.embedding);
          
          // Calculate negative inner product manually
          let dotProduct = 0;
          for (let i = 0; i < queryEmbedding.length && i < grantEmbedding.length; i++) {
            dotProduct += queryEmbedding[i] * grantEmbedding[i];
          }
          const negativeInnerProduct = -dotProduct;
          
          return {
            ...grant,
            distance: negativeInnerProduct
          };
        } catch (error) {
          console.error('Error parsing embedding for grant:', grant.id, error);
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance) // Sort by negative inner product (smaller is better)
      .slice(0, 20);

    console.log(`📊 Found ${grantsWithScores.length} grants with calculated negative inner products`);

    if (grantsWithScores.length === 0) {
      console.log('No valid embeddings found');
      return new Response(JSON.stringify({
        rankedGrants: [],
        explanation: 'No grants with valid embeddings found'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate similarity scores based on actual negative inner product values
    const rankedGrants = grantsWithScores.map((match: any, index: number) => {
      const negativeInnerProduct = match.distance;
      
      // For negative inner product with normalized embeddings, values typically range from -1 to 1
      // Convert to similarity score (0-1 scale) where values closer to 1 are more similar
      const similarityScore = Math.max(0, Math.min(1, (-negativeInnerProduct + 1) / 2));
      const relevanceScore = Math.round(similarityScore * 100) / 100;
      
      console.log(`📊 Grant ${match.id}: Negative Inner Product: ${negativeInnerProduct.toFixed(6)}, Similarity: ${relevanceScore}`);
      
      return {
        grantId: match.id,
        relevanceScore: relevanceScore,
        matchingReasons: [
          `Semantic similarity score: ${Math.round(relevanceScore * 100)}%`,
          `Negative inner product: ${negativeInnerProduct.toFixed(6)}`
        ]
      };
    });

    const response = {
      rankedGrants,
      explanation: `Found ${grantsWithScores.length} grants using manual negative inner product calculation based on your query: "${query}"`
    };

    console.log(`✅ Returning ${rankedGrants.length} ranked grants with calculated similarity scores`);
    console.log('Top 3 scores:', rankedGrants.slice(0, 3).map(g => ({ id: g.grantId, score: g.relevanceScore })));
    
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
