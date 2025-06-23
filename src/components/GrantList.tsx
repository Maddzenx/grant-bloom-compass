
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import GrantCard from "@/components/GrantCard";
import { Grant } from "@/types/grant";

interface GrantListProps {
  grants: Grant[];
  selectedGrant: Grant | null;
  bookmarkedGrants: Set<string>;
  seenGrants: Set<string>;
  onGrantSelect: (grant: Grant) => void;
  onToggleBookmark: (grantId: string) => void;
  searchTerm: string;
  isMobile: boolean;
}

const GrantList = ({
  grants,
  selectedGrant,
  bookmarkedGrants,
  seenGrants,
  onGrantSelect,
  onToggleBookmark,
  searchTerm,
  isMobile
}: GrantListProps) => {
  const containerClass = isMobile ? "w-full bg-[#f8f4ec] overflow-hidden flex flex-col" : "w-[35%] border-r border-gray-200 bg-[#f8f4ec] overflow-hidden flex flex-col";
  
  return (
    <div className={containerClass}>
      <ScrollArea className="flex-1">
        <div className="p-2 md:p-4 border border-transparent py-0 px-1 md:px-2 max-w-[400px]">
          <div className="space-y-2 md:space-y-3">
            {grants.length === 0 ? (
              <div className="text-center text-gray-500 mt-8 px-4">
                {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
              </div>
            ) : (
              grants.map(grant => (
                <GrantCard 
                  key={grant.id} 
                  grant={grant} 
                  isSelected={selectedGrant?.id === grant.id} 
                  isBookmarked={bookmarkedGrants.has(grant.id)} 
                  isSeen={seenGrants.has(grant.id)}
                  onSelect={() => onGrantSelect(grant)} 
                  onToggleBookmark={() => onToggleBookmark(grant.id)} 
                  isMobile={isMobile} 
                />
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default GrantList;
