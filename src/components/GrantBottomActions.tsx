
import React from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GrantBottomActionsProps {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const GrantBottomActions = ({ isBookmarked, onToggleBookmark }: GrantBottomActionsProps) => {
  return (
    <div className="flex justify-center items-center pt-8 mt-8 border-t border-gray-200">
      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base">
        Apply
      </Button>
    </div>
  );
};

export default GrantBottomActions;
