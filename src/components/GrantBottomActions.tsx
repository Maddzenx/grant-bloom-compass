
import React from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GrantBottomActionsProps {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const GrantBottomActions = ({ isBookmarked, onToggleBookmark }: GrantBottomActionsProps) => {
  return (
    <div className="flex gap-3 pt-8 mt-8 border-t border-gray-200">
      <Button
        variant="ghost"
        onClick={onToggleBookmark}
        className="hover:bg-gray-100 font-semibold rounded-lg px-6"
      >
        <Bookmark
          className={`w-5 h-5 mr-2 ${
            isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
          }`}
        />
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base">
        Apply
      </Button>
    </div>
  );
};

export default GrantBottomActions;
