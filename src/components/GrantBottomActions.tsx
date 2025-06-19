
import React from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface GrantBottomActionsProps {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const GrantBottomActions = ({
  isBookmarked,
  onToggleBookmark
}: GrantBottomActionsProps) => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/editor');
  };

  return (
    <div className="flex justify-center items-center pt-8 mt-8 border-t border-transparent">
      <Button 
        onClick={handleApplyClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base"
      >
        Ansök
      </Button>
    </div>
  );
};

export default GrantBottomActions;
