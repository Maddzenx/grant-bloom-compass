import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Interface for LLM filtering
interface GrantForLLMFiltering {
  id: string;
  title: string;
  search_description: string | null;
  description: string | null;
  geographic_scope: string | null;
  region: string | null;
  eligible_organisations: any;
  industry_sectors: any;
  organisation: string | null;
  relevanceScore: number;
}

// Free models to try for LLM filtering, in order of preference (smartest/largest first)
const llmFilterModels = [
  'google/gemini-2.5-flash-lite-preview-06-17',
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.1-405b-instruct:free',
  'google/gemma-3-27b-it:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'deepseek/deepseek-r1-0528:free',
  'deepseek/deepseek-r1:free',
  'moonshotai/kimi-k2:free'
];

interface LLMFilterResult {
  grantId: string;
  shouldInclude: boolean;
  refinedScore: number; // 0-100
}

const performLLMFiltering = async (query: string, grants: GrantForLLMFiltering[]): Promise<LLMFilterResult[]> => {
  console.log(`🤖 Starting LLM filtering for ${grants.length} grants with query: "${query}"`);

  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key not configured');
  }
  
  // Prepare grants data for LLM - only include description
  console.log('📋 Preparing grant data for LLM (description only)...');
  const grantsForLLM = grants.map(grant => {
    return {
      id: grant.id,
      description: grant.search_description || 'No description available',
      currentRelevanceScore: Math.round(grant.relevanceScore * 100)
    };
  });
  console.log(`✅ Prepared ${grantsForLLM.length} grants for LLM prompt`);

  const prompt = `You are an expert grant matching system. Your task is to evaluate grants for relevance to a user's search query based on their descriptions. Disregard which language is used, it's the content that matters.

USER SEARCH QUERY: "${query}"

EVALUATION CRITERIA:
1. RELEVANCE MATCH: Does the grant's description align with the search query? Consider the purpose, industry, and scope mentioned in the description.
2. CONTENT RELEVANCE: Does the description contain information that would be useful for someone searching for this query?

SCORING GUIDELINES:
- 100%: Perfect match - description directly addresses the search query
- 75-99%: Excellent match - strong alignment with the search intent
- 50-74%: Good match - relevant content but may not be the exact focus
- 25-49%: Partial match - tangentially related content
- 1-24%: Weak match - minimal connection to the search query
- 0%: No match - completely irrelevant to the search query

GRANTS TO EVALUATE:
${JSON.stringify(grantsForLLM, null, 2)}

Evaluate each grant and respond with a JSON array of objects with this structure:
{
  "grantId": "grant_id_here",
  "shouldInclude": true/false,
  "refinedScore": 0-100
}

Do NOT include any other text in your response.
`;

  let lastError: string | undefined;

  for (const model of llmFilterModels) {
    try {
      console.log(`🔄 Calling OpenRouter with model ${model} for LLM filtering...`);
      console.log('📏 Prompt length:', prompt.length, 'characters');

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
            { role: 'system', content: 'You are a precise grant matching expert. Always respond with valid JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 4096,
          response_format: { "type": "json_object" }
        }),
      });
      console.log(`📡 API call to ${model} completed, status:`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ OpenRouter LLM filtering error with ${model}:`, errorText);
        throw new Error(`OpenRouter API error with ${model}: ${response.status}`);
      }

      console.log('✅ OpenRouter response received successfully');
      const aiResponse = await response.json();
      let content = aiResponse.choices[0].message.content;

             let filterResults: LLMFilterResult[];
       try {
         // The response should be a JSON object, as requested.
         // It might be a string inside the content field, or the content itself is the object.
         let parsedContent;
         if (typeof content === 'string') {
           if (content.includes('```json')) {
             console.log('🧹 Cleaning markdown wrapper from LLM response...');
             content = content.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
           }
           parsedContent = JSON.parse(content);
         } else if (typeof content === 'object' && content !== null) {
           parsedContent = content;
         } else {
            throw new Error('Unexpected response format from LLM.');
         }

         // Handle different response formats - some models return direct array, others wrap in object
         if (Array.isArray(parsedContent)) {
           filterResults = parsedContent;
         } else if (parsedContent.evaluations && Array.isArray(parsedContent.evaluations)) {
           filterResults = parsedContent.evaluations;
         } else if (parsedContent.results && Array.isArray(parsedContent.results)) {
           filterResults = parsedContent.results;
         } else if (parsedContent.grants && Array.isArray(parsedContent.grants)) {
           filterResults = parsedContent.grants;
         } else {
           // Try to find any array property in the object
           const keys = Object.keys(parsedContent);
           const arrayKey = keys.find(key => Array.isArray(parsedContent[key]));
           if (arrayKey) {
             filterResults = parsedContent[arrayKey];
           } else {
             throw new Error(`Expected array or object with array property, got: ${JSON.stringify(parsedContent).substring(0, 200)}`);
           }
         }

         console.log(`✅ Successfully parsed LLM response from ${model} with ${filterResults.length} results`);

        console.log(`🤖 LLM filtering complete. Processed ${filterResults.length} results`);
        console.log('All LLM scores:', filterResults.map(r => `${r.grantId}: ${r.refinedScore}%`));

        const filteredResults = filterResults.filter(result => result.shouldInclude);
        console.log(`🔍 After filtering: ${filteredResults.length} results remaining`);
        console.log('Filtered scores:', filteredResults.map(r => `${r.grantId}: ${r.refinedScore}%`));

        return filteredResults; // Success, return the results
      } catch (parseError) {
        console.error(`❌ Failed to parse LLM response from ${model} as JSON:`, content);
        lastError = `Invalid JSON response from ${model}`;
        continue; // Try next model
      }
    } catch (error) {
      console.error(`Error with model ${model} in LLM filtering:`, error);
      lastError = `LLM filtering failed with ${model}: ${error.message}`;
      continue; // Try next model
    }
  }

  // If all models failed
  console.error('All models failed for LLM filtering. Last error:', lastError);
  throw new Error(`LLM filtering failed for all models. Last error: ${lastError}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, organizationFilter = [] } = await req.json();

    console.log('🔍 Semantic Grant Search - Received query:', query);
    console.log('🏢 Organization filter:', organizationFilter);

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not configured');
      return new Response(JSON.stringify({ 
        error: 'Semantic search temporarily unavailable',
        rankedGrants: [],
        explanation: 'Semantic search temporarily unavailable - API key not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ OpenAI API key is configured, proceeding with search...');

    // Generate embedding using OpenAI
    console.log('📊 Generating embedding with OpenAI...');
    let embeddingResponse;
    try {
      embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
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
    } catch (fetchError) {
      console.error('❌ Failed to call OpenAI API:', fetchError);
      throw new Error(`Failed to connect to OpenAI API: ${fetchError.message}`);
    }

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('❌ OpenAI embedding error:', errorText);
      throw new Error(`OpenAI API error: ${embeddingResponse.status}`);
    }

    const embeddingData = await embeddingResponse.json();
    if (!embeddingData.data || !embeddingData.data[0] || !embeddingData.data[0].embedding) {
      console.error('❌ Invalid response from OpenAI embeddings API:', embeddingData);
      throw new Error('Invalid response from OpenAI embeddings API');
    }
    const queryEmbedding = embeddingData.data[0].embedding;
    console.log('✅ Embedding generated successfully, length:', queryEmbedding.length);

    console.log('✅ Embedding generated, fetching grants for cosine similarity comparison...');

    // Get all grants with embeddings for manual similarity calculation using cosine distance
    let grants;
    try {
      console.log('🔍 Querying database for grants with embeddings...');
      
      // Build the query - start with base query
      let grantsQuery = supabase
        .from('grant_call_details')
        .select(`
          id, title_sv, title_en, organisation, subtitle_sv, subtitle_en, 
          description_sv, description_en, geographic_scope, region_sv, region_en, 
          eligible_organisations_sv, eligible_organisations_en, 
          industry_sectors, embedding
        `)
        .not('embedding', 'is', null);

      // Filter out grants with passed deadlines
      const today = new Date().toISOString().split('T')[0];
      grantsQuery = grantsQuery
        .not('application_closing_date', 'is', null)
        .gte('application_closing_date', today);

      // Apply organization filtering if specified
      if (organizationFilter && organizationFilter.length > 0) {
        console.log('🏢 Applying organization filter:', organizationFilter);
        
        // Create OR conditions for each organization type in the filter
        // Use both Swedish and English fields for organization filtering
        const orConditions = organizationFilter.flatMap((orgType: string) => [
          `eligible_organisations_sv.cs.["${orgType}"]`,
          `eligible_organisations_en.cs.["${orgType}"]`
        ]);
        
        grantsQuery = grantsQuery.or(orConditions.join(','));
        console.log('📋 Organization filter applied with conditions:', orConditions);
      } else {
        console.log('📋 No organization filter applied - searching all grants');
      }

      const { data, error: grantsError } = await grantsQuery;

      console.log('📊 Database query completed');

      if (grantsError) {
        console.error('❌ Database error fetching grants:', JSON.stringify(grantsError, null, 2));
        throw new Error(`Failed to fetch grants: ${grantsError.message || 'Unknown database error'}`);
      }
      
      console.log('✅ Database query successful');
      grants = data;
    } catch (dbError) {
      console.error('❌ Database connection error:', JSON.stringify(dbError, null, 2));
      throw new Error(`Database connection failed: ${dbError.message || 'Unknown connection error'}`);
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
    console.log('🔍 Processing embeddings and calculating similarities...');
    const scoredGrants = grants.map((grant: any) => {
      if (!grant.embedding) {
        return { grant, similarity: 0 };
      }

      // Prioritize English descriptions, fall back to Swedish if English is not available
      const title = grant.title_en || grant.title_sv || 'No title available';
      const subtitle = grant.subtitle_en || grant.subtitle_sv || '';
      const description = grant.description_en || grant.description_sv || '';
      const region = grant.region_en || grant.region_sv || '';
      const eligible_organisations = grant.eligible_organisations_en || grant.eligible_organisations_sv || [];
      
      // Create a search description combining title, subtitle, and description
      const search_description = [title, subtitle, description].filter(Boolean).join(' ');
      
      // Update the grant object with the processed fields
      const processedGrant = {
        ...grant,
        title: title || 'No title available',
        subtitle: subtitle || '',
        description: description || '',
        search_description: search_description || 'No description available',
        region: region || '',
        eligible_organisations: eligible_organisations || []
      };

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
          console.warn(`⚠️ Invalid embedding format for grant ${grant.id}`);
          return { grant, similarity: 0 };
        }

        // Validate embedding dimensions
        if (!grantEmbedding || grantEmbedding.length === 0) {
          console.warn(`⚠️ Empty embedding for grant ${grant.id}`);
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

        return { grant: processedGrant, similarity: rawSimilarityScore };
      } catch (error) {
        console.error(`Error processing embedding for grant ${grant.id}:`, error);
        return { grant: processedGrant, similarity: 0 };
      }
    });

    // Find the maximum raw similarity score for dynamic scaling
    const similarities = scoredGrants.map(sg => sg.similarity).filter(s => !isNaN(s) && isFinite(s));
    const maxRawScore = similarities.length > 0 ? Math.max(...similarities) : 0;
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

      return { grant, similarity: clampedScore };
    });

    // Sort by similarity score (highest first), filter out 0% matches, and take top 25.
    const topMatches = scaledGrants
      .filter(({ similarity }) => similarity > 0) // Cut off all results at 0 matching percentage.
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 25);

    console.log(`📊 Found ${topMatches.length} semantic matches, starting LLM filtering...`);
    console.log('🎯 Top matches for LLM filtering:', topMatches.slice(0, 5).map(m => ({
      id: m.grant.id, 
      similarity: Math.round(m.similarity * 100) + '%',
      title: m.grant.title?.substring(0, 50) + '...'
    })));

    // If no matches found, return empty result early
    if (topMatches.length === 0) {
      console.log(`⚠️ No semantic matches found for query: "${query}"`);
      return new Response(JSON.stringify({
        rankedGrants: [],
        explanation: `No relevant grants found for query: "${query}"`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare grants for LLM filtering
    console.log('🔍 Preparing grants for LLM filtering...');
    const grantsForLLMFiltering: GrantForLLMFiltering[] = topMatches.map(({ grant, similarity }) => ({
      id: grant.id,
      title: grant.title,
      search_description: grant.search_description,
      description: grant.description,
      geographic_scope: grant.geographic_scope,
      region: grant.region,
      eligible_organisations: grant.eligible_organisations,
      industry_sectors: grant.industry_sectors,
      organisation: grant.organisation,
      relevanceScore: similarity
    }));
    console.log(`✅ Prepared ${grantsForLLMFiltering.length} grants for LLM filtering`);

    // Perform LLM filtering
    console.log('🤖 Starting LLM filtering process...');
    let llmFilteredResults;
    try {
      llmFilteredResults = await performLLMFiltering(query, grantsForLLMFiltering);
      console.log('✅ LLM filtering completed successfully');
    } catch (llmError) {
      console.error('❌ LLM filtering failed:', JSON.stringify(llmError, null, 2));
      return new Response(JSON.stringify({
        error: 'LLM filtering failed - please try again',
        rankedGrants: [],
        explanation: 'The AI-powered grant relevance filtering is temporarily unavailable. Please try your search again.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`🤖 LLM filtering complete. ${llmFilteredResults.length} grants passed filtering`);
    console.log('Final LLM filtered scores:', llmFilteredResults.map(r => `${r.grantId}: ${r.refinedScore}%`));

    // Convert to final response format - return only IDs and scores (like the frontend expects)
    const rankedGrants = llmFilteredResults.map(result => {
      return {
        grantId: result.grantId,
        relevanceScore: Math.round(result.refinedScore) / 100,
        matchingReasons: [
          `LLM refined score: ${result.refinedScore}%`,
          `Semantic search match`
        ]
      };
    });

    // Sort by refined score
    rankedGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const response = {
      rankedGrants,
      explanation: `Found ${rankedGrants.length} relevant grants using semantic search + LLM filtering for query: "${query}"`
    };

    console.log(`✅ Returning ${rankedGrants.length} LLM-filtered grants with full data`);
    console.log('All final scores being returned:', rankedGrants.map(g => `${g.id}: ${Math.round(g.relevanceScore * 100)}%`));
    
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
