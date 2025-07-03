
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

    console.log('✅ Embedding generated, fetching grants for cosine similarity comparison...');

    // Get all grants with embeddings for manual similarity calculation using cosine distance
    const { data: grants, error: grantsError } = await supabase
      .from('grant_call_details')
      .select('*')
      .not('embedding', 'is', null);

    if (grantsError) {
      console.error('Error fetching grants:', grantsError);
      throw new Error(`Failed to fetch grants: ${grantsError.message}`);
    }

    console.log(`📊 Found ${grants?.length || 0} grants with embeddings`);

    if (!grants || grants.length === 0) {
      console.log('No grants found with embeddings');
      return new Response(JSON.stringify({
        rankedGrants: [],
        explanation: 'No grants found with embeddings for semantic search'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate similarity scores manually using cosine distance
    const scoredGrants = grants.map((grant: any) => {
      if (!grant.embedding) {
        return { grant, rawScore: 0 };
      }

      // Parse the embedding vector string to array
      let grantEmbedding;
      try {
        // Handle different embedding formats
        if (typeof grant.embedding === 'string') {
          // Remove brackets and split by comma
          const cleanStr = grant.embedding.replace(/[\[\]]/g, '');
          grantEmbedding = cleanStr.split(',').map((x: string) => parseFloat(x.trim()));
        } else if (Array.isArray(grant.embedding)) {
          grantEmbedding = grant.embedding;
        } else {
          console.warn(`Invalid embedding format for grant ${grant.id}`);
          return { grant, rawScore: 0 };
        }

        // Calculate cosine similarity manually
        // First calculate dot product
        let dotProduct = 0;
        for (let i = 0; i < Math.min(queryEmbedding.length, grantEmbedding.length); i++) {
          dotProduct += queryEmbedding[i] * grantEmbedding[i];
        }

        // Calculate magnitudes
        let queryMagnitude = 0;
        let grantMagnitude = 0;
        for (let i = 0; i < queryEmbedding.length; i++) {
          queryMagnitude += queryEmbedding[i] * queryEmbedding[i];
        }
        for (let i = 0; i < grantEmbedding.length; i++) {
          grantMagnitude += grantEmbedding[i] * grantEmbedding[i];
        }
        queryMagnitude = Math.sqrt(queryMagnitude);
        grantMagnitude = Math.sqrt(grantMagnitude);

        // Calculate cosine similarity
        const cosineSimilarity = dotProduct / (queryMagnitude * grantMagnitude);
        
        return { grant, rawScore: cosineSimilarity };
      } catch (error) {
        console.error(`Error processing embedding for grant ${grant.id}:`, error);
        return { grant, rawScore: 0 };
      }
    });

    // Sort by raw score (highest first) to find the top score
    const sortedByRawScore = scoredGrants.sort((a, b) => b.rawScore - a.rawScore);
    
    // Get the top score for sliding scale calculation
    const topScore = sortedByRawScore[0]?.rawScore || 0;
    console.log(`📊 Top raw cosine similarity score: ${topScore.toFixed(4)}`);

    // Implement sliding scale
    // Map the top score to a range between 60% and 100%
    const minDisplayScore = 0.6; // 60%
    const maxDisplayScore = 1.0; // 100%
    
    // Calculate the scaling factor based on the top score
    // If top score is very high (e.g., 0.9), scale differently than if it's lower (e.g., 0.3)
    const scoreRange = maxDisplayScore - minDisplayScore; // 0.4 (40% range)
    
    const scaledGrants = sortedByRawScore.map(({ grant, rawScore }) => {
      let scaledScore;
      
      if (topScore <= 0) {
        // If no meaningful similarity, set all to 0
        scaledScore = 0;
      } else {
        // Scale relative to the top score
        // The top score gets mapped to somewhere between 60-100% based on its actual value
        const normalizedScore = rawScore / topScore; // 0 to 1 relative to top score
        
        // Determine the target max score based on the top score quality
        let targetMaxScore;
        if (topScore >= 0.8) {
          targetMaxScore = 1.0; // Excellent match - top can be 100%
        } else if (topScore >= 0.6) {
          targetMaxScore = 0.9; // Good match - top can be 90%
        } else if (topScore >= 0.4) {
          targetMaxScore = 0.8; // Decent match - top can be 80%
        } else if (topScore >= 0.2) {
          targetMaxScore = 0.7; // Weak match - top can be 70%
        } else {
          targetMaxScore = 0.6; // Poor match - top can be 60%
        }
        
        // Calculate the actual range to use
        const actualRange = targetMaxScore - minDisplayScore;
        const minThreshold = minDisplayScore;
        
        // Apply the scaling
        scaledScore = minThreshold + (normalizedScore * actualRange);
        
        // Ensure score doesn't go below a minimum threshold for very low scores
        if (rawScore < topScore * 0.1) { // If score is less than 10% of top score
          scaledScore = Math.max(0, scaledScore - 0.1); // Reduce by 10%
        }
      }
      
      // Clamp the score between 0 and 1
      scaledScore = Math.max(0, Math.min(1, scaledScore));
      
      console.log(`📊 Grant ${grant.id}: Raw: ${rawScore.toFixed(3)}, Scaled: ${scaledScore.toFixed(3)} (${Math.round(scaledScore * 100)}%)`);
      
      return { grant, similarity: scaledScore };
    });

    // Take top 25 results
    const topMatches = scaledGrants.slice(0, 25);

    const rankedGrants = topMatches.map(({ grant, similarity }) => ({
      grantId: grant.id,
      relevanceScore: Math.round(similarity * 1000) / 1000, // Round to 3 decimal places
      matchingReasons: [
        `Similarity score: ${Math.round(similarity * 100)}%`,
        `Cosine similarity with sliding scale normalization`
      ]
    }));

    const response = {
      rankedGrants,
      explanation: `Found ${topMatches.length} grants using cosine similarity with sliding scale normalization based on your query: "${query}"`
    };

    console.log('✅ Returning ranked grants with sliding scale scores');
    console.log('📊 Score distribution:', {
      topScore: `${Math.round((topMatches[0]?.similarity || 0) * 100)}%`,
      avgScore: `${Math.round((topMatches.reduce((sum, g) => sum + g.similarity, 0) / topMatches.length) * 100)}%`,
      minScore: `${Math.round((topMatches[topMatches.length - 1]?.similarity || 0) * 100)}%`
    });
    
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
