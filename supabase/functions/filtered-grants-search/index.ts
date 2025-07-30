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

const createLanguageAwareSelect = (fields: string[], language: 'sv' | 'en'): string[] => {
  const languageSpecificFields = [
    'title', 'subtitle', 'description', 'eligibility', 'evaluation_criteria',
    'application_process', 'consortium_requirement', 'region',
    'eligible_organisations', 'eligible_cost_categories', 'information_webinar_names',
    'application_templates_names', 'other_sources_names', 'contact_title',
    'other_templates_names', 'other_important_dates_labels'
  ];
  
  return fields.map(field => {
    if (languageSpecificFields.includes(field)) {
      return `${field}_${language}`;
    }
    return field;
  });
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

    // Define fields to select - load basic card info in both languages
    const selectFields = [
      'id', 'organisation', 'min_funding_per_project', 'max_funding_per_project', 
      'total_funding_per_call', 'funding_amount_eur', 'currency', 'application_opening_date', 'application_closing_date', 
      'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max', 
      'information_webinar_dates', 'information_webinar_links', 'geographic_scope', 
      'cofinancing_required', 'cofinancing_level_min', 'created_at', 'updated_at',
      // Basic card info in both languages
      'title_sv', 'title_en', 'subtitle_sv', 'subtitle_en',
      // Other fields that don't need language selection
      'keywords', 'industry_sectors', 'eligible_organisations_standardized', 'region_sv', 'region_en',
      'eligible_cost_categories_standardized'
    ];

    // Start building the query
    let query = supabase
      .from('grant_call_details')
      .select(selectFields.join(', '), { count: 'exact' });

    // Filter out grants with passed deadlines (but include grants with null closing dates)
    const today = new Date().toISOString().split('T')[0];
    query = query.or(
      `application_closing_date.is.null,application_closing_date.gte.${today}`
    );

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

    // Apply funding range filter using the new funding_amount_eur field
    if (filters.fundingRange) {
      const { min, max } = filters.fundingRange;
      if (min !== undefined && min > 0) {
        query = query.gte('funding_amount_eur', min);
      }
      if (max !== undefined && max > 0) {
        query = query.lte('funding_amount_eur', max);
      }
    }

    // Apply industry sectors filter - use the original field
    if (filters.industrySectors && filters.industrySectors.length > 0) {
      console.log('🏭 Applying industry sectors filter:', filters.industrySectors);
      const sectorConditions = filters.industrySectors.map((sector: string) => 
        `industry_sectors.cs.["${sector}"]`
      );
      query = query.or(sectorConditions.join(','));
    }

    // Apply eligible applicants filter - use the original field for filtering
    if (filters.eligibleApplicants && filters.eligibleApplicants.length > 0) {
      console.log('👥 Applying eligible applicants filter:', filters.eligibleApplicants);
      const applicantConditions = filters.eligibleApplicants.map((applicant: string) => 
        `eligible_organisations_standardized.cs.["${applicant}"]`
      );
      query = query.or(applicantConditions.join(','));
    }

    // Apply consortium requirement filter - use the original field for filtering
    // Temporarily disabled due to boolean parsing issues
    if (filters.consortiumRequired !== undefined && filters.consortiumRequired !== null) {
      console.log('🤝 Consortium requirement filter received:', filters.consortiumRequired, 'Type:', typeof filters.consortiumRequired);
      // TODO: Re-enable this filter once the boolean parsing issue is resolved
      // For now, we'll skip this filter to avoid the "invalid input syntax for type boolean" error
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
    if (filters.cofinancingRequired !== undefined && filters.cofinancingRequired !== null) {
      console.log('💰 Applying cofinancing requirement filter:', filters.cofinancingRequired, 'Type:', typeof filters.cofinancingRequired);
      query = query.eq('cofinancing_required', filters.cofinancingRequired);
    }

    // Apply status filter (open/upcoming)
    if (filters.statusFilter) {
      console.log('📅 Applying status filter:', filters.statusFilter);
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (filters.statusFilter === 'open') {
        // Open grants: application_opening_date <= today <= application_closing_date
        query = query
          .not('application_opening_date', 'is', null)
          .not('application_closing_date', 'is', null)
          .lte('application_opening_date', today)
          .gte('application_closing_date', today);
      } else if (filters.statusFilter === 'upcoming') {
        // Upcoming grants: application_opening_date > today
        query = query
          .not('application_opening_date', 'is', null)
          .gt('application_opening_date', today);
      }
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
        // Use the new funding_amount_eur field for efficient sorting
        query = query.order('funding_amount_eur', { ascending: false, nullsLast: true });
        break;
      case 'amount-asc':
        query = query.order('funding_amount_eur', { ascending: true, nullsLast: true });
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

    // Helper function to select the correct language fields based on organization
    const selectLanguageFields = (grant: any): any => {
      const language = getGrantLanguage(grant.organisation);
      
      return {
        ...grant,
        // Select the correct language for title and subtitle
        title: language === 'en' ? grant.title_en : grant.title_sv,
        subtitle: language === 'en' ? grant.subtitle_en : grant.subtitle_sv,
        region: language === 'en' ? grant.region_en : grant.region_sv,
        // Use standardized fields for other data
        eligible_organisations: grant.eligible_organisations_standardized,
        eligible_cost_categories: grant.eligible_cost_categories_standardized
      };
    };

    console.log('✅ Query executed successfully:', {
      grantsCount: grants?.length || 0,
      totalCount: count,
      page: pagination.page,
      limit: pagination.limit
    });

    // Transform the grants data
    const transformedGrants = grants?.map((grant: any) => {
      // Select the correct language fields based on organization
      const languageGrant = selectLanguageFields(grant);
      
      // Debug logging for the first few grants
      if (grants?.indexOf(grant) < 3) {
        console.log('🔍 Grant transformation debug:', {
          id: languageGrant.id,
          organisation: languageGrant.organisation,
          title_sv: grant.title_sv,
          title_en: grant.title_en,
          subtitle_sv: grant.subtitle_sv,
          subtitle_en: grant.subtitle_en,
          selected_title: languageGrant.title,
          selected_subtitle: languageGrant.subtitle,
          funding_fields: {
            max_funding: languageGrant.max_funding_per_project,
            min_funding: languageGrant.min_funding_per_project,
            total_funding: languageGrant.total_funding_per_call,
            currency: languageGrant.currency
          }
        });
      }
      
      // Transform the grant data to use the correct language fields
      return {
        id: languageGrant.id,
        title: languageGrant.title || 'No title available',
        organization: languageGrant.organisation || 'Unknown organization',
        aboutGrant: languageGrant.subtitle || 'No description available',
        fundingAmount: formatFundingAmount(languageGrant),
        opens_at: languageGrant.application_opening_date || '',
        deadline: languageGrant.application_closing_date || '',
        tags: Array.isArray(languageGrant.keywords) ? languageGrant.keywords : [],
        industry_sectors: Array.isArray(languageGrant.industry_sectors) ? languageGrant.industry_sectors : [],
        eligible_organisations: Array.isArray(languageGrant.eligible_organisations) ? languageGrant.eligible_organisations : [],
        geographic_scope: languageGrant.geographic_scope ? [languageGrant.geographic_scope] : [],
        region: languageGrant.region || undefined,
        cofinancing_required: languageGrant.cofinancing_required || false,
        cofinancing_level_min: languageGrant.cofinancing_level_min || undefined,
        consortium_requirement: undefined, // Not available in card view
        fundingRules: Array.isArray(languageGrant.eligible_cost_categories) ? languageGrant.eligible_cost_categories : [],
        application_opening_date: languageGrant.application_opening_date,
        application_closing_date: languageGrant.application_closing_date,
        project_start_date_min: languageGrant.project_start_date_min,
        project_start_date_max: languageGrant.project_start_date_max,
        project_end_date_min: languageGrant.project_end_date_max,
        project_end_date_max: languageGrant.project_end_date_max,
        information_webinar_dates: Array.isArray(languageGrant.information_webinar_dates) ? languageGrant.information_webinar_dates : [],
        information_webinar_links: Array.isArray(languageGrant.information_webinar_links) ? languageGrant.information_webinar_links : [],
        information_webinar_names: [], // Not available in card view
        templates: [], // Not available in card view
        generalInfo: [], // Not available in card view
        application_templates_links: [], // Not available in card view
        other_templates_links: [], // Not available in card view
        other_sources_links: [], // Not available in card view
        other_sources_names: [], // Not available in card view
        created_at: languageGrant.created_at,
        updated_at: languageGrant.updated_at
      };
    }) || [];

    const totalPages = Math.ceil((count || 0) / pagination.limit);
    
    console.log('📄 Pagination response:', {
      totalCount: count || 0,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
      grantsReturned: transformedGrants.length
    });
    
    return new Response(JSON.stringify({
      grants: transformedGrants,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: count || 0,
        totalPages,
        hasMore: pagination.page < totalPages
      }
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
  // Handle null/undefined values safely
  const maxFunding = grant.max_funding_per_project;
  const minFunding = grant.min_funding_per_project;
  const totalFunding = grant.total_funding_per_call;
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
} 