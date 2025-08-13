import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface EnhancedFilterOptions {
  organizations: string[];
  fundingRange: {
    min: number | null;
    max: number | null;
  };
  deadline: {
    type: 'preset' | 'custom';
    preset?: string;
    customRange?: {
      start: Date | null;
      end: Date | null;
    };
  };
  tags: string[];
  industrySectors: string[];
  eligibleApplicants: string[];
  consortiumRequired: boolean | null;
  geographicScope: string[];
  region: string[]; // New region filter for EU, Sverige, Regionalt
  cofinancingRequired: boolean | null;
  statusFilter: string;
}

const defaultFilters: EnhancedFilterOptions = {
  organizations: [],
  fundingRange: { min: null, max: null },
  deadline: { type: 'preset', preset: '' },
  tags: [],
  industrySectors: [],
  eligibleApplicants: [],
  consortiumRequired: null,
  geographicScope: [],
  region: [], // Initialize empty region filter
  cofinancingRequired: null,
  statusFilter: '',
};

export const useFilterState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<EnhancedFilterOptions>(defaultFilters);

  // Load filters from URL or localStorage on mount
  useEffect(() => {
    const urlFilters = parseFiltersFromURL(searchParams);
    const hasURLFilters = urlHasAnyFilter(searchParams);

    if (hasURLFilters) {
      setFilters(urlFilters);
      return;
    }

    try {
      const persisted = localStorage.getItem('grantFilters');
      if (persisted) {
        const parsed = JSON.parse(persisted) as EnhancedFilterOptions;
        setFilters({ ...defaultFilters, ...parsed });
        // Sync URL too for shareability
        const newParams = new URLSearchParams(searchParams);
        updateURLParams(newParams, { ...defaultFilters, ...parsed });
        setSearchParams(newParams);
        return;
      }
    } catch {}

    setFilters(urlFilters);
  }, []);

  // Update URL when filters change
  const updateFilters = useCallback((newFilters: Partial<EnhancedFilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    updateURLParams(newParams, updatedFilters);
    setSearchParams(newParams);
    
    // Save to localStorage for session persistence
    localStorage.setItem('grantFilters', JSON.stringify(updatedFilters));
  }, [filters, searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
    localStorage.removeItem('grantFilters');
  }, [setSearchParams]);

  // Check if any filters are active - simplified and more reliable
  const hasActiveFilters = useMemo(() => {
    const isActive = (
      filters.organizations.length > 0 ||
      filters.statusFilter !== '' ||
      filters.eligibleApplicants.length > 0 ||
      filters.fundingRange.min !== null ||
      filters.fundingRange.max !== null ||
      (filters.deadline.preset && filters.deadline.preset !== '') ||
      (filters.deadline.customRange?.start !== null) ||
      (filters.deadline.customRange?.end !== null) ||
      filters.tags.length > 0 ||
      filters.region.length > 0 ||
      filters.consortiumRequired !== null ||
      filters.cofinancingRequired !== null
    );
    return isActive;
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
};

// Helper functions
const parseFiltersFromURL = (searchParams: URLSearchParams): EnhancedFilterOptions => {
  // Always start with default clean state
  return {
    organizations: searchParams.get('orgs')?.split(',').filter(Boolean) || [],
    fundingRange: {
      min: searchParams.get('minFunding') ? Number(searchParams.get('minFunding')) : null,
      max: searchParams.get('maxFunding') ? Number(searchParams.get('maxFunding')) : null,
    },
    deadline: {
      type: (searchParams.get('deadlineType') as 'preset' | 'custom') || 'preset',
      preset: searchParams.get('deadlinePreset') || '',
      customRange: { start: null, end: null },
    },
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    industrySectors: searchParams.get('industrySectors')?.split(',').filter(Boolean) || [],
    eligibleApplicants: searchParams.get('eligibleApplicants')?.split(',').filter(Boolean) || [],
    consortiumRequired: searchParams.get('consortiumRequired') === 'true' ? true : searchParams.get('consortiumRequired') === 'false' ? false : null,
    geographicScope: searchParams.get('geographicScope')?.split(',').filter(Boolean) || [],
    region: searchParams.get('region')?.split(',').filter(Boolean) || [],
    cofinancingRequired: searchParams.get('cofinancingRequired') === 'true' ? true : searchParams.get('cofinancingRequired') === 'false' ? false : null,
    statusFilter: searchParams.get('statusFilter') || '',
  };
};

const urlHasAnyFilter = (params: URLSearchParams): boolean => {
  const keys = ['orgs','minFunding','maxFunding','deadlineType','deadlinePreset','tags','industrySectors','eligibleApplicants','consortiumRequired','geographicScope','region','cofinancingRequired','statusFilter'];
  return keys.some(k => params.get(k));
};

const updateURLParams = (params: URLSearchParams, filters: EnhancedFilterOptions) => {
  // Clear existing filter params
  ['orgs', 'minFunding', 'maxFunding', 'deadlineType', 'deadlinePreset', 'tags', 'industrySectors', 'eligibleApplicants', 'consortiumRequired', 'geographicScope', 'region', 'cofinancingRequired','statusFilter'].forEach(key => {
    params.delete(key);
  });

  // Set new params
  if (filters.organizations.length > 0) {
    params.set('orgs', filters.organizations.join(','));
  }
  if (filters.fundingRange.min !== null) {
    params.set('minFunding', filters.fundingRange.min.toString());
  }
  if (filters.fundingRange.max !== null) {
    params.set('maxFunding', filters.fundingRange.max.toString());
  }
  if (filters.deadline.preset) {
    params.set('deadlineType', filters.deadline.type);
    params.set('deadlinePreset', filters.deadline.preset);
  }
  if (filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','));
  }
  if (filters.industrySectors.length > 0) {
    params.set('industrySectors', filters.industrySectors.join(','));
  }
  if (filters.eligibleApplicants.length > 0) {
    params.set('eligibleApplicants', filters.eligibleApplicants.join(','));
  }
  if (filters.consortiumRequired !== null) {
    params.set('consortiumRequired', filters.consortiumRequired.toString());
  }
  if (filters.geographicScope.length > 0) {
    params.set('geographicScope', filters.geographicScope.join(','));
  }
  if (filters.region.length > 0) {
    params.set('region', filters.region.join(','));
  }
  if (filters.cofinancingRequired !== null) {
    params.set('cofinancingRequired', filters.cofinancingRequired.toString());
  }
  if (filters.statusFilter) {
    params.set('statusFilter', filters.statusFilter);
  }
};

