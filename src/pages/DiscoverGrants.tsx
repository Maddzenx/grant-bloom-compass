
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

  // Apply filters to grants - only filter if there are active filters
  const filteredGrants = useMemo(() => {
    // If no active filters, return all grants
    if (!hasActiveFilters) {
      return grants;
    }

    return grants.filter(grant => {
      // Organization filter
      if (filters.organizations.length > 0) {
        if (!filters.organizations.includes(grant.organization)) {
          return false;
        }
      }

      // Funding range filter
      if (filters.fundingRange.min !== null || filters.fundingRange.max !== null) {
        const amount = parseFundingAmount(grant.fundingAmount);
        if (filters.fundingRange.min && amount < filters.fundingRange.min) return false;
        if (filters.fundingRange.max && amount > filters.fundingRange.max) return false;
      }

      // Deadline filter
      if (filters.deadline.preset || filters.deadline.customRange?.start) {
        if (!isGrantWithinDeadline(grant, filters.deadline)) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag =>
          grant.tags.some(grantTag => grantTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
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
