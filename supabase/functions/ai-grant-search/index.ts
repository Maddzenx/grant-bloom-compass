
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
    const { query } = await req.json();

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

    console.log('🔍 AI Grant Search - Query:', query);

    // Define fields to select for AI search
    const selectFields = [
      'id', 'organisation', 'original_url', 'application_closing_date', 'application_opening_date',
      'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max',
      'information_webinar_dates', 'information_webinar_links', 'project_duration_months_min',
      'project_duration_months_max', 'max_funding_per_project', 'min_funding_per_project',
      'total_funding_per_call', 'currency', 'cofinancing_level_min', 'application_templates_links',
      'other_sources_links', 'contact_name', 'contact_email', 'contact_phone', 'processing_status',
      'scraped_at', 'processed_at', 'created_at', 'updated_at', 'ai_enabled', 'other_templates_links',
      'is_original_source', 'original_source_url', 'cofinancing_required', 'embedding',
      'cofinancing_level_max', 'program', 'grant_type', 'comments', 'other_important_dates',
      'eligible_organisations_standardized', 'eligible_cost_categories_standardized',
      'keywords', 'industry_sectors', 'geographic_scope',
      // Language-specific fields
      'title', 'region', 'eligible_organisations', 'consortium_requirement', 'subtitle',
      'description', 'eligibility', 'evaluation_criteria', 'application_process',
      'information_webinar_names', 'eligible_cost_categories', 'application_templates_names',
      'other_sources_names', 'contact_title', 'other_templates_names', 'other_important_dates_labels'
    ];

    // For AI search, we'll use Swedish as default and handle language selection in transformation
    const selectStatement = createLanguageAwareSelect(selectFields, 'sv');

    // Fetch all grants from the database
    const { data: grants, error: grantsError } = await supabase
      .from('grant_call_details')
      .select(selectStatement);

    if (grantsError) {
      throw new Error(`Failed to fetch grants: ${grantsError.message}`);
    }

    if (!grants || grants.length === 0) {
      return new Response(JSON.stringify({ 
        rankedGrants: [],
        explanation: 'No grants found in database'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📊 Processing grants:', grants.length);

    // Transform grants to use correct language based on organization
    const transformedGrants = grants.map(grant => {
      const language = getGrantLanguage(grant.organisation);
      
      return {
        ...grant,
        // Ensure we have the correct language fields for AI processing
        title: grant.title || 'No title available',
        subtitle: grant.subtitle || '',
        description: grant.description || '',
        eligibility: grant.eligibility || '',
        evaluation_criteria: grant.evaluation_criteria || '',
        application_process: grant.application_process || '',
        consortium_requirement: grant.consortium_requirement || '',
        region: grant.region || '',
        eligible_organisations: grant.eligible_organisations || [],
        eligible_cost_categories: grant.eligible_cost_categories || [],
        information_webinar_names: grant.information_webinar_names || [],
        application_templates_names: grant.application_templates_names || [],
        other_sources_names: grant.other_sources_names || [],
        contact_title: grant.contact_title || '',
        other_templates_names: grant.other_templates_names || [],
        other_important_dates_labels: grant.other_important_dates_labels || []
      };
    });

    // Use OpenAI to rank grants
    const prompt = `You are an expert grant matching system. Analyze the following grants and rank them by relevance to the user's query.

USER QUERY: "${query}"

GRANTS TO ANALYZE:
${transformedGrants.map((grant, index) => `
${index + 1}. ${grant.title}
   Organization: ${grant.organisation}
   Description: ${grant.description || grant.subtitle || 'No description'}
   Eligibility: ${grant.eligibility || 'Not specified'}
   Keywords: ${Array.isArray(grant.keywords) ? grant.keywords.join(', ') : 'None'}
   Industry Sectors: ${Array.isArray(grant.industry_sectors) ? grant.industry_sectors.join(', ') : 'None'}
   Funding: ${grant.max_funding_per_project ? `${grant.max_funding_per_project.toLocaleString()} ${grant.currency || 'SEK'}` : 'Not specified'}
`).join('\n')}

Please rank these grants by relevance to the query and provide a brief explanation for each ranking. Consider:
1. Semantic similarity to the query
2. Industry/sector alignment
3. Eligibility match
4. Funding appropriateness
5. Overall relevance

Return your response as a JSON array with objects containing:
- grantId: The grant ID
- relevanceScore: A score from 0-100
- explanation: Brief explanation of why this grant is relevant

Example format:
[
  {
    "grantId": "grant-id-1",
    "relevanceScore": 85,
    "explanation": "Excellent match for AI research funding"
  }
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert grant matching system. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;

    let rankedResults;
    try {
      rankedResults = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid AI response format');
    }

    // Transform the ranked results to include full grant data
    const rankedGrants = rankedResults.map((result: any) => {
      const originalGrant = transformedGrants.find(g => g.id === result.grantId);
      if (!originalGrant) {
        console.warn(`Could not find grant with ID: ${result.grantId}`);
        return null;
      }

      return {
        id: originalGrant.id,
        title: originalGrant.title || 'No title available',
        organization: originalGrant.organisation || 'Unknown organization',
        description: originalGrant.description || originalGrant.subtitle || 'No description available',
        aboutGrant: originalGrant.subtitle || originalGrant.description || 'No description available',
        fundingAmount: formatFundingAmount(originalGrant),
        opens_at: originalGrant.application_opening_date || '',
        deadline: originalGrant.application_closing_date || '',
        tags: Array.isArray(originalGrant.keywords) ? originalGrant.keywords : [],
        industry_sectors: Array.isArray(originalGrant.industry_sectors) ? originalGrant.industry_sectors : [],
        eligible_organisations: Array.isArray(originalGrant.eligible_organisations) ? originalGrant.eligible_organisations : [],
        geographic_scope: originalGrant.geographic_scope ? [originalGrant.geographic_scope] : [],
        region: originalGrant.region || undefined,
        cofinancing_required: originalGrant.cofinancing_required || false,
        cofinancing_level_min: originalGrant.cofinancing_level_min || undefined,
        consortium_requirement: originalGrant.consortium_requirement || undefined,
        fundingRules: Array.isArray(originalGrant.eligible_cost_categories) ? originalGrant.eligible_cost_categories : [],
        application_opening_date: originalGrant.application_opening_date,
        application_closing_date: originalGrant.application_closing_date,
        project_start_date_min: originalGrant.project_start_date_min,
        project_start_date_max: originalGrant.project_start_date_max,
        project_end_date_min: originalGrant.project_end_date_min,
        project_end_date_max: originalGrant.project_end_date_max,
        information_webinar_dates: Array.isArray(originalGrant.information_webinar_dates) ? originalGrant.information_webinar_dates : [],
        information_webinar_links: Array.isArray(originalGrant.information_webinar_links) ? originalGrant.information_webinar_links : [],
        information_webinar_names: Array.isArray(originalGrant.information_webinar_names) ? originalGrant.information_webinar_names : [],
        templates: Array.isArray(originalGrant.application_templates_names) ? originalGrant.application_templates_names : [],
        generalInfo: Array.isArray(originalGrant.other_templates_names) ? originalGrant.other_templates_names : [],
        application_templates_links: Array.isArray(originalGrant.application_templates_links) ? originalGrant.application_templates_links : [],
        other_templates_links: Array.isArray(originalGrant.other_templates_links) ? originalGrant.other_templates_links : [],
        other_sources_links: Array.isArray(originalGrant.other_sources_links) ? originalGrant.other_sources_links : [],
        other_sources_names: Array.isArray(originalGrant.other_sources_names) ? originalGrant.other_sources_names : [],
        created_at: originalGrant.created_at,
        updated_at: originalGrant.updated_at,
        relevanceScore: result.relevanceScore / 100, // Convert to 0-1 scale
        matchingReasons: [result.explanation]
      };
    }).filter((grant): grant is NonNullable<typeof grant> => grant !== null);

    return new Response(JSON.stringify({
      rankedGrants,
      explanation: `Found ${rankedGrants.length} relevant grants using AI analysis`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in AI grant search:', error);
    return new Response(JSON.stringify({ 
      error: 'AI search failed',
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
