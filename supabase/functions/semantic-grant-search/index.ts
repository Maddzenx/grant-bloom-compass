import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Deno types for edge functions
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Language utility functions
const getGrantLanguage = (organisation: string | null): 'sv' | 'en' => {
  if (!organisation) return 'sv';
  
  const orgLower = organisation.toLowerCase();
  
  // EU grants use English
  if (orgLower.includes('eu') || orgLower.includes('european')) {
    return 'en';
  }
  
  // All other grants use Swedish
  return 'sv';
};



serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, organizationFilter } = await req.json();

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

    console.log('🔍 Semantic Grant Search - Query:', query);
    console.log('🏢 Organization filter:', organizationFilter);

    let grants: any[] = [];

    try {
      console.log('🔍 Querying database for grants with embeddings...');
      
      // Define fields to select for semantic search - load both language versions
      const selectFields = [
        'id', 'organisation', 'embedding',
        // Language-specific fields in both languages
        'title_sv', 'title_en', 'description_sv', 'description_en', 'subtitle_sv', 'subtitle_en',
        'eligibility_sv', 'eligibility_en', 'evaluation_criteria_sv', 'evaluation_criteria_en',
        'application_process_sv', 'application_process_en',
        // Other fields that don't need language selection
        'keywords', 'industry_sectors', 'eligible_organisations_sv', 'eligible_organisations_en',
        'geographic_scope', 'region_sv', 'region_en', 'eligible_cost_categories_sv', 'eligible_cost_categories_en'
      ];
      
      // Build the query - start with base query
      let grantsQuery = supabase
        .from('grant_call_details')
        .select(selectFields.join(', '))
        .not('embedding', 'is', null);

      // Filter out grants with passed deadlines (but include grants with null closing dates)
      const today = new Date().toISOString().split('T')[0];
      grantsQuery = grantsQuery.or(
        `application_closing_date.is.null,application_closing_date.gte.${today}`
      );

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

    if (!grants || grants.length === 0) {
      console.log('📭 No grants found in database');
      return new Response(JSON.stringify({
        rankedGrants: [],
        explanation: 'No grants found in database'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`📊 Processing ${grants.length} grants with AI semantic search`);
    console.log(`🔍 About to create embeddings for query: "${query}"`);

    // Transform grants to use correct language based on organization
    const transformedGrants = grants.map(grant => {
      const language = getGrantLanguage(grant.organisation);
      
      // Select the correct language fields based on organization
      const title = language === 'en' ? grant.title_en : grant.title_sv;
      const subtitle = language === 'en' ? grant.subtitle_en : grant.subtitle_sv;
      const description = language === 'en' ? grant.description_en : grant.description_sv;
      const eligibility = language === 'en' ? grant.eligibility_en : grant.eligibility_sv;
      const evaluation_criteria = language === 'en' ? grant.evaluation_criteria_en : grant.evaluation_criteria_sv;
      const application_process = language === 'en' ? grant.application_process_en : grant.application_process_sv;
      const region = language === 'en' ? grant.region_en : grant.region_sv;
      const eligible_organisations = language === 'en' ? grant.eligible_organisations_en : grant.eligible_organisations_sv;
      const eligible_cost_categories = language === 'en' ? grant.eligible_cost_categories_en : grant.eligible_cost_categories_sv;
      
      return {
        ...grant,
        title: title || 'No title available',
        subtitle: subtitle || '',
        description: description || subtitle || 'No description available',
        eligibility: eligibility || '',
        evaluation_criteria: evaluation_criteria || '',
        application_process: application_process || '',
        region: region || undefined,
        eligible_organisations: eligible_organisations || grant.eligible_organisations_sv,
        eligible_cost_categories: eligible_cost_categories || grant.eligible_cost_categories_sv
      };
    });

    // Create embeddings for the query
    console.log(`🔍 Creating OpenAI embedding for query: "${query}"`);
    
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: query,
        model: 'text-embedding-3-small'
      })
    });

    if (!embeddingResponse.ok) {
      console.error(`❌ OpenAI API error: ${embeddingResponse.status} ${embeddingResponse.statusText}`);
      throw new Error(`OpenAI embedding API error: ${embeddingResponse.statusText}`);
    }

    const embeddingData = await embeddingResponse.json();
    console.log(`✅ OpenAI embedding created successfully`);
    
    const queryEmbedding = embeddingData.data[0].embedding;
    
    console.log(`🔍 Query embedding length: ${queryEmbedding.length}`);
    console.log(`🔍 Query embedding sample: [${queryEmbedding.slice(0, 5).map(x => x.toFixed(4)).join(', ')}...]`);
    console.log(`🔍 Starting semantic search with ${transformedGrants.length} transformed grants`);

    // Use the already fetched grants for semantic search
    const allGrantsWithEmbeddings = transformedGrants.filter(grant => grant.embedding);
    
    console.log(`📊 Found ${allGrantsWithEmbeddings.length} grants with embeddings from transformed grants`);
    
    // Debug: Check first grant's embedding
    if (allGrantsWithEmbeddings.length > 0) {
      const firstGrant = allGrantsWithEmbeddings[0];
      console.log(`🔍 First grant embedding type: ${typeof firstGrant.embedding}`);
      console.log(`🔍 First grant embedding length: ${firstGrant.embedding?.length || 0}`);
      
      if (firstGrant.embedding) {
        if (Array.isArray(firstGrant.embedding)) {
          console.log(`🔍 First grant embedding sample: [${firstGrant.embedding.slice(0, 5).map(x => x.toFixed(4)).join(', ')}...]`);
        } else if (typeof firstGrant.embedding === 'string') {
          console.log(`🔍 First grant embedding is a string, attempting to parse...`);
          try {
            const parsedEmbedding = JSON.parse(firstGrant.embedding);
            console.log(`🔍 Parsed embedding type: ${typeof parsedEmbedding}, length: ${parsedEmbedding?.length || 0}`);
            if (Array.isArray(parsedEmbedding)) {
              console.log(`🔍 Parsed embedding sample: [${parsedEmbedding.slice(0, 5).map(x => x.toFixed(4)).join(', ')}...]`);
            }
          } catch (error) {
            console.log(`🔍 Failed to parse embedding: ${error.message}`);
          }
        } else {
          console.log(`🔍 First grant embedding is not an array, type: ${typeof firstGrant.embedding}`);
          console.log(`🔍 First grant embedding value: ${JSON.stringify(firstGrant.embedding).substring(0, 100)}...`);
        }
      }
    }

    if (allGrantsWithEmbeddings.length === 0) {
      console.log('📭 No grants with embeddings found');
      return new Response(JSON.stringify({
        rankedGrants: [],
        explanation: 'No grants found in database'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`🔍 Calculating similarity for ${allGrantsWithEmbeddings.length} grants...`);
    
    // Calculate cosine similarity for each grant
    const grantsWithSimilarity = allGrantsWithEmbeddings.map(grant => {
      let grantEmbedding = grant.embedding;
      
      // Check if embedding is valid
      if (!grantEmbedding) {
        console.warn(`⚠️ No embedding for grant ${grant.id}`);
        return { ...grant, similarity: 0 };
      }
      
      // Parse embedding if it's a string (JSON format)
      if (typeof grantEmbedding === 'string') {
        try {
          grantEmbedding = JSON.parse(grantEmbedding);
        } catch (error) {
          console.warn(`⚠️ Failed to parse embedding JSON for grant ${grant.id}: ${error.message}`);
          return { ...grant, similarity: 0 };
        }
      }
      
      // Check if embedding is an array after parsing
      if (!Array.isArray(grantEmbedding)) {
        console.warn(`⚠️ Embedding is not an array for grant ${grant.id} after parsing, type: ${typeof grantEmbedding}`);
        return { ...grant, similarity: 0 };
      }
      
      if (grantEmbedding.length !== queryEmbedding.length) {
        console.warn(`⚠️ Embedding length mismatch for grant ${grant.id}: query=${queryEmbedding.length}, grant=${grantEmbedding.length}`);
        return { ...grant, similarity: 0 };
      }

      // Calculate cosine similarity
      let dotProduct = 0;
      let queryMagnitude = 0;
      let grantMagnitude = 0;

      for (let i = 0; i < queryEmbedding.length; i++) {
        dotProduct += queryEmbedding[i] * grantEmbedding[i];
        queryMagnitude += queryEmbedding[i] * queryEmbedding[i];
        grantMagnitude += grantEmbedding[i] * grantEmbedding[i];
      }

      queryMagnitude = Math.sqrt(queryMagnitude);
      grantMagnitude = Math.sqrt(grantMagnitude);

      const similarity = dotProduct / (queryMagnitude * grantMagnitude);
      
      // Debug logging for first few grants
      if (allGrantsWithEmbeddings.indexOf(grant) < 3) {
        console.log(`🔍 Grant ${grant.id} similarity: ${similarity.toFixed(4)}`);
      }
      
      return { ...grant, similarity };
    });

    // Sort by similarity and take top results with a lower threshold
    const sortedGrants = grantsWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 20); // Take top 20 for debugging

    console.log(`📊 Top similarities: ${sortedGrants.slice(0, 5).map(g => `${g.similarity.toFixed(4)}`).join(', ')}`);
    
    // Use a much lower threshold - cosine similarity for text embeddings is typically much lower
    const matchedGrants = sortedGrants.filter(grant => grant.similarity >= 0.1);

    if (matchedGrants.length === 0) {
      console.log('📭 No semantic matches found above threshold');
      return new Response(JSON.stringify({
        rankedGrants: [],
        explanation: 'No grants found matching your query'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the full grant details for the matched grants
    const matchedGrantIds = matchedGrants.map((grant: any) => grant.id);
    
    // Define fields to select for the full grant details
    const fullGrantFields = [
      'id', 'organisation', 'min_funding_per_project', 'max_funding_per_project', 
      'total_funding_per_call', 'currency', 'application_opening_date', 'application_closing_date', 
      'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max', 
      'information_webinar_dates', 'information_webinar_links', 'geographic_scope', 
      'cofinancing_required', 'cofinancing_level_min', 'created_at', 'updated_at',
      // Language-specific fields in both languages
      'title_sv', 'title_en', 'subtitle_sv', 'subtitle_en', 'description_sv', 'description_en',
      'eligibility_sv', 'eligibility_en', 'evaluation_criteria_sv', 'evaluation_criteria_en',
      'application_process_sv', 'application_process_en',
      // Other fields
      'keywords', 'industry_sectors', 'eligible_organisations_sv', 'eligible_organisations_en',
      'region_sv', 'region_en', 'eligible_cost_categories_sv', 'eligible_cost_categories_en',
      'consortium_requirement_sv', 'consortium_requirement_en',
      'information_webinar_names_sv', 'information_webinar_names_en',
      'application_templates_names_sv', 'application_templates_names_en',
      'other_templates_names_sv', 'other_templates_names_en',
      'other_sources_names_sv', 'other_sources_names_en',
      'application_templates_links', 'other_templates_links', 'other_sources_links'
    ];

    const { data: fullGrants, error: fullGrantsError } = await supabase
      .from('grant_call_details')
      .select(fullGrantFields.join(', '))
      .in('id', matchedGrantIds);

    if (fullGrantsError) {
      console.error('❌ Error fetching full grant details:', fullGrantsError);
      throw new Error(`Failed to fetch full grant details: ${fullGrantsError.message}`);
    }

    // Create a map of grants by ID for easy lookup
    const grantsMap = new Map();
    fullGrants?.forEach(grant => {
      grantsMap.set(grant.id, grant);
    });

    // Transform the matched grants to use correct language
    const rankedGrants = matchedGrants.map((matchedGrant: any) => {
      const fullGrant = grantsMap.get(matchedGrant.id);
      if (!fullGrant) {
        console.warn(`⚠️ Full grant details not found for ID: ${matchedGrant.id}`);
        return null;
      }

      const language = getGrantLanguage(fullGrant.organisation);
      
      // Select the correct language fields based on organization
      const title = language === 'en' ? fullGrant.title_en : fullGrant.title_sv;
      const subtitle = language === 'en' ? fullGrant.subtitle_en : fullGrant.subtitle_sv;
      const description = language === 'en' ? fullGrant.description_en : fullGrant.description_sv;
      const eligibility = language === 'en' ? fullGrant.eligibility_en : fullGrant.eligibility_sv;
      const evaluation_criteria = language === 'en' ? fullGrant.evaluation_criteria_en : fullGrant.evaluation_criteria_sv;
      const application_process = language === 'en' ? fullGrant.application_process_en : fullGrant.application_process_sv;
      const region = language === 'en' ? fullGrant.region_en : fullGrant.region_sv;
      const eligible_organisations = language === 'en' ? fullGrant.eligible_organisations_en : fullGrant.eligible_organisations_sv;
      const eligible_cost_categories = language === 'en' ? fullGrant.eligible_cost_categories_en : fullGrant.eligible_cost_categories_sv;
      const consortium_requirement = language === 'en' ? fullGrant.consortium_requirement_en : fullGrant.consortium_requirement_sv;
      const information_webinar_names = language === 'en' ? fullGrant.information_webinar_names_en : fullGrant.information_webinar_names_sv;
      const application_templates_names = language === 'en' ? fullGrant.application_templates_names_en : fullGrant.application_templates_names_sv;
      const other_templates_names = language === 'en' ? fullGrant.other_templates_names_en : fullGrant.other_templates_names_sv;
      const other_sources_names = language === 'en' ? fullGrant.other_sources_names_en : fullGrant.other_sources_names_sv;
      
      return {
        id: fullGrant.id,
        title: title || 'No title available',
        organization: fullGrant.organisation || 'Unknown organization',
        description: description || subtitle || 'No description available',
        aboutGrant: subtitle || description || 'No description available',
        fundingAmount: formatFundingAmount(fullGrant),
        opens_at: fullGrant.application_opening_date || '',
        deadline: fullGrant.application_closing_date || '',
        tags: Array.isArray(fullGrant.keywords) ? fullGrant.keywords : [],
        industry_sectors: Array.isArray(fullGrant.industry_sectors) ? fullGrant.industry_sectors : [],
        eligible_organisations: Array.isArray(eligible_organisations) ? eligible_organisations : [],
        geographic_scope: fullGrant.geographic_scope ? [fullGrant.geographic_scope] : [],
        region: region || undefined,
        cofinancing_required: fullGrant.cofinancing_required || false,
        cofinancing_level_min: fullGrant.cofinancing_level_min || undefined,
        consortium_requirement: consortium_requirement || undefined,
        fundingRules: Array.isArray(eligible_cost_categories) ? eligible_cost_categories : [],
        application_opening_date: fullGrant.application_opening_date,
        application_closing_date: fullGrant.application_closing_date,
        project_start_date_min: fullGrant.project_start_date_min,
        project_start_date_max: fullGrant.project_start_date_max,
        project_end_date_min: fullGrant.project_end_date_min,
        project_end_date_max: fullGrant.project_end_date_max,
        information_webinar_dates: Array.isArray(fullGrant.information_webinar_dates) ? fullGrant.information_webinar_dates : [],
        information_webinar_links: Array.isArray(fullGrant.information_webinar_links) ? fullGrant.information_webinar_links : [],
        information_webinar_names: Array.isArray(information_webinar_names) ? information_webinar_names : [],
        templates: Array.isArray(application_templates_names) ? application_templates_names : [],
        generalInfo: Array.isArray(other_templates_names) ? other_templates_names : [],
        application_templates_links: Array.isArray(fullGrant.application_templates_links) ? fullGrant.application_templates_links : [],
        other_templates_links: Array.isArray(fullGrant.other_templates_links) ? fullGrant.other_templates_links : [],
        other_sources_links: Array.isArray(fullGrant.other_sources_links) ? fullGrant.other_sources_links : [],
        other_sources_names: Array.isArray(other_sources_names) ? other_sources_names : [],
        created_at: fullGrant.created_at,
        updated_at: fullGrant.updated_at,
        distance: 1 - matchedGrant.similarity // Convert similarity to distance for consistency
      };
    }).filter(grant => grant !== null); // Remove any null grants

    console.log(`✅ Semantic search completed, found ${rankedGrants.length} matches`);

    return new Response(JSON.stringify({
      rankedGrants,
      explanation: `Found ${rankedGrants.length} grants matching your query using semantic search`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in semantic grant search:', error);
    return new Response(JSON.stringify({
      error: 'Semantic search failed',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to format funding amount
function formatFundingAmount(grant: any): string {
  const currency = grant.currency || 'SEK';
  
  // Helper to format large amounts in millions
  const formatAmount = (amount: number): string => {
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)} M${currency}`;
    }
    // Use spaces instead of commas for thousand separators (Swedish format)
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currency}`;
  };
  
  if (grant.max_funding_per_project) {
    if (grant.min_funding_per_project && grant.min_funding_per_project !== grant.max_funding_per_project) {
      return `${formatAmount(grant.min_funding_per_project)} - ${formatAmount(grant.max_funding_per_project)}`;
    }
    return formatAmount(grant.max_funding_per_project);
  }
  
  if (grant.total_funding_per_call) {
    return formatAmount(grant.total_funding_per_call);
  }
  
  if (grant.min_funding_per_project) {
    return formatAmount(grant.min_funding_per_project);
  }
  
  return 'Not specified';
}
