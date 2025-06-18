
import React, { useState } from "react";
import { useGrants } from "@/hooks/useGrants";
import GrantCard from "@/components/GrantCard";
import GrantDetails from "@/components/GrantDetails";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import SearchBar from "@/components/SearchBar";
import { Grant } from "@/types/grant";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";

const DiscoverGrants = () => {
  const { data: grants = [], isLoading, error } = useGrants();
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGrants = grants.filter(grant =>
    grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading grants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading grants: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Grant List */}
      <div className="w-1/2 border-r border-gray-200 bg-white flex flex-col">
        {/* Header with collapse button */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <SidebarTrigger className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors">
              <PanelLeft className="w-4 h-4" />
            </SidebarTrigger>
            <h1 className="text-2xl font-bold text-gray-900">Upptäck bidrag</h1>
          </div>
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Grant Cards */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredGrants.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
              </div>
            ) : (
              filteredGrants.map((grant) => (
                <GrantCard
                  key={grant.id}
                  grant={grant}
                  isSelected={selectedGrant?.id === grant.id}
                  onClick={() => setSelectedGrant(grant)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Grant Details */}
      <div className="w-1/2 bg-white">
        {selectedGrant ? (
          <GrantDetails grant={selectedGrant} />
        ) : (
          <EmptyGrantDetails />
        )}
      </div>
    </div>
  );
};

export default DiscoverGrants;
