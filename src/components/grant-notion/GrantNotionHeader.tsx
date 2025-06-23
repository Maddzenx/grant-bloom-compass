
import React from "react";
import { Calendar, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";

interface GrantNotionHeaderProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isMobile?: boolean;
}

const GrantNotionHeader = ({
  grant,
  isBookmarked,
  onToggleBookmark,
  isMobile = false
}: GrantNotionHeaderProps) => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/editor', {
      state: {
        grant
      }
    });
  };

  return (
    <div className="px-6 md:px-12 pt-12 pb-8">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight md:text-xl">
        {grant.title}
      </h1>

      {/* Description from database */}
      <p className="text-sm text-gray-700 mb-6 leading-relaxed max-w-4xl">
        {grant.description}
      </p>

      {/* About Grant section (if different from description) */}
      {grant.aboutGrant && grant.aboutGrant !== grant.description && (
        <p className="text-sm text-gray-700 mb-6 leading-relaxed max-w-4xl">
          {grant.aboutGrant}
        </p>
      )}

      {/* Action buttons and date */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>Viktiga datum</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="date" 
            defaultValue="2025-08-20" 
            className="px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <Button 
            variant="outline" 
            onClick={onToggleBookmark}
            className="px-3 py-1 text-xs border-gray-300"
          >
            <Bookmark className={`w-3 h-3 mr-1 ${isBookmarked ? "fill-current" : ""}`} />
            Spara bidrag
          </Button>
          <Button 
            onClick={handleApplyClick}
            className="px-4 py-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium"
          >
            Börja ansökan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrantNotionHeader;
