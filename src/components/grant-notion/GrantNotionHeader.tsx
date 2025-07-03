import React from "react";
import { Calendar, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
interface GrantNotionHeaderProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isMobile?: boolean;
}
const GrantNotionHeader = ({
  grant,
  isBookmarked,
  onToggleBookmark,
  isMobile = false
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
  return <div className="w-full px-0 md:px-6 pb-8 rounded-none pt-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
        {grant.title}
      </h1>

      {/* Description from database */}
      {grant.description && <p className="text-gray-700 mb-4 leading-relaxed max-w-[65ch] text-base">
          {grant.description}
        </p>}

      {/* About Grant section (if different from description) */}
      {grant.aboutGrant && grant.aboutGrant !== grant.description}

      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-4">
        <Button onClick={handleApplyClick} className="px-6 py-2 text-black text-sm font-medium rounded-lg bg-[#d7cffc] hover:bg-[#CEC5F9]">
          Ansök om bidrag
        </Button>
        <Button variant="outline" onClick={handleBookmarkToggle} className="px-4 py-2 text-sm border-gray-300 rounded-lg flex items-center gap-2 bg-white hover:bg-gray-50">
          <Bookmark className={`w-4 h-4 ${actuallyBookmarked ? "fill-current text-[#8162F4]" : "text-gray-500"}`} />
          {actuallyBookmarked ? "Sparat" : "Spara bidrag"}
        </Button>
      </div>
    </div>;
};
export default GrantNotionHeader;