import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
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

  console.log('🔥 DiscoverGrants render:', { 
    grantsCount: grants?.length || 0, 
    isLoading, 
    isError,
    locationState: location.state,
    initialSearchTerm
  });

  // Check if we have structured matching results from navigation state
  const matchingResult = location.state?.aiSearchResult;
  const matchedGrants = location.state?.matchedGrants as Grant[] | undefined;

  console.log('🤖 Structured matching data from location state:', {
    hasMatchingResult: !!matchingResult,
    hasMatchedGrants: !!matchedGrants,
    rankedGrantsCount: matchingResult?.rankedGrants?.length || 0,
    matchedGrantsCount: matchedGrants?.length || 0,
    actualRankedGrants: matchingResult?.rankedGrants
  });

  // Set AI matches from location state when available
  useEffect(() => {
    if (matchingResult?.rankedGrants) {
      console.log('🎯 Setting AI matches from location state:', {
        rankedGrantsCount: matchingResult.rankedGrants.length,
        allGrantsCount: grants.length,
        willCoverAllGrants: matchingResult.rankedGrants.length >= grants.length
      });
      
      setAiMatches(matchingResult.rankedGrants);
      // Set sorting to "default" (which is "Rekommenderade") when AI search results are available
      setSortBy("default");
    }
  }, [matchingResult, grants.length]);

  // Enhanced filter state
  const {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useFilterState();

  // Always use all grants as the base - AI matches will provide scoring for all grants
  const baseGrants = grants;

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

  // Enhanced search hook with initial search term
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    searchMetrics,
    isSearching,
  } = useEnhancedSearch({
    grants: filteredGrants,
    filters: { organization: '', minFunding: '', maxFunding: '', deadline: '' },
    sortBy,
    initialSearchTerm,
  });

  // Clear AI matches when search term is cleared
  useEffect(() => {
    if (!searchTerm.trim()) {
      setAiMatches(undefined);
      console.log('🧹 Cleared AI matches due to empty search term');
    }
  }, [searchTerm]);

  // Apply AI-based sorting when we have AI matches and using default sorting
  const sortedSearchResults = useMemo(() => {
    if (aiMatches && aiMatches.length > 0 && sortBy === "default") {
      console.log('🤖 Applying AI-based sorting for default sort');
      
      // Create a map of grant IDs to their AI scores
      const scoreMap = new Map<string, number>();
      aiMatches.forEach(match => {
        scoreMap.set(match.grantId, match.relevanceScore);
      });
      
      // Sort grants by AI relevance score (highest first)
      const sorted = [...searchResults].sort((a, b) => {
        const scoreA = scoreMap.get(a.id) || 0;
        const scoreB = scoreMap.get(b.id) || 0;
        return scoreB - scoreA;
      });
      
      console.log('🎯 AI-sorted results:', {
        totalResults: sorted.length,
        aiMatchesCount: aiMatches.length,
        grantsWithScores: sorted.filter(g => scoreMap.has(g.id)).length,
        grantsWithoutScores: sorted.filter(g => !scoreMap.has(g.id)).length,
        topScores: sorted.slice(0, 5).map(g => ({
          id: g.id,
          title: g.title,
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

  // Log AI matches for debugging
  useEffect(() => {
    if (aiMatches && aiMatches.length > 0) {
      console.log('🤖 AI matches available:', {
        totalMatches: aiMatches.length,
        totalGrants: grants.length,
        hasScoreForAllGrants: aiMatches.length >= grants.length,
        coveragePercentage: Math.round((aiMatches.length / grants.length) * 100),
        sampleScores: aiMatches.slice(0, 5).map(match => ({
          grantId: match.grantId,
          score: match.relevanceScore,
          percentage: Math.round(match.relevanceScore * 100)
        }))
      });
    }
  }, [aiMatches, grants.length]);

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
      suggestions={suggestions}
      isSearching={isSearching}
      searchMetrics={searchMetrics}
      aiMatches={aiMatches}
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
