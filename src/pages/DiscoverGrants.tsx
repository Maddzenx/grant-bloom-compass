
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { useFilterState } from "@/hooks/useFilterState";
import { useGrantSelection } from "@/hooks/useGrantSelection";
import { SortOption } from "@/components/SortingControls";
import { DiscoverGrantsStates } from "@/components/DiscoverGrantsStates";
import { DiscoverGrantsContent } from "@/components/DiscoverGrantsContent";
import { parseFundingAmount, isGrantWithinDeadline } from "@/utils/grantHelpers";

const DiscoverGrants = () => {
  console.log('🔥 DiscoverGrants component mounting...');
  
  useEffect(() => {
    console.log('🔥 DiscoverGrants component mounted and useEffect triggered');
  }, []);

  const queryResult = useGrants();
  console.log('🔥 Raw query result from useGrants:', queryResult);
  
  const {
    data: grants = [],
    isLoading,
    error,
    isError,
    refetch,
    isFetching,
    isSuccess,
    dataUpdatedAt,
    status,
    fetchStatus
  } = queryResult;
  
  console.log('🔥 DiscoverGrants render state:', { 
    grantsCount: grants?.length || 0, 
    isLoading, 
    isFetching,
    isSuccess,
    error: error?.message, 
    isError,
    status,
    fetchStatus,
    dataUpdatedAt: new Date(dataUpdatedAt).toISOString(),
    grantsType: typeof grants,
    grantsIsArray: Array.isArray(grants)
  });

  // Force refetch on mount if we have no data
  useEffect(() => {
    if (!isLoading && !isFetching && grants.length === 0 && !error) {
      console.log('🔥 No grants and not loading - forcing refetch');
      refetch();
    }
  }, [isLoading, isFetching, grants.length, error, refetch]);
  
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Enhanced filter state
  const {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useFilterState();

  console.log('🔥 Filter state:', { filters, hasActiveFilters });

  // Apply filters to grants - Simplified and fixed logic
  const filteredGrants = useMemo(() => {
    console.log('🔥 Starting filteredGrants calculation:', { 
      totalGrants: grants.length, 
      hasActiveFilters,
      filters 
    });

    // If no grants available, return empty array
    if (!grants || grants.length === 0) {
      console.log('🔥 No grants available, returning empty array');
      return [];
    }

    // Check if we actually have active filters by looking at the values
    const hasOrganizationFilter = filters.organizations && filters.organizations.length > 0;
    const hasFundingFilter = filters.fundingRange && (filters.fundingRange.min !== null || filters.fundingRange.max !== null);
    const hasDeadlineFilter = filters.deadline && filters.deadline.preset && filters.deadline.preset !== '';
    const hasTagsFilter = filters.tags && filters.tags.length > 0;
    
    const actuallyHasActiveFilters = hasOrganizationFilter || hasFundingFilter || hasDeadlineFilter || hasTagsFilter;
    
    console.log('🔥 Filter analysis:', {
      hasOrganizationFilter,
      hasFundingFilter,
      hasDeadlineFilter,
      hasTagsFilter,
      actuallyHasActiveFilters
    });

    // If no active filters, return all grants
    if (!actuallyHasActiveFilters) {
      console.log('🔥 No active filters detected, returning all grants:', grants.length);
      return grants;
    }

    // Apply filtering only when we have active filters
    console.log('🔥 Applying filters to grants...');
    const filtered = grants.filter(grant => {
      // Organization filter
      if (hasOrganizationFilter && !filters.organizations.includes(grant.organization)) {
        return false;
      }

      // Funding range filter
      if (hasFundingFilter) {
        const amount = parseFundingAmount(grant.fundingAmount);
        if (filters.fundingRange.min && amount < filters.fundingRange.min) return false;
        if (filters.fundingRange.max && amount > filters.fundingRange.max) return false;
      }

      // Deadline filter
      if (hasDeadlineFilter && !isGrantWithinDeadline(grant, filters.deadline)) {
        return false;
      }

      // Tags filter
      if (hasTagsFilter) {
        const hasMatchingTag = filters.tags.some(tag =>
          grant.tags.some(grantTag => grantTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });

    console.log('🔥 Filtered grants result:', filtered.length);
    return filtered;
  }, [grants, filters]);

  // Enhanced search hook
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    searchMetrics,
    isSearching,
  } = useEnhancedSearch({
    grants: filteredGrants,
    filters: { organization: '', minFunding: '', maxFunding: '', deadline: '' }, // Legacy format for compatibility
    sortBy,
  });

  console.log('🔥 Search results:', { 
    searchResultsCount: searchResults.length, 
    filteredGrantsCount: filteredGrants.length 
  });

  // Grant selection logic
  const {
    selectedGrant,
    showDetails,
    bookmarkedGrants,
    handleGrantSelect,
    toggleBookmark,
    handleBackToList,
  } = useGrantSelection({ searchResults });

  const handleToggleBookmark = useCallback((grantId: string) => {
    toggleBookmark(grantId);
  }, [toggleBookmark]);

  const handleRefresh = useCallback(() => {
    console.log('🔥 Refreshing grants data...');
    refetch();
  }, [refetch]);

  // Show loading/error/empty states
  const stateComponent = DiscoverGrantsStates({
    isLoading,
    isError,
    error,
    grants,
    onRefresh: handleRefresh,
  });

  if (stateComponent) {
    return stateComponent;
  }

  return (
    <DiscoverGrantsContent
      grants={grants}
      searchResults={searchResults}
      selectedGrant={selectedGrant}
      bookmarkedGrants={bookmarkedGrants}
      showDetails={showDetails}
      searchTerm={searchTerm}
      sortBy={sortBy}
      filters={filters}
      hasActiveFilters={hasActiveFilters}
      suggestions={suggestions}
      isSearching={isSearching}
      searchMetrics={searchMetrics}
      onSearchChange={setSearchTerm}
      onSortChange={setSortBy}
      onFiltersChange={updateFilters}
      onClearFilters={clearFilters}
      onGrantSelect={handleGrantSelect}
      onToggleBookmark={handleToggleBookmark}
      onBackToList={handleBackToList}
    />
  );
};

export default DiscoverGrants;
