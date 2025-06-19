
import React from "react";
import { Grant } from "@/types/grant";
import GrantHeader from "./GrantHeader";
import GrantKeyInfo from "./GrantKeyInfo";
import GrantMainContent from "./GrantMainContent";
import GrantSidebar from "./GrantSidebar";
import GrantBottomActions from "./GrantBottomActions";
import { getOrganizationLogo } from "@/utils/organizationLogos";

interface GrantDetailsProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isMobile?: boolean;
}

const GrantDetails = ({ grant, isBookmarked, onToggleBookmark, isMobile = false }: GrantDetailsProps) => {
  const orgLogo = getOrganizationLogo(grant.organization);

  return (
    <div className={`${isMobile ? 'p-3' : 'p-6'} max-w-5xl`}>
      {/* Header section */}
      <div className="mb-4 md:mb-6">
        <GrantHeader
          grant={grant}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          orgLogo={orgLogo}
          isMobile={isMobile}
        />

        {/* Key info section */}
        <GrantKeyInfo grant={grant} isMobile={isMobile} />
      </div>

      {/* Main content - stack on mobile, side-by-side on desktop */}
      <div className={`${isMobile ? 'flex flex-col space-y-4' : 'grid grid-cols-1 lg:grid-cols-4 gap-6'}`}>
        {/* Main content */}
        <div className={isMobile ? 'order-1' : 'lg:col-span-3'}>
          <GrantMainContent grant={grant} isMobile={isMobile} />
        </div>

        {/* Sidebar info */}
        <div className={isMobile ? 'order-2' : 'lg:col-span-1'}>
          <GrantSidebar grant={grant} isMobile={isMobile} />
        </div>
      </div>

      {/* Bottom action buttons */}
      <GrantBottomActions
        grant={grant}
        isBookmarked={isBookmarked}
        onToggleBookmark={onToggleBookmark}
        isMobile={isMobile}
      />
    </div>
  );
};

export default GrantDetails;
