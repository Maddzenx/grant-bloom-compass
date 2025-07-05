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
    
    console.log('🎯 Creating match badge for grant:', grant.id, {
      rawScore: score,
      percentage,
      grantTitle: grant.title.substring(0, 30) + '...'
    });
    
    if (percentage >= 75) {
      return (
        <Badge className="bg-[#d7f5d7] text-[#4a7c4a] border-[#c5e9c5] hover:bg-[#d7f5d7] font-semibold text-xs px-2 py-1 whitespace-nowrap">
          {percentage}% match
        </Badge>
      );
    } else if (percentage >= 40) {
      return (
        <Badge className="bg-[#f5e6d7] text-[#7c6a4a] border-[#e9dbc5] hover:bg-[#f5e6d7] font-semibold text-xs px-2 py-1 whitespace-nowrap">
          {percentage}% match
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-[#f5d7d7] text-[#7c4a4a] border-[#e9c5c5] hover:bg-[#f5d7d7] font-semibold text-xs px-2 py-1 whitespace-nowrap">
          {percentage}% match
        </Badge>
      );
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

  // Show match score if it's a valid number (not null, undefined, or NaN)
  const shouldShowMatchScore = matchScore !== undefined && 
                              matchScore !== null && 
                              !isNaN(matchScore) && 
                              typeof matchScore === 'number';

  console.log('🔍 GrantCard render decision:', {
    grantId: grant.id,
    grantTitle: grant.title.substring(0, 30) + '...',
    matchScore,
    shouldShowMatchScore,
    matchScoreType: typeof matchScore,
    isNaN: isNaN(matchScore as number),
    percentage: shouldShowMatchScore ? Math.round(matchScore * 100) : 'N/A'
  });

  // --- Status logic ---
  const today = new Date();
  const opensAt = new Date(grant.opens_at);
  // Try to parse deadline as ISO, fallback to Swedish date
  let deadlineDate: Date;
  try {
    deadlineDate = new Date(grant.deadline);
    if (isNaN(deadlineDate.getTime())) {
      // Fallback for Swedish format (e.g., '15 mars 2025')
      const [day, monthName, year] = grant.deadline.split(' ');
      const months = ['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
      const month = months.findIndex(m => m === monthName.toLowerCase());
      deadlineDate = new Date(Number(year), month, Number(day));
    }
  } catch {
    deadlineDate = new Date();
  }
  let status: 'open' | 'upcoming' | 'closed' = 'closed';
  if (today >= opensAt && today <= deadlineDate) status = 'open';
  else if (today < opensAt) status = 'upcoming';
  // ---

  return (
    <Card className={`p-6 min-h-[120px] rounded-xl shadow-md cursor-pointer transition-all duration-200 border-l-4 ${isSelected ? 'bg-accent-2/10 border-l-accent-2' : 'bg-white border-l-transparent hover:bg-accent-2/5'} ${isMobile ? 'mx-2' : 'mx-1'}`} onClick={onSelect}>
      <div className="space-y-3">
        {/* Status component */}
        <div className="mb-1">
          {status === 'open' && (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Öppen:
              </span>
              <span>{Math.max(0, Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))} dagar kvar.</span>
              <span className="inline-flex items-center gap-1 ml-4">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Sök senast: {grant.deadline}
              </span>
            </div>
          )}
          {status === 'upcoming' && (
            <div className="flex items-center gap-2 text-yellow-700 text-sm font-medium">
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Kommande:
              </span>
              <span>Öppnar för ansökningar {grant.opens_at}</span>
            </div>
          )}
        </div>
        {/* Header with organization and match score */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-ink-obsidian/70 flex-shrink-0">
            <img src={orgLogo.src} alt={orgLogo.alt} className={orgLogo.className} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Match score badge - only show when AI search has been used and score is valid */}
            {shouldShowMatchScore && (
              <div className="flex-shrink-0">
                {getMatchBadge(matchScore)}
              </div>
            )}
            {/* Bookmark button */}
            <button 
              onClick={handleBookmarkToggle} 
              className="p-1 hover:bg-accent-2/10 rounded transition-colors flex-shrink-0"
              aria-label={actuallyBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark className={`w-4 h-4 transition-colors ${actuallyBookmarked ? 'text-[#8162F4] fill-[#8162F4]' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-ink-obsidian text-base leading-tight break-words">
          {grant.title}
        </h3>

        {/* Description - now showing aboutGrant which contains subtitle from database */}
        <p className="text-sm text-ink-obsidian/70 leading-relaxed break-words">
          {grant.aboutGrant}
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
