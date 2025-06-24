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
    navigate('/chat', {
      state: {
        grant
      }
    });
  };
  return <div className="px-6 pt-6 pb-8 md:px-[20px] py-[20px] rounded-none">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight md:text-xl">
        {grant.title}
      </h1>

      {/* Description from database */}
      {grant.description && <p className="text-sm text-gray-700 mb-6 leading-relaxed max-w-4xl">
          {grant.description}
        </p>}

      {/* About Grant section (if different from description) */}
      {grant.aboutGrant && grant.aboutGrant !== grant.description && <p className="text-sm text-gray-700 mb-6 leading-relaxed max-w-4xl">
          {grant.aboutGrant}
        </p>}

      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button onClick={handleApplyClick} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
          Ansök om bidrag
        </Button>
        <Button variant="outline" onClick={onToggleBookmark} className="px-4 py-2 text-sm border-gray-300 rounded-lg flex items-center gap-2">
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current text-blue-600" : "text-gray-500"}`} />
          {isBookmarked ? "Sparat" : "Spara bidrag"}
        </Button>
      </div>
    </div>;
};
export default GrantNotionHeader;