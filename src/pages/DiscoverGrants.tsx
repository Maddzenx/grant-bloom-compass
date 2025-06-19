
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { sortGrants } from "@/utils/grantSorting";
import { SortOption } from "@/components/SortingControls";
import DiscoverHeader from "@/components/DiscoverHeader";
import GrantList from "@/components/GrantList";
import GrantDetailsPanel from "@/components/GrantDetailsPanel";
import { useIsMobile } from "@/hooks/use-mobile";

const GRANTS_PER_PAGE = 10; // Reduced for better performance

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

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

  const filteredGrants = useMemo(() => {
    if (!grants || grants.length === 0) {
      console.log('No grants to filter');
      return [];
    }
    
    const filtered = grants.filter(grant => {
      if (!grant) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (grant.title || '').toLowerCase().includes(searchLower) ||
        (grant.organization || '').toLowerCase().includes(searchLower) ||
        (grant.description || '').toLowerCase().includes(searchLower) ||
        (grant.tags || []).some(tag => tag.toLowerCase().includes(searchLower));
      
      return matchesSearch;
    });
    
    console.log('Filtered grants:', filtered.length, 'out of', grants.length);
    return filtered;
  }, [grants, searchTerm]);

  const sortedGrants = useMemo(() => {
    const sorted = sortGrants(filteredGrants, sortBy);
    console.log('Sorted grants:', sorted.length);
    return sorted;
  }, [filteredGrants, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedGrants.length / GRANTS_PER_PAGE);
  const startIndex = (currentPage - 1) * GRANTS_PER_PAGE;
  const endIndex = startIndex + GRANTS_PER_PAGE;
  const currentGrants = sortedGrants.slice(startIndex, endIndex);

  // Reset to first page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  // Auto-select first grant when grants are loaded or search changes
  useEffect(() => {
    if (currentGrants.length > 0 && !selectedGrant) {
      console.log('Auto-selecting first grant:', currentGrants[0]);
      setSelectedGrant(currentGrants[0]);
    } else if (currentGrants.length > 0 && selectedGrant && !currentGrants.find(g => g.id === selectedGrant.id)) {
      console.log('Current selection not in filtered results, selecting first filtered grant');
      setSelectedGrant(currentGrants[0]);
    } else if (currentGrants.length === 0) {
      console.log('No grants available, clearing selection');
      setSelectedGrant(null);
    }
  }, [currentGrants, selectedGrant]);

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

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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
      {/* Search Header - fixed height */}
      <DiscoverHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalGrants={sortedGrants.length}
      />

      {/* Main Content Area - takes remaining height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Layout */}
        {isMobile ? (
          <>
            {/* Show list when not viewing details */}
            {!showDetails && (
              <GrantList
                grants={currentGrants}
                selectedGrant={selectedGrant}
                bookmarkedGrants={bookmarkedGrants}
                onGrantSelect={handleGrantSelect}
                onToggleBookmark={handleToggleBookmark}
                searchTerm={searchTerm}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
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
              grants={currentGrants}
              selectedGrant={selectedGrant}
              bookmarkedGrants={bookmarkedGrants}
              onGrantSelect={handleGrantSelect}
              onToggleBookmark={handleToggleBookmark}
              searchTerm={searchTerm}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
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
