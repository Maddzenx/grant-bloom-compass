import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GrantListItem } from '@/types/grant';
import { EnhancedFilterOptions } from '@/hooks/useFilterState';
import { SortOption } from '@/components/SortingControls';
import { formatFundingAmount } from '@/utils/grantHelpers';

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
  return {
    organizations: filters.organizations.length > 0 ? filters.organizations : undefined,
    fundingRange: (filters.fundingRange.min !== null || filters.fundingRange.max !== null) ? {
      min: filters.fundingRange.min || undefined,
      max: filters.fundingRange.max || undefined,
    } : undefined,
    deadline: filters.deadline.preset || filters.deadline.customRange?.start ? {
      type: filters.deadline.type,
      preset: filters.deadline.preset || undefined,
      customRange: filters.deadline.customRange ? {
        start: filters.deadline.customRange.start?.toISOString().split('T')[0],
        end: filters.deadline.customRange.end?.toISOString().split('T')[0],
      } : undefined,
    } : undefined,
    tags: filters.tags.length > 0 ? filters.tags : undefined,
    industrySectors: filters.industrySectors.length > 0 ? filters.industrySectors : undefined,
    eligibleApplicants: filters.eligibleApplicants.length > 0 ? filters.eligibleApplicants : undefined,
    consortiumRequired: filters.consortiumRequired,
    geographicScope: filters.geographicScope.length > 0 ? filters.geographicScope : undefined,
    cofinancingRequired: filters.cofinancingRequired,
  };
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

const transformSupabaseGrantToListItem = (grant: any): GrantListItem => {
  return {
    id: grant.id,
    title: grant.title || 'Untitled Grant',
    organization: grant.organisation || 'Unknown Organization',
    aboutGrant: grant.subtitle || grant.description || 'No information available',
    fundingAmount: formatFundingAmount(grant),
    opens_at: grant.application_opening_date || '2024-01-01',
    deadline: grant.application_closing_date || 'Not specified',
    tags: parseJsonArray(grant.keywords) || [],
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
    templates: parseJsonArray(grant.application_templates_names) || [],
    generalInfo: parseJsonArray(grant.other_templates_names) || [],
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
    fundingRules: parseJsonArray(grant.eligible_cost_categories) || [],
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
    filters,
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