import React from "react";
import { Calendar, Bookmark, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import SortingControls, { SortOption } from "@/components/SortingControls";

interface GrantNotionHeaderProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isMobile?: boolean;
  onBackToList?: () => void;
  sortBy?: SortOption;
  onSortChange?: (sortBy: SortOption) => void;
}

const GrantNotionHeader = ({
  grant,
  isBookmarked,
  onToggleBookmark,
  isMobile = false,
  onBackToList,
  sortBy = "default",
  onSortChange = () => {},
}: GrantNotionHeaderProps) => {
  const navigate = useNavigate();
  const {
    startApplication,
    addToSaved,
    removeFromSaved,
    isGrantSaved
  } = useSavedGrantsContext();

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

  // Always use the context to determine the actual saved state
  const actuallyBookmarked = isGrantSaved(grant.id);

  return <div className="w-full px-0 md:px-4 pb-4 rounded-none pt-4 relative">
    {/* Close button for desktop in top right corner */}
    {!isMobile && onBackToList && (
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToList}
          className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )}

    {/* Title and SortingControls in a flex row */}
    <div className="flex flex-row items-start justify-between gap-4 mt-2 mb-2">
      <h1 className="text-2xl font-bold text-gray-900 leading-tight pr-4 flex-1 truncate">
        {grant.title}
      </h1>
      {!isMobile && (
        <div className="flex flex-row items-center gap-2 flex-shrink-0 mt-1" style={{ minWidth: 260 }}>
          <SortingControls sortBy={sortBy} onSortChange={onSortChange} />
        </div>
      )}
    </div>

    {/* Description from database */}
    {grant.description && <p className="text-gray-700 mb-2 leading-snug max-w-[65ch] text-sm">
        {grant.description}
      </p>}

    {/* About Grant section (if different from description) */}
    {grant.aboutGrant && grant.aboutGrant !== grant.description}

    {/* Action buttons */}
    <div className="flex items-center gap-2 mb-2">
      <Button onClick={handleApplyClick} className="px-4 py-1 text-black text-xs font-medium rounded-lg bg-[#d7cffc] hover:bg-[#CEC5F9] h-8">
        Ansök om bidrag
      </Button>
      <Button variant="outline" onClick={handleBookmarkToggle} className="px-2 py-1 text-xs border-gray-300 rounded-lg flex items-center gap-2 bg-white hover:bg-gray-50 h-8">
        <Bookmark className={`w-4 h-4 ${actuallyBookmarked ? "fill-current text-[#8162F4]" : "text-gray-500"}`} />
        {actuallyBookmarked ? "Sparat" : "Spara bidrag"}
      </Button>
    </div>
  </div>;
};

export default GrantNotionHeader;