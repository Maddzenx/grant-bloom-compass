
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
          ? 'bg-accent-lavender/10 border-l-accent-lavender shadow-md' 
          : 'bg-white border-l-transparent hover:bg-accent-lavender/5 hover:shadow-sm'
      } ${isMobile ? 'mx-2' : 'mx-1'}`} 
      onClick={onSelect}
    >
      <div className="space-y-3">
        {/* Header with organization */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-xs text-ink-obsidian/70">
            <img 
              src={orgLogo.src} 
              alt={orgLogo.alt} 
              className={orgLogo.className} 
            />
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }} 
            className="p-1 hover:bg-accent-lavender/10 rounded transition-colors"
          >
            <Bookmark 
              className={`w-4 h-4 ${
                isBookmarked 
                  ? 'fill-accent-lavender text-accent-lavender' 
                  : 'text-ink-obsidian/40'
              }`} 
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-ink-obsidian text-sm leading-tight line-clamp-2">
          {grant.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-ink-obsidian/70 line-clamp-2 leading-relaxed">
          {grant.description}
        </p>

        {/* Footer with funding and deadline */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-highlight-amber">
            {grant.fundingAmount}
          </span>
          <div className="flex items-center gap-1 text-ink-obsidian/60">
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
                className="px-2 py-1 bg-accent-lavender/10 text-ink-obsidian/80 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {grant.tags.length > 2 && (
              <span className="text-xs text-ink-obsidian/50">
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
