
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGrants } from "@/hooks/useGrants";
import GrantCard from "@/components/GrantCard";
import GrantDetails from "@/components/GrantDetails";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import SearchBar from "@/components/SearchBar";
import SortingControls, { SortOption } from "@/components/SortingControls";
import GrantStickyHeader from "@/components/GrantStickyHeader";
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

  const getOrganizationLogo = (organization: string) => {
    const orgLower = organization.toLowerCase();
    
    if (orgLower.includes('vinnova')) {
      return {
        src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
        alt: "Vinnova",
        className: "w-20 h-6 object-contain"
      };
    } else if (orgLower.includes('energimyndigheten')) {
      return {
        src: "/lovable-uploads/f8a26579-c7af-42a6-a518-0af3d65385d6.png",
        alt: "Energimyndigheten",
        className: "w-20 h-6 object-contain"
      };
    } else if (orgLower.includes('vetenskapsrådet')) {
      return {
        src: "/lovable-uploads/65e93ced-f449-4ba6-bcb0-5556c3edeb8a.png",
        alt: "Vetenskapsrådet",
        className: "w-20 h-6 object-contain"
      };
    } else if (orgLower.includes('formas')) {
      return {
        src: "/lovable-uploads/24e99124-8ec2-4d23-945b-ead48b809491.png",
        alt: "Formas",
        className: "w-20 h-6 object-contain"
      };
    } else if (orgLower.includes('tillväxtverket')) {
      return {
        src: "/lovable-uploads/112d5f02-31e8-4cb1-a8d5-7b7b422b0fa2.png",
        alt: "Tillväxtverket",
        className: "w-20 h-6 object-contain"
      };
    }
    
    return {
      src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
      alt: organization,
      className: "w-20 h-6 object-contain"
    };
  };

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
    return grants.filter(grant => grant.title.toLowerCase().includes(searchTerm.toLowerCase()) || grant.organization.toLowerCase().includes(searchTerm.toLowerCase()) || grant.description.toLowerCase().includes(searchTerm.toLowerCase()) || grant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [grants, searchTerm]);

  const sortedGrants = useMemo(() => {
    return sortGrants(filteredGrants, sortBy);
  }, [filteredGrants, sortBy]);

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

  const handleGrantSelect = useCallback((grant: Grant) => {
    setSelectedGrant(grant);
  }, []);

  const handleToggleBookmark = useCallback((grantId: string) => {
    toggleBookmark(grantId);
  }, [toggleBookmark]);

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

  return <div className="h-screen bg-[#f8f4ec] flex flex-col w-full overflow-hidden">
      {/* Search Header - fixed height */}
      <div className="w-full bg-[#f8f4ec] border-b border-gray-200 flex-shrink-0">
        <div className="p-4 border border-transparent">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Upptäck bidrag</h1>
          </div>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <div className="mt-3 flex items-center justify-between">
            <div className="text-black text-sm">
              {sortedGrants.length} bidrag hittade
            </div>
            <SortingControls sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </div>
      </div>

      {/* Main Content Area - takes remaining height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Grant List (40% width) */}
        <div className="w-2/5 border-r border-gray-200 bg-[#f8f4ec] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 border border-transparent">
              <div className="space-y-3">
                {sortedGrants.length === 0 ? <div className="text-center text-gray-500 mt-8">
                    {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
                  </div> : sortedGrants.map(grant => <GrantCard key={grant.id} grant={grant} isSelected={selectedGrant?.id === grant.id} isBookmarked={bookmarkedGrants.has(grant.id)} onSelect={() => handleGrantSelect(grant)} onToggleBookmark={() => handleToggleBookmark(grant.id)} />)}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Grant Details (60% width) */}
        <div className="w-3/5 bg-[#f8f4ec] overflow-hidden relative">
          {/* Sticky Header - Only show when grant is selected */}
          {selectedGrant && (
            <GrantStickyHeader
              grant={selectedGrant}
              isBookmarked={bookmarkedGrants.has(selectedGrant.id)}
              onToggleBookmark={() => handleToggleBookmark(selectedGrant.id)}
              orgLogo={getOrganizationLogo(selectedGrant.organization)}
            />
          )}
          
          {selectedGrant ? <ScrollArea className="h-full" data-grant-details-scroll>
              <div className="p-4 border-transparent">
                <div className="bg-white rounded-lg">
                  <GrantDetails grant={selectedGrant} isBookmarked={bookmarkedGrants.has(selectedGrant.id)} onToggleBookmark={() => handleToggleBookmark(selectedGrant.id)} />
                </div>
              </div>
            </ScrollArea> : <div className="flex items-center justify-center h-full p-4">
              <div className="bg-white rounded-lg w-full h-full flex items-center justify-center">
                <EmptyGrantDetails />
              </div>
            </div>}
        </div>
      </div>
    </div>;
};

export default DiscoverGrants;
