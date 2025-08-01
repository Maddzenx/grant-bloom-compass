import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GrantListItem } from '@/types/grant';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';
import { SortOption } from '@/components/SortingControls';


interface BackendFilterOptions {
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
  statusFilter?: 'open' | 'upcoming' | '';
}

interface BackendSortOptions {
  sortBy: SortOption;
  searchTerm?: string;
}

interface BackendPaginationOptions {
  page: number;
  limit: number;
}

interface BackendGrantsResponse {
  grants: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: BackendFilterOptions;
  sorting: BackendSortOptions;
}

export interface UseBackendFilteredGrantsOptions {
  filters: EnhancedFilterOptions;
  sorting: BackendSortOptions;
  pagination: BackendPaginationOptions;
  searchTerm?: string;
  enabled?: boolean;
}

const transformFiltersForBackend = (filters: EnhancedFilterOptions): BackendFilterOptions => {
  const backendFilters: BackendFilterOptions = {};
  
  // Only include organizations if there are actually selected
  if (filters.organizations && filters.organizations.length > 0) {
    backendFilters.organizations = filters.organizations;
  }
  
  // Only include funding range if both min and max are meaningful values
  if (filters.fundingRange && 
      (filters.fundingRange.min !== null && filters.fundingRange.min !== undefined && filters.fundingRange.min > 0) ||
      (filters.fundingRange.max !== null && filters.fundingRange.max !== undefined && filters.fundingRange.max > 0)) {
    backendFilters.fundingRange = {};
    if (filters.fundingRange.min !== null && filters.fundingRange.min !== undefined && filters.fundingRange.min > 0) {
      backendFilters.fundingRange.min = filters.fundingRange.min;
    }
    if (filters.fundingRange.max !== null && filters.fundingRange.max !== undefined && filters.fundingRange.max > 0) {
      backendFilters.fundingRange.max = filters.fundingRange.max;
    }
  }
  
  // Only include deadline if there's actually a preset or custom range
  if (filters.deadline && 
      (filters.deadline.preset || 
       (filters.deadline.customRange && 
        (filters.deadline.customRange.start || filters.deadline.customRange.end)))) {
    backendFilters.deadline = {
      type: filters.deadline.type
    };
    if (filters.deadline.preset) {
      backendFilters.deadline.preset = filters.deadline.preset;
    }
    if (filters.deadline.customRange && 
        (filters.deadline.customRange.start || filters.deadline.customRange.end)) {
      backendFilters.deadline.customRange = {};
      if (filters.deadline.customRange.start) {
        backendFilters.deadline.customRange.start = filters.deadline.customRange.start.toISOString().split('T')[0];
      }
      if (filters.deadline.customRange.end) {
        backendFilters.deadline.customRange.end = filters.deadline.customRange.end.toISOString().split('T')[0];
      }
    }
  }
  
  // Only include tags if there are actually selected
  if (filters.tags && filters.tags.length > 0) {
    backendFilters.tags = filters.tags;
  }
  
  // Only include industry sectors if there are actually selected
  if (filters.industrySectors && filters.industrySectors.length > 0) {
    backendFilters.industrySectors = filters.industrySectors;
  }
  
  // Only include eligible applicants if there are actually selected
  if (filters.eligibleApplicants && filters.eligibleApplicants.length > 0) {
    backendFilters.eligibleApplicants = filters.eligibleApplicants;
  }
  
  // Only include consortium required if it's explicitly set by user (not default false)
  if (filters.consortiumRequired === true) {
    backendFilters.consortiumRequired = filters.consortiumRequired;
  }
  
  // Only include geographic scope if there are actually selected
  if (filters.geographicScope && filters.geographicScope.length > 0) {
    backendFilters.geographicScope = filters.geographicScope;
  }
  
  // Only include cofinancing required if it's explicitly set by user (not default false)
  if (filters.cofinancingRequired === true) {
    backendFilters.cofinancingRequired = filters.cofinancingRequired;
  }
  
  // Only include status filter if it's a meaningful value
  if (filters.statusFilter && (filters.statusFilter === 'open' || filters.statusFilter === 'upcoming')) {
    backendFilters.statusFilter = filters.statusFilter;
  }
  
  return backendFilters;
};

