import React from "react";
import { GrantListItem } from "@/types/grant";
import { Badge } from "@/components/ui/badge";
import { getOrganizationLogo } from "@/utils/organizationLogos";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, Calendar, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { calculateGrantStatus } from "@/utils/grantHelpers";
import { useNavigate } from 'react-router-dom';
interface ConsolidatedGrantListProps {
  grants: GrantListItem[];
  selectedGrant: GrantListItem | null;
  onGrantSelect: (grant: GrantListItem) => void;
  onToggleBookmark: (grantId: string) => void;
  searchTerm: string;
  isMobile: boolean;
  aiMatches?: AIGrantMatch[];
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  scrollTick?: number;
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
  totalCount = 0,
  onPageChange = () => {},
  scrollTick = 0
}: ConsolidatedGrantListProps) => {
  const { isGrantSaved, addToSaved, removeFromSaved } = useSavedGrantsContext();
  const [savedFeedback, setSavedFeedback] = React.useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // Hide saved feedback when the list scrolls
  React.useEffect(() => {
    if (scrollTick > 0) {
      setSavedFeedback({});
    }
  }, [scrollTick]);
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
      return <Badge className="bg-[#d7f5d7] text-[#4a7c4a] border-[#c5e9c5] hover:bg-[#d7f5d7] font-medium text-xs px-2 py-1">{percentage}% match</Badge>;
    } else if (percentage >= 40) {
      return <Badge className="bg-[#f5e6d7] text-[#7c6a4a] border-[#e9dbc5] hover:bg-[#f5e6d7] font-medium text-xs px-2 py-1">{percentage}% match</Badge>;
    } else {
      return <Badge className="bg-[#f5d7d7] text-[#7c4a4a] border-[#e9c5c5] hover:bg-[#f5d7d7] font-medium text-xs px-2 py-1">{percentage}% match</Badge>;
    }
  };
  const handleBookmarkToggle = (e: React.MouseEvent, grant: GrantListItem) => {
    e.stopPropagation();
    const isSaved = isGrantSaved(grant.id);
    if (isSaved) {
      removeFromSaved(grant.id);
    } else {
      addToSaved(grant);
      setSavedFeedback(prev => ({ ...prev, [grant.id]: true }));
      setTimeout(() => setSavedFeedback(prev => ({ ...prev, [grant.id]: false })), 1800);
    }
    onToggleBookmark(grant.id);
  };

  // Generate smart page numbers with ellipsis
  const generatePageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  // Keyboard navigation for pagination
  React.useEffect(() => {
    if (isMobile || totalPages <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === 'ArrowLeft' && currentPage > 1) onPageChange(currentPage - 1);
        if (e.key === 'ArrowRight' && currentPage < totalPages) onPageChange(currentPage + 1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onPageChange, isMobile]);

  // Create a map for quick lookup of match scores
  const matchScoreMap = React.useMemo(() => new Map(aiMatches?.map(match => [match.grantId, match.relevanceScore]) || []), [aiMatches]);
  return <div className="bg-white">
      {grants.length === 0 ? <div className="text-center text-zinc-500 py-12 px-6">
          <div className="type-body">
            {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
          </div>
          <div className="type-caption mt-2">
            Försök att justera dina filter eller söktermer.
          </div>
        </div> : <>
          {/* Grant counter header */}
          {!isMobile && totalPages > 1 && totalCount > 0}
          {/* Full-width rows layout */}
          <div className="divide-y divide-zinc-100">
            {grants.map(grant => {
          const matchScore = matchScoreMap.get(grant.id);
          const shouldShowMatchScore = matchScore !== undefined && matchScore !== null && !isNaN(matchScore) && typeof matchScore === 'number';
          const actuallyBookmarked = isGrantSaved(grant.id);
          const isSelected = selectedGrant?.id === grant.id;

          // --- Status logic ---
          const status = calculateGrantStatus(grant.application_opening_date, grant.application_closing_date);
          // ---
                     const daysLeft = Math.max(0, Math.ceil((new Date(grant.application_closing_date || grant.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
           const actualDeadline = formatDate(grant.deadline);
           
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
          // No need to filter properties - using the grant object directly
          return <div key={grant.id} className={`p-4 cursor-pointer transition-all duration-200 hover:bg-zinc-50 ${isSelected ? 'bg-zinc-50' : ''}`} onClick={() => onGrantSelect(grant)}>
                  <div className="space-y-2">
                    {/* Header with organization logo and match score */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getOrganizationLogo(grant.organization) && <img src={getOrganizationLogo(grant.organization).src} alt={getOrganizationLogo(grant.organization).alt} className={getOrganizationLogo(grant.organization).className} />}
                      </div>
                      <div className="flex items-center gap-2">
                        {shouldShowMatchScore && <div className="flex-shrink-0">
                            {getMatchBadge(matchScore)}
                          </div>}
                        {status === 'open' && <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Öppen</Badge>}
                        {status === 'upcoming' && <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Kommande</Badge>}
                        {status === 'closed' && <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Stängt</Badge>}
                        <Button variant="ghost" size="sm" onClick={e => handleBookmarkToggle(e, grant)} className="h-11 w-11 p-0 flex items-center justify-center" aria-label={actuallyBookmarked ? 'Ta bort från sparade' : 'Spara bidrag'}>
                          <Bookmark className={`h-5 w-5 transition-colors ${isGrantSaved(grant.id) ? 'text-[#7D54F4] fill-[#7D54F4]' : 'text-zinc-400'}`} />
                        </Button>
                        {grant && (grant as any).originalUrl && (
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); window.open((grant as any).originalUrl, '_blank', 'noopener,noreferrer'); }} className="h-11 w-11 p-0 flex items-center justify-center" title="Källa" aria-label="Öppna källan">
                            <ExternalLink className="h-5 w-5 text-zinc-500" />
                          </Button>
                        )}
                        {savedFeedback[grant.id] && (
                          <span className="type-caption text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5 ml-1">
                            Sparat
                            <button
                              className="ml-2 underline text-green-700 hover:text-green-800"
                              onClick={(e) => { e.stopPropagation(); navigate('/saved'); }}
                              aria-label="Visa i Sparade"
                            >
                              Visa i Sparade
                            </button>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="type-body font-bold text-zinc-900 leading-tight font-['Source_Sans_3'] line-clamp-2 md:line-clamp-none">
                      {grant.title}
                    </h3>

                    {/* Meta row */}
                    <div className="flex items-center justify-between type-caption text-zinc-600 font-['Source_Sans_3']">
                      <span className="font-semibold text-gray-900 font-['Source_Sans_3']">{grant.fundingAmount || 'Belopp ej angivet'}</span>
                      <span>Sista ansökan: {actualDeadline || 'Okänt datum'}</span>
                    </div>

                    {/* Description */}
                    <p className="type-secondary text-zinc-600 leading-snug font-['Source_Sans_3'] line-clamp-3 md:line-clamp-none">
                      {grant.aboutGrant}
                    </p>

                    {/* Status component at bottom with smaller font and subtle separation */}
                                         {status === 'open' && <div className="mt-2 pt-2 border-t border-zinc-100 text-xs">
                         <div className="flex items-center gap-2 text-green-600">
                           <Clock className="h-3 w-3" />
                           <span>Öppen: {daysLeft} dagar kvar.</span>
                         </div>
                         <div className="flex items-center gap-2 text-green-600 mt-1">
                           <Calendar className="h-3 w-3" />
                           <span>Sök senast: {formatDate(grant.deadline)}</span>
                         </div>
                       </div>}
                                         {status === 'upcoming' && <div className="mt-2 pt-2 border-t border-zinc-100 text-xs">
                         <div className="flex items-center gap-2 text-orange-600">
                           <Clock className="h-3 w-3" />
                           <span>Öppnar {getDaysUntilOpening(grant.application_opening_date || '')}</span>
                         </div>
                         <div className="flex items-center gap-2 text-orange-600 mt-1">
                           <Calendar className="h-3 w-3" />
                           <span>Sök senast: {formatDate(grant.deadline)}</span>
                         </div>
                       </div>}
                    {status === 'closed' && <div className="mt-2 pt-2 border-t border-zinc-100 text-xs">
                        <div className="flex items-center gap-2 text-red-600">
                          <Calendar className="h-3 w-3" />
                          <span>Stängt: {actualDeadline}</span>
                        </div>
                      </div>}
                  </div>
                </div>;
        })}
          </div>

          {/* Pagination footer */}
          {(!isMobile && totalPages > 1) && (
            <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-600">
              <Button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 px-3 text-xs hover:bg-gray-100" aria-label="Föregående sida" title="Föregående sida (Alt + ←)">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {generatePageNumbers(currentPage, totalPages).map((pageNum, index) => (
                  typeof pageNum === 'number' ? (
                    <Button key={index} variant={pageNum === currentPage ? 'default' : 'ghost'} onClick={() => onPageChange(pageNum)} className={`h-8 w-8 p-0 text-xs font-medium ${pageNum === currentPage ? 'font-bold text-gray-900' : 'hover:bg-gray-100'}`}>
                      {pageNum}
                    </Button>
                  ) : (
                    <span key={index} className="px-2 py-1 text-gray-400">...</span>
                  )
                ))}
              </div>
              <Button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 px-3 text-xs hover:bg-gray-100" aria-label="Nästa sida" title="Nästa sida (Alt + →)">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>}
    </div>;
};

export default ConsolidatedGrantList;