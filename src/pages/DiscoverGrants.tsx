import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGrantListItems } from "@/hooks/useGrantListItems";
import { GrantListItem } from "@/types/grant";
import { useSemanticSearch } from "@/hooks/useSemanticSearch";
import { useFilterState } from "@/hooks/useFilterState";
import { useGrantSelection } from "@/hooks/useGrantSelection";
import { SortOption } from "@/components/SortingControls";
import { DiscoverGrantsStates } from "@/components/DiscoverGrantsStates";
import { DiscoverGrantsContent } from "@/components/DiscoverGrantsContent";
import { parseFundingAmount, isGrantWithinDeadline, isGrantActive } from "@/utils/grantHelpers";
import { useBackendFilteredGrants } from "@/hooks/useBackendFilteredGrants";

const DiscoverGrants = () => {
  const location = useLocation();
  
  // State for search and pipeline management
  const [sortBy, setSortBy] = useState<SortOption>("deadline-asc"); // Changed default to deadline-asc
  const [initialSearchTerm] = useState(() => location.state?.searchTerm || '');
  const [initialSearchResults] = useState(() => location.state?.searchResults || undefined);
  const [semanticMatches, setSemanticMatches] = useState<any[] | undefined>(initialSearchResults?.rankedGrants || undefined);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [hasSearched, setHasSearched] = useState(!!initialSearchTerm);
  
  // Determine which pipeline to use
  const useSemanticPipeline = hasSearched && searchTerm.trim();
  const useBackendPipeline = !useSemanticPipeline;

  console.log('🔥 DiscoverGrants render:', { 
    useSemanticPipeline,
    useBackendPipeline,
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

  // Semantic search hook (for semantic pipeline)
  const { searchGrants, isSearching } = useSemanticSearch();

  // All grants query (for semantic pipeline fallback and filter options)
  const {
    data: allGrants = [],
    isLoading: allGrantsLoading,
    error: allGrantsError,
    isError: allGrantsIsError,
    refetch: refetchAllGrants,
  } = useGrantListItems();

  // Backend filtered grants hook (for manual browse pipeline)
  const {
    grants: backendGrants,
    pagination: backendPagination,
    isLoading: backendLoading,
    isFetching: backendFetching,
    error: backendError,
    isError: backendIsError,
    currentPage,
    changePage,
    refresh: refreshBackend,
  } = useBackendFilteredGrants({
    filters,
    sorting: { sortBy, searchTerm },
    pagination: { page: 1, limit: 15 },
    searchTerm: useBackendPipeline ? searchTerm : '', // Only pass searchTerm for backend pipeline
    enabled: useBackendPipeline, // Only enabled for manual browse pipeline
  });

  // Track if this is the very first load (no filters, no sorting, no search)
  const isInitialLoad = !hasActiveFilters && sortBy === "deadline-asc" && !searchTerm.trim();
  
  // Show backend fetching overlay when:
  // 1. We have existing data and are refetching, OR
  // 2. User has applied filters/sorting (even if no data yet)
  const showBackendFetchingOverlay = useBackendPipeline && backendFetching && (backendGrants.length > 0 || !isInitialLoad);

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

  // Filter out expired grants from all grants
  const activeGrants = useMemo(() => {
    return allGrants.filter(grant => isGrantActive(grant));
  }, [allGrants]);

  // Get the appropriate grants and loading states based on pipeline
  const { grants, isLoading, isError, error } = useMemo(() => {
    if (useSemanticPipeline) {
      // Semantic pipeline: use active grants for filtering options, but results come from semantic search
      return {
        grants: activeGrants,
        isLoading: allGrantsLoading,
        isError: allGrantsIsError,
        error: allGrantsError
      };
    } else {
      // Backend pipeline: use backend filtered grants (backend should already filter expired grants)
      // Note: React Query's placeholderData should keep previous data during loading
      return {
        grants: backendGrants,
        isLoading: backendLoading,
        isError: backendIsError,
        error: backendError
      };
    }
  }, [useSemanticPipeline, activeGrants, allGrantsLoading, allGrantsIsError, allGrantsError, backendGrants, backendLoading, backendIsError, backendError]);

  // Filter grants based on pipeline
  const baseFilteredGrants = useMemo(() => {
    console.log('🎯 Filtering grants based on pipeline:', {
      useSemanticPipeline,
      useBackendPipeline,
      totalGrants: grants.length,
      hasSemanticMatches: !!semanticMatches,
      semanticMatchesCount: semanticMatches?.length || 0,
      searchTerm: searchTerm.trim(),
      hasSearched
    });

    if (useSemanticPipeline) {
      // Semantic pipeline: filter based on semantic search results
      if (!hasSearched || !searchTerm.trim()) {
        console.log('📋 No search performed, returning all active grants');
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
      console.log('📋 Search performed but no semantic results, returning all active grants as fallback');
      return grants;
    } else {
      // Backend pipeline: grants are already filtered by backend
      console.log('📋 Using backend filtered grants:', grants.length);
      return grants;
    }
  }, [useSemanticPipeline, useBackendPipeline, grants, semanticMatches, searchTerm, hasSearched]);

  // Apply additional frontend filters only for semantic pipeline
  const filteredGrants = useMemo(() => {
    console.log('🔍 Applying additional filters:', { 
      baseCount: baseFilteredGrants?.length || 0,
      hasActiveFilters,
      useSemanticPipeline,
      useBackendPipeline
    });
    
    if (!baseFilteredGrants || baseFilteredGrants.length === 0) {
      return [];
    }

    // For backend pipeline, filters are already applied on backend
    if (useBackendPipeline) {
      console.log('✅ Backend pipeline - filters already applied');
      return baseFilteredGrants;
    }

    // For semantic pipeline, apply frontend filters if active
    if (!hasActiveFilters) {
      return baseFilteredGrants;
    }

    console.log('🔍 Applying frontend filters for semantic pipeline');

    // Apply additional filtering for semantic pipeline
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
  }, [baseFilteredGrants, filters, hasActiveFilters, useSemanticPipeline, useBackendPipeline]);

  // Apply sorting based on pipeline and semantic scores
  const sortedSearchResults = useMemo(() => {
    if (!filteredGrants || filteredGrants.length === 0) {
      return [];
    }

    console.log('🎯 Sorting results:', {
      useSemanticPipeline,
      useBackendPipeline,
      hasSemanticMatches: !!semanticMatches,
      semanticMatchesCount: semanticMatches?.length || 0,
      sortBy,
      filteredCount: filteredGrants.length
    });

    // For backend pipeline, sorting is already done on backend
    if (useBackendPipeline) {
      console.log('✅ Backend pipeline - sorting already applied');
      return filteredGrants;
    }

    // For semantic pipeline, apply frontend sorting
    if (useSemanticPipeline && semanticMatches && semanticMatches.length > 0 && sortBy === "matching") {
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
      
      console.log('🎯 Matching-sorted results with actual scores:', {
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
    
    // Default sorting for semantic pipeline (no semantic matches or different sort option)
    return filteredGrants;
  }, [filteredGrants, semanticMatches, sortBy, useSemanticPipeline, useBackendPipeline]);

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
    if (useBackendPipeline) {
      refreshBackend();
    } else {
      refetchAllGrants();
    }
  }, [useBackendPipeline, refreshBackend, refetchAllGrants]);

  // Clear search results when search term is cleared
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSemanticMatches(undefined);
      setHasSearched(false);
    }
  }, []);

  // Handle sort change - for backend pipeline, this will trigger a new query
  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
    // Backend pipeline will automatically refetch with new sorting
  }, []);

  // Show loading/error/empty states - but NEVER for backend filtering/sorting operations
  const showFullPageLoading = useSemanticPipeline 
    ? (allGrantsLoading || isSearching) 
    : (backendLoading && backendGrants.length === 0 && isInitialLoad);
  
  // Prevent showing "no grants found" when we're fetching new data
  const effectiveIsLoading = showFullPageLoading || (useBackendPipeline && backendFetching);
    
  const stateComponent = DiscoverGrantsStates({
    isLoading: showFullPageLoading,
    isFetching: useBackendPipeline && backendFetching,
    isError,
    error,
    grants: useSemanticPipeline ? activeGrants : backendGrants,
    onRefresh: handleRefresh,
  });

  if (stateComponent) {
    return stateComponent;
  }

  // Calculate search metrics
  const searchMetrics = {
    totalResults: sortedSearchResults.length,
    searchTime: 0,
    ...(useBackendPipeline && {
      currentPage: backendPagination.page,
      totalPages: backendPagination.totalPages,
      totalInDatabase: backendPagination.total
    })
  };

  return (
    <DiscoverGrantsContent
      grants={useSemanticPipeline ? activeGrants : backendGrants}
      searchResults={sortedSearchResults}
      selectedGrant={selectedGrant}
      showDetails={showDetails}
      searchTerm={searchTerm}
      sortBy={sortBy}
      filters={filters}
      hasActiveFilters={hasActiveFilters}
      suggestions={[]}
      isSearching={isSearching || (useSemanticPipeline && isSearching)}
      isBackendFetching={showBackendFetchingOverlay}
      searchMetrics={searchMetrics}
      aiMatches={semanticMatches}
      onSearchChange={handleSearchChange}
      onSearch={handleSearch}
      onSortChange={handleSortChange}
      onFiltersChange={updateFilters}
      onClearFilters={clearFilters}
      onGrantSelect={handleGrantSelect}
      onToggleBookmark={handleToggleBookmark}
      onBackToList={handleBackToList}
      // Backend pagination props (only for backend pipeline)
      {...(useBackendPipeline && {
        pagination: backendPagination,
        onPageChange: changePage
      })}
    />
  );
};

export default DiscoverGrants;