const parseBooleanString = (val: any): boolean | undefined => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const lowered = val.trim().toLowerCase();
    if (['true','1','yes','ja','required','t'].includes(lowered)) return true;
    if (['false','0','no','nej','not required','none','f'].includes(lowered)) return false;
  }
  return undefined;
};

// Helper function to normalize field names from language-specific to base names
const normalizeGrantData = (grant: any): any => {
  const normalized = { ...grant };
  
  // Map language-specific fields back to base field names
  const languageFields = [
    'title', 'subtitle', 'description', 'eligibility', 'evaluation_criteria',
    'application_process', 'consortium_requirement', 'region',
    'eligible_organisations', 'eligible_cost_categories', 'information_webinar_names',
    'application_templates_names', 'other_sources_names', 'contact_title',
    'other_templates_names', 'other_important_dates_labels'
  ];
  
  languageFields.forEach(field => {
    // Check if the language-specific field exists and map it to the base field
    if (grant[`${field}_sv`] !== undefined) {
      normalized[field] = grant[`${field}_sv`];
    } else if (grant[`${field}_en`] !== undefined) {
      normalized[field] = grant[`${field}_en`];
    }
  });
  
  return normalized;
};

const transformSupabaseGrantToListItem = (grant: any): GrantListItem => {
  // The filtered-grants-search function now returns data with correct language already selected
  // No need to normalize - just use the data as-is
  
  return {
    id: grant.id,
    title: grant.title || 'Untitled Grant',
    organization: grant.organization || 'Unknown Organization',
    aboutGrant: grant.aboutGrant || 'No information available',
    fundingAmount: grant.fundingAmount || 'Not specified',
    funding_amount_eur: grant.funding_amount_eur || null,
    opens_at: grant.opens_at || '2024-01-01',
    deadline: grant.deadline || 'Not specified',
    tags: parseJsonArray(grant.tags) || [],
    industry_sectors: parseJsonArray(grant.industry_sectors),
    eligible_organisations: parseJsonArray(grant.eligible_organisations),
    geographic_scope: parseJsonArray(grant.geographic_scope),
    // Date fields for important dates display
    application_opening_date: grant.application_opening_date,
    application_closing_date: grant.application_closing_date,
    project_start_date_min: grant.project_start_date_min,
    project_start_date_max: grant.project_start_date_max,
    project_end_date_min: grant.project_end_date_min,
    project_end_date_max: grant.project_end_date_max,
    information_webinar_dates: parseJsonArray(grant.information_webinar_dates),
    information_webinar_links: parseJsonArray(grant.information_webinar_links),
    information_webinar_names: parseJsonArray(grant.information_webinar_names),
    // Project duration fields
    project_duration_months_min: grant.project_duration_months_min || undefined,
    project_duration_months_max: grant.project_duration_months_max || undefined,
    // Template fields for files and documents
    templates: parseJsonArray(grant.templates) || [],
    generalInfo: parseJsonArray(grant.generalInfo) || [],
    application_templates_links: parseJsonArray(grant.application_templates_links),
    other_templates_links: parseJsonArray(grant.other_templates_links),
    other_sources_links: parseJsonArray(grant.other_sources_links),
    other_sources_names: parseJsonArray(grant.other_sources_names),
    cofinancing_required: parseBooleanString(grant.cofinancing_required),
    cofinancing_level: grant.cofinancing_level_min ?? null,
    cofinancing_level_min: grant.cofinancing_level_min || undefined,
    cofinancing_level_max: grant.cofinancing_level_max || undefined,
    consortium_requirement: (typeof grant.consortium_requirement === 'string' ? grant.consortium_requirement.trim() : grant.consortium_requirement) || undefined,
    region: grant.region || null,
    fundingRules: parseJsonArray(grant.fundingRules) || [],
    // Timestamp fields
    created_at: grant.created_at,
    updated_at: grant.updated_at
  };
};



