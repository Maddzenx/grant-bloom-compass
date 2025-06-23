
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { getUniqueOrganizations } from "@/utils/grantFiltering";
import { SortOption } from "@/components/SortingControls";
import DiscoverHeader from "@/components/DiscoverHeader";
import FilterControls, { FilterOptions } from "@/components/FilterControls";
import GrantList from "@/components/GrantList";
import GrantDetailsPanel from "@/components/GrantDetailsPanel";
import { useIsMobile } from "@/hooks/use-mobile";

const DiscoverGrants = () => {
  const {
    data: grants = [],
    isLoading,
    error,
    isError,
    refetch
  } = useGrants();
  
  const isMobile = useIsMobile();
  
  console.log('DiscoverGrants render state:', { 
    grantsCount: grants?.length || 0, 
    isLoading, 
    error: error?.message, 
    isError 
  });
  
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    organization: "",
    minFunding: "",
    maxFunding: "",
    deadline: ""
  });

  // Enhanced search hook
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    searchMetrics,
    isSearching,
  } = useEnhancedSearch({
    grants,
    filters,
    sortBy,
  });

  const toggleBookmark = useCallback((grantId: string) => {
    setBookmarkedGrants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(grantId)) {
        newSet.delete(grantId);
      } else {
        newSet.add(grantId);
      }
      return newSet;
    });
  }, []);

  // Get unique organizations for filter dropdown
  const uniqueOrganizations = useMemo(() => {
    return getUniqueOrganizations(grants);
  }, [grants]);

  // Auto-select first grant when grants are loaded or search changes
  useEffect(() => {
    if (searchResults.length > 0 && !selectedGrant) {
      console.log('Auto-selecting first grant:', searchResults[0]);
      setSelectedGrant(searchResults[0]);
    } else if (searchResults.length > 0 && selectedGrant && !searchResults.find(g => g.id === selectedGrant.id)) {
      console.log('Current selection not in filtered results, selecting first filtered grant');
      setSelectedGrant(searchResults[0]);
    } else if (searchResults.length === 0) {
      console.log('No grants available, clearing selection');
      setSelectedGrant(null);
    }
  }, [searchResults, selectedGrant]);

  const handleGrantSelect = useCallback((grant: Grant) => {
    console.log('Grant selected:', grant);
    setSelectedGrant(grant);
    if (isMobile) {
      setShowDetails(true);
    }
  }, [isMobile]);

  const handleToggleBookmark = useCallback((grantId: string) => {
    toggleBookmark(grantId);
  }, [toggleBookmark]);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing grants data...');
    refetch();
  }, [refetch]);

  const handleBackToList = useCallback(() => {
    setShowDetails(false);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 mb-2">Laddar bidrag...</div>
          <div className="text-sm text-gray-500">Hämtar data från databasen...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError || error) {
    console.error('Error state:', { isError, error });
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-lg text-red-600 mb-2">Problem med att ladda bidrag</div>
          <div className="text-sm text-gray-600 mb-4">
            {error?.message || 'Ett oväntat fel inträffade vid hämtning av data'}
          </div>
          <div className="space-x-2">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Försök igen
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Ladda om sidan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!isLoading && (!grants || grants.length === 0)) {
    console.log('No data state - grants:', grants);
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">Inga bidrag hittades</div>
          <div className="text-sm text-gray-500 mb-4">Det finns för närvarande inga bidrag tillgängliga i databasen</div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Uppdatera data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f8f4ec] flex flex-col w-full overflow-hidden">
      {/* Enhanced Search Header */}
      <DiscoverHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalGrants={searchResults.length}
        suggestions={suggestions}
        isSearching={isSearching}
        searchMetrics={searchMetrics}
      />

      {/* Filter Controls */}
      <FilterControls
        filters={filters}
        onFiltersChange={setFilters}
        organizations={uniqueOrganizations}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Layout */}
        {isMobile ? (
          <>
            {/* Show list when not viewing details */}
            {!showDetails && (
              <GrantList
                grants={searchResults}
                selectedGrant={selectedGrant}
                bookmarkedGrants={bookmarkedGrants}
                onGrantSelect={handleGrantSelect}
                onToggleBookmark={handleToggleBookmark}
                searchTerm={searchTerm}
                isMobile={true}
              />
            )}

            {/* Show details when viewing a grant */}
            {showDetails && selectedGrant && (
              <GrantDetailsPanel
                selectedGrant={selectedGrant}
                bookmarkedGrants={bookmarkedGrants}
                onToggleBookmark={handleToggleBookmark}
                isMobile={true}
                onBackToList={handleBackToList}
              />
            )}
          </>
        ) : (
          /* Desktop Layout */
          <>
            {/* Left Panel - Grant List */}
            <GrantList
              grants={searchResults}
              selectedGrant={selectedGrant}
              bookmarkedGrants={bookmarkedGrants}
              onGrantSelect={handleGrantSelect}
              onToggleBookmark={handleToggleBookmark}
              searchTerm={searchTerm}
              isMobile={false}
            />

            {/* Right Panel - Grant Details */}
            <GrantDetailsPanel
              selectedGrant={selectedGrant}
              bookmarkedGrants={bookmarkedGrants}
              onToggleBookmark={handleToggleBookmark}
              isMobile={false}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverGrants;
