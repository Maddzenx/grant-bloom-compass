
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

const GrantCard = ({ grant, isSelected, isBookmarked, onSelect, onToggleBookmark, isMobile = false }: GrantCardProps) => {
  const orgLogo = getOrganizationLogo(grant.organization);

  return (
    <div
      className={`bg-white rounded-lg border p-3 md:p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-500 border-blue-200 shadow-md" : "border-gray-200 shadow-sm"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={orgLogo.src}
              alt={orgLogo.alt}
              className={`${orgLogo.className} ${isMobile ? 'w-4 h-4' : ''}`}
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">{grant.title}</h3>
          <p className="text-gray-600 text-xs mb-2 md:mb-3 line-clamp-2 leading-relaxed">{grant.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          className="ml-2 p-1 hover:bg-gray-100 rounded-lg flex-shrink-0"
        >
          <Bookmark
            className={`w-4 h-4 ${
              isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`}
          />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-2 md:mb-3">
        {grant.tags.slice(0, isMobile ? 2 : 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs bg-teal-50 text-teal-700 border-0 font-medium px-2 py-0.5 rounded-full">
            {tag}
          </Badge>
        ))}
        {grant.tags.length > (isMobile ? 2 : 3) && (
          <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600 border-0 font-medium px-2 py-0.5 rounded-full">
            +{grant.tags.length - (isMobile ? 2 : 3)}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs mb-2 md:mb-0">
        <div>
          <span className="text-gray-500 text-xs block mb-1 font-medium">Bidragsbelopp</span>
          <div className="text-gray-900 font-semibold truncate">{grant.fundingAmount}</div>
        </div>
        <div>
          <span className="text-gray-500 text-xs block mb-1 font-medium">Deadline</span>
          <div className="text-gray-900 font-semibold truncate">{grant.deadline}</div>
        </div>
      </div>
      
      {!isMobile && (
        <div className="mt-3 text-xs">
          <span className="text-gray-500 text-xs block mb-1 font-medium">Kvalifikationer</span>
          <div className="text-gray-700 leading-relaxed line-clamp-2">{grant.qualifications}</div>
        </div>
      )}
    </div>
  );
};

export default GrantCard;