const parseJsonArray = (jsonValue: any): string[] | undefined => {
  if (!jsonValue) return undefined;
  if (Array.isArray(jsonValue)) return jsonValue;
  try {
    const parsed = JSON.parse(jsonValue);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const fetchBackendFilteredGrants = async (
  filters: BackendFilterOptions,
  sorting: BackendSortOptions,
  pagination: BackendPaginationOptions,
  searchTerm?: string
): Promise<{ grants: GrantListItem[]; pagination: BackendGrantsResponse['pagination'] }> => {
  console.log('🔍 Fetching backend filtered grants:', {
    filters: JSON.stringify(filters, null, 2),
    sorting,
    pagination,
    searchTerm: searchTerm ? `"${searchTerm}"` : 'none'
  });

  const { data, error } = await supabase.functions.invoke('filtered-grants-search', {
    body: {
      filters,
      sorting,
      pagination,
      searchTerm: searchTerm || ''
    }
  });

  if (error) {
    console.error('❌ Backend filtering error:', error);
    throw new Error(error.message || 'Failed to fetch filtered grants');
  }

  if (!data || data.error) {
    console.error('❌ Backend filtering service error:', data?.error);
    throw new Error(data?.error || 'Backend filtering service failed');
  }

  console.log('✅ Backend filtering successful:', {
    grantsCount: data.grants?.length || 0,
    totalCount: data.pagination?.total || 0,
    currentPage: data.pagination?.page || 1,
    totalPages: data.pagination?.totalPages || 0
  });

  // Transform grants from Supabase format to GrantListItem format
  const transformedGrants: GrantListItem[] = [];
  
  if (data.grants && Array.isArray(data.grants)) {
    for (const grant of data.grants) {
      try {
        const transformed = transformSupabaseGrantToListItem(grant);
        transformedGrants.push(transformed);
      } catch (transformError) {
        console.error('❌ Transform error for grant:', grant.id, transformError);
        // Skip this grant but continue with others
      }
    }
  }

  return {
    grants: transformedGrants,
    pagination: data.pagination
  };
};

export const useBackendFilteredGrants = ({
  filters,
  sorting,
  pagination,
  searchTerm = '',
  enabled = true
}: UseBackendFilteredGrantsOptions) => {
  const [currentPage, setCurrentPage] = useState(pagination.page);
  
  // Transform frontend filters to backend format
  const backendFilters = transformFiltersForBackend(filters);
  
  // Create query key for caching
  const queryKey = [
    'backend-filtered-grants',
    backendFilters,
    sorting,
    currentPage,
    pagination.limit,
    searchTerm
  ];

  const {
    data,
    isLoading,
    error,
    isError,
    refetch,
    isFetching
  } = useQuery({
    queryKey,
    queryFn: () => fetchBackendFilteredGrants(
      backendFilters,
      sorting,
      { ...pagination, page: currentPage },
      searchTerm
    ),
    enabled,
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading new data
  });

  // Update current page when pagination prop changes
  useEffect(() => {
    if (pagination.page !== currentPage) {
      setCurrentPage(pagination.page);
    }
  }, [pagination.page]);

  // Debug the data structure
  console.log('🔍 useBackendFilteredGrants data debug:', {
    data,
    dataType: typeof data,
    dataKeys: data ? Object.keys(data) : 'no data',
    dataPagination: data?.pagination,
    grantsLength: data?.grants?.length || 0,
    fullDataStructure: data ? JSON.stringify(data, null, 2) : 'no data'
  });

  const changePage = useCallback((newPage: number) => {
    console.log('📄 Changing page:', newPage);
    setCurrentPage(newPage);
  }, []);

  const refresh = useCallback(() => {
    console.log('🔄 Refreshing backend filtered grants');
    refetch();
  }, [refetch]);

  return {
    grants: data?.grants || [],
    pagination: data?.pagination || {
      page: currentPage,
      limit: pagination.limit,
      total: 0,
      totalPages: 0,
      hasMore: false
    },
    isLoading,
    isFetching,
    error,
    isError,
    currentPage,
    changePage,
    refresh,
  };
};

export default useBackendFilteredGrants; 