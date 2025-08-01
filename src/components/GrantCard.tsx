import React from "react";
import { Grant } from "@/types/grant";
import { Calendar, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrganizationLogo } from "@/utils/organizationLogos";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import { calculateGrantStatus } from "@/utils/grantHelpers";

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
    // Removed expensive console logging to improve performance
    if (currentlyBookmarked) {
      removeFromSaved(grant.id);
    } else {
      addToSaved(grant);
    }

    // Call the parent's toggle function for UI updates
    onToggleBookmark();
  };

  // OPTIMIZED: Call isGrantSaved only once and cache the result
  const actuallyBookmarked = isGrantSaved(grant.id);

  // Show match score if it's a valid number (not null, undefined, or NaN)
  const shouldShowMatchScore = matchScore !== undefined && 
                              matchScore !== null && 
                              !isNaN(matchScore) && 
                              typeof matchScore === 'number';

  // Removed expensive console logging to improve performance

  // --- Status logic ---
  const status = calculateGrantStatus(grant.application_opening_date, grant.application_closing_date);
  // ---

  const getDaysLeftText = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - now.getTime();

    if (timeDiff < 0) {
      return 'Slut';
    }

    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return `${days} dagar kvar`;
  };

  const getDaysUntilOpening = (openingDate: string) => {
    const now = new Date();
    const openingDateObj = new Date(openingDate);
    const timeDiff = openingDateObj.getTime() - now.getTime();

    if (timeDiff < 0) {
      return 'Öppet';
    }

    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return `om ${days} dagar`;
  };

  return (
    <Card className={`p-6 min-h-[120px] rounded-lg shadow-md cursor-pointer transition-all duration-200 border-l-4 ${isSelected ? 'bg-accent-2/10 border-l-accent-2' : 'bg-white border-l-transparent hover:bg-accent-2/5'} ${isMobile ? 'mx-2' : 'mx-1'}`} onClick={onSelect}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-ink-obsidian/70 flex-shrink-0">
            <img src={orgLogo.src} alt={orgLogo.alt} className="w-8 h-8 object-contain" />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {shouldShowMatchScore && (
              <div className="flex-shrink-0">
                {getMatchBadge(matchScore)}
              </div>
            )}
            {status === 'open' && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Öppet</Badge>
            )}
            {status === 'upcoming' && (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Kommande</Badge>
            )}
            {status === 'closed' && (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Stängd</Badge>
            )}
            {/* Bookmark button hidden */}
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs mt-2">
          <span className="font-semibold text-accent-1">
            {grant.fundingAmount}
          </span>
          <div className="flex flex-col md:flex-row md:items-center gap-2 text-ink-obsidian/60">
            {status === 'open' && grant.deadline && (
              <span className="flex items-center gap-1 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Öppen: {getDaysLeftText(grant.deadline)}
              </span>
            )}
            {status === 'upcoming' && grant.application_opening_date && (
              <span className="flex items-center gap-1 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Öppnar {getDaysUntilOpening(grant.application_opening_date)}
              </span>
            )}
            {grant.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Sök senast: <span className="font-semibold">{formatDate(grant.deadline)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {grant.tags && grant.tags.length > 0}
      </div>
    </Card>
  );
};

export default GrantCard;