// --- Inference helpers for boolean and scope fields ---
export const inferConsortiumRequired = (grant: any): boolean => {
  // Look for phrases like "Minst 2 aktörer" or "konsortium" in requirements or description
  const text = [
    ...(grant.requirements || []),
    grant.description || '',
    grant.aboutGrant || '',
    grant.qualifications || ''
  ].join(' ').toLowerCase();
  return text.includes('minst 2 aktörer') || text.includes('konsortium');
};

export const inferCofinancingRequired = (grant: any): boolean => {
  // Look for "medfinansiering" or similar in fundingRules or requirements
  const text = [
    ...(grant.fundingRules || []),
    ...(grant.requirements || []),
    grant.description || '',
    grant.aboutGrant || ''
  ].join(' ').toLowerCase();
  return text.includes('medfinansiering');
};

export const inferGeographicScope = (grant: any): string[] => {
  // Look for "Sverige", "EU", "Europa", "internationell", "global" in eligibility or description
  const text = [
    grant.eligibility || '',
    grant.description || '',
    grant.aboutGrant || '',
    grant.qualifications || ''
  ].join(' ').toLowerCase();
  const scopes: string[] = [];
  if (text.includes('sverige') || text.includes('svensk')) scopes.push('Sverige');
  if (text.includes('eu') || text.includes('europa')) scopes.push('EU');
  if (text.includes('internationell') || text.includes('global')) scopes.push('Global');
  return scopes;
};
