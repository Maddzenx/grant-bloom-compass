import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGrants } from "@/hooks/useGrantsQuery";
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
  const [initialSearchResults] = useState(() => location.state?.searchResults || undefined);
  const [semanticMatches, setSemanticMatches] = useState<any[] | undefined>(initialSearchResults?.rankedGrants || undefined);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [hasSearched, setHasSearched] = useState(!!initialSearchTerm);

  console.log('🔥 DiscoverGrants render:', { 
    grantsCount: grants?.length || 0, 
    isLoading, 
    isError,
    searchTerm,
    semanticMatchesCount: semanticMatches?.length || 0,
    hasSearched
  });

  // Enhanced filter state
  const {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useFilterState();

  // Use the semantic search hook
  const { searchGrants, isSearching } = useSemanticSearch();

  // Handle semantic search - only when explicitly called
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      console.log('⚠️ Empty search term, clearing semantic matches');
      setSemanticMatches(undefined);
      setHasSearched(false);
      return;
    }

    console.log('🔍 Starting semantic search for:', searchTerm);
    setHasSearched(true);
    
    try {
      const result = await searchGrants(searchTerm);
      console.log('🎯 Semantic search result:', result);
      
      if (result?.rankedGrants && result.rankedGrants.length > 0) {
        console.log('✅ Setting semantic matches with actual scores:', 
          result.rankedGrants.map(g => ({ id: g.grantId, score: g.relevanceScore }))
        );
        setSemanticMatches(result.rankedGrants);
      } else {
        console.log('⚠️ No semantic matches found');
        setSemanticMatches([]);
      }
      
      // Close details panel after successful search completion
      handleBackToList();
    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      setSemanticMatches([]);
      
      // Close details panel even on error to show the (empty) results
      handleBackToList();
    }
  };

  // Auto-trigger search only if coming from home page with search term but no pre-fetched results
  useEffect(() => {
    if (initialSearchTerm && !hasSearched && !initialSearchResults) {
      console.log('🔍 Auto-triggering search from home page for:', initialSearchTerm);
      handleSearch();
    } else if (initialSearchResults) {
      console.log('✅ Using pre-fetched search results from home page');
    }
  }, [initialSearchTerm, hasSearched, initialSearchResults]);

  // Filter grants based on search state
  const baseFilteredGrants = useMemo(() => {
    console.log('🎯 Filtering grants based on search state:', {
      totalGrants: grants.length,
      hasSemanticMatches: !!semanticMatches,
      semanticMatchesCount: semanticMatches?.length || 0,
      searchTerm: searchTerm.trim(),
      hasSearched
    });

    // If no search has been performed or no search term, return all grants
    if (!hasSearched || !searchTerm.trim()) {
      console.log('📋 No search performed, returning all grants');
      return grants;
    }

    // If we have semantic matches (even if empty array), use those
    if (semanticMatches !== undefined) {
      if (semanticMatches.length === 0) {
        console.log('📋 No semantic matches found, returning empty array');
        return [];
      }

      // Filter grants to only include those that were semantically matched
      const matchedGrantIds = semanticMatches.map(match => match.grantId);
      const filteredGrants = grants.filter(grant => matchedGrantIds.includes(grant.id));
      
      console.log('✅ Filtered to semantic matches:', {
        matchedIds: matchedGrantIds.length,
        filteredGrants: filteredGrants.length
      });

      return filteredGrants;
    }

    // If semantic search failed but we searched, return all grants as fallback
    console.log('📋 Search performed but no semantic results, returning all grants as fallback');
    return grants;
  }, [grants, semanticMatches, searchTerm, hasSearched]);

  // Apply additional filters to the search results
  const filteredGrants = useMemo(() => {
    console.log('🔍 Applying additional filters:', { 
      baseCount: baseFilteredGrants?.length || 0,
      hasActiveFilters
    });
    
    if (!baseFilteredGrants || baseFilteredGrants.length === 0) {
      return [];
    }

    // If no additional filters are active, return the base filtered grants
    if (!hasActiveFilters) {
      return baseFilteredGrants;
    }

    // Apply additional filtering
    const filtered = baseFilteredGrants.filter(grant => {
      // Organization filter
      if (filters.organizations.length > 0 && !filters.organizations.includes(grant.organization)) {
        return false;
      }

      // Funding range filter
      if (filters.fundingRange.min !== null || filters.fundingRange.max !== null) {
        const amount = parseFundingAmount(grant.fundingAmount);
        if (filters.fundingRange.min && amount < filters.fundingRange.min) return false;
        if (filters.fundingRange.max && amount > filters.fundingRange.max) return false;
      }

      // Deadline filter
      if (filters.deadline.preset && !isGrantWithinDeadline(grant, filters.deadline)) {
        return false;
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

    console.log('✅ Final filtered count:', filtered.length);
    return filtered;
  }, [baseFilteredGrants, filters, hasActiveFilters]);

  // Apply sorting based on actual semantic scores
  const sortedSearchResults = useMemo(() => {
    if (!filteredGrants || filteredGrants.length === 0) {
      return [];
    }

    console.log('🎯 Sorting results:', {
      hasSemanticMatches: !!semanticMatches,
      semanticMatchesCount: semanticMatches?.length || 0,
      sortBy,
      filteredCount: filteredGrants.length
    });

    if (semanticMatches && semanticMatches.length > 0 && sortBy === "default") {
      // Create a map of grant IDs to their actual semantic scores
      const scoreMap = new Map<string, number>();
      semanticMatches.forEach((match) => {
        // Use the actual relevance score from the semantic search
        scoreMap.set(match.grantId, match.relevanceScore || 0);
      });
      
      // Sort grants by actual semantic relevance score (highest first)
      const sorted = [...filteredGrants].sort((a, b) => {
        const scoreA = scoreMap.get(a.id) ?? 0;
        const scoreB = scoreMap.get(b.id) ?? 0;
        return scoreB - scoreA;
      });
      
      console.log('🎯 Semantic-sorted results with actual scores:', {
        totalResults: sorted.length,
        topScores: sorted.slice(0, 3).map(g => ({
          id: g.id,
          title: g.title.substring(0, 30) + '...',
          actualScore: scoreMap.get(g.id),
          percentage: Math.round((scoreMap.get(g.id) || 0) * 100) + '%'
        }))
      });
      
      return sorted;
    }
    
    return filteredGrants;
  }, [filteredGrants, semanticMatches, sortBy]);

  // Grant selection logic
  const {
    selectedGrant,
    showDetails,
    handleGrantSelect,
    toggleBookmark,
    handleBackToList,
    setSelectedGrant,
  } = useGrantSelection({ searchResults: sortedSearchResults });

  // Auto-select first grant when results change
  useEffect(() => {
    if (sortedSearchResults.length > 0) {
      if (!selectedGrant || !sortedSearchResults.find(g => g.id === selectedGrant.id)) {
        setSelectedGrant(sortedSearchResults[0]);
      }
    } else {
      setSelectedGrant(null);
    }
  }, [sortedSearchResults, selectedGrant, setSelectedGrant]);

  const handleToggleBookmark = useCallback((grantId: string) => {
    toggleBookmark(grantId);
  }, [toggleBookmark]);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    refetch();
  }, [refetch]);

  // Clear search results when search term is cleared
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSemanticMatches(undefined);
      setHasSearched(false);
    }
  }, []);

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
      searchResults={sortedSearchResults}
      selectedGrant={selectedGrant}
      showDetails={showDetails}
      searchTerm={searchTerm}
      sortBy={sortBy}
      filters={filters}
      hasActiveFilters={hasActiveFilters}
      suggestions={[]}
      isSearching={isSearching}
      searchMetrics={{ totalResults: sortedSearchResults.length, searchTime: 0 }}
      aiMatches={semanticMatches}
      onSearchChange={handleSearchChange}
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
