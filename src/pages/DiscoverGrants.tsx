
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { useFilterState } from "@/hooks/useFilterState";
import { useGrantSelection } from "@/hooks/useGrantSelection";
import { SortOption } from "@/components/SortingControls";
import { DiscoverGrantsStates } from "@/components/DiscoverGrantsStates";
import { DiscoverGrantsContent } from "@/components/DiscoverGrantsContent";
import { parseFundingAmount, isGrantWithinDeadline } from "@/utils/grantHelpers";

const DiscoverGrants = () => {
  const location = useLocation();
  const {
    data: grants = [],
    isLoading,
    error,
    isError,
    refetch,
  } = useGrants();
  
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [initialSearchTerm] = useState(() => location.state?.searchTerm || '');
  const [semanticMatches, setSemanticMatches] = useState<any[] | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  console.log('🔥 DiscoverGrants render:', { 
    grantsCount: grants?.length || 0, 
    isLoading, 
    isError,
    locationState: location.state,
    initialSearchTerm,
    semanticMatchesCount: semanticMatches?.length || 0,
    searchTerm
  });

  // Check if we have structured matching results from navigation state
  const matchingResult = location.state?.aiSearchResult;
  const matchedGrants = location.state?.matchedGrants as Grant[] | undefined;

  console.log('🤖 Structured matching data from location state:', {
    hasMatchingResult: !!matchingResult,
    hasMatchedGrants: !!matchedGrants,
    rankedGrantsCount: matchingResult?.rankedGrants?.length || 0,
    matchedGrantsCount: matchedGrants?.length || 0
  });

  // Set semantic matches from location state when available
  useEffect(() => {
    if (matchingResult?.rankedGrants) {
      console.log('🎯 Setting semantic matches from location state:', matchingResult.rankedGrants.length);
      setSemanticMatches(matchingResult.rankedGrants);
      setSortBy("default");
    }
  }, [matchingResult]);

  // Enhanced filter state
  const {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useFilterState();

  // Use the new semantic search
  const { searchGrants, isSearching } = useSemanticSearch();

  // Use matched grants if available, otherwise use all grants
  const baseGrants = matchedGrants || grants;

  // Apply filters to grants
  const filteredGrants = useMemo(() => {
    console.log('🔍 Filtering grants:', { totalGrants: baseGrants?.length || 0 });
    
    if (!baseGrants || baseGrants.length === 0) {
      console.log('⚠️ No grants to filter');
      return [];
    }

    // Check if we actually have active filters
    const hasOrganizationFilter = filters.organizations && filters.organizations.length > 0;
    const hasFundingFilter = filters.fundingRange && (filters.fundingRange.min !== null || filters.fundingRange.max !== null);
    const hasDeadlineFilter = filters.deadline && filters.deadline.preset && filters.deadline.preset !== '';
    const hasTagsFilter = filters.tags && filters.tags.length > 0;
    
    const actuallyHasActiveFilters = hasOrganizationFilter || hasFundingFilter || hasDeadlineFilter || hasTagsFilter;

    // If no active filters, return all grants
    if (!actuallyHasActiveFilters) {
      console.log('✅ No active filters, returning all grants:', baseGrants.length);
      return baseGrants;
    }

    // Apply filtering
    const filtered = baseGrants.filter(grant => {
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

    console.log('✅ Filtered grants:', filtered.length);
    return filtered;
  }, [baseGrants, filters]);

  // Handle semantic search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      console.log('⚠️ Empty search term, clearing semantic matches');
      setSemanticMatches(undefined);
      setSortBy("default");
      return;
    }

    console.log('🔍 Using semantic search for:', searchTerm);
    try {
      const result = await searchGrants(searchTerm);
      console.log('🎯 Semantic search result:', result);
      
      if (result?.rankedGrants && result.rankedGrants.length > 0) {
        console.log('✅ Setting semantic matches from search result:', result.rankedGrants.length);
        setSemanticMatches(result.rankedGrants);
        setSortBy("default");
      } else {
        console.log('⚠️ No matches found, clearing existing matches');
        setSemanticMatches(undefined);
        setSortBy("default");
      }
    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      setSemanticMatches(undefined);
      setSortBy("default");
    }
  };

  // Use filtered grants as search results
  const searchResults = filteredGrants;

  // Clear semantic matches when search term is cleared manually
  useEffect(() => {
    if (!searchTerm.trim() && !location.state?.searchTerm) {
      setSemanticMatches(undefined);
      console.log('🧹 Cleared semantic matches due to empty search term');
    }
  }, [searchTerm, location.state?.searchTerm]);

  // Apply semantic-based sorting when we have matches and using default sorting
  const sortedSearchResults = useMemo(() => {
    console.log('🎯 Sorting results:', {
      hasSemanticMatches: !!semanticMatches,
      semanticMatchesCount: semanticMatches?.length || 0,
      sortBy,
      searchResultsCount: searchResults.length
    });

    if (semanticMatches && semanticMatches.length > 0 && sortBy === "default") {
      console.log('🔍 Applying semantic-based sorting for default sort');
      
      // Create a map of grant IDs to their semantic scores
      const scoreMap = new Map<string, number>();
      semanticMatches.forEach(match => {
        const score = match.relevanceScore !== null && match.relevanceScore !== undefined 
          ? match.relevanceScore 
          : 0.25;
        scoreMap.set(match.grantId, score);
        
        console.log(`📊 Grant ${match.grantId} -> Score: ${score}`);
      });
      
      // Sort grants by semantic relevance score (highest first)
      const sorted = [...searchResults].sort((a, b) => {
        const scoreA = scoreMap.get(a.id) ?? 0.1;
        const scoreB = scoreMap.get(b.id) ?? 0.1;
        return scoreB - scoreA;
      });
      
      console.log('🎯 Semantic-sorted results:', {
        totalResults: sorted.length,
        topScores: sorted.slice(0, 5).map(g => ({
          id: g.id,
          title: g.title.substring(0, 30) + '...',
          score: scoreMap.get(g.id)
        }))
      });
      
      return sorted;
    }
    
    return searchResults;
  }, [searchResults, semanticMatches, sortBy]);

  // Grant selection logic
  const {
    selectedGrant,
    showDetails,
    handleGrantSelect,
    toggleBookmark,
    handleBackToList,
    setSelectedGrant,
  } = useGrantSelection({ searchResults: sortedSearchResults });

  // Handle pre-selected grant from navigation state
  useEffect(() => {
    if (location.state?.selectedGrant && grants.length > 0) {
      const preSelectedGrant = location.state.selectedGrant as Grant;
      const matchingGrant = grants.find(g => g.id === preSelectedGrant.id);
      if (matchingGrant) {
        console.log('🎯 Pre-selecting grant from navigation state:', matchingGrant.id);
        setSelectedGrant(matchingGrant);
      }
    }
  }, [location.state, grants, setSelectedGrant]);

  const handleToggleBookmark = useCallback((grantId: string) => {
    toggleBookmark(grantId);
  }, [toggleBookmark]);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
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
      grants={baseGrants}
      searchResults={sortedSearchResults}
      selectedGrant={selectedGrant}
      showDetails={showDetails}
      searchTerm={searchTerm}
      sortBy={sortBy}
      filters={filters}
      hasActiveFilters={hasActiveFilters}
      suggestions={[]}
      isSearching={isSearching}
      searchMetrics={{ totalResults: searchResults.length, searchTime: 0 }}
      aiMatches={semanticMatches}
      onSearchChange={setSearchTerm}
      onSearch={handleSearch}
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
