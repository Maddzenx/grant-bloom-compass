
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import GrantDetails from "@/components/GrantDetails";
import GrantStickyHeader from "@/components/GrantStickyHeader";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import { Grant } from "@/types/grant";
import { getOrganizationLogo } from "@/utils/organizationLogos";

interface GrantDetailsPanelProps {
  selectedGrant: Grant | null;
  bookmarkedGrants: Set<string>;
  onToggleBookmark: (grantId: string) => void;
}

const GrantDetailsPanel = ({
  selectedGrant,
  bookmarkedGrants,
  onToggleBookmark
}: GrantDetailsPanelProps) => {
  return (
    <div className="w-3/5 bg-[#f8f4ec] overflow-hidden relative">
      {/* Sticky Header - Only show when grant is selected */}
      {selectedGrant && (
        <GrantStickyHeader
          grant={selectedGrant}
          isBookmarked={bookmarkedGrants.has(selectedGrant.id)}
          onToggleBookmark={() => onToggleBookmark(selectedGrant.id)}
          orgLogo={getOrganizationLogo(selectedGrant.organization)}
        />
      )}
      
      {selectedGrant ? (
        <ScrollArea className="h-full" data-grant-details-scroll>
          <div className="p-4 border-transparent px-0 py-0">
            <div className="bg-white rounded-lg">
              <GrantDetails
                grant={selectedGrant}
                isBookmarked={bookmarkedGrants.has(selectedGrant.id)}
                onToggleBookmark={() => onToggleBookmark(selectedGrant.id)}
              />
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center h-full p-4">
          <div className="bg-white rounded-lg w-full h-full flex items-center justify-center">
            <EmptyGrantDetails />
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantDetailsPanel;
