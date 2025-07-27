import React from "react";
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
    startApplication(grant);
    console.log('🔄 After startApplication call, navigating to chat interface');
    navigate('/chat', {
      state: {
        grant
      }
    });
  };
  const handleReadMoreClick = () => {
    if (grant.originalUrl) {
      window.open(grant.originalUrl, '_blank', 'noopener,noreferrer');
    }
  };
  const handleBookmarkToggle = () => {
    const currentlyBookmarked = isGrantSaved(grant.id);
    console.log('🔖 Header bookmark toggle for grant:', grant.id, 'Currently saved:', currentlyBookmarked);
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
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Länk kopierad till urklipp!");
  };

  // Always use the context to determine the actual saved state
  const actuallyBookmarked = isGrantSaved(grant.id);

  // Always use subtitle (aboutGrant) for the header description
  const displayDescription = grant.aboutGrant;
  return <>
      {/* Status label and organization icon inline */}
      <div className="flex items-center gap-2 mb-2 pt-4">
        {status === 'open' && <Badge className="bg-green-100 text-green-800 hover:bg-green-200 w-fit">Öppen</Badge>}
        {status === 'upcoming' && <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 w-fit">Kommande</Badge>}
        {status === 'closed' && <Badge className="bg-red-100 text-red-800 hover:bg-red-200 w-fit">Stängd</Badge>}
        
        <span className="font-semibold text-gray-900 text-base">{grant.organization}</span>
      </div>

      {/* Desktop action buttons in top right corner */}
      {!isMobile && <div className="absolute top-4 right-4 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={handleBookmarkToggle}>
                <Bookmark className={`mr-2 h-4 w-4 ${actuallyBookmarked ? "fill-current text-[#8162F4]" : ""}`} />
                <span>{actuallyBookmarked ? "Sparat" : "Spara"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                <span>Dela</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={grant.originalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Läs mer</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>}

      {/* Title with wrapping allowed */}
      <div className="flex flex-row items-start justify-between gap-4 mt-2 mb-2 w-full">
        <h1 className="text-xl font-bold text-gray-900 leading-tight pr-4 flex-1 break-words">
          {grant.title}
        </h1>
      </div>
      
      {/* Description with full width - use subtitle when long_description is available */}
      {displayDescription && <p className="text-gray-700 mb-4 leading-snug text-sm w-full">
          {displayDescription}
        </p>}
      <div className="mb-4">
        
      </div>
      {/* About Grant section (if different from description) */}
      {grant.aboutGrant && grant.aboutGrant !== grant.description}
      {/* Action buttons */}
      <div className="flex items-center gap-2 mb-2 w-full my-0 py-[10px]">
        <Button onClick={handleReadMoreClick} disabled={!grant.originalUrl} className="flex-1 w-full text-black text-xs font-normal rounded bg-[#d7cffc] hover:bg-[#CEC5F9] h-8 shadow-none flex items-center justify-center gap-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-0 px-[2px] disabled:opacity-50 disabled:cursor-not-allowed">
          Läs mer
          <ExternalLink className="w-4 h-4 text-black" />
        </Button>
        <Button variant="outline" onClick={handleBookmarkToggle} className="flex-1 w-full text-xs font-normal rounded border-[#d7cffc] flex items-center gap-2 bg-white hover:bg-gray-50 h-8 shadow-none px-[2px] py-0">
          <Bookmark className={`w-4 h-4 ${actuallyBookmarked ? "fill-current text-[#8162F4]" : "text-gray-500"}`} />
          {actuallyBookmarked ? "Sparat" : "Spara bidrag"}
        </Button>
      </div>
    </>;
};
export default GrantNotionHeader;