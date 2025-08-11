import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bookmark, ExternalLink, MoreHorizontal, Send } from "lucide-react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import SortingControls, { SortOption } from "@/components/SortingControls";
import { toast } from "sonner";
import { calculateGrantStatus } from "@/utils/grantHelpers";
import { getOrganizationLogo } from '@/utils/organizationLogos';
import InterestPage from "@/components/InterestPage";
interface GrantNotionHeaderProps {
  grant: GrantDetailsType;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isMobile?: boolean;
  sortBy?: SortOption;
  onSortChange?: (sortBy: SortOption) => void;
  onBackToList?: () => void;
}
const GrantNotionHeader = ({
  grant,
  isBookmarked,
  onToggleBookmark,
  isMobile = false,
  sortBy = "default",
  onSortChange = () => {}
}: GrantNotionHeaderProps) => {
  const navigate = useNavigate();
  const [showInterestPage, setShowInterestPage] = useState(false);
  const {
    startApplication,
    addToSaved,
    removeFromSaved,
    isGrantSaved
  } = useSavedGrantsContext();
  const orgLogo = getOrganizationLogo(grant.organization);
  // --- Status logic ---
  const status = calculateGrantStatus(grant.application_opening_date, grant.application_closing_date);
  // ---

  const handleApplyClick = () => {
    console.log('🎯 Apply button clicked in header for grant:', grant.id, grant.title);
    setShowInterestPage(true);
  };
  const handleReadMoreClick = () => {
    if (grant.originalUrl) {
      window.open(grant.originalUrl, '_blank', 'noopener,noreferrer');
    }
  };
  const handleBookmarkToggle = () => {
    const currentlyBookmarked = isGrantSaved(grant.id);
    // Removed expensive console logging to improve performance
    if (currentlyBookmarked) {
      removeFromSaved(grant.id);
    } else {
      addToSaved(grant);
    }
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Länk kopierad till urklipp!");
  };

  // Always use the context to determine the actual saved state
  const actuallyBookmarked = isGrantSaved(grant.id);

  // Always use subtitle (aboutGrant) for the header description
  const displayDescription = grant.aboutGrant;
  return <>
      {/* Mobile menu moved to SheetContent level */}

      {/* Status label and organization icon inline */}
      <div className="flex items-center gap-2 mb-2 pt-4">
        {status === 'open' && <Badge className="bg-green-100 text-green-800 hover:bg-green-200 w-fit text-sm px-3 py-1.5">Öppen</Badge>}
        {status === 'upcoming' && <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 w-fit text-sm px-3 py-1.5">Kommande</Badge>}
        {status === 'closed' && <Badge className="bg-red-100 text-red-800 hover:bg-red-200 w-fit text-sm px-3 py-1.5">Stängd</Badge>}
        
        <span className="font-semibold text-gray-900 text-lg font-['Source_Sans_3']">{grant.organization}</span>
      </div>

      {/* Desktop action buttons in top right corner */}
      {!isMobile && <div className="absolute top-4 right-4 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-lg p-1 min-w-[180px]">
              <DropdownMenuItem onClick={handleBookmarkToggle} className="!bg-transparent !text-gray-700 hover:!bg-gray-50 hover:!text-gray-900 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-b-0 rounded-md px-3 py-2.5">
                <Bookmark className={`h-4 w-4 mr-2 ${actuallyBookmarked ? 'fill-current text-[#7D54F4]' : 'text-gray-600'}`} />
                <span className="text-sm font-medium font-['Source_Sans_3']">{actuallyBookmarked ? 'Ta bort från sparade' : 'Spara bidrag'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="!bg-transparent !text-gray-700 hover:!bg-gray-50 hover:!text-gray-900 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-b-0 rounded-md px-3 py-2.5">
                <Send className="h-4 w-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium font-['Source_Sans_3']">Dela</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="!bg-transparent !text-gray-700 hover:!bg-gray-50 hover:!text-gray-900 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-b-0 rounded-md px-3 py-2.5">
                <a href={grant.originalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                  <ExternalLink className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium">Läs mer</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>}

      {/* Title with wrapping allowed */}
      <div className="flex flex-row items-start justify-between gap-4 mt-2 mb-2 w-full">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight pr-4 flex-1 break-words">
          {grant.title}
        </h1>
      </div>
      
      {/* Description with full width - use subtitle when long_description is available */}
      {displayDescription && <p className="text-gray-700 mb-4 leading-snug text-base w-full">
          {displayDescription}
        </p>}
      <div className="mb-4">
        
      </div>
      {/* About Grant section (if different from description) */}
      {grant.aboutGrant && grant.aboutGrant !== grant.description}
      {/* Action buttons */}
      <div className="flex flex-col gap-3 mb-4 w-full my-0 py-[10px]">
        {/* Primary CTA Button */}
        <Button 
          onClick={handleApplyClick} 
          className="w-full text-black font-normal text-base py-3 rounded-lg transition-all duration-200 flex items-center justify-center hover:bg-[#E5DEFD]"
          style={{ backgroundColor: '#CEC5F9' }}
        >
          Skapa din ansökan direkt
        </Button>
        
        {/* Secondary buttons */}
        <div className="flex items-center gap-2 w-full">
          <Button onClick={handleReadMoreClick} disabled={!grant.originalUrl} className="flex-1 w-full text-black text-sm font-normal rounded-lg bg-white hover:bg-gray-50 h-10 shadow-none flex items-center justify-center gap-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-0 px-[2px] disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200">
            Läs mer
            <ExternalLink className="w-5 h-5 text-black" />
          </Button>
          {/* Bookmark button hidden */}
        </div>
      </div>
      
      {/* Interest Page Modal */}
      {showInterestPage && (
        <InterestPage onClose={() => setShowInterestPage(false)} />
      )}
    </>;
};
export default GrantNotionHeader;