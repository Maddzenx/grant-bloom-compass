import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface FilterOptions {
  organizations?: string[];
  fundingRange?: {
    min?: number;
    max?: number;
  };
  deadline?: {
    type: 'preset' | 'custom';
    preset?: string;
    customRange?: {
      start?: string;
      end?: string;
    };
  };
  tags?: string[];
  industrySectors?: string[];
  eligibleApplicants?: string[];
  consortiumRequired?: boolean;
  geographicScope?: string[];
  cofinancingRequired?: boolean;
}

interface SortOptions {
  sortBy: 'default' | 'deadline-asc' | 'deadline-desc' | 'amount-desc' | 'amount-asc' | 'created-desc' | 'relevance';
  searchTerm?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

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

    // Start building the query
    let query = supabase
      .from('grant_call_details')
      .select(`
        id, title, organisation, subtitle, min_funding_per_project, max_funding_per_project, total_funding_per_call,
        application_opening_date, application_closing_date, project_start_date_min, project_start_date_max,
        project_end_date_min, project_end_date_max, information_webinar_dates, information_webinar_links,
        information_webinar_names, application_templates_names, application_templates_links, other_templates_names,
        other_templates_links, other_sources_names, other_sources_links, keywords, industry_sectors, eligible_organisations, 
        geographic_scope, cofinancing_required, cofinancing_level_min, created_at
      `, { count: 'exact' });

    // Filter out grants with passed deadlines
    const today = new Date().toISOString().split('T')[0];
    query = query
      .not('application_closing_date', 'is', null)
      .gte('application_closing_date', today);

    // Apply text search if provided (basic text search, not semantic)
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      query = query.or(`title.ilike.%${searchLower}%,organisation.ilike.%${searchLower}%,description.ilike.%${searchLower}%,subtitle.ilike.%${searchLower}%`);
    }

    // Apply organization filter
    if (filters.organizations && filters.organizations.length > 0) {
      query = query.in('organisation', filters.organizations);
    }

    // Apply industry sectors filter
    if (filters.industrySectors && filters.industrySectors.length > 0) {
      const sectorConditions = filters.industrySectors.map((sector: string) => 
        `industry_sectors.cs.["${sector}"]`
      );
      query = query.or(sectorConditions.join(','));
    }

    // Apply eligible applicants filter
    if (filters.eligibleApplicants && filters.eligibleApplicants.length > 0) {
      const applicantConditions = filters.eligibleApplicants.map((applicant: string) => 
        `eligible_organisations.cs.["${applicant}"]`
      );
      query = query.or(applicantConditions.join(','));
    }

    // Apply geographic scope filter
    if (filters.geographicScope && filters.geographicScope.length > 0) {
      const geoConditions = filters.geographicScope.map((scope: string) => 
        `geographic_scope.cs.["${scope}"],region.cs.["${scope}"]`
      );
      query = query.or(geoConditions.join(','));
    }

    // Apply deadline filter
    if (filters.deadline && filters.deadline.type === 'preset' && filters.deadline.preset) {
      const presetDays: { [key: string]: number } = {
        'urgent': 7,
        '2weeks': 14,
        '1month': 30,
        '3months': 90,
        '6months': 180,
        '1year': 365,
      };
      
      const days = presetDays[filters.deadline.preset];
      if (days) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        const targetDateStr = targetDate.toISOString().split('T')[0];
        
        query = query
          .not('application_closing_date', 'is', null)
          .gte('application_closing_date', new Date().toISOString().split('T')[0])
          .lte('application_closing_date', targetDateStr);
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
        query = query.order('created_at', { ascending: false });
        break;
      default:
        // Default sorting by created_at descending
        query = query.order('created_at', { ascending: false });
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

    // Apply funding range filter (post-query since it requires parsing)
    let filteredGrants = grants || [];
    if (filters.fundingRange && (filters.fundingRange.min || filters.fundingRange.max)) {
      filteredGrants = filteredGrants.filter(grant => {
        // Use max_funding_per_project as the primary funding amount, fallback to min_funding_per_project
        const fundingAmount = grant.max_funding_per_project || grant.min_funding_per_project || 0;
        
        if (filters.fundingRange.min && fundingAmount < filters.fundingRange.min) {
          return false;
        }
        if (filters.fundingRange.max && fundingAmount > filters.fundingRange.max) {
          return false;
        }
        
        return true;
      });
    }

    // Apply tags filter (post-query since it requires array parsing)
    if (filters.tags && filters.tags.length > 0) {
      filteredGrants = filteredGrants.filter(grant => {
        const grantTags = parseJsonArray(grant.keywords);
        return filters.tags.some(filterTag => 
          grantTags.some(grantTag => 
            grantTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        );
      });
    }

    const response = {
      grants: filteredGrants,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: count,
        totalPages: Math.ceil((count || 0) / pagination.limit),
        hasMore: offset + pagination.limit < (count || 0)
      },
      filters: filters,
      sorting: sorting
    };

    console.log('📊 Response summary:', {
      grantsReturned: filteredGrants.length,
      totalInDB: count,
      currentPage: pagination.page,
      totalPages: response.pagination.totalPages
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in filtered-grants-search:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch filtered grants',
      grants: [],
      pagination: { page: 1, limit: 15, total: 0, totalPages: 0, hasMore: false }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to parse funding amounts
function parseFundingAmount(fundingAmount: string): number {
  if (!fundingAmount) return 0;
  
  const match = fundingAmount.match(/(\d+(?:[.,]\d+)?)\s*M?SEK/i);
  if (match) {
    const amount = parseFloat(match[1].replace(',', '.'));
    return fundingAmount.includes('M') ? amount * 1000000 : amount;
  }
  
  const numbers = fundingAmount.match(/\d+(?:\s*\d+)*/g);
  if (!numbers) return 0;
  
  const firstNumber = numbers[0].replace(/\s/g, '');
  return parseInt(firstNumber, 10) || 0;
}

// Helper function to parse JSON arrays
function parseJsonArray(jsonValue: any): string[] {
  try {
    if (!jsonValue) return [];
    if (Array.isArray(jsonValue)) {
      return jsonValue.filter(item => typeof item === 'string');
    }
    if (typeof jsonValue === 'string') {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => typeof item === 'string');
      }
    }
    return [];
  } catch (error) {
    console.warn('⚠️ Error parsing JSON array:', error, jsonValue);
    return [];
  }
} 