
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
  const { addToSaved, removeFromSaved, startApplication, isGrantSaved } = useSavedGrantsContext();

  const handleApplyClick = () => {
    if (grant) {
      // Start the application process, which moves the grant to active applications
      startApplication(grant);
      navigate('/business-plan-editor', { state: { grant } });
    }
  };

  const handleBookmarkToggle = () => {
    if (grant) {
      if (isBookmarked) {
        removeFromSaved(grant.id);
      } else {
        addToSaved(grant);
      }
      onToggleBookmark();
    }
  };

  return (
    <div className={`border-t border-gray-200 ${isMobile ? 'pt-3 mt-4' : 'pt-6 mt-6'}`}>
      <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'justify-center'}`}>
        <Button
          variant="outline"
          onClick={handleBookmarkToggle}
          className={`${isMobile ? 'w-full justify-center' : ''} flex items-center gap-2`}
        >
          <Bookmark
            className={`w-4 h-4 ${
              isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`}
          />
          {isBookmarked ? "Sparad" : "Spara bidrag"}
        </Button>
        <Button
          onClick={handleApplyClick}
          className={`bg-blue-600 hover:bg-blue-700 text-white ${isMobile ? 'w-full' : ''} flex items-center gap-2`}
        >
          <ExternalLink className="w-4 h-4" />
          Börja ansökan
        </Button>
      </div>
    </div>
  );
};

export default GrantBottomActions;
