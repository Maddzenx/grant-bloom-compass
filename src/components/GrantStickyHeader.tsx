import React from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";

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

  const handleApplyClick = () => {
    navigate('/editor');
  };

  return (
    <div className={`sticky top-0 z-10 bg-white border-b border-gray-200 ${isMobile ? 'p-2' : 'p-4'} shadow-sm transform transition-all duration-300 ease-in-out animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <img 
            src={orgLogo.src} 
            alt={orgLogo.alt} 
            className={`${orgLogo.className} ${isMobile ? 'w-4 h-4' : 'w-6 h-6'} flex-shrink-0`} 
          />
          <div className="min-w-0 flex-1">
            <h2 className={`font-semibold text-gray-900 truncate ${isMobile ? 'text-sm' : 'text-base'}`}>
              {grant.title}
            </h2>
            <p className={`text-gray-600 truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {grant.organization}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleBookmark}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Bookmark
              className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} transition-colors duration-200 ${
                isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
              }`}
            />
          </Button>
          <Button
            onClick={handleApplyClick}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Ansök
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrantStickyHeader;
