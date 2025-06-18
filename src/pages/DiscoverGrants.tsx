import React, { useState, useEffect } from "react";
import { useGrants } from "@/hooks/useGrants";
import GrantCard from "@/components/GrantCard";
import GrantDetails from "@/components/GrantDetails";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import SearchBar from "@/components/SearchBar";
import SortingControls, { SortOption } from "@/components/SortingControls";
import { Grant } from "@/types/grant";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sortGrants } from "@/utils/grantSorting";

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
  
  const toggleBookmark = (grantId: string) => {
    setBookmarkedGrants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(grantId)) {
        newSet.delete(grantId);
      } else {
        newSet.add(grantId);
      }
      return newSet;
    });
  };
  
  const filteredGrants = grants.filter(grant => grant.title.toLowerCase().includes(searchTerm.toLowerCase()) || grant.organization.toLowerCase().includes(searchTerm.toLowerCase()) || grant.description.toLowerCase().includes(searchTerm.toLowerCase()) || grant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
  const sortedGrants = sortGrants(filteredGrants, sortBy);

  // Auto-select first grant when grants are loaded or search changes
  useEffect(() => {
    if (sortedGrants.length > 0 && !selectedGrant) {
      setSelectedGrant(sortedGrants[0]);
    } else if (sortedGrants.length > 0 && selectedGrant && !sortedGrants.find(g => g.id === selectedGrant.id)) {
      // If current selection is not in filtered results, select first filtered grant
      setSelectedGrant(sortedGrants[0]);
    } else if (sortedGrants.length === 0) {
      setSelectedGrant(null);
    }
  }, [sortedGrants, selectedGrant]);
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
  return <div className="min-h-screen bg-[#f8f4ec] flex w-full">
      {/* Main Content Area */}
      <div className="flex flex-1 h-screen">
        {/* Left Panel - Grant List (40% width) */}
        <div className="w-2/5 border-r border-gray-200 bg-[#f8f4ec] flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-[#f8f4ec]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Upptäck bidrag</h1>
            </div>
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <div className="mt-4">
              <SortingControls sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          {/* Grant Cards - Scrollable */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="space-y-4">
                {sortedGrants.length === 0 ? <div className="text-center text-gray-500 mt-8">
                    {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
                  </div> : sortedGrants.map(grant => <GrantCard key={grant.id} grant={grant} isSelected={selectedGrant?.id === grant.id} isBookmarked={bookmarkedGrants.has(grant.id)} onSelect={() => setSelectedGrant(grant)} onToggleBookmark={() => toggleBookmark(grant.id)} />)}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Grant Details (60% width) */}
        <div className="w-3/5 bg-[#f8f4ec] h-full p-6">
          {selectedGrant ? <div className="bg-white rounded-lg h-full">
              <GrantDetails grant={selectedGrant} isBookmarked={bookmarkedGrants.has(selectedGrant.id)} onToggleBookmark={() => toggleBookmark(selectedGrant.id)} />
            </div> : <div className="bg-white rounded-lg h-full">
              <EmptyGrantDetails />
            </div>}
        </div>
      </div>
    </div>;
};

export default DiscoverGrants;
