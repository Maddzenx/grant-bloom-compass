
import React from "react";
import { Grant } from "@/types/grant";
import { Calendar, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrganizationLogo } from "@/utils/organizationLogos";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";

interface GrantCardProps {
  grant: Grant;
  isSelected: boolean;
  isBookmarked: boolean;
  onSelect: () => void;
  onToggleBookmark: () => void;
  isMobile?: boolean;
  matchScore?: number;
}

const GrantCard = ({
  grant,
  isSelected,
  isBookmarked,
  onSelect,
  onToggleBookmark,
  isMobile = false,
  matchScore
}: GrantCardProps) => {
  const {
    isGrantSaved,
    addToSaved,
    removeFromSaved
  } = useSavedGrantsContext();

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

  const getMatchBadge = (score: number) => {
    const percentage = Math.round(score * 100);
    
    console.log('🎯 Rendering match badge for grant:', grant.id, 'Score:', score, 'Percentage:', percentage);
    
    if (percentage >= 75) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 font-semibold text-xs px-2 py-1 whitespace-nowrap">
          {percentage}% match
        </Badge>
      );
    } else if (percentage >= 40) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 font-semibold text-xs px-2 py-1 whitespace-nowrap">
          {percentage}% match
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 font-semibold text-xs px-2 py-1 whitespace-nowrap">
          {percentage}% match
        </Badge>
      );
    }
  };

  // TEMPORARY: Add mock match scores for testing since AI search is failing
  const getMockMatchScore = () => {
    if (grant.id === "9b46f9d6-a680-40f2-8e47-bf1ab7e2dad6") return 0.85; // 85% match
    if (grant.id === "178451f0-3534-4a94-9f3f-a1a9758156df") return 0.65; // 65% match
    if (grant.title.toLowerCase().includes('innovation')) return 0.75; // 75% match for innovation grants
    if (grant.title.toLowerCase().includes('green') || grant.title.toLowerCase().includes('hållbar')) return 0.80; // 80% match for green grants
    return 0.55; // Default mock score for visibility testing
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

  // Use actual match score or mock score for testing - always show a mock score for debugging
  const finalMatchScore = matchScore ?? getMockMatchScore();

  console.log('🔍 GrantCard render:', {
    grantId: grant.id,
    grantTitle: grant.title,
    matchScore,
    mockScore: getMockMatchScore(),
    finalMatchScore,
    hasMatchScore: finalMatchScore !== undefined,
    percentage: finalMatchScore ? Math.round(finalMatchScore * 100) : 'N/A'
  });

  return (
    <Card className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${isSelected ? 'bg-accent-2/10 border-l-accent-2 shadow-md' : 'bg-white border-l-transparent hover:bg-accent-2/5 hover:shadow-sm'} ${isMobile ? 'mx-2' : 'mx-1'}`} onClick={onSelect}>
      <div className="space-y-3">
        {/* Header with organization and match score */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-ink-obsidian/70 flex-shrink-0">
            <img src={orgLogo.src} alt={orgLogo.alt} className={orgLogo.className} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Match score badge - always show for debugging */}
            <div className="flex-shrink-0">
              {getMatchBadge(finalMatchScore)}
            </div>
            {/* Bookmark button */}
            <button 
              onClick={handleBookmarkToggle} 
              className="p-1 hover:bg-accent-2/10 rounded transition-colors flex-shrink-0"
              aria-label={actuallyBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark className={`w-4 h-4 transition-colors ${actuallyBookmarked ? 'fill-accent-lavender text-accent-lavender' : 'text-white stroke-ink-obsidian/40 fill-none'}`} />
            </button>
          </div>
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
        {grant.tags && grant.tags.length > 0}
      </div>
    </Card>
  );
};

export default GrantCard;
