
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConsolidatedGrantList from "@/components/ConsolidatedGrantList";
import { Grant } from "@/types/grant";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";

interface GrantListProps {
  grants: Grant[];
  selectedGrant: Grant | null;
  onGrantSelect: (grant: Grant) => void;
  onToggleBookmark: (grantId: string) => void;
  searchTerm: string;
  isMobile: boolean;
  aiMatches?: AIGrantMatch[];
}

const GrantList = ({
  grants,
  selectedGrant,
  onGrantSelect,
  onToggleBookmark,
  searchTerm,
  isMobile,
  aiMatches
}: GrantListProps) => {
  const containerClass = isMobile 
    ? "w-full bg-canvas-cloud overflow-hidden flex flex-col" 
    : "w-[35%] bg-canvas-cloud overflow-hidden flex flex-col border-r border-[#F0F1F3]";

  return (
    <div className={containerClass}>
      <ScrollArea className="flex-1">
        <ConsolidatedGrantList
          grants={grants}
          selectedGrant={selectedGrant}
          onGrantSelect={onGrantSelect}
          onToggleBookmark={onToggleBookmark}
          searchTerm={searchTerm}
          isMobile={isMobile}
          aiMatches={aiMatches}
        />
      </ScrollArea>
    </div>
  );
};

export default GrantList;
