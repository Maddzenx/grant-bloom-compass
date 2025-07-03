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
        return { grant, similarity: 0 };
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
          return { grant, similarity: 0 };
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
        
        // Apply the *8 scaling to preserve distribution
        const rawSimilarityScore = cosineSimilarity * 8;

        return { grant, similarity: rawSimilarityScore };
      } catch (error) {
        console.error(`Error processing embedding for grant ${grant.id}:`, error);
        return { grant, similarity: 0 };
      }
    });

    // Find the maximum raw similarity score for dynamic scaling
    const maxRawScore = Math.max(...scoredGrants.map(sg => sg.similarity));
    console.log(`📊 Max raw similarity score: ${maxRawScore.toFixed(3)}`);

    // Determine dynamic ceiling based on the quality of the top match
    // Map raw scores to ceiling percentages between 50% and 100%
    const determineCeiling = (rawScore: number): number => {
      // Define thresholds for ceiling calculation
      const highThreshold = 4.0; // 50% cosine similarity * 8 scaling = excellent match
      const lowThreshold = 1.0;  // 12.5% cosine similarity * 8 scaling = weak match
      
      if (rawScore >= highThreshold) {
        return 1.0; // 100% ceiling for excellent matches
      } else if (rawScore <= lowThreshold) {
        return 0.5; // 50% ceiling for weak matches
      } else {
        // Linear interpolation between 50% and 100%
        const ratio = (rawScore - lowThreshold) / (highThreshold - lowThreshold);
        return 0.5 + (0.5 * ratio); // 50% + up to 50% more
      }
    };

    const dynamicCeiling = determineCeiling(maxRawScore);
    console.log(`📊 Dynamic ceiling set to: ${Math.round(dynamicCeiling * 100)}% based on top score quality`);

    // Dynamically transpose all scores so the highest becomes the dynamic ceiling
    // Using subtraction to preserve the 8x scaling factor
    const scaledGrants = scoredGrants.map(({ grant, similarity }) => {
      // Subtract (maxScore - ceiling) from all scores to shift the maximum to the ceiling
      const transposedScore = similarity - (maxRawScore - dynamicCeiling);
      
      // Clamp to ensure values stay within 0-ceiling range
      const clampedScore = Math.max(0, Math.min(dynamicCeiling, transposedScore));

      console.log(`📊 Grant ${grant.id}: Raw: ${similarity.toFixed(3)}, Transposed: ${clampedScore.toFixed(3)} (${Math.round(clampedScore * 100)}%)`);

      return { grant, similarity: clampedScore };
    });

    // Sort by similarity score (highest first), filter out 0% matches, and take top 25
    const topMatches = scaledGrants
      .filter(({ similarity }) => similarity > 0) // Cut off all results at 0 matching percentage
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 25);

    const rankedGrants = topMatches.map(({ grant, similarity }) => ({
      grantId: grant.id,
      relevanceScore: Math.round(similarity * 1000) / 1000, // Round to 3 decimal places
      matchingReasons: [
        `Cosine similarity score: ${Math.round(similarity * 100)}%`,
        `Manual cosine similarity calculation`
      ]
    }));

    const response = {
      rankedGrants,
      explanation: `Found ${topMatches.length} grants using cosine similarity search based on your query: "${query}"`
    };

    console.log(`✅ Returning ${rankedGrants.length} ranked grants with cosine similarity calculation`);
    console.log('Top 3 scores:', rankedGrants.slice(0, 3).map(g => `${g.grantId}: ${Math.round(g.relevanceScore * 100)}%`));
    
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
