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

  // Check if deadline has passed
  const isDeadlinePassed = (() => {
    if (grant.deadline === 'Ej specificerat') return false;

    // Parse Swedish date format
    const months: {
      [key: string]: number;
    } = {
      'januari': 0,
      'februari': 1,
      'mars': 2,
      'april': 3,
      'maj': 4,
      'juni': 5,
      'juli': 6,
      'augusti': 7,
      'september': 8,
      'oktober': 9,
      'november': 10,
      'december': 11
    };
    const parts = grant.deadline.toLowerCase().split(' ');
    if (parts.length < 3) return false;
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || month === undefined || isNaN(year)) return false;
    const deadlineDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    return deadlineDate < today;
  })();
  return <div onClick={onSelect} className="w-full bg-white rounded-xl p-4">
      {/* Header with logo, title, and bookmark */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-14 h-14 flex items-center justify-center border border-gray-100 flex-shrink-0 max-w-14 rounded-2xl">
            <img src={orgLogo.src} alt={orgLogo.alt} className="w-10 h-7 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 text-base">{grant.title}</h3>
            <div className="text-sm font-bold text-gray-900">{grant.fundingAmount}</div>
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 sm:gap-2 md:gap-1 lg:gap-2">
            <span className={`font-semibold text-xs ${isDeadlinePassed ? 'text-red-600' : 'text-green-600'}`}>
              {isDeadlinePassed ? 'Closed:' : 'Open:'}
            </span>
            <span className="font-semibold mx-[3px] text-xs sm:text-xs text-gray-900 md:text-xs">
              {(() => {
              if (isDeadlinePassed) {
                return 'Deadline passed';
              }
              const deadlineDate = new Date(grant.deadline);
              const today = new Date();
              const diffTime = deadlineDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return `${diffDays} days left`;
            })()}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-1 lg:gap-2">
            <span className="text-gray-600 font-medium text-xs">Deadline:</span>
            <span className="text-gray-900 font-semibold mx-[3px] text-xs sm:text-xs md:text-xs">{grant.deadline}</span>
          </div>
        </div>
      </div>
    </div>;
};
export default GrantCard;