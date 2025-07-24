import React from "react";
import { Grant } from "@/types/grant";
import GrantNotionHeader from "./grant-notion/GrantNotionHeader";
import GrantNotionKeyInfo from "./grant-notion/GrantNotionKeyInfo";
import GrantNotionContent from "./grant-notion/GrantNotionContent";
import GrantNotionImportantDatesSection from "./grant-notion/GrantNotionImportantDatesSection";
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
  onSortChange = () => {}
}: GrantDetailsProps) => {
  return <div>
      <div className="bg-white">
        <GrantNotionHeader grant={grant} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} isMobile={isMobile} onBackToList={onBackToList} sortBy={sortBy} onSortChange={onSortChange} />
        {/* Two-column layout starts here */}
        <div className="w-full px-0 pb-0 rounded-none py-0 md:px-0">
          <div className="flex flex-col md:flex-row gap-0 w-full">
            {/* Left column: main content */}
            <div className="w-full md:w-3/5 pr-0 md:pr-8">
              <GrantNotionContent grant={grant} isMobile={isMobile} />
            </div>
            {/* Vertical divider and right column: key info + dates (desktop only) */}
            {!isMobile && (
              <div className="hidden md:flex flex-col w-2/5 pl-0 md:pl-8 border-l border-gray-200">
                <div className="mb-6">
                  <GrantNotionKeyInfo grant={grant} isMobile={isMobile} section="info" />
                </div>
                <div className="mb-6">
                  <GrantNotionImportantDatesSection grant={grant} />
                </div>
                <GrantNotionKeyInfo grant={grant} isMobile={isMobile} section="krav" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>;
};
export default GrantDetails;