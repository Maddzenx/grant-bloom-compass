
import React from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";

interface GrantStickyHeaderProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  orgLogo: {
    src: string;
    alt: string;
    className: string;
  };
  isMobile?: boolean;
}

const GrantStickyHeader = ({
  grant,
  isBookmarked,
  onToggleBookmark,
  orgLogo,
  isMobile = false
}: GrantStickyHeaderProps) => {
  const navigate = useNavigate();
  const { isGrantSaved, addToSaved, removeFromSaved, startApplication } = useSavedGrantsContext();

  const handleApplyClick = () => {
    console.log('🎯 Apply button clicked in sticky header for grant:', grant.id, grant.title);
    startApplication(grant);
    navigate('/chat', { state: { grant } });
  };

  const handleBookmarkToggle = () => {
    const currentlyBookmarked = isGrantSaved(grant.id);
    // Removed expensive console logging to improve performance
    if (currentlyBookmarked) {
      removeFromSaved(grant.id);
    } else {
      addToSaved(grant);
    }
  };

  // Use the context to determine if grant is actually saved
  const actuallyBookmarked = isGrantSaved(grant.id);

  return (
    <div className={`bg-white ${isMobile ? 'p-2' : 'p-4'} backdrop-blur-sm bg-white/95 hover:bg-white transition-all duration-300 ease-out hover:shadow-md group`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <img 
            src={orgLogo.src} 
            alt={orgLogo.alt} 
            className={`${orgLogo.className} ${isMobile ? 'w-4 h-4' : 'w-6 h-6'} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} 
          />
          <div className="min-w-0 flex-1">
            <h2 className={`font-semibold text-gray-900 truncate transition-colors duration-300 group-hover:text-blue-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
              {grant.title}
            </h2>
            <p className={`text-gray-600 truncate transition-colors duration-300 group-hover:text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {grant.organization}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmarkToggle}
            className="p-2 hover:bg-canvas-bg rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Bookmark
              className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} transition-all duration-300 hover:scale-110 ${
                actuallyBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400 hover:text-blue-500"
              }`}
            />
          </Button>
          <Button
            onClick={handleApplyClick}
            size="sm"
            className="text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            Ansök
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrantStickyHeader;
