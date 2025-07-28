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

const createLanguageAwareSelect = (fields: string[], language: 'sv' | 'en'): string => {
  const languageSpecificFields = [
    'title', 'subtitle', 'description', 'eligibility', 'evaluation_criteria',
    'application_process', 'consortium_requirement', 'region',
    'eligible_organisations', 'eligible_cost_categories', 'information_webinar_names',
    'application_templates_names', 'other_sources_names', 'contact_title',
    'other_templates_names', 'other_important_dates_labels'
  ];
  
  return fields.map(field => {
    if (languageSpecificFields.includes(field)) {
      return `${field}_${language} as ${field}`;
    }
    return field;
  }).join(', ');
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
      
      // Define fields to select for semantic search
      const selectFields = [
        'id', 'organisation', 'embedding',
        // Language-specific fields
        'title', 'description', 'subtitle', 'eligibility', 'evaluation_criteria',
        'application_process', 'keywords', 'industry_sectors', 'eligible_organisations',
        'geographic_scope', 'region', 'eligible_cost_categories'
      ];

      // For semantic search, we'll use Swedish as default and handle language selection in transformation
      const selectStatement = createLanguageAwareSelect(selectFields, 'sv');
      
      // Build the query - start with base query
      let grantsQuery = supabase
        .from('grant_call_details')
        .select(selectStatement)
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
        const orConditions = organizationFilter.map((orgType: string) => 
          `eligible_organisations_sv.cs.["${orgType}"]`
        );
        
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

    // Transform grants to use correct language based on organization
    const transformedGrants = grants.map(grant => {
      const language = getGrantLanguage(grant.organisation);
      
      // For semantic search, we need to use the correct language description
      const description = language === 'en' ? 
        (grant.description || grant.subtitle || '') : 
        (grant.description || grant.subtitle || '');
      
      return {
        ...grant,
        description,
        // Ensure we have the correct language fields for display
        title: grant.title || 'No title available',
        subtitle: grant.subtitle || '',
        eligibility: grant.eligibility || '',
        evaluation_criteria: grant.evaluation_criteria || '',
        application_process: grant.application_process || ''
      };
    });

    // Create embeddings for the query
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
      throw new Error(`OpenAI embedding API error: ${embeddingResponse.statusText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Use the match_grant_call_details function for semantic search
    const { data: matchedGrants, error: matchError } = await supabase.rpc('match_grant_call_details', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 10
    });

    if (matchError) {
      console.error('❌ Semantic search error:', matchError);
      throw new Error(`Semantic search failed: ${matchError.message}`);
    }

    if (!matchedGrants || matchedGrants.length === 0) {
      console.log('📭 No semantic matches found');
      return new Response(JSON.stringify({ 
        rankedGrants: [],
        explanation: 'No grants found matching your query'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Transform the matched grants to use correct language
    const rankedGrants = matchedGrants.map((grant: any) => {
      const language = getGrantLanguage(grant.organisation);
      
      return {
        id: grant.id,
        title: grant.title || 'No title available',
        organization: grant.organisation || 'Unknown organization',
        description: grant.description || grant.subtitle || 'No description available',
        aboutGrant: grant.subtitle || grant.description || 'No description available',
        fundingAmount: formatFundingAmount(grant),
        opens_at: grant.application_opening_date || '',
        deadline: grant.application_closing_date || '',
        tags: Array.isArray(grant.keywords) ? grant.keywords : [],
        industry_sectors: Array.isArray(grant.industry_sectors) ? grant.industry_sectors : [],
        eligible_organisations: Array.isArray(grant.eligible_organisations) ? grant.eligible_organisations : [],
        geographic_scope: grant.geographic_scope ? [grant.geographic_scope] : [],
        region: grant.region || undefined,
        cofinancing_required: grant.cofinancing_required || false,
        cofinancing_level_min: grant.cofinancing_level_min || undefined,
        consortium_requirement: grant.consortium_requirement || undefined,
        fundingRules: Array.isArray(grant.eligible_cost_categories) ? grant.eligible_cost_categories : [],
        application_opening_date: grant.application_opening_date,
        application_closing_date: grant.application_closing_date,
        project_start_date_min: grant.project_start_date_min,
        project_start_date_max: grant.project_start_date_max,
        project_end_date_min: grant.project_end_date_min,
        project_end_date_max: grant.project_end_date_max,
        information_webinar_dates: Array.isArray(grant.information_webinar_dates) ? grant.information_webinar_dates : [],
        information_webinar_links: Array.isArray(grant.information_webinar_links) ? grant.information_webinar_links : [],
        information_webinar_names: Array.isArray(grant.information_webinar_names) ? grant.information_webinar_names : [],
        templates: Array.isArray(grant.application_templates_names) ? grant.application_templates_names : [],
        generalInfo: Array.isArray(grant.other_templates_names) ? grant.other_templates_names : [],
        application_templates_links: Array.isArray(grant.application_templates_links) ? grant.application_templates_links : [],
        other_templates_links: Array.isArray(grant.other_templates_links) ? grant.other_templates_links : [],
        other_sources_links: Array.isArray(grant.other_sources_links) ? grant.other_sources_links : [],
        other_sources_names: Array.isArray(grant.other_sources_names) ? grant.other_sources_names : [],
        created_at: grant.created_at,
        updated_at: grant.updated_at,
        distance: grant.distance
      };
    });

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
  if (grant.max_funding_per_project) {
    if (grant.min_funding_per_project && grant.min_funding_per_project !== grant.max_funding_per_project) {
      return `${grant.min_funding_per_project.toLocaleString()} - ${grant.max_funding_per_project.toLocaleString()} ${grant.currency || 'SEK'}`;
    }
    return `${grant.max_funding_per_project.toLocaleString()} ${grant.currency || 'SEK'}`;
  }
  
  if (grant.total_funding_per_call) {
    return `${grant.total_funding_per_call.toLocaleString()} ${grant.currency || 'SEK'}`;
  }
  
  if (grant.min_funding_per_project) {
    return `${grant.min_funding_per_project.toLocaleString()} ${grant.currency || 'SEK'}`;
  }
  
  return 'Not specified';
}
