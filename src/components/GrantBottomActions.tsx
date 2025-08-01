
import React from "react";
import { Bookmark, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";

interface GrantBottomActionsProps {
  grant?: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isMobile?: boolean;
}

const GrantBottomActions = ({ grant, isBookmarked, onToggleBookmark, isMobile = false }: GrantBottomActionsProps) => {
  const navigate = useNavigate();
  const { addToSaved, removeFromSaved, startApplication, savedGrants, isGrantSaved } = useSavedGrantsContext();

  const handleApplyClick = () => {
    if (grant) {
      // Removed expensive console logging to improve performance
      
      // Start the application process, which moves the grant to active applications
      startApplication(grant);
      
      // Removed expensive console logging to improve performance
      navigate('/chat', { state: { grant } });
    }
  };

  const handleBookmarkToggle = () => {
    if (grant) {
      const currentlyBookmarked = isGrantSaved(grant.id);
      // Removed expensive console logging to improve performance
      
      if (currentlyBookmarked) {
        removeFromSaved(grant.id);
      } else {
        addToSaved(grant);
      }
      onToggleBookmark();
    }
  };

  // Use the context to determine if grant is actually saved
  const actuallyBookmarked = grant ? isGrantSaved(grant.id) : false;

  return (
    <div className={`border-t border-accent-lavender/30 ${isMobile ? 'pt-3 mt-4' : 'pt-6 mt-6'}`}>
      <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'justify-center'}`}>
        {/* Bookmark button hidden */}
        <Button
          onClick={handleApplyClick}
          className={`${isMobile ? 'w-full' : ''} flex items-center gap-2`}
        >
          <ExternalLink className="w-4 h-4" />
          Börja ansökan
        </Button>
      </div>
    </div>
  );
};

export default GrantBottomActions;
