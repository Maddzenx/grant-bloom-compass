import React from "react";
import { Grant } from "@/types/grant";
import GrantNotionHeader from "./grant-notion/GrantNotionHeader";
import GrantNotionKeyInfo from "./grant-notion/GrantNotionKeyInfo";
import GrantNotionContent from "./grant-notion/GrantNotionContent";
interface GrantDetailsProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isMobile?: boolean;
  onBackToList?: () => void;
  sortBy?: import("./SortingControls").SortOption;
  onSortChange?: (sortBy: import("./SortingControls").SortOption) => void;
}
const GrantDetails = ({
  grant,
  isBookmarked,
  onToggleBookmark,
  isMobile = false,
  onBackToList,
  sortBy = "default",
  onSortChange = () => {},
}: GrantDetailsProps) => {
  return <div className="max-w-4xl mx-auto">
      <div className="bg-white min-h-screen">
        <GrantNotionHeader 
          grant={grant} 
          isBookmarked={isBookmarked} 
          onToggleBookmark={onToggleBookmark} 
          isMobile={isMobile} 
          onBackToList={onBackToList}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
        <div className="w-full px-4 pb-6 rounded-none py-0 md:px-[16px]">
          <GrantNotionKeyInfo grant={grant} isMobile={isMobile} />
          <GrantNotionContent grant={grant} isMobile={isMobile} />
        </div>
      </div>
    </div>;
};
export default GrantDetails;