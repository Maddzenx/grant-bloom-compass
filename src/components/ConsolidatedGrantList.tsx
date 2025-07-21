import React from "react";
import { Grant } from "@/types/grant";
import { Badge } from "@/components/ui/badge";
import { getOrganizationLogo } from "@/utils/organizationLogos";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface ConsolidatedGrantListProps {
  grants: Grant[];
  selectedGrant: Grant | null;
  onGrantSelect: (grant: Grant) => void;
  onToggleBookmark: (grantId: string) => void;
  searchTerm: string;
  isMobile: boolean;
  aiMatches?: AIGrantMatch[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ConsolidatedGrantList = ({
  grants,
  selectedGrant,
  onGrantSelect,
  onToggleBookmark,
  searchTerm,
  isMobile,
  aiMatches,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
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
        <Badge className="bg-[#d7f5d7] text-[#4a7c4a] border-[#c5e9c5] hover:bg-[#d7f5d7] font-medium text-xs px-2 py-1">
          {percentage}% match
        </Badge>
      );
    } else if (percentage >= 40) {
      return (
        <Badge className="bg-[#f5e6d7] text-[#7c6a4a] border-[#e9dbc5] hover:bg-[#f5e6d7] font-medium text-xs px-2 py-1">
          {percentage}% match
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-[#f5d7d7] text-[#7c4a4a] border-[#e9c5c5] hover:bg-[#f5d7d7] font-medium text-xs px-2 py-1">
          {percentage}% match
        </Badge>
      );
    }
  };

  const handleBookmarkToggle = (e: React.MouseEvent, grant: Grant) => {
    e.stopPropagation();
    const isSaved = isGrantSaved(grant.id);
    if (isSaved) {
      removeFromSaved(grant.id);
    } else {
      addToSaved(grant);
    }
    onToggleBookmark(grant.id);
  };

  // Create a map for quick lookup of match scores
  const matchScoreMap = React.useMemo(() => 
    new Map(aiMatches?.map(match => [match.grantId, match.relevanceScore]) || [])
  , [aiMatches]);

  return (
    <div className="bg-white">
      {grants.length === 0 ? (
        <div className="text-center text-ink-secondary py-12 px-6">
          <div className="text-base">
            {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
          </div>
          <div className="text-sm mt-2">
            Försök att justera dina filter eller söktermer.
          </div>
        </div>
      ) : (
        <>
          {/* Full-width rows layout */}
          <div className="divide-y divide-gray-100">
            {grants.map((grant) => {
              const matchScore = matchScoreMap.get(grant.id);
              const shouldShowMatchScore = matchScore !== undefined && 
                                          matchScore !== null && 
                                          !isNaN(matchScore) && 
                                          typeof matchScore === 'number';
              const actuallyBookmarked = isGrantSaved(grant.id);
              const isSelected = selectedGrant?.id === grant.id;

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
              console.log('Status:', status, grant.title, grant.opens_at, grant.deadline);

              const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
              const actualDeadline = formatDate(grant.deadline);

              return (
                <div
                  key={grant.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    isSelected ? 'bg-[#F6F6F6]' : ''
                  }`}
                  onClick={() => onGrantSelect(grant)}
                >
                  <div className="space-y-2">
                    {/* Header with organization logo and match score */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getOrganizationLogo(grant.organization) && (
                          <img 
                            src={getOrganizationLogo(grant.organization).src} 
                            alt={getOrganizationLogo(grant.organization).alt} 
                            className={getOrganizationLogo(grant.organization).className}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {shouldShowMatchScore && (
                          <div className="flex-shrink-0">
                            {getMatchBadge(matchScore)}
                          </div>
                        )}
                        {status === 'open' && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Öppen</Badge>
                        )}
                        {status === 'upcoming' && (
                          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Kommande</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmarkToggle(e, grant);
                          }}
                          className="h-7 px-1"
                        >
                          <Bookmark className={`h-4 w-4 transition-colors ${isGrantSaved(grant.id) ? 'text-[#8162F4] fill-[#8162F4]' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 leading-tight">
                      {grant.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-snug">
                      {grant.aboutGrant}
                    </p>

                    {/* Footer with funding and deadline */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-900">
                        {grant.fundingAmount}
                      </span>
                      <span className="text-gray-500">
                        Deadline: {actualDeadline}
                      </span>
                    </div>

                    {/* Status component at bottom with smaller font and subtle separation */}
                    {/* {status === 'open' && (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
                        <div className="flex items-center gap-2 text-green-600">
                          <Clock className="h-3 w-3" />
                          <span>Öppen: {daysLeft} dagar kvar.</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Sök senast: {deadlineDate.toISOString().split('T')[0]}</span>
                        </div>
                      </div>
                    )}
                    {status === 'upcoming' && (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
                        <div className="flex items-center gap-2 text-amber-600">
                          <Calendar className="h-3 w-3" />
                          <span>Kommande: Öppnar för ansökningar {opensAt.toISOString().split('T')[0]}</span>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination Controls */}
          {!isMobile && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-4 px-6 border-t border-gray-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
                aria-label="Föregående sida"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-sm text-gray-700 min-w-[90px] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
                aria-label="Nästa sida"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConsolidatedGrantList;
