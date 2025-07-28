import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    const { 
      filters = {}, 
      sorting = { sortBy: 'default' }, 
      pagination = { page: 1, limit: 15 },
      searchTerm = ''
    } = await req.json();

    console.log('🔍 Filtered grants search request:', {
      filters,
      sorting,
      pagination,
      searchTerm: searchTerm ? `"${searchTerm}"` : 'none'
    });

    // Define fields to select
    const selectFields = [
      'id', 'organisation', 'min_funding_per_project', 'max_funding_per_project', 
      'total_funding_per_call', 'currency', 'application_opening_date', 'application_closing_date', 
      'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max', 
      'information_webinar_dates', 'information_webinar_links', 'geographic_scope', 
      'cofinancing_required', 'cofinancing_level_min', 'created_at', 'updated_at',
      // Language-specific fields
      'title', 'subtitle', 'information_webinar_names', 'application_templates_names', 
      'application_templates_links', 'other_templates_names', 'other_templates_links', 
      'other_sources_names', 'other_sources_links', 'keywords', 'industry_sectors', 
      'eligible_organisations', 'region', 'eligible_cost_categories'
    ];

    // For filtered search, we'll use Swedish as default and handle language selection in transformation
    const selectStatement = createLanguageAwareSelect(selectFields, 'sv');

    // Start building the query
    let query = supabase
      .from('grant_call_details')
      .select(selectStatement, { count: 'exact' });

    // Filter out grants with passed deadlines
    const today = new Date().toISOString().split('T')[0];
    query = query
      .not('application_closing_date', 'is', null)
      .gte('application_closing_date', today);

    // Apply text search if provided (basic text search, not semantic)
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      // Search in both Swedish and English fields
      query = query.or(
        `title_sv.ilike.%${searchLower}%,title_en.ilike.%${searchLower}%,` +
        `organisation.ilike.%${searchLower}%,` +
        `description_sv.ilike.%${searchLower}%,description_en.ilike.%${searchLower}%,` +
        `subtitle_sv.ilike.%${searchLower}%,subtitle_en.ilike.%${searchLower}%`
      );
    }

    // Apply organization filter
    if (filters.organizations && filters.organizations.length > 0) {
      console.log('🏢 Applying organization filter:', filters.organizations);
      query = query.in('organisation', filters.organizations);
    }

    // Apply funding range filter
    if (filters.fundingRange) {
      const { min, max } = filters.fundingRange;
      if (min !== undefined && min > 0) {
        query = query.gte('max_funding_per_project', min);
      }
      if (max !== undefined && max > 0) {
        query = query.lte('max_funding_per_project', max);
      }
    }

    // Apply industry sectors filter
    if (filters.industrySectors && filters.industrySectors.length > 0) {
      console.log('🏭 Applying industry sectors filter:', filters.industrySectors);
      const sectorConditions = filters.industrySectors.map((sector: string) => 
        `industry_sectors.cs.["${sector}"]`
      );
      query = query.or(sectorConditions.join(','));
    }

    // Apply eligible applicants filter
    if (filters.eligibleApplicants && filters.eligibleApplicants.length > 0) {
      console.log('👥 Applying eligible applicants filter:', filters.eligibleApplicants);
      const applicantConditions = filters.eligibleApplicants.map((applicant: string) => 
        `eligible_organisations_sv.cs.["${applicant}"]`
      );
      query = query.or(applicantConditions.join(','));
    }

    // Apply consortium requirement filter
    if (filters.consortiumRequired !== undefined) {
      console.log('🤝 Applying consortium requirement filter:', filters.consortiumRequired);
      query = query.eq('consortium_requirement_sv', filters.consortiumRequired ? 'true' : 'false');
    }

    // Apply geographic scope filter
    if (filters.geographicScope && filters.geographicScope.length > 0) {
      console.log('🌍 Applying geographic scope filter:', filters.geographicScope);
      const scopeConditions = filters.geographicScope.map((scope: string) => 
        `geographic_scope.ilike.%${scope}%`
      );
      query = query.or(scopeConditions.join(','));
    }

    // Apply cofinancing requirement filter
    if (filters.cofinancingRequired !== undefined) {
      console.log('💰 Applying cofinancing requirement filter:', filters.cofinancingRequired);
      query = query.eq('cofinancing_required', filters.cofinancingRequired);
    }

    // Apply deadline filter
    if (filters.deadline) {
      if (filters.deadline.type === 'preset') {
        const today = new Date();
        let targetDate: Date;

        switch (filters.deadline.preset) {
          case '1week':
            targetDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case '1month':
            targetDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            break;
          case '3months':
            targetDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
            break;
          case '6months':
            targetDate = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
            break;
          default:
            targetDate = today;
        }

        query = query.lte('application_closing_date', targetDate.toISOString().split('T')[0]);
      }
    }

    // Apply custom date range filter
    if (filters.deadline && filters.deadline.type === 'custom' && filters.deadline.customRange) {
      const { start, end } = filters.deadline.customRange;
      if (start) {
        query = query.gte('application_closing_date', start);
      }
      if (end) {
        query = query.lte('application_closing_date', end);
      }
    }

    // Apply sorting before pagination
    switch (sorting.sortBy) {
      case 'deadline-asc':
        query = query.order('application_closing_date', { ascending: true, nullsLast: true });
        break;
      case 'deadline-desc':
        query = query.order('application_closing_date', { ascending: false, nullsFirst: true });
        break;
      case 'amount-desc':
        // Note: This is a simplified approach. In production, you might want to store parsed amounts
        query = query.order('max_funding_per_project', { ascending: false, nullsLast: true });
        break;
      case 'amount-asc':
        query = query.order('max_funding_per_project', { ascending: true, nullsLast: true });
        break;
      case 'created-desc':
        query = query.order('updated_at', { ascending: false });
        break;
      default:
        // Default sorting by updated_at descending
        query = query.order('updated_at', { ascending: false });
        break;
    }

    // Apply pagination
    const offset = (pagination.page - 1) * pagination.limit;
    query = query.range(offset, offset + pagination.limit - 1);

    // Execute the query
    const { data: grants, error: grantsError, count } = await query;

    if (grantsError) {
      console.error('❌ Database error:', grantsError);
      throw new Error(`Failed to fetch grants: ${grantsError.message}`);
    }

    console.log('✅ Query executed successfully:', {
      grantsCount: grants?.length || 0,
      totalCount: count,
      page: pagination.page,
      limit: pagination.limit
    });

    // Transform the grants data
    const transformedGrants = grants?.map((grant: any) => {
      // Determine language based on organization
      const language = getGrantLanguage(grant.organisation);
      
      // Transform the grant data to use the correct language fields
      return {
        id: grant.id,
        title: grant.title || 'No title available',
        organization: grant.organisation || 'Unknown organization',
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
        updated_at: grant.updated_at
      };
    }) || [];

    return new Response(JSON.stringify({
      grants: transformedGrants,
      totalCount: count || 0,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil((count || 0) / pagination.limit)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in filtered grants search:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
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