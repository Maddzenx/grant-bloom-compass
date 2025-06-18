
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGrants } from "@/hooks/useGrants";
import { Grant } from "@/types/grant";
import { sortGrants } from "@/utils/grantSorting";
import { SortOption } from "@/components/SortingControls";
import DiscoverHeader from "@/components/DiscoverHeader";
import FilterPanel from "@/components/FilterPanel";
import GrantList from "@/components/GrantList";
import GrantDetailsPanel from "@/components/GrantDetailsPanel";

const GRANTS_PER_PAGE = 15;

const DiscoverGrants = () => {
  const {
    data: grants = [],
    isLoading,
    error
  } = useGrants();
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

  const handleFiltersChange = useCallback((filters: any) => {
    console.log("Filters changed:", filters);
    // Here you would implement the actual filtering logic
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading grants...</div>
      </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading grants: {error.message}</div>
      </div>;
  }

  return (
    <div className="h-screen bg-[#f8f4ec] flex flex-col w-full overflow-hidden">
      {/* Filter Panel - replaces the old header */}
      <FilterPanel 
        totalResults={sortedGrants.length}
        onFiltersChange={handleFiltersChange}
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
