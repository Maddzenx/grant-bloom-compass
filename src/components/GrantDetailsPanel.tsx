import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import GrantDetails from "@/components/GrantDetails";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import { Grant } from "@/types/grant";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import SortingControls, { SortOption } from "@/components/SortingControls";
import { Dialog, DialogContent, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerClose } from "@/components/ui/drawer";
import GrantNotionContent from "./grant-notion/GrantNotionContent";
import GrantNotionHeader from "./grant-notion/GrantNotionHeader";
interface GrantDetailsPanelProps {
  selectedGrant: Grant | null;
  onToggleBookmark: (grantId: string) => void;
  isMobile: boolean;
  onBackToList?: () => void;
  sortBy?: SortOption;
  onSortChange?: (sortBy: SortOption) => void;
}
const GrantDetailsPanel = ({
  selectedGrant,
  onToggleBookmark,
  isMobile,
  onBackToList,
  sortBy = "default",
  onSortChange = () => {}
}: GrantDetailsPanelProps) => {
  const {
    isGrantSaved
  } = useSavedGrantsContext();
  const containerClass = isMobile ? "w-full bg-canvas-cloud overflow-hidden relative" : "w-full h-full bg-canvas-cloud overflow-hidden relative";
  return <div className={containerClass}>
      {selectedGrant ? <>
        <ScrollArea className="h-full w-full" data-grant-details-scroll>
          <div className="relative bg-[#f0f1f3] px-0 py-0 md:pr-0 md:py-0 md:px-0">
            <div className="bg-white rounded-lg mr-0 md:mr-2 px-4 pb-6 min-h-full">
              <GrantDetails grant={selectedGrant} isBookmarked={isGrantSaved(selectedGrant.id)} onToggleBookmark={() => onToggleBookmark(selectedGrant.id)} isMobile={isMobile} onBackToList={onBackToList} />
            </div>
          </div>
        </ScrollArea>
      </> : <div className="flex items-center justify-center h-full p-4">
        <div className="bg-white rounded-lg w-full h-full flex items-center justify-center mr-0 md:mr-2">
          <EmptyGrantDetails />
        </div>
      </div>}
    </div>;
};
export default GrantDetailsPanel;