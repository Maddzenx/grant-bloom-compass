
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
    navigate('/editor', { state: { grant } });
  };

  return (
    <div className="px-6 md:px-12 pt-12 pb-8">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
        {grant.title}
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-4xl">
        {grant.aboutGrant || grant.description}
      </p>

      {/* Action buttons and date */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Viktiga datum</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="date" 
            defaultValue="2025-08-20"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="outline"
            onClick={onToggleBookmark}
            className="px-4 py-2 text-sm border-gray-300"
          >
            <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
            Spara bidrag
          </Button>
          <Button
            onClick={handleApplyClick}
            className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium"
          >
            Börja ansökan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrantNotionHeader;
