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
import { useIsMobile } from "@/hooks/use-mobile";

const DiscoverGrants = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // State for search and pipeline management
  const [sortBy, setSortBy] = useState<SortOption>("deadline-asc"); // Changed default to deadline-asc
  const [initialSearchTerm] = useState(() => location.state?.searchTerm || '');
  const [initialSearchResults] = useState(() => location.state?.searchResults || undefined);
  const [semanticMatches, setSemanticMatches] = useState<any[] | undefined>(initialSearchResults?.rankedGrants || undefined);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [hasSearched, setHasSearched] = useState(!!initialSearchTerm);
  
  // Mobile-specific grant accumulation for infinite scroll
  const [accumulatedGrants, setAccumulatedGrants] = useState<GrantListItem[]>([]);
  
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
  } = useGrantListItems({
    enabled: useSemanticPipeline, // Only load all grants when using semantic pipeline
  });

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
    sorting: { sortBy, searchTerm: '' }, // Don't pass searchTerm to backend pipeline
    pagination: { page: 1, limit: 15 },
    searchTerm: '', // Always empty for backend pipeline - search is handled by semantic search
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



  // Handle grant accumulation for mobile infinite scroll
  useEffect(() => {
    if (useBackendPipeline && isMobile && backendGrants.length > 0) {
      setAccumulatedGrants(prev => {
        // If this is page 1 or filters changed, replace all grants
        if (currentPage === 1) {
          console.log('📱 Mobile: Starting fresh with page 1 grants', { grantsCount: backendGrants.length });
          return [...backendGrants];
        }
        
        // For subsequent pages, append new grants
        const newGrants = backendGrants.filter(newGrant => 
          !prev.some(existingGrant => existingGrant.id === newGrant.id)
        );
        
        if (newGrants.length > 0) {
          console.log('📱 Mobile: Adding grants from page', currentPage, { 
            newGrants: newGrants.length, 
            totalAfter: prev.length + newGrants.length 
          });
          return [...prev, ...newGrants];
        }
        
        return prev;
      });
    }
  }, [useBackendPipeline, isMobile, backendGrants, currentPage]);

  // Reset accumulated grants when filters change
  useEffect(() => {
    if (useBackendPipeline && isMobile) {
      console.log('📱 Mobile: Resetting accumulated grants due to filter change');
      setAccumulatedGrants([]);
    }
  }, [useBackendPipeline, isMobile, filters, sortBy, searchTerm]);

  // Get the appropriate grants for filtering and display based on pipeline
  const grantsForFiltering = useMemo(() => {
    if (useSemanticPipeline) {
      // For semantic pipeline, use all grants (filtered for active grants)
      return allGrants.filter(grant => isGrantActive(grant));
    } else {
      // For backend pipeline, use accumulated grants for mobile infinite scroll, regular grants for desktop
      const grantsToUse = (isMobile && accumulatedGrants.length > 0) ? accumulatedGrants : backendGrants;
      return grantsToUse;
    }
  }, [useSemanticPipeline, allGrants, backendGrants, isMobile, accumulatedGrants]);

  // Filter grants based on pipeline
  const baseFilteredGrants = useMemo(() => {
    console.log('🎯 Filtering grants based on pipeline:', {
      useSemanticPipeline,
      useBackendPipeline,
      totalGrants: grantsForFiltering.length,
      hasSemanticMatches: !!semanticMatches,
      semanticMatchesCount: semanticMatches?.length || 0,
      searchTerm: searchTerm.trim(),
      hasSearched
    });

    if (useSemanticPipeline) {
      // Semantic pipeline: filter based on semantic search results
      if (!hasSearched || !searchTerm.trim()) {
        console.log('📋 No search performed, returning all active grants');
        return grantsForFiltering;
      }

      // If we have semantic matches (even if empty array), use those
      if (semanticMatches !== undefined) {
        if (semanticMatches.length === 0) {
          console.log('📋 No semantic matches found, returning empty array');
          return [];
        }

        // Filter grants to only include those that were semantically matched
        const matchedGrantIds = semanticMatches.map(match => match.grantId);
        const filteredGrants = grantsForFiltering.filter(grant => matchedGrantIds.includes(grant.id));
        
        console.log('✅ Filtered to semantic matches:', {
          matchedIds: matchedGrantIds.length,
          filteredGrants: filteredGrants.length
        });

        return filteredGrants;
      }

      // If semantic search failed but we searched, return all grants as fallback
      console.log('📋 Search performed but no semantic results, returning all active grants as fallback');
      return grantsForFiltering;
    } else {
      // Backend pipeline: grants are already filtered by backend
      console.log('📋 Using backend filtered grants:', grantsForFiltering.length);
      return grantsForFiltering;
    }
  }, [useSemanticPipeline, useBackendPipeline, grantsForFiltering, semanticMatches, searchTerm, hasSearched]);

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
        const amount = grant.funding_amount_eur ?? parseFundingAmount(grant.fundingAmount);
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
    // Only clear search results if the search term is completely empty
    if (!value.trim()) {
      setSemanticMatches(undefined);
      setHasSearched(false);
    }
    // Don't trigger any automatic search - only search on button click or Enter key
  }, []);

  // Handle sort change - for backend pipeline, this will trigger a new query
  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
    // Backend pipeline will automatically refetch with new sorting
  }, []);

  // Get the appropriate loading and error states based on pipeline
  const { isLoading, isError, error } = useMemo(() => {
    if (useSemanticPipeline) {
      return {
        isLoading: allGrantsLoading || isSearching,
        isError: allGrantsIsError,
        error: allGrantsError
      };
    } else {
      return {
        isLoading: backendLoading,
        isError: backendIsError,
        error: backendError
      };
    }
  }, [useSemanticPipeline, allGrantsLoading, isSearching, allGrantsIsError, allGrantsError, backendLoading, backendIsError, backendError]);

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
    grants: useSemanticPipeline ? grantsForFiltering : backendGrants,
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
      grants={useSemanticPipeline ? grantsForFiltering : backendGrants}
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
