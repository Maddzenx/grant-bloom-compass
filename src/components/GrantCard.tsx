import React from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grant } from "@/types/grant";
import { getOrganizationLogo } from "@/utils/organizationLogos";
interface GrantCardProps {
  grant: Grant;
  isSelected: boolean;
  isBookmarked: boolean;
  onSelect: () => void;
  onToggleBookmark: () => void;
  isMobile?: boolean;
}
const GrantCard = ({
  grant,
  isSelected,
  isBookmarked,
  onSelect,
  onToggleBookmark,
  isMobile = false
}: GrantCardProps) => {
  const orgLogo = getOrganizationLogo(grant.organization);
  return <div className={`bg-white rounded-xl border p-6 cursor-pointer transition-all hover:shadow-lg ${isSelected ? "ring-2 ring-blue-500 border-blue-200 shadow-lg" : "border-gray-100 shadow-sm"}`} onClick={onSelect}>
      {/* Header with logo, title, and bookmark */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
            <img src={orgLogo.src} alt={orgLogo.alt} className="w-10 h-7 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug line-clamp-2">{grant.title}</h3>
            <div className="text-sm font-bold text-gray-900\n">{grant.fundingAmount}</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={e => {
        e.stopPropagation();
        onToggleBookmark();
      }} className="p-2 hover:bg-gray-50 rounded-lg flex-shrink-0 ml-2">
          <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-gray-600 text-gray-600" : "text-gray-400"}`} />
        </Button>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {grant.tags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-0 font-medium px-2.5 py-1 rounded-full">
            {tag}
          </Badge>)}
        {grant.tags.length > 3 && <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-0 font-medium px-2.5 py-1 rounded-full">
            +{grant.tags.length - 3}
          </Badge>}
      </div>
      
      {/* Status and deadline info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <span className="text-green-600 font-semibold text-sm">Open:</span>
            <span className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
              {(() => {
              const deadlineDate = new Date(grant.deadline);
              const today = new Date();
              const diffTime = deadlineDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return `${diffDays} days left`;
            })()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 font-medium text-sm">Deadline:</span>
            <span className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base lg:text-lg">{grant.deadline}</span>
          </div>
        </div>
        <div className="text-gray-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg\n">Seen</div>
      </div>
    </div>;
};
export default GrantCard;