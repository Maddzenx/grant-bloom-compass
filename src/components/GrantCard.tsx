
import React from "react";
import { Grant } from "@/types/grant";
import { Calendar, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const orgLogo = getOrganizationLogo(grant.organization);

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        isSelected 
          ? 'bg-blue-50 border-l-blue-500 shadow-md' 
          : 'bg-white border-l-transparent hover:bg-gray-50 hover:shadow-sm'
      } ${isMobile ? 'mx-2' : 'mx-1'}`}
      onClick={onSelect}
    >
      <div className="space-y-3">
        {/* Header with organization */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <img 
              src={orgLogo.src} 
              alt={orgLogo.alt} 
              className={orgLogo.className}
            />
            <span className="font-medium">{grant.organization}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Bookmark 
              className={`w-4 h-4 ${
                isBookmarked ? 'fill-blue-600 text-blue-600' : 'text-gray-400'
              }`} 
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
          {grant.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {grant.description}
        </p>

        {/* Footer with funding and deadline */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-green-600">
            {grant.fundingAmount}
          </span>
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(grant.deadline)}</span>
          </div>
        </div>

        {/* Tags */}
        {grant.tags && grant.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {grant.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {grant.tags.length > 2 && (
              <span className="text-xs text-gray-400">
                +{grant.tags.length - 2} mer
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default GrantCard;
