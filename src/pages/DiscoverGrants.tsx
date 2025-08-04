import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
import { sortGrants } from "@/utils/grantSorting";
import { useBackendFilteredGrants } from "@/hooks/useBackendFilteredGrants";
import { useIsMobile } from "@/hooks/use-mobile";

const DiscoverGrants = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // State for search and pipeline management
  const [sortBy, setSortBy] = useState<SortOption>("deadline-asc"); // Default to deadline-asc for filtered search
  const [initialSearchTerm] = useState(() => location.state?.searchTerm || '');
  const [initialSearchResults] = useState(() => location.state?.searchResults || undefined);
  const [isAISearch, setIsAISearch] = useState(false); // Default to regular search mode
  // Transform initial search results if they exist
  const transformSemanticMatches = (rawMatches: any[]) => {
    if (!rawMatches || rawMatches.length === 0) return undefined;
    
    console.log('🔍 Debug: Transforming initial search results:', rawMatches.length, 'matches');
    
    return rawMatches.map((match, index) => {
      console.log(`🔍 Debug: Transforming initial match ${index + 1}/${rawMatches.length}:`, match.id);
      const isEU = match.organization === 'Europeiska Kommissionen';
      const language = isEU ? 'en' : 'sv';
      
      console.log('🔍 Debug: Processing initial match:', {
        id: match.id,
        grantId: match.grantId,
        organization: match.organization,
        isEU,
        language,
        title_sv: match.title_sv,
        title_en: match.title_en,
        subtitle_sv: match.subtitle_sv,
        subtitle_en: match.subtitle_en
      });
      
      const selectedTitle = language === 'en' ? match.title_en : match.title_sv;
      const selectedAboutGrant = language === 'en' ? match.subtitle_en : match.subtitle_sv;
      
      console.log('🔍 Debug: Language selection for initial match:', {
        id: match.id,
        organization: match.organization,
        isEU,
        language,
        title_sv: match.title_sv,
        title_en: match.title_en,
        selectedTitle,
        subtitle_sv: match.subtitle_sv,
        subtitle_en: match.subtitle_en,
        selectedAboutGrant
      });
      
      return {
        // Standard grant structure with language selection
        id: match.id,
        title: selectedTitle,
        organization: match.organization,
        aboutGrant: selectedAboutGrant,
        fundingAmount: match.fundingAmount,
        funding_amount_eur: match.funding_amount_eur,
        opens_at: match.opens_at,
        deadline: match.deadline,
        tags: match.tags,
        industry_sectors: match.industry_sectors,
        eligible_organisations: match.eligible_organisations,
        geographic_scope: match.geographic_scope,
        region: language === 'en' ? match.region_en : match.region_sv,
        cofinancing_required: match.cofinancing_required,
        cofinancing_level_min: match.cofinancing_level_min,
        consortium_requirement: match.consortium_requirement,
        fundingRules: match.fundingRules,
        application_opening_date: match.application_opening_date,
        application_closing_date: match.application_closing_date,
        project_start_date_min: match.project_start_date_min,
        project_start_date_max: match.project_start_date_max,
        project_end_date_min: match.project_end_date_min,
        project_end_date_max: match.project_end_date_max,
        information_webinar_dates: match.information_webinar_dates,
        information_webinar_links: match.information_webinar_links,
        information_webinar_names: match.information_webinar_names,
        templates: match.templates,
        generalInfo: match.generalInfo,
        application_templates_links: match.application_templates_links,
        other_templates_links: match.other_templates_links,
        other_sources_links: match.other_sources_links,
        other_sources_names: match.other_sources_names,
        created_at: match.created_at,
        updated_at: match.updated_at,
        // Semantic search specific fields
        grantId: match.grantId,
        relevanceScore: match.relevanceScore
      };
    });
  };

  const [semanticMatches, setSemanticMatches] = useState<any[] | undefined>(transformSemanticMatches(initialSearchResults?.rankedGrants));
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [hasSearched, setHasSearched] = useState(!!initialSearchTerm);
  
  // Mobile-specific grant accumulation for infinite scroll
  const [accumulatedGrants, setAccumulatedGrants] = useState<GrantListItem[]>([]);
  
  // Track if we've already made initial sorting decisions
  const hasSetInitialSorting = useRef(false);
  const previousSemanticMatches = useRef<any[] | undefined>(undefined);
  
  // Determine which pipeline to use
  const useSemanticPipeline = Boolean(hasSearched && searchTerm.trim());
  const useBackendPipeline = !useSemanticPipeline;

  // Handle initial sorting setup - only run once
  useEffect(() => {
    if (hasSetInitialSorting.current) return;
    
    // If we have initial search results, switch to matching sort
    if (initialSearchResults?.rankedGrants && initialSearchResults.rankedGrants.length > 0) {
      console.log('🔄 Auto-switching to matching sort for initial search results from navigation');
      setSortBy("matching");
      hasSetInitialSorting.current = true;
    }
    // If we have no initial search state, ensure deadline-asc sorting
    else if (!initialSearchTerm && !initialSearchResults) {
      console.log('🔄 Ensuring deadline-asc sorting for filtered search pipeline on initial load');
      setSortBy("deadline-asc");
      hasSetInitialSorting.current = true;
    }
  }, [initialSearchTerm, initialSearchResults]);

  // Handle semantic search pipeline sorting
  useEffect(() => {
    // Only switch to matching if we have new semantic matches and we're not already on matching
    if (useSemanticPipeline && 
        semanticMatches && 
        semanticMatches.length > 0 && 
        semanticMatches !== previousSemanticMatches.current &&
        sortBy !== "matching") {
      console.log('🔄 Auto-switching to matching sort for semantic search results');
      setSortBy("matching");
      previousSemanticMatches.current = semanticMatches;
    }
  }, [useSemanticPipeline, semanticMatches, sortBy]);

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

  // All grants query (for filter options only - semantic search now returns full data)
  const {
    data: allGrants = [],
    isLoading: allGrantsLoading,
    error: allGrantsError,
    isError: allGrantsIsError,
    refetch: refetchAllGrants,
  } = useGrantListItems({
    enabled: false, // No longer needed since semantic search returns full data
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
        
        console.log('🔍 Debug: First semantic match structure:', result.rankedGrants[0]);
        console.log('🔍 Debug: Starting transformation of', result.rankedGrants.length, 'matches');
        
        // Transform semantic matches to include language selection
        const transformedMatches = result.rankedGrants.map((match, index) => {
          console.log(`🔍 Debug: Transforming match ${index + 1}/${result.rankedGrants.length}:`, match.id);
          const isEU = match.organization === 'Europeiska Kommissionen';
          const language = isEU ? 'en' : 'sv';
          
          console.log('🔍 Debug: Processing match:', {
            id: match.id,
            grantId: match.grantId,
            organization: match.organization,
            isEU,
            language,
            title_sv: match.title_sv,
            title_en: match.title_en,
            subtitle_sv: match.subtitle_sv,
            subtitle_en: match.subtitle_en
          });
          
          const selectedTitle = language === 'en' ? match.title_en : match.title_sv;
          const selectedAboutGrant = language === 'en' ? match.subtitle_en : match.subtitle_sv;
          
          console.log('🔍 Debug: Language selection for match:', {
            id: match.id,
            organization: match.organization,
            isEU,
            language,
            title_sv: match.title_sv,
            title_en: match.title_en,
            selectedTitle,
            subtitle_sv: match.subtitle_sv,
            subtitle_en: match.subtitle_en,
            selectedAboutGrant
          });
          
          return {
            // Standard grant structure with language selection
            id: match.id,
            title: selectedTitle,
            organization: match.organization,
            aboutGrant: selectedAboutGrant,
            fundingAmount: match.fundingAmount,
            funding_amount_eur: match.funding_amount_eur,
            opens_at: match.opens_at,
            deadline: match.deadline,
            tags: match.tags,
            industry_sectors: match.industry_sectors,
            eligible_organisations: match.eligible_organisations,
            geographic_scope: match.geographic_scope,
            region: language === 'en' ? match.region_en : match.region_sv,
            cofinancing_required: match.cofinancing_required,
            cofinancing_level_min: match.cofinancing_level_min,
            consortium_requirement: match.consortium_requirement,
            fundingRules: match.fundingRules,
            application_opening_date: match.application_opening_date,
            application_closing_date: match.application_closing_date,
            project_start_date_min: match.project_start_date_min,
            project_start_date_max: match.project_start_date_max,
            project_end_date_min: match.project_end_date_min,
            project_end_date_max: match.project_end_date_max,
            information_webinar_dates: match.information_webinar_dates,
            information_webinar_links: match.information_webinar_links,
            information_webinar_names: match.information_webinar_names,
            templates: match.templates,
            generalInfo: match.generalInfo,
            application_templates_links: match.application_templates_links,
            other_templates_links: match.other_templates_links,
            other_sources_links: match.other_sources_links,
            other_sources_names: match.other_sources_names,
            created_at: match.created_at,
            updated_at: match.updated_at,
            // Semantic search specific fields
            grantId: match.grantId,
            relevanceScore: match.relevanceScore
          };
        });
        
        console.log('🔍 Debug: Transformed matches count:', transformedMatches.length);
        console.log('🔍 Debug: First transformed match:', {
          id: transformedMatches[0]?.id,
          title: transformedMatches[0]?.title,
          aboutGrant: transformedMatches[0]?.aboutGrant,
          organization: transformedMatches[0]?.organization,
          fundingAmount: transformedMatches[0]?.fundingAmount
        });
        
        setSemanticMatches(transformedMatches);
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

        // Semantic matches now contain the full grant data with language selection
        console.log('✅ Using semantic matches as grants:', {
          semanticMatchesCount: semanticMatches.length,
          firstMatch: semanticMatches[0] ? {
            id: semanticMatches[0].id,
            title: semanticMatches[0].title,
            organization: semanticMatches[0].organization
          } : null
        });

        return semanticMatches;
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
    if (useSemanticPipeline && semanticMatches && semanticMatches.length > 0) {
      // Use the sortGrants function to respect user's sort choice
      const sorted = sortGrants(semanticMatches, sortBy, searchTerm);
      
      console.log('🎯 Semantic search results sorted by:', sortBy, {
        totalResults: sorted.length,
        topScores: sorted.slice(0, 3).map(g => ({
          id: g.id,
          title: g.title ? g.title.substring(0, 30) + '...' : 'No title',
          actualScore: (g as any).relevanceScore,
          percentage: Math.round(((g as any).relevanceScore || 0) * 100) + '%'
        }))
      });
      
      return sorted;
    }
    
    // Default sorting for semantic pipeline (no semantic matches)
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
      // For semantic pipeline, re-run the search if there's a search term
      if (searchTerm.trim()) {
        handleSearch();
      }
    }
  }, [useBackendPipeline, refreshBackend, searchTerm, handleSearch]);

  // Clear search results when search term is cleared
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSemanticMatches(undefined);
      setHasSearched(false);
      // Reset to deadline-asc sorting when clearing search to switch to filtered search pipeline
      if (sortBy !== "deadline-asc") {
        console.log('🔄 Resetting to deadline-asc sorting when clearing search');
        setSortBy("deadline-asc");
      }
      // Reset the initial sorting flag so we can set it again if needed
      hasSetInitialSorting.current = false;
    }
  }, [sortBy]);

  // Handle sort change - for backend pipeline, this will trigger a new query
  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
    // Backend pipeline will automatically refetch with new sorting
  }, []);

  // Handle search mode toggle
  const handleToggleSearchMode = useCallback((isAI: boolean) => {
    setIsAISearch(isAI);
    console.log('🔀 Search mode changed to:', isAI ? 'AI' : 'Regular');
  }, []);

  // Get the appropriate loading and error states based on pipeline
  const { isLoading, isError, error } = useMemo(() => {
    if (useSemanticPipeline) {
      return {
        isLoading: isSearching,
        isError: false,
        error: null
      };
    } else {
      return {
        isLoading: backendLoading,
        isError: backendIsError,
        error: backendError
      };
    }
  }, [useSemanticPipeline, isSearching, backendLoading, backendIsError, backendError]);

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
    grants: useSemanticPipeline ? sortedSearchResults : backendGrants,
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
      isAISearch={isAISearch}
      onToggleSearchMode={handleToggleSearchMode}
      // Backend pagination props (only for backend pipeline)
      {...(useBackendPipeline && {
        pagination: backendPagination,
        onPageChange: changePage
      })}
    />
  );
};

export default DiscoverGrants;
