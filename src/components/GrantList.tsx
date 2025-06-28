import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import GrantCard from "@/components/GrantCard";
import { Grant } from "@/types/grant";
interface GrantListProps {
  grants: Grant[];
  selectedGrant: Grant | null;
  bookmarkedGrants: Set<string>;
  onGrantSelect: (grant: Grant) => void;
  onToggleBookmark: (grantId: string) => void;
  searchTerm: string;
  isMobile: boolean;
}
const GrantList = ({
  grants,
  selectedGrant,
  bookmarkedGrants,
  onGrantSelect,
  onToggleBookmark,
  searchTerm,
  isMobile
}: GrantListProps) => {
  const containerClass = isMobile ? "w-full bg-canvas-cloud overflow-hidden flex flex-col" : "w-[35%] bg-canvas-cloud overflow-hidden flex flex-col border-r" + " border-[#F0F1F3]";
  return <div className={containerClass}>
      <ScrollArea className="flex-1">
        <div className="bg-canvas-cloud w-full bg-[#f0f1f3] py-px px-[5px]">
          <div className="space-y-3">
            {grants.length === 0 ? <div className="text-center text-ink-secondary mt-12 px-4">
                <div className="body-text">
                  {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
                </div>
              </div> : grants.map(grant => <GrantCard key={grant.id} grant={grant} isSelected={selectedGrant?.id === grant.id} isBookmarked={bookmarkedGrants.has(grant.id)} onSelect={() => onGrantSelect(grant)} onToggleBookmark={() => onToggleBookmark(grant.id)} isMobile={isMobile} />)}
          </div>
        </div>
      </ScrollArea>
    </div>;
};
export default GrantList;