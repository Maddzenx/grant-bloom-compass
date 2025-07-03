
import React from "react";
import { Grant } from "@/types/grant";
import { Calendar, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getOrganizationLogo } from "@/utils/organizationLogos";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";

interface ConsolidatedGrantListProps {
  grants: Grant[];
  selectedGrant: Grant | null;
  onGrantSelect: (grant: Grant) => void;
  onToggleBookmark: (grantId: string) => void;
  searchTerm: string;
  isMobile: boolean;
  aiMatches?: AIGrantMatch[];
}

const ConsolidatedGrantList = ({
  grants,
  selectedGrant,
  onGrantSelect,
  onToggleBookmark,
  searchTerm,
  isMobile,
  aiMatches
}: ConsolidatedGrantListProps) => {
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
    
    if (percentage >= 75) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 font-medium text-xs px-2 py-1">
          {percentage}% match
        </Badge>
      );
    } else if (percentage >= 40) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 font-medium text-xs px-2 py-1">
          {percentage}% match
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 font-medium text-xs px-2 py-1">
          {percentage}% match
        </Badge>
      );
    }
  };

  // Create a map of grant IDs to match scores for quick lookup
  const matchScoreMap = React.useMemo(() => {
    if (!aiMatches || aiMatches.length === 0) {
      return new Map();
    }
    const map = new Map<string, number>();
    aiMatches.forEach(match => {
      const validScore = match.relevanceScore !== null && match.relevanceScore !== undefined ? match.relevanceScore : 0.25;
      map.set(match.grantId, validScore);
    });
    return map;
  }, [aiMatches]);

  const handleBookmarkToggle = (e: React.MouseEvent, grant: Grant) => {
    e.stopPropagation();
    const currentlyBookmarked = isGrantSaved(grant.id);
    if (currentlyBookmarked) {
      removeFromSaved(grant.id);
    } else {
      addToSaved(grant);
    }
    onToggleBookmark(grant.id);
  };

  return (
    <div className="bg-white">
      {grants.length === 0 ? (
        <div className="text-center text-ink-secondary py-12 px-6">
          <div className="text-base">
            {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {grants.map((grant) => {
            const matchScore = matchScoreMap.get(grant.id);
            const shouldShowMatchScore = matchScore !== undefined && 
                                        matchScore !== null && 
                                        !isNaN(matchScore) && 
                                        typeof matchScore === 'number';
            const orgLogo = getOrganizationLogo(grant.organization);
            const actuallyBookmarked = isGrantSaved(grant.id);
            const isSelected = selectedGrant?.id === grant.id;

            return (
              <div
                key={grant.id}
                className={`p-5 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  isSelected ? 'bg-[#F6F6F6]' : ''
                }`}
                onClick={() => onGrantSelect(grant)}
              >
                {/* Header with organization logo and match score */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={orgLogo.src} 
                      alt={orgLogo.alt} 
                      className={orgLogo.className}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Match score badge */}
                    {shouldShowMatchScore && (
                      <div className="flex-shrink-0">
                        {getMatchBadge(matchScore)}
                      </div>
                    )}
                    {/* Bookmark button */}
                    <button 
                      onClick={(e) => handleBookmarkToggle(e, grant)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                      aria-label={actuallyBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      <Bookmark className={`w-4 h-4 transition-colors ${
                        actuallyBookmarked 
                          ? 'fill-accent-lavender text-accent-lavender' 
                          : 'text-gray-400 fill-none'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-ink-obsidian mb-2 leading-tight">
                  {grant.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-ink-secondary mb-3 leading-relaxed line-clamp-2">
                  {grant.aboutGrant}
                </p>

                {/* Footer with funding and deadline */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-accent-1">
                    {grant.fundingAmount}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-ink-secondary">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Ansökan stänger {formatDate(grant.deadline)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsolidatedGrantList;
