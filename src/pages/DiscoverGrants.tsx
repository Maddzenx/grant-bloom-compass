
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { sortGrants } from "@/utils/grantSorting";
import { SortOption } from "@/components/SortingControls";
import DiscoverHeader from "@/components/DiscoverHeader";
import GrantList from "@/components/GrantList";
import GrantDetailsPanel from "@/components/GrantDetailsPanel";

const GRANTS_PER_PAGE = 15;

const DiscoverGrants = () => {
  const {
    data: grants = [],
    isLoading,
    error,
    isError,
    refetch
  } = useGrants();
  
  console.log('DiscoverGrants render:', { grants, isLoading, error, isError });
  
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

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
    if (!grants.length) return [];
    return grants.filter(grant => 
      grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [grants, searchTerm]);

  const sortedGrants = useMemo(() => {
    return sortGrants(filteredGrants, sortBy);
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
      setSelectedGrant(currentGrants[0]);
    } else if (currentGrants.length > 0 && selectedGrant && !currentGrants.find(g => g.id === selectedGrant.id)) {
      // If current selection is not in filtered results, select first filtered grant
      setSelectedGrant(currentGrants[0]);
    } else if (currentGrants.length === 0) {
      setSelectedGrant(null);
    }
  }, [currentGrants, selectedGrant]);

  const handleGrantSelect = useCallback((grant: Grant) => {
    setSelectedGrant(grant);
  }, []);

  const handleToggleBookmark = useCallback((grantId: string) => {
    toggleBookmark(grantId);
  }, [toggleBookmark]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">Laddar bidrag...</div>
          <div className="text-sm text-gray-500">Hämtar senaste data från databasen...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError || error) {
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">Fel vid laddning av bidrag</div>
          <div className="text-sm text-gray-600 mb-4">
            {error?.message || 'Ett oväntat fel inträffade'}
          </div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Försök igen
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Ladda om sidan
          </button>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!isLoading && grants.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">Inga bidrag hittades</div>
          <div className="text-sm text-gray-500 mb-4">Det finns för närvarande inga bidrag tillgängliga i databasen</div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
        />

        {/* Right Panel - Grant Details */}
        <GrantDetailsPanel
          selectedGrant={selectedGrant}
          bookmarkedGrants={bookmarkedGrants}
          onToggleBookmark={handleToggleBookmark}
        />
      </div>
    </div>
  );
};

export default DiscoverGrants;
