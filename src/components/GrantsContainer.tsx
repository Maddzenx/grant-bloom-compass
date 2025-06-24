
import React, { useState } from "react";
import GrantCard from "./GrantCard";
import GrantDetails from "./GrantDetails";
import { Grant } from "@/types/grant";

interface GrantsContainerProps {
  grants: Grant[];
}

const GrantsContainer = ({ grants }: GrantsContainerProps) => {
  // Track the currently selected grant's ID
  const [selectedGrantId, setSelectedGrantId] = useState<string | null>(null);

  // Safety check for grants
  if (!grants || !Array.isArray(grants)) {
    return (
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-[300px] p-4">
          <div className="text-gray-500">No grants available</div>
        </aside>
        <section className="flex-1 p-6">
          <div className="text-gray-500">Select a grant to see details</div>
        </section>
      </div>
    );
  }

  const selectedGrant = grants.find(g => g.id === selectedGrantId);

  return (
    <div className="flex flex-col md:flex-row">
      <aside className="w-full md:w-[300px] p-4 space-y-4">
        {grants.map((grant) => (
          <GrantCard
            key={grant.id}
            grant={grant}
            isSelected={grant.id === selectedGrantId}
            isBookmarked={false}              // wire up your own bookmark state
            onSelect={() => setSelectedGrantId(grant.id)}
            onToggleBookmark={() => {/* … */}}
          />
        ))}
      </aside>

      <section className="flex-1 p-6">
        {selectedGrant ? (
          <GrantDetails 
            grant={selectedGrant} 
            isBookmarked={false}
            onToggleBookmark={() => {/* … */}}
          />
        ) : (
          <div className="text-gray-500">Select a grant to see details</div>
        )}
      </section>
    </div>
  );
};

export default GrantsContainer;
