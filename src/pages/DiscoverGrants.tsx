
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import GrantCard from "@/components/GrantCard";
import GrantDetails from "@/components/GrantDetails";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import { Grant } from "@/types/grant";
import { useGrants } from "@/hooks/useGrants";

const DiscoverGrants = () => {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());

  const { data: grants = [], isLoading, error } = useGrants();

  const toggleBookmark = (grantId: string) => {
    const newBookmarks = new Set(bookmarkedGrants);
    if (newBookmarks.has(grantId)) {
      newBookmarks.delete(grantId);
    } else {
      newBookmarks.add(grantId);
    }
    setBookmarkedGrants(newBookmarks);
  };

  const filteredGrants = grants.filter(grant =>
    grant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Set the first grant as selected by default
  React.useEffect(() => {
    if (filteredGrants.length > 0 && !selectedGrant) {
      setSelectedGrant(filteredGrants[0]);
    }
  }, [filteredGrants, selectedGrant]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Laddar bidrag...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Fel vid hämtning av bidrag: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Upptäck bidrag</h1>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Grants List */}
        <div className="space-y-4">
          {filteredGrants.map((grant) => (
            <GrantCard
              key={grant.id}
              grant={grant}
              isSelected={selectedGrant?.id === grant.id}
              isBookmarked={bookmarkedGrants.has(grant.id)}
              onSelect={() => setSelectedGrant(grant)}
              onToggleBookmark={() => toggleBookmark(grant.id)}
            />
          ))}
        </div>

        {/* Right Panel - Grant Details */}
        {selectedGrant ? (
          <GrantDetails
            grant={selectedGrant}
            isBookmarked={bookmarkedGrants.has(selectedGrant.id)}
            onToggleBookmark={() => toggleBookmark(selectedGrant.id)}
          />
        ) : (
          <EmptyGrantDetails />
        )}
      </div>
    </div>
  );
};

export default DiscoverGrants;
