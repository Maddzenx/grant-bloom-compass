
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
  const { startApplication, addToSaved, removeFromSaved, isGrantSaved } = useSavedGrantsContext();

  const handleApplyClick = () => {
    console.log('🎯 Apply button clicked in header for grant:', grant.id, grant.title);
    
    // Start the application process, which moves the grant to active applications
    startApplication(grant);
    
    console.log('🔄 After startApplication call, navigating to chat interface');
    navigate('/chat', { state: { grant } });
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
    onToggleBookmark();
  };

  // Use the context to determine if grant is actually saved
  const actuallyBookmarked = isGrantSaved(grant.id);

  return (
    <div className="w-full px-6 pb-12 rounded-none md:px-[24px] py-[24px] my-0">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight md:text-xl">
        {grant.title}
      </h1>

      {/* Description from database */}
      {grant.description && (
        <p className="text-sm text-gray-700 mb-6 leading-relaxed max-w-4xl">
          {grant.description}
        </p>
      )}

      {/* About Grant section (if different from description) */}
      {grant.aboutGrant && grant.aboutGrant !== grant.description && (
        <p className="text-sm text-gray-700 mb-6 leading-relaxed max-w-4xl">
          {grant.aboutGrant}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          onClick={handleApplyClick}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
        >
          Ansök om bidrag
        </Button>
        <Button
          variant="outline"
          onClick={handleBookmarkToggle}
          className="px-4 py-2 text-sm border-gray-300 rounded-lg flex items-center gap-2"
        >
          <Bookmark
            className={`w-4 h-4 ${
              actuallyBookmarked ? "fill-current text-blue-600" : "text-gray-500"
            }`}
          />
          {actuallyBookmarked ? "Sparat" : "Spara bidrag"}
        </Button>
      </div>
    </div>
  );
};

export default GrantNotionHeader;
