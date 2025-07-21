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
      <div className="flex items-center gap-2 mb-2 py-[5px]">
        <img src={orgLogo.src} alt={orgLogo.alt} className="w-8 h-8 rounded-md bg-white object-contain shadow-sm" />
        
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
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          öppen, kommande
        </span>
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