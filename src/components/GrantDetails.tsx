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
}
const GrantDetails = ({
  grant,
  isBookmarked,
  onToggleBookmark,
  isMobile = false
}: GrantDetailsProps) => {
  return <div className="max-w-4xl mx-auto">
      <div className="bg-white min-h-screen">
        <GrantNotionHeader grant={grant} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} isMobile={isMobile} />
        <div className="px-6 pb-12 md:px-[20px] rounded-none">
          <GrantNotionKeyInfo grant={grant} isMobile={isMobile} />
          <GrantNotionContent grant={grant} isMobile={isMobile} />
        </div>
      </div>
    </div>;
};
export default GrantDetails;