
import React, { useState, useMemo, useCallback } from "react";
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
  const {
    data: grants = [],
    isLoading,
    error,
    isError,
    refetch
  } = useGrants();
  
  console.log('DiscoverGrants render state:', { 
    grantsCount: grants?.length || 0, 
    isLoading, 
    error: error?.message, 
    isError 
  });
  
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Enhanced filter state
  const {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useFilterState();

  console.log('Filter state:', { filters, hasActiveFilters });

  // Apply filters to grants - Fix the filtering logic
  const filteredGrants = useMemo(() => {
    console.log('Filtering grants:', { 
      totalGrants: grants.length, 
      hasActiveFilters,
      filters 
    });

    // If no grants available, return empty array
    if (!grants || grants.length === 0) {
      console.log('No grants available');
      return [];
    }

    // Check if any filters are actually active by examining their values
    const hasOrganizationFilter = filters.organizations && filters.organizations.length > 0;
    const hasFundingFilter = filters.fundingRange && (filters.fundingRange.min !== null || filters.fundingRange.max !== null);
    const hasDeadlineFilter = filters.deadline && (filters.deadline.preset || filters.deadline.customRange?.start || filters.deadline.customRange?.end);
    const hasTagsFilter = filters.tags && filters.tags.length > 0;
    
    const actuallyHasActiveFilters = hasOrganizationFilter || hasFundingFilter || hasDeadlineFilter || hasTagsFilter;
    
    console.log('Actual filter analysis:', {
      hasOrganizationFilter,
      hasFundingFilter,
      hasDeadlineFilter,
      hasTagsFilter,
      actuallyHasActiveFilters,
      hasActiveFiltersFromHook: hasActiveFilters
    });

    // If no active filters, return all grants immediately
    if (!actuallyHasActiveFilters) {
      console.log('No active filters, returning all grants:', grants.length);
      return grants;
    }

    // Only apply filtering logic when filters are actually active
    const filtered = grants.filter(grant => {
      // Organization filter
      if (hasOrganizationFilter) {
        if (!filters.organizations.includes(grant.organization)) {
          return false;
        }
      }

      // Funding range filter
      if (hasFundingFilter) {
        const amount = parseFundingAmount(grant.fundingAmount);
        if (filters.fundingRange.min && amount < filters.fundingRange.min) return false;
        if (filters.fundingRange.max && amount > filters.fundingRange.max) return false;
      }

      // Deadline filter
      if (hasDeadlineFilter) {
        if (!isGrantWithinDeadline(grant, filters.deadline)) {
          return false;
        }
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

    console.log('Filtered grants count:', filtered.length);
    return filtered;
  }, [grants, filters, hasActiveFilters]);

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

  console.log('Search results:', { 
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
    console.log('Refreshing grants data...');
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
