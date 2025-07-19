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

interface LLMFilterResult {
  grantId: string;
  shouldInclude: boolean;
  refinedScore: number; // 0-100
  reasoning: string;
}

const performLLMFiltering = async (query: string, grants: GrantForLLMFiltering[]): Promise<LLMFilterResult[]> => {
  console.log(`🤖 Starting LLM filtering for ${grants.length} grants with query: "${query}"`);

  // Prepare grants data for LLM
  console.log('📋 Preparing grant data for LLM...');
  const grantsForLLM = grants.map(grant => {
    try {
      return {
        id: grant.id,
        title: grant.title || 'No title',
        organisation: grant.organisation || 'Unknown',
        search_description: grant.search_description || grant.description || 'No description available',
        geographic_scope: grant.geographic_scope || 'Not specified',
        region: grant.region || 'Not specified',
        eligible_organisations: Array.isArray(grant.eligible_organisations) ? grant.eligible_organisations : 
                               (typeof grant.eligible_organisations === 'string' ? 
                                JSON.parse(grant.eligible_organisations || '[]') : []),
        industry_sectors: Array.isArray(grant.industry_sectors) ? grant.industry_sectors :
                         (typeof grant.industry_sectors === 'string' ? 
                          JSON.parse(grant.industry_sectors || '[]') : []),
        currentRelevanceScore: Math.round(grant.relevanceScore * 100)
      };
    } catch (parseError) {
      console.error(`⚠️ Error parsing grant ${grant.id}:`, parseError);
      return {
        id: grant.id,
        title: grant.title || 'No title',
        organisation: grant.organisation || 'Unknown',
        search_description: grant.search_description || grant.description || 'No description available',
        geographic_scope: grant.geographic_scope || 'Not specified',
        region: grant.region || 'Not specified',
        eligible_organisations: [],
        industry_sectors: [],
        currentRelevanceScore: Math.round(grant.relevanceScore * 100)
      };
    }
  });
  console.log(`✅ Prepared ${grantsForLLM.length} grants for LLM prompt`);

  const prompt = `You are an expert grant matching system. Your task is to evaluate grants for relevance to a user's search query and filter out irrelevant results.

USER SEARCH QUERY: "${query}"

EVALUATION CRITERIA:
1. RELEVANCE MATCH: Does the grant's purpose, industry, and scope align with the search query? In case the grant has a non-specific purpose, or a broad scope which the search query could apply to, it should be considered relevant.
2. ORGANIZATIONAL ELIGIBILITY: Could the searching organization potentially be eligible?
3. SCOPE COMPATIBILITY: Do geographic/regional restrictions make sense for the search context?

SCORING GUIDELINES:
- 100%: Perfect match - organization, project, and purpose align perfectly
- 75-99%: Excellent match - strong alignment with minor gaps
- 50-74%: Good match - correct industry/area but may not be the exact right project type, etc.
- 25-49%: Partial match - tangentially related or very broad eligibility
- 1-24%: Weak match - minimal connection, mostly irrelevant
- 0%: No match - completely irrelevant or organization clearly not eligible

SPECIAL CONSIDERATIONS:
- Some grants are industry non-specific (e.g., "Innovativa Startups" for any innovative startup). This should be a strong match for any startup with an innovative idea.
- Some grants are region-specific but otherwise broad. This should be a strong match for essentially any organisation in the region.
- If a grant has a specific industry and the search query is in another industry, it should generally not be considered a match at all.
- Consider both explicit eligibility and implicit suitability
- Be generous with broad/general grants that could apply to many situations, but be strict with specific grants that are only relevant for a specific industry or region.

GRANTS TO EVALUATE:
${JSON.stringify(grantsForLLM, null, 2)}

Please evaluate each grant and respond with a JSON array of objects with this structure:
{
  "grantId": "grant_id_here",
  "shouldInclude": true/false,
  "refinedScore": 0-100,
  "reasoning": "Brief explanation for the score"
}

Be thorough but fair in your evaluation.`;

  try {
    console.log('🔄 Calling OpenAI for LLM filtering...');
    console.log('📏 Prompt length:', prompt.length, 'characters');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You are a precise grant matching expert. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
    });
    console.log('📡 OpenAI API call completed, status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI LLM filtering error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    console.log('✅ OpenAI response received successfully');
    const aiResponse = await response.json();
    let content = aiResponse.choices[0].message.content;
    
    // Strip markdown code fences if present
    if (content.includes('```json')) {
      console.log('🧹 Cleaning markdown wrapper from LLM response...');
      content = content.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
    }
    
    // Parse the JSON response
    let filterResults: LLMFilterResult[];
    try {
      filterResults = JSON.parse(content);
      console.log(`✅ Successfully parsed LLM response with ${filterResults.length} results`);
    } catch (parseError) {
      console.error('❌ Failed to parse LLM response as JSON:', content);
      throw new Error('Invalid JSON response from LLM');
    }

    console.log(`🤖 LLM filtering complete. Processed ${filterResults.length} results`);
    console.log('All LLM scores:', filterResults.map(r => `${r.grantId}: ${r.refinedScore}%`));
    
    const filteredResults = filterResults.filter(result => result.shouldInclude && result.refinedScore >= 30);
    console.log(`🔍 After 30% filter: ${filteredResults.length} results remaining`);
    console.log('Filtered scores:', filteredResults.map(r => `${r.grantId}: ${r.refinedScore}%`));
    
    return filteredResults;
    
  } catch (error) {
    console.error('Error in LLM filtering:', error);
    throw new Error(`LLM filtering failed: ${error.message}`);
  }
};

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

    console.log('✅ Embedding generated, using PostgreSQL vector search for optimal performance...');

    // Use PostgreSQL's built-in vector similarity search (much faster than JavaScript calculation)
    let grants;
    try {
             console.log('🔍 Performing database-level vector similarity search...');
       
       // Alternative approach: Use direct SQL with proper vector casting
       const { data, error: grantsError } = await supabase
         .from('grant_call_details')
         .select(`
           id, title, organisation, description, search_description,
           geographic_scope, region, eligible_organisations, 
           industry_sectors,
           (embedding <#> '[${queryEmbedding.join(',')}]'::vector) as distance
         `)
         .not('embedding', 'is', null)
         .order('distance', { ascending: false })  // Higher similarity first
         .limit(50);  // Limit to top 50 candidates for performance

      console.log('📊 Vector similarity search completed');

      if (grantsError) {
        console.error('❌ Database error in vector search:', JSON.stringify(grantsError, null, 2));
        throw new Error(`Vector search failed: ${grantsError.message || 'Unknown database error'}`);
      }
      
      console.log('✅ Vector search successful');
      grants = data;
    } catch (dbError) {
      console.error('❌ Vector search error:', JSON.stringify(dbError, null, 2));
      throw new Error(`Vector search failed: ${dbError.message || 'Unknown connection error'}`);
    }

    console.log(`📊 Found ${grants?.length || 0} grants from vector search`);

    if (!grants || grants.length === 0) {
      console.log('No grants found with vector similarity search');
      return new Response(JSON.stringify({
        rankedGrants: [],
        explanation: 'No grants found with sufficient similarity for the search query'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

         // Convert database similarity results to our format
     console.log('🔍 Processing vector search results...');
     const scoredGrants = grants.map((grant: any) => {
       // PostgreSQL returns negative inner product (higher = more similar)
       // Normalize to 0-1 scale for consistency with our scoring system
       const rawDistance = grant.distance || 0;
       const similarity = Math.max(0, Math.min(1, rawDistance / 10)); // Scale and clamp to 0-1
       
       console.log(`📊 Grant ${grant.id}: Raw Distance: ${rawDistance.toFixed(3)}, Similarity: ${similarity.toFixed(3)} (${Math.round(similarity * 100)}%)`);
       
       return { 
         grant: {
           id: grant.id,
           title: grant.title,
           organisation: grant.organisation,
           description: grant.description,
           search_description: grant.search_description,
           geographic_scope: grant.geographic_scope,
           region: grant.region,
           eligible_organisations: grant.eligible_organisations,
           industry_sectors: grant.industry_sectors
         }, 
         similarity 
       };
     });

         // Sort by similarity score (highest first), filter out very low scores, and take top 25
     const topMatches = scoredGrants
       .filter(({ similarity }) => similarity > 0.1) // Cut off results below 10% similarity (database already filtered)
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

    // Convert to final response format
    const rankedGrants = llmFilteredResults.map(result => {
      const originalGrant = grantsForLLMFiltering.find(g => g.id === result.grantId);
      const originalScore = originalGrant ? Math.round(originalGrant.relevanceScore * 100) : 0;
      
      return {
        grantId: result.grantId,
        relevanceScore: Math.round(result.refinedScore) / 100, // Convert back to 0-1 scale
        matchingReasons: [
          `LLM refined score: ${result.refinedScore}%`,
          `Reasoning: ${result.reasoning || 'No reasoning provided'}`,
          `Original semantic score: ${originalScore}%`
        ]
      };
    });

    // Sort by refined score
    rankedGrants.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const response = {
      rankedGrants,
      explanation: `Found ${rankedGrants.length} relevant grants using semantic search + LLM filtering for query: "${query}"`
    };

    console.log(`✅ Returning ${rankedGrants.length} LLM-filtered grants`);
    console.log('All final scores being returned:', rankedGrants.map(g => `${g.grantId}: ${Math.round(g.relevanceScore * 100)}%`));
    
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
