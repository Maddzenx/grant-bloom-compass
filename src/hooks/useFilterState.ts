
import { useState, useEffect, useCallback } from 'react';
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
}

const defaultFilters: EnhancedFilterOptions = {
  organizations: [],
  fundingRange: { min: null, max: null },
  deadline: { type: 'preset', preset: '' },
  tags: [],
};

export const useFilterState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<EnhancedFilterOptions>(defaultFilters);

  // Load filters from URL on mount
  useEffect(() => {
    const urlFilters = parseFiltersFromURL(searchParams);
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

  const hasActiveFilters = useCallback(() => {
    return (
      filters.organizations.length > 0 ||
      filters.fundingRange.min !== null ||
      filters.fundingRange.max !== null ||
      filters.deadline.preset !== '' ||
      filters.deadline.customRange?.start !== null ||
      filters.tags.length > 0
    );
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters: hasActiveFilters(),
  };
};

// Helper functions
const parseFiltersFromURL = (searchParams: URLSearchParams): EnhancedFilterOptions => {
  const savedFilters = localStorage.getItem('grantFilters');
  let baseFilters = defaultFilters;
  
  if (savedFilters) {
    try {
      baseFilters = JSON.parse(savedFilters);
    } catch (e) {
      console.warn('Failed to parse saved filters');
    }
  }

  return {
    organizations: searchParams.get('orgs')?.split(',').filter(Boolean) || baseFilters.organizations,
    fundingRange: {
      min: searchParams.get('minFunding') ? Number(searchParams.get('minFunding')) : baseFilters.fundingRange.min,
      max: searchParams.get('maxFunding') ? Number(searchParams.get('maxFunding')) : baseFilters.fundingRange.max,
    },
    deadline: {
      type: (searchParams.get('deadlineType') as 'preset' | 'custom') || baseFilters.deadline.type,
      preset: searchParams.get('deadlinePreset') || baseFilters.deadline.preset,
      customRange: baseFilters.deadline.customRange,
    },
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || baseFilters.tags,
  };
};

const updateURLParams = (params: URLSearchParams, filters: EnhancedFilterOptions) => {
  // Clear existing filter params
  ['orgs', 'minFunding', 'maxFunding', 'deadlineType', 'deadlinePreset', 'tags'].forEach(key => {
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
};
