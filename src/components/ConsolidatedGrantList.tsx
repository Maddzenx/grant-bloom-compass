import React from "react";
import { GrantListItem } from "@/types/grant";
import { Badge } from "@/components/ui/badge";
import { getOrganizationLogo } from "@/utils/organizationLogos";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import { AIGrantMatch } from "@/hooks/useAIGrantSearch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { calculateGrantStatus } from "@/utils/grantHelpers";
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
  onPageChange = () => {}
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
      return <Badge className="bg-[#d7f5d7] text-[#4a7c4a] border-[#c5e9c5] hover:bg-[#d7f5d7] font-medium text-xs px-2 py-1">
          {percentage}% match
        </Badge>;
    } else if (percentage >= 40) {
      return <Badge className="bg-[#f5e6d7] text-[#7c6a4a] border-[#e9dbc5] hover:bg-[#f5e6d7] font-medium text-xs px-2 py-1">
          {percentage}% match
        </Badge>;
    } else {
      return <Badge className="bg-[#f5d7d7] text-[#7c4a4a] border-[#e9c5c5] hover:bg-[#f5d7d7] font-medium text-xs px-2 py-1">
          {percentage}% match
        </Badge>;
    }
  };
  const handleBookmarkToggle = (e: React.MouseEvent, grant: GrantListItem) => {
    e.stopPropagation();
    const isSaved = isGrantSaved(grant.id);
    if (isSaved) {
      removeFromSaved(grant.id);
    } else {
      addToSaved(grant);
    }
    onToggleBookmark(grant.id);
  };

  // Generate smart page numbers with ellipsis
  const generatePageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({
        length: total
      }, (_, i) => i + 1);
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
        switch (e.key) {
          case 'Home':
            e.preventDefault();
            if (currentPage > 1) onPageChange(1);
            break;
          case 'End':
            e.preventDefault();
            if (currentPage < totalPages) onPageChange(totalPages);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (currentPage > 1) onPageChange(currentPage - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (currentPage < totalPages) onPageChange(currentPage + 1);
            break;
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onPageChange, isMobile]);

  // Create a map for quick lookup of match scores
  const matchScoreMap = React.useMemo(() => new Map(aiMatches?.map(match => [match.grantId, match.relevanceScore]) || []), [aiMatches]);
  return <div className="bg-white">
      {grants.length === 0 ? <div className="text-center text-ink-secondary py-12 px-6">
          <div className="text-base">
            {searchTerm ? "Inga bidrag hittades för din sökning." : "Inga bidrag tillgängliga."}
          </div>
          <div className="text-sm mt-2">
            Försök att justera dina filter eller söktermer.
          </div>
        </div> : <>
          {/* Grant counter header */}
          {!isMobile && totalPages > 1 && totalCount > 0}
          {/* Full-width rows layout */}
          <div className="divide-y divide-gray-100">
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
          return <div key={grant.id} className={`p-4 cursor-pointer transition-all duration-200 hover:bg-[#F2F2F2] ${isSelected ? 'bg-[#F2F2F2]' : ''}`} onClick={() => onGrantSelect(grant)}>
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
                        <Button variant="ghost" size="sm" onClick={e => {
                    e.stopPropagation();
                    handleBookmarkToggle(e, grant);
                  }} className="h-7 px-1">
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
                      
                    </div>

                    {/* Status component at bottom with smaller font and subtle separation */}
                                         {status === 'open' && <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
                         <div className="flex items-center gap-2 text-green-600">
                           <Clock className="h-3 w-3" />
                           <span>Öppen: {daysLeft} dagar kvar.</span>
                         </div>
                         <div className="flex items-center gap-2 text-green-600 mt-1">
                           <Calendar className="h-3 w-3" />
                           <span>Sök senast: {formatDate(grant.deadline)}</span>
                         </div>
                       </div>}
                                         {status === 'upcoming' && <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
                         <div className="flex items-center gap-2 text-orange-600">
                           <Clock className="h-3 w-3" />
                           <span>Öppnar {getDaysUntilOpening(grant.application_opening_date || '')}</span>
                         </div>
                         <div className="flex items-center gap-2 text-orange-600 mt-1">
                           <Calendar className="h-3 w-3" />
                           <span>Sök senast: {formatDate(grant.deadline)}</span>
                         </div>
                       </div>}
                    {status === 'closed' && <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
                        <div className="flex items-center gap-2 text-red-600">
                          <Calendar className="h-3 w-3" />
                          <span>Stängt: {actualDeadline}</span>
                        </div>
                      </div>}
                  </div>
                </div>;
        })}
          </div>
          
          {/* Enhanced Pagination Controls */}
          {!isMobile && totalPages > 1 && <div className="border-t border-gray-100 bg-gray-50">
              {/* Pagination Info Bar */}
              <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  
                </div>
                <div className="flex items-center gap-2">
                  
                </div>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-2 py-4 px-6">
                {/* Previous Page Button */}
                <Button variant="ghost" size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 px-3 text-xs hover:bg-gray-100" aria-label="Föregående sida" title="Föregående sida (Alt + ←)">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Föregående
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-4">
                  {generatePageNumbers(currentPage, totalPages).map((pageNum, index) => 
                    pageNum === '...' ? 
                      <span key={index} className="px-2 py-1 text-gray-400">...</span> : 
                      <Button 
                        key={index}
                        variant={pageNum === currentPage ? "ghost" : "ghost"} 
                        size="sm" 
                        onClick={() => onPageChange(pageNum as number)} 
                        className={`h-8 w-8 p-0 text-xs font-medium ${pageNum === currentPage ? 'font-bold text-gray-900' : 'hover:bg-gray-100'}`} 
                        aria-label={`Sida ${pageNum}`} 
                        aria-current={pageNum === currentPage ? "page" : undefined}
                      >
                        {pageNum}
                      </Button>
                  )}
                </div>
                
                {/* Next Page Button */}
                <Button variant="ghost" size="sm" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 px-3 text-xs hover:bg-gray-100" aria-label="Nästa sida" title="Nästa sida (Alt + →)">
                  Nästa
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {/* Quick Jump Controls */}
              
            </div>}
        </>}
    </div>;
};
export default ConsolidatedGrantList;