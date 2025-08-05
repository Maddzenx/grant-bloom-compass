import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { analyzeTokenUsage, logTokenDebugInfo } from './token-debug.ts';

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
  'google/gemini-2.0-flash-001',
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
  
  // Create a mapping from simple numbers to grant IDs
  const grantIdMapping: { [key: number]: string } = {};
  const grantsForLLM = grants.map((grant, index) => {
    const simpleId = index + 1; // 1, 2, 3, etc.
    grantIdMapping[simpleId] = grant.id;
    
    // Truncate description to reduce token usage - aim for ~500-800 chars per grant
    const maxDescriptionLength = 600;
    let description = grant.search_description || 'No description available';
    if (description.length > maxDescriptionLength) {
      description = description.substring(0, maxDescriptionLength) + '...';
    }
    
    return {
      id: simpleId, // Use simple number instead of UUID
      description: description,
      organisation: grant.organisation || 'Unknown organization',
      currentRelevanceScore: Math.round(grant.relevanceScore * 100)
    };
  });
  console.log(`✅ Prepared ${grantsForLLM.length} grants for LLM prompt (truncated to ~600 chars each)`);
  console.log('🔗 Grant ID mapping:', grantIdMapping);

  const prompt = `You are an expert grant matching system. Your task is to evaluate grants for relevance to a user's search query based on their descriptions.

USER SEARCH QUERY: "${query}"

EVALUATION CRITERIA:
1. RELEVANCE MATCH: Does the grant's description align with the search query? Consider the purpose, industry, and scope mentioned in the description. Be generous with the relevance score.
2. CONTENT RELEVANCE: Does the description contain information that would be useful for someone searching for this query?
3. ORGANIZATION BIAS: If the grant organization is not the European Commission, the grant should score about twice as high as if it were the EU.

SCORING GUIDELINES:
- 100%: Perfect match - description directly addresses the search query
- 75-99%: Excellent match - strong alignment with the search intent
- 50-74%: Good match - maybe only part of the query is mentioned, or the query is only a part of the description
- 25-49%: Partial match - could be relevant, if you use your imagination a bit
- 1-24%: Weak match - minimal connection to the search query
- 0%: No match - completely irrelevant to the search query

GRANTS TO EVALUATE:
${JSON.stringify(grantsForLLM, null, 2)}


  Score grants 0-100. Return only included grants in compact array:
  [grantId,refinedScore,grantId,refinedScore,...]
  
  Only include grants that should appear in search results. Include all matches with 30% and above, and down to 1% if the search query yields very few results. Try to include at least 10-15 grants, unless the match is very poor. But if more than 15 grants seem relevant, include all of them.
  refinedScore: 0-100
  grantId: 1,2,3,etc.

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
            { role: 'system', content: 'Return only included grants: [1,85,3,92,4,78,...]. No explanations.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 2048, // Increased further to ensure complete JSON response for all grants
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
      
      // Debug: Log the actual response content and length
      console.log('🔍 DEBUG: Response content length:', content.length, 'characters');
      console.log('🔍 DEBUG: Estimated response tokens:', Math.ceil(content.length / 4));
      console.log('🔍 DEBUG: Response content preview:', content.substring(0, 500) + (content.length > 500 ? '...' : ''));
      console.log('🔍 DEBUG: Full response content:', content);

             let filterResults: LLMFilterResult[];
       try {
         // The response should be a JSON object, as requested.
         // It might be a string inside the content field, or the content itself is the object.
         let parsedContent;
         if (typeof content === 'string') {
           // Check if response is truncated (ends with incomplete JSON)
           const trimmedContent = content.trim();
           if (trimmedContent.endsWith(',') || 
               trimmedContent.endsWith('"') || 
               trimmedContent.endsWith(':') ||
               trimmedContent.endsWith('"grantId":') ||
               trimmedContent.endsWith('"shouldInclude":') ||
               trimmedContent.endsWith('"refinedScore":') ||
               !trimmedContent.endsWith(']')) {
             console.log('⚠️ WARNING: Response appears to be truncated, trying next model...');
             console.log('🔍 DEBUG: Response ends with:', trimmedContent.substring(trimmedContent.length - 20));
             lastError = `Response truncated from ${model}`;
             continue;
           }
           
           if (content.includes('```json')) {
             console.log('🧹 Cleaning markdown wrapper from LLM response...');
             content = content.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
           }
           
           try {
             parsedContent = JSON.parse(content);
           } catch (parseError) {
             console.log('⚠️ WARNING: Invalid JSON from model, trying next model...');
             lastError = `Invalid JSON from ${model}: ${parseError.message}`;
             continue;
           }
         } else if (typeof content === 'object' && content !== null) {
           parsedContent = content;
         } else {
            throw new Error('Unexpected response format from LLM.');
         }

         // Handle different response formats - some models return direct array, others wrap in object
         let rawResults;
         if (Array.isArray(parsedContent)) {
           rawResults = parsedContent;
         } else if (parsedContent.evaluations && Array.isArray(parsedContent.evaluations)) {
           rawResults = parsedContent.evaluations;
         } else if (parsedContent.results && Array.isArray(parsedContent.results)) {
           rawResults = parsedContent.results;
         } else if (parsedContent.grants && Array.isArray(parsedContent.grants)) {
           rawResults = parsedContent.grants;
         } else {
           // Try to find any array property in the object
           const keys = Object.keys(parsedContent);
           const arrayKey = keys.find(key => Array.isArray(parsedContent[key]));
           if (arrayKey) {
             rawResults = parsedContent[arrayKey];
           } else {
             throw new Error(`Expected array or object with array property, got: ${JSON.stringify(parsedContent).substring(0, 200)}`);
           }
         }

         // Parse the results - handle the new compact format: [1,refinedScore,3,refinedScore,...]
         if (Array.isArray(rawResults)) {
           // Handle the new compact format where results are in a flat array
           const compactArray = rawResults;
           filterResults = [];
           
           // Process the flat array in groups of 2: [id, refinedScore, id, refinedScore, ...]
           for (let i = 0; i < compactArray.length; i += 2) {
             if (i + 1 < compactArray.length) {
               const simpleId = compactArray[i];
               const refinedScore = compactArray[i + 1];
               
               // Transform simple ID back to original grant ID
               const originalGrantId = grantIdMapping[simpleId];
               if (originalGrantId) {
                 filterResults.push({
                   grantId: originalGrantId,
                   shouldInclude: true, // All returned grants should be included
                   refinedScore: refinedScore
                 });
               } else {
                 console.log(`⚠️ WARNING: Unknown simple ID ${simpleId} in response`);
               }
             }
           }
         } else {
           // Fallback: handle old formats if needed
           filterResults = rawResults.map((item: any) => {
             // Check if it's a compact tuple format: [grantId, shouldInclude, refinedScore]
             if (Array.isArray(item) && item.length === 3) {
               return {
                 grantId: item[0],
                 shouldInclude: item[1],
                 refinedScore: item[2]
               };
             }
             // Otherwise assume it's the full object format
             return item;
           });
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
    const { query, organizationFilter = [], grantType = 'both' } = await req.json();

    console.log('🔍 Semantic Grant Search - Received query:', query);
    console.log('🏢 Organization filter:', organizationFilter);
    console.log('🌍 Grant type filter:', grantType);

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

      // Apply grant type filtering if specified
      if (grantType && grantType !== 'both') {
        console.log('🌍 Applying grant type filter:', grantType);
        
        if (grantType === 'eu') {
          // Only include grants where organisation = 'Europeiska Kommissionen'
          grantsQuery = grantsQuery.eq('organisation', 'Europeiska Kommissionen');
          console.log('📋 EU grants filter applied - only Europeiska Kommissionen');
        } else if (grantType === 'swedish') {
          // Only include grants where organisation is NOT 'Europeiska Kommissionen'
          grantsQuery = grantsQuery.neq('organisation', 'Europeiska Kommissionen');
          console.log('📋 Swedish grants filter applied - excluding Europeiska Kommissionen');
        }
      } else {
        console.log('📋 No grant type filter applied - searching all grants');
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

      // Apply 25% boost for non-EU grants (Swedish grants)
      let finalScore = clampedScore;
      if (grant.organisation && !grant.organisation.toLowerCase().includes('europeiska kommissionen')) {
        finalScore = Math.min(1.0, clampedScore + 0.2); // Boost by 20%, cap at 100%
      }

      return { grant, similarity: finalScore };
    });

    // Sort by similarity score (highest first), filter out 0% matches, and take top 25.
    const topMatches = scaledGrants
      .filter(({ similarity }) => similarity > 0.2) // Cut off all results at 0 matching percentage.
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

    // Get minimal grant data for card display
    console.log('🔍 Fetching minimal grant data for card display...');
    const grantIds = llmFilteredResults.map(result => result.grantId);
    
    const { data: grantData, error: grantError } = await supabase
      .from('grant_call_details')
      .select(`
        id, organisation, title_sv, title_en, subtitle_sv, subtitle_en, 
        max_funding_per_project, min_funding_per_project, total_funding_per_call, currency,
        funding_amount_eur,
        application_opening_date, application_closing_date, keywords, industry_sectors,
        geographic_scope, region_sv, region_en, cofinancing_required, cofinancing_level_min,
        eligible_organisations_standardized, eligible_cost_categories_standardized,
        created_at, updated_at
      `)
      .in('id', grantIds);

    if (grantError) {
      console.error('❌ Error fetching grant data:', grantError);
      throw new Error(`Failed to fetch grant data: ${grantError.message}`);
    }

    // Helper function to format funding amount
    const formatFundingAmount = (grant: any): string => {
      const maxFunding = grant.max_funding_per_project;
      const minFunding = grant.min_funding_per_project;
      const totalFunding = grant.total_funding_per_call;
      const currency = grant.currency || 'SEK';
      
      const formatAmount = (amount: number): string => {
        if (amount >= 1000000) {
          const millions = amount / 1000000;
          return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)} M${currency}`;
        }
        return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currency}`;
      };
      
      if (maxFunding && maxFunding > 0) {
        if (minFunding && minFunding > 0 && minFunding !== maxFunding) {
          return `${formatAmount(minFunding)} - ${formatAmount(maxFunding)}`;
        }
        return formatAmount(maxFunding);
      }
      
      if (totalFunding && totalFunding > 0) {
        return formatAmount(totalFunding);
      }
      
      if (minFunding && minFunding > 0) {
        return formatAmount(minFunding);
      }
      
      return 'Not specified';
    };

    // Transform the grants data - return both language versions for frontend to decide
    const transformedGrants = grantData?.map((grant: any) => {
      return {
        id: grant.id,
        title_sv: grant.title_sv || 'No title available',
        title_en: grant.title_en || 'No title available',
        organization: grant.organisation || 'Unknown organization',
        subtitle_sv: grant.subtitle_sv || 'No description available',
        subtitle_en: grant.subtitle_en || 'No description available',
        fundingAmount: formatFundingAmount(grant),
        funding_amount_eur: grant.funding_amount_eur, // Needed for sorting by funding amount
        opens_at: grant.application_opening_date || '',
        deadline: grant.application_closing_date || '',
        tags: Array.isArray(grant.keywords) ? grant.keywords : [],
        industry_sectors: Array.isArray(grant.industry_sectors) ? grant.industry_sectors : [],
        eligible_organisations: Array.isArray(grant.eligible_organisations_standardized) ? grant.eligible_organisations_standardized : [],
        geographic_scope: grant.geographic_scope ? [grant.geographic_scope] : [],
        region_sv: grant.region_sv || undefined,
        region_en: grant.region_en || undefined,
        cofinancing_required: grant.cofinancing_required || false,
        cofinancing_level_min: grant.cofinancing_level_min || undefined,
        consortium_requirement: undefined, // Not available in card view
        fundingRules: Array.isArray(grant.eligible_cost_categories_standardized) ? grant.eligible_cost_categories_standardized : [],
        application_opening_date: grant.application_opening_date,
        application_closing_date: grant.application_closing_date,
        project_start_date_min: undefined, // Not needed for card view
        project_start_date_max: undefined, // Not needed for card view
        project_end_date_min: undefined, // Not needed for card view
        project_end_date_max: undefined, // Not needed for card view
        information_webinar_dates: [], // Not needed for card view
        information_webinar_links: [], // Not needed for card view
        information_webinar_names: [], // Not needed for card view
        templates: [], // Not needed for card view
        generalInfo: [], // Not needed for card view
        application_templates_links: [], // Not needed for card view
        other_templates_links: [], // Not needed for card view
        other_sources_links: [], // Not needed for card view
        other_sources_names: [], // Not needed for card view
        created_at: grant.created_at, // Needed for sorting by publication date
        updated_at: grant.updated_at // Needed for sorting by publication date
      };
    }) || [];

    // Create a map of grant ID to relevance score
    const relevanceScoreMap = new Map(llmFilteredResults.map(result => [result.grantId, result.refinedScore]));

    // Combine the transformed grants with their relevance scores
    const rankedGrants = transformedGrants.map(grant => {
      const relevanceScore = relevanceScoreMap.get(grant.id) || 0;
      return {
        grantId: grant.id,
        relevanceScore: Number(relevanceScore) / 100,
        // Include all the grant data
        ...grant
      };
    });

    // Sort by relevance score
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
