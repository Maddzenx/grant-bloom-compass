
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
}

const GrantDetails = ({ grant, isBookmarked, onToggleBookmark }: GrantDetailsProps) => {
  const orgLogo = getOrganizationLogo(grant.organization);

  return (
    <div className="p-6 max-w-5xl">
      {/* Header section */}
      <div className="mb-6">
        <GrantHeader
          grant={grant}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          orgLogo={orgLogo}
        />

        {/* Key info section */}
        <GrantKeyInfo grant={grant} />
      </div>

      {/* Main content in two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column - Main content */}
        <div className="lg:col-span-3">
          <GrantMainContent grant={grant} />
        </div>

        {/* Right column - Sidebar info */}
        <div className="lg:col-span-1">
          <GrantSidebar />
        </div>
      </div>

      {/* Bottom action buttons */}
      <GrantBottomActions
        isBookmarked={isBookmarked}
        onToggleBookmark={onToggleBookmark}
      />
    </div>
  );
};

export default GrantDetails;
