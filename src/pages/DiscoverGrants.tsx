
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
    searchTerm,
    semanticMatchesCount: semanticMatches?.length || 0,
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

  // Handle semantic search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      console.log('⚠️ Empty search term, clearing semantic matches');
      setSemanticMatches(undefined);
      return;
    }

    console.log('🔍 Starting semantic search for:', searchTerm);
    try {
      const result = await searchGrants(searchTerm);
      console.log('🎯 Semantic search result:', result);
      
      if (result?.rankedGrants && result.rankedGrants.length > 0) {
        console.log('✅ Setting semantic matches:', result.rankedGrants.length);
        setSemanticMatches(result.rankedGrants);
      } else {
        console.log('⚠️ No semantic matches found');
        setSemanticMatches([]);
      }
    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      setSemanticMatches([]);
    }
  };

  // Trigger semantic search when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      console.log('🔍 Auto-triggering semantic search for:', searchTerm);
      handleSearch();
    } else {
      setSemanticMatches(undefined);
    }
  }, [searchTerm]);

  // Filter grants based on semantic matches first
  const baseFilteredGrants = useMemo(() => {
    console.log('🎯 Filtering grants based on semantic matches:', {
      totalGrants: grants.length,
      hasSemanticMatches: !!semanticMatches,
      semanticMatchesCount: semanticMatches?.length || 0,
      searchTerm: searchTerm.trim()
    });

    // If no search term, return all grants
    if (!searchTerm.trim()) {
      console.log('📋 No search term, returning all grants');
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

    // If semantic search is still loading or failed, return all grants
    console.log('📋 Semantic search not ready, returning all grants');
    return grants;
  }, [grants, semanticMatches, searchTerm]);

  // Apply additional filters to the semantically filtered grants
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

  // Apply semantic-based sorting when we have matches
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
      // Create a map of grant IDs to their semantic scores
      const scoreMap = new Map<string, number>();
      semanticMatches.forEach((match, index) => {
        const score = match.relevanceScore !== null && match.relevanceScore !== undefined 
          ? match.relevanceScore 
          : 0.9 - (index * 0.05); // Fallback scoring based on order
        scoreMap.set(match.grantId, score);
      });
      
      // Sort grants by semantic relevance score (highest first)
      const sorted = [...filteredGrants].sort((a, b) => {
        const scoreA = scoreMap.get(a.id) ?? 0;
        const scoreB = scoreMap.get(b.id) ?? 0;
        return scoreB - scoreA;
      });
      
      console.log('🎯 Semantic-sorted results:', {
        totalResults: sorted.length,
        topScores: sorted.slice(0, 3).map(g => ({
          id: g.id,
          title: g.title.substring(0, 30) + '...',
          score: scoreMap.get(g.id)
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
