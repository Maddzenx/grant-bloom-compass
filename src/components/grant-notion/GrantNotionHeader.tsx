import React from "react";
import { Calendar, Bookmark, X, ExternalLink, MoreHorizontal, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import SortingControls, { SortOption } from "@/components/SortingControls";
import { getOrganizationLogo } from '@/utils/organizationLogos';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface GrantNotionHeaderProps {
  grant: Grant;
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
  const today = new Date();
  const opensAt = new Date(grant.opens_at);
  let deadlineDate: Date;
  try {
    deadlineDate = new Date(grant.deadline);
    if (isNaN(deadlineDate.getTime())) {
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
  return <>
      {/* Organization icon and name inline at the top left */}
      <div className={`flex items-center gap-2 mb-2 ${isMobile ? '' : ''}`}>
        <img src={orgLogo.src} alt={orgLogo.alt} className="w-8 h-8 object-contain" />
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBookmarkToggle}>
                <Bookmark className={`mr-2 h-4 w-4 ${actuallyBookmarked ? "fill-current text-[#8162F4]" : ""}`} />
                <span>{actuallyBookmarked ? "Sparat" : "Spara"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Dela</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleApplyClick}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Ansök</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>}

      {/* Status label above title */}
      <div className="mb-2">
        {status === 'open' && (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 w-fit">Öppen</Badge>
        )}
        {status === 'upcoming' && (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 w-fit">Kommande</Badge>
        )}
      </div>

      {/* Title in a flex row, no SortingControls */}
      <div className="flex flex-row items-start justify-between gap-4 mt-2 mb-2 w-full">
        <h1 className="text-xl font-bold text-gray-900 leading-tight pr-4 flex-1 truncate">
          {grant.title}
        </h1>
      </div>
      {/* Description from database */}
      {grant.description && <p className="text-gray-700 mb-4 leading-snug max-w-[80ch] text-sm w-full">
          {grant.description}
        </p>}
      <div className="mb-4">
        
      </div>
      {/* About Grant section (if different from description) */}
      {grant.aboutGrant && grant.aboutGrant !== grant.description}
      {/* Action buttons */}
      <div className="flex items-center gap-2 mb-2 w-full">
        <Button onClick={handleApplyClick} className="flex-1 w-full text-black text-xs font-normal rounded bg-[#d7cffc] hover:bg-[#CEC5F9] h-8 shadow-none flex items-center justify-center gap-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-0 px-[2px]">
          Ansök om bidrag
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