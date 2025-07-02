
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { useAIGrantSearch } from "@/hooks/useAIGrantSearch";
import { useFilterState } from "@/hooks/useFilterState";
import { useGrantSelection } from "@/hooks/useGrantSelection";
import { SortOption } from "@/components/SortingControls";
import { DiscoverGrantsStates } from "@/components/DiscoverGrantsStates";
import { DiscoverGrantsContent } from "@/components/DiscoverGrantsContent";
import { parseFundingAmount, isGrantWithinDeadline } from "@/utils/grantHelpers";
import { AISearchResult, AIGrantMatch } from "@/hooks/useAIGrantSearch";
import { useGrantsMatchingEngine } from "@/hooks/useGrantsMatchingEngine";

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
  const [aiMatches, setAiMatches] = useState<AIGrantMatch[] | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  console.log('🔥 DiscoverGrants render:', { 
    grantsCount: grants?.length || 0, 
    isLoading, 
    isError,
    locationState: location.state,
    initialSearchTerm,
    aiMatchesCount: aiMatches?.length || 0,
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

  // Set AI matches from location state when available
  useEffect(() => {
    if (matchingResult?.rankedGrants) {
      console.log('🎯 Setting AI matches from location state:', matchingResult.rankedGrants.length);
      setAiMatches(matchingResult.rankedGrants);
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

  // Use the same matching engine as the home page
  const { searchGrants: searchWithMatchingEngine, isSearching: isMatchingEngineSearching } = useGrantsMatchingEngine();

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

  // Use the matching engine search instead of the simple AI search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      console.log('⚠️ Empty search term, clearing AI matches');
      setAiMatches(undefined);
      setSortBy("default");
      return;
    }

    console.log('🤖 Using matching engine search for:', searchTerm);
    try {
      const result = await searchWithMatchingEngine(searchTerm);
      console.log('🎯 Matching engine result:', result);
      
      if (result?.rankedGrants && result.rankedGrants.length > 0) {
        console.log('✅ Setting AI matches from matching engine result:', result.rankedGrants.length);
        // Convert matching engine results to AI matches format
        const convertedMatches = result.rankedGrants.map(match => ({
          grantId: match.grantId,
          relevanceScore: match.relevanceScore,
          matchingReasons: match.matchingReasons || []
        }));
        setAiMatches(convertedMatches);
        setSortBy("default");
      } else {
        console.log('⚠️ No matches found, clearing existing matches');
        setAiMatches(undefined);
        setSortBy("default");
      }
    } catch (error) {
      console.error('❌ Matching engine search failed:', error);
      // On error, still clear existing matches to show all grants
      setAiMatches(undefined);
      setSortBy("default");
    }
  };

  // Use filtered grants as search results
  const searchResults = filteredGrants;

  // Clear AI matches when search term is cleared manually (not from navigation)
  useEffect(() => {
    if (!searchTerm.trim() && !location.state?.searchTerm) {
      setAiMatches(undefined);
      console.log('🧹 Cleared AI matches due to empty search term');
    }
  }, [searchTerm, location.state?.searchTerm]);

  // Apply AI-based sorting when we have AI matches and using default sorting
  const sortedSearchResults = useMemo(() => {
    console.log('🎯 Sorting results:', {
      hasAiMatches: !!aiMatches,
      aiMatchesCount: aiMatches?.length || 0,
      sortBy,
      searchResultsCount: searchResults.length
    });

    if (aiMatches && aiMatches.length > 0 && sortBy === "default") {
      console.log('🤖 Applying AI-based sorting for default sort');
      
      // Create a map of grant IDs to their AI scores
      const scoreMap = new Map<string, number>();
      aiMatches.forEach(match => {
        // Ensure we have a valid score
        const score = match.relevanceScore !== null && match.relevanceScore !== undefined 
          ? match.relevanceScore 
          : 0.25; // Fallback score
        scoreMap.set(match.grantId, score);
        
        console.log(`📊 Grant ${match.grantId} -> Score: ${score}`);
      });
      
      // Sort grants by AI relevance score (highest first)
      const sorted = [...searchResults].sort((a, b) => {
        const scoreA = scoreMap.get(a.id) ?? 0.1; // Fallback for missing scores
        const scoreB = scoreMap.get(b.id) ?? 0.1;
        return scoreB - scoreA;
      });
      
      console.log('🎯 AI-sorted results:', {
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
  }, [searchResults, aiMatches, sortBy]);

  // Grant selection logic - uses context directly for bookmark state
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
      // Find the grant in our current grants list
      const matchingGrant = grants.find(g => g.id === preSelectedGrant.id);
      if (matchingGrant) {
        console.log('🎯 Pre-selecting grant from navigation state:', matchingGrant.id);
        setSelectedGrant(matchingGrant);
      }
    }
  }, [location.state, grants, setSelectedGrant]);

  // Log structured matching results if available
  useEffect(() => {
    if (matchingResult) {
      console.log('🤖 Structured matching results available:', {
        explanation: matchingResult.explanation,
        totalMatches: matchingResult.rankedGrants.length,
        topMatches: matchingResult.rankedGrants.slice(0, 5).map(match => ({
          grantId: match.grantId,
          score: match.relevanceScore,
          reasons: match.matchingReasons
        }))
      });
    } else {
      console.log('❌ No structured matching results in location state');
    }
  }, [matchingResult]);

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
      isSearching={isMatchingEngineSearching}
      searchMetrics={{ totalResults: searchResults.length, searchTime: 0 }}
      aiMatches={aiMatches}
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
