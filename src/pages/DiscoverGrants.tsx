
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { useEnhancedSearchEngine } from "@/hooks/useEnhancedSearchEngine";
import { useFilterState } from "@/hooks/useFilterState";
import { useGrantSelection } from "@/hooks/useGrantSelection";
import { SortOption } from "@/components/SortingControls";
import { DiscoverGrantsStates } from "@/components/DiscoverGrantsStates";
import { DiscoverGrantsContent } from "@/components/DiscoverGrantsContent";
import { EnhancedSearchResults } from "@/components/EnhancedSearchResults";
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
  const [useEnhancedSearch, setUseEnhancedSearch] = useState(false);

  console.log('🔥 DiscoverGrants render:', { 
    grantsCount: grants?.length || 0, 
    isLoading, 
    isError,
    locationState: location.state,
    initialSearchTerm,
    useEnhancedSearch
  });

  // Check if we have structured matching results from navigation state
  const matchingResult = location.state?.aiSearchResult;
  const matchedGrants = location.state?.matchedGrants as Grant[] | undefined;

  // Enhanced search engine
  const {
    search: enhancedSearch,
    isSearching: isEnhancedSearching,
    searchResults: enhancedSearchResults,
    searchError,
    currentQuery,
    recordFeedback,
    getSuggestions
  } = useEnhancedSearchEngine(grants);

  // Set AI matches from location state when available
  useEffect(() => {
    if (matchingResult?.rankedGrants) {
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

  // Use matched grants if available, otherwise use all grants
  const baseGrants = matchedGrants || grants;

  // Apply filters to grants
  const filteredGrants = useMemo(() => {
    console.log('🔍 Filtering grants:', { totalGrants: baseGrants?.length || 0 });
    
    if (!baseGrants || baseGrants.length === 0) {
      console.log('⚠️ No grants to filter');
      return [];
    }

    const hasOrganizationFilter = filters.organizations && filters.organizations.length > 0;
    const hasFundingFilter = filters.fundingRange && (filters.fundingRange.min !== null || filters.fundingRange.max !== null);
    const hasDeadlineFilter = filters.deadline && filters.deadline.preset && filters.deadline.preset !== '';
    const hasTagsFilter = filters.tags && filters.tags.length > 0;
    
    const actuallyHasActiveFilters = hasOrganizationFilter || hasFundingFilter || hasDeadlineFilter || hasTagsFilter;

    if (!actuallyHasActiveFilters) {
      console.log('✅ No active filters, returning all grants:', baseGrants.length);
      return baseGrants;
    }

    const filtered = baseGrants.filter(grant => {
      if (hasOrganizationFilter && !filters.organizations.includes(grant.organization)) {
        return false;
      }

      if (hasFundingFilter) {
        const amount = parseFundingAmount(grant.fundingAmount);
        if (filters.fundingRange.min && amount < filters.fundingRange.min) return false;
        if (filters.fundingRange.max && amount > filters.fundingRange.max) return false;
      }

      if (hasDeadlineFilter && !isGrantWithinDeadline(grant, filters.deadline)) {
        return false;
      }

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

  // Handle search with enhanced search engine
  const handleSearch = useCallback(async (query: string) => {
    setSearchTerm(query);
    
    if (!query.trim()) {
      setAiMatches(undefined);
      setUseEnhancedSearch(false);
      console.log('🧹 Cleared search and AI matches');
      return;
    }

    // Trigger enhanced search for complex queries
    if (query.length > 10 || /[^\w\s]/.test(query) || query.includes('?')) {
      console.log('🚀 Using enhanced search for complex query:', query);
      setUseEnhancedSearch(true);
      await enhancedSearch(query);
    } else {
      setUseEnhancedSearch(false);
    }
  }, [enhancedSearch]);

  // Get suggestions for search
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 1) {
        const newSuggestions = await getSuggestions(searchTerm);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    };
    
    fetchSuggestions();
  }, [searchTerm, getSuggestions]);

  // Determine which results to show
  const searchResults = useMemo(() => {
    if (useEnhancedSearch && enhancedSearchResults) {
      return enhancedSearchResults.items.map(item => item.grant);
    }
    
    // Fallback to simple text search
    if (!searchTerm.trim()) {
      return filteredGrants;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return filteredGrants.filter(grant => 
      grant.title?.toLowerCase().includes(lowerSearchTerm) ||
      grant.description?.toLowerCase().includes(lowerSearchTerm) ||
      grant.organization?.toLowerCase().includes(lowerSearchTerm) ||
      grant.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
    );
  }, [useEnhancedSearch, enhancedSearchResults, searchTerm, filteredGrants]);

  // Apply AI-based sorting when we have AI matches and using default sorting
  const sortedSearchResults = useMemo(() => {
    if (aiMatches && aiMatches.length > 0 && sortBy === "default") {
      console.log('🤖 Applying AI-based sorting for default sort');
      
      const scoreMap = new Map<string, number>();
      aiMatches.forEach(match => {
        scoreMap.set(match.grantId, match.relevanceScore);
      });
      
      const sorted = [...searchResults].sort((a, b) => {
        const scoreA = scoreMap.get(a.id) || 0;
        const scoreB = scoreMap.get(b.id) || 0;
        return scoreB - scoreA;
      });
      
      console.log('🎯 AI-sorted results:', {
        totalResults: sorted.length,
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

  // Handle enhanced search result selection
  const handleEnhancedGrantSelect = useCallback((grant: Grant) => {
    recordFeedback({
      type: 'click',
      target: grant.id,
      rating: 1
    });
    handleGrantSelect(grant);
  }, [recordFeedback, handleGrantSelect]);

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

  // Show enhanced search results if using enhanced search
  if (useEnhancedSearch && enhancedSearchResults && searchTerm.trim()) {
    return (
      <div className="h-screen bg-canvas-cloud flex flex-col w-full overflow-hidden">
        <div className="w-full bg-canvas-cloud flex-shrink-0">
          <div className="page-container py-6">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="headline text-ink-obsidian">Upptäck bidrag</h1>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between">
                <div className="w-full max-w-md">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Sök efter bidrag, organisation eller område..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-12 pr-10 border-gray-300 bg-white rounded-xl text-base font-medium shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-black placeholder:text-black py-3 px-12"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-ink-secondary body-text">
                  {enhancedSearchResults.items.length} bidrag hittade
                  {isEnhancedSearching && <span className="ml-2 text-ink-secondary">• Söker...</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="page-container py-6">
            <EnhancedSearchResults
              searchResult={enhancedSearchResults}
              onGrantSelect={handleEnhancedGrantSelect}
              onFeedback={recordFeedback}
            />
          </div>
        </div>
      </div>
    );
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
      isSearching={isEnhancedSearching}
      searchMetrics={{
        resultsCount: sortedSearchResults.length,
        searchLatency: 0,
        cacheHitRate: 0
      }}
      aiMatches={aiMatches}
      onSearchChange={handleSearch}
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
