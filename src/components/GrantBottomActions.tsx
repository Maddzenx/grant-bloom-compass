import React from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
interface GrantBottomActionsProps {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}
const GrantBottomActions = ({
  isBookmarked,
  onToggleBookmark
}: GrantBottomActionsProps) => {
  return <div className="flex gap-3 pt-8 mt-8 border-t border-gray-200">
      
      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base py-[15px] px-[100px] text-center">
        Apply
      </Button>
    </div>;
};
export default GrantBottomActions;