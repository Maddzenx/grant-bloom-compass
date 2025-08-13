import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import GrantDetails from "@/components/GrantDetails";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import { GrantListItem, GrantDetails as GrantDetailsType } from "@/types/grant";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
import SortingControls, { SortOption } from "@/components/SortingControls";
import { Dialog, DialogContent, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerClose } from "@/components/ui/drawer";
import GrantNotionContent from "./grant-notion/GrantNotionContent";
import GrantNotionHeader from "./grant-notion/GrantNotionHeader";
import { useGrantDetails } from "@/hooks/useGrantDetails";

interface GrantDetailsPanelProps {
  selectedGrant: GrantListItem | null;
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

  // Lazy load full grant details when a grant is selected
  const {
    data: fullGrantDetails,
    isLoading: isLoadingDetails,
    error: detailsError
  } = useGrantDetails(selectedGrant?.id || null);

  const containerClass = isMobile ? "w-full bg-canvas-cloud overflow-hidden relative" : "w-full h-full bg-canvas-cloud overflow-hidden relative";

  // Add viewportRef for scroll reset
  const viewportRef = useRef<HTMLDivElement>(null);

  // Scroll to top when selectedGrant changes
  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [selectedGrant]);

  return <div className={containerClass}>
      {selectedGrant ? <>
        <ScrollArea className="h-full w-full" data-grant-details-scroll viewportRef={viewportRef}>
          <div className="relative bg-[#f0f1f3] px-0 py-0 md:pr-0 md:py-0 md:px-0">
            <div className="bg-white rounded-lg mr-0 md:mr-2 pb-6 min-h-full px-[30px]">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#8B5CF6' }}></div>
                    <p className="text-gray-600">Laddar bidragsinformation...</p>
                  </div>
                </div>
              ) : detailsError ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-red-600 mb-2">Ett fel uppstod vid laddning av bidragsinformation</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                      className="text-sm"
                    >
                      Försök igen
                    </Button>
                  </div>
                </div>
              ) : fullGrantDetails ? (
                <GrantDetails 
                  grant={fullGrantDetails as any} 
                  isBookmarked={isGrantSaved(selectedGrant.id)} 
                  onToggleBookmark={() => onToggleBookmark(selectedGrant.id)} 
                  isMobile={isMobile} 
                  onBackToList={onBackToList} 
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-600">Ingen bidragsinformation tillgänglig</p>
                </div>
              )}
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