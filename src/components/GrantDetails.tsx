
import React from "react";
import { Grant } from "@/types/grant";
import GrantHeader from "./GrantHeader";
import GrantKeyInfo from "./GrantKeyInfo";
import GrantMainContent from "./GrantMainContent";
import GrantSidebar from "./GrantSidebar";
import GrantBottomActions from "./GrantBottomActions";

interface GrantDetailsProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const getOrganizationLogo = (organization: string) => {
  const orgLower = organization.toLowerCase();
  
  if (orgLower.includes('vinnova')) {
    return {
      src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
      alt: "Vinnova",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('energimyndigheten')) {
    return {
      src: "/lovable-uploads/f8a26579-c7af-42a6-a518-0af3d65385d6.png",
      alt: "Energimyndigheten",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('vetenskapsrådet')) {
    return {
      src: "/lovable-uploads/65e93ced-f449-4ba6-bcb0-5556c3edeb8a.png",
      alt: "Vetenskapsrådet",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('formas')) {
    return {
      src: "/lovable-uploads/24e99124-8ec2-4d23-945b-ead48b809491.png",
      alt: "Formas",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('tillväxtverket')) {
    return {
      src: "/lovable-uploads/112d5f02-31e8-4cb1-a8d5-7b7b422b0fa2.png",
      alt: "Tillväxtverket",
      className: "w-24 h-8 object-contain"
    };
  }
  
  // Default fallback to Vinnova
  return {
    src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
    alt: organization,
    className: "w-24 h-8 object-contain"
  };
};

const GrantDetails = ({ grant, isBookmarked, onToggleBookmark }: GrantDetailsProps) => {
  const orgLogo = getOrganizationLogo(grant.organization);

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="p-8 max-w-4xl">
        {/* Header section */}
        <div className="mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column - Main content */}
          <GrantMainContent grant={grant} />

          {/* Right column - Sidebar info */}
          <GrantSidebar />
        </div>

        {/* Bottom action buttons */}
        <GrantBottomActions
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
        />
      </div>
    </div>
  );
};

export default GrantDetails;
