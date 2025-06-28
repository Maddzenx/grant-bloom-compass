
import React from "react";
import { Grant } from "@/types/grant";
import { Calendar, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getOrganizationLogo } from "@/utils/organizationLogos";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";

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
  const { isGrantSaved, addToSaved, removeFromSaved } = useSavedGrantsContext();
  
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

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const currentlyBookmarked = isGrantSaved(grant.id);
    console.log('🔖 GrantCard bookmark toggle for grant:', grant.id, 'Currently saved:', currentlyBookmarked);
    
    if (currentlyBookmarked) {
      console.log('🗑️ Removing from saved');
      removeFromSaved(grant.id);
    } else {
      console.log('📝 Adding to saved');
      addToSaved(grant);
    }
    
    // Call the parent's toggle function for UI updates
    onToggleBookmark();
  };

  // Always use the context to determine the actual saved state
  const actuallyBookmarked = isGrantSaved(grant.id);

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        isSelected 
          ? 'bg-accent-2/10 border-l-accent-2 shadow-md' 
          : 'bg-white border-l-transparent hover:bg-accent-2/5 hover:shadow-sm'
      } ${isMobile ? 'mx-2' : 'mx-1'}`} 
      onClick={onSelect}
    >
      <div className="space-y-3">
        {/* Header with organization */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-xs text-ink-obsidian/70">
            <img src={orgLogo.src} alt={orgLogo.alt} className={orgLogo.className} />
          </div>
          <button 
            onClick={handleBookmarkToggle}
            className="p-1 hover:bg-accent-2/10 rounded transition-colors"
          >
            <Bookmark 
              className={`w-4 h-4 ${
                actuallyBookmarked 
                  ? 'fill-accent-2 text-accent-2' 
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
          <span className="font-semibold text-accent-1">
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
                className="px-2 py-1 bg-accent-2/20 text-accent-2 text-xs rounded-full border border-accent-2/30"
              >
                {tag}
              </span>
            ))}
            {grant.tags.length > 2 && (
              <span className="px-2 py-1 bg-accent-2/10 text-ink-obsidian/60 text-xs rounded-full">
                +{grant.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default GrantCard;
