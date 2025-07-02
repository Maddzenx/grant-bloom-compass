import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GrantDetails from "@/components/GrantDetails";
import GrantStickyHeader from "@/components/GrantStickyHeader";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import { Grant } from "@/types/grant";
import { getOrganizationLogo } from "@/utils/organizationLogos";
import { useSavedGrantsContext } from "@/contexts/SavedGrantsContext";
interface GrantDetailsPanelProps {
  selectedGrant: Grant | null;
  onToggleBookmark: (grantId: string) => void;
  isMobile: boolean;
  onBackToList?: () => void;
}
const GrantDetailsPanel = ({
  selectedGrant,
  onToggleBookmark,
  isMobile,
  onBackToList
}: GrantDetailsPanelProps) => {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const {
    isGrantSaved
  } = useSavedGrantsContext();
  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (!scrollArea) return;
      const currentScrollY = scrollArea.scrollTop;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const hasScrolledPastThreshold = currentScrollY > 150;
      const isNearTop = currentScrollY < 50;
      console.log('Scroll data:', {
        currentScrollY,
        scrollingDown,
        hasScrolledPastThreshold,
        isNearTop,
        showStickyHeader
      });

      // Show sticky header when scrolling down and past threshold
      if (scrollingDown && hasScrolledPastThreshold && !showStickyHeader) {
        setShowStickyHeader(true);
      }
      // Hide sticky header when near the top
      else if (isNearTop && showStickyHeader) {
        setShowStickyHeader(false);
      }
      lastScrollY.current = currentScrollY;
    };
    const scrollArea = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }
  }, [showStickyHeader]);

  // Reset sticky header when grant changes
  useEffect(() => {
    setShowStickyHeader(false);
    lastScrollY.current = 0;
  }, [selectedGrant?.id]);
  const containerClass = isMobile ? "w-full bg-canvas-cloud overflow-hidden relative" : "w-[65%] bg-canvas-cloud overflow-hidden relative";
  return <div className={containerClass}>
      {/* Mobile Back Button */}
      {isMobile && selectedGrant && onBackToList && <div className="sticky top-0 z-20 bg-canvas-cloud p-3">
          <Button variant="ghost" size="sm" onClick={onBackToList} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till listan
          </Button>
        </div>}
      
      {selectedGrant ? <ScrollArea ref={scrollRef} className="h-full" data-grant-details-scroll>
          <div className="px-0 py-1 md:p-1 bg-canvas-cloud relative bg-[v#F0F1F3] bg-[#f0f1f3] pl-0 pr-10">
            {/* Enhanced Sticky Header positioned within the white content area */}
            {selectedGrant && <div className={`absolute top-0 left-2 right-2 md:left-4 md:right-4 z-30 transition-all duration-300 ease-in-out ${showStickyHeader ? 'opacity-100 transform translate-y-0 shadow-lg' : 'opacity-0 transform -translate-y-4 pointer-events-none'}`}>
                <GrantStickyHeader grant={selectedGrant} isBookmarked={isGrantSaved(selectedGrant.id)} onToggleBookmark={() => onToggleBookmark(selectedGrant.id)} orgLogo={getOrganizationLogo(selectedGrant.organization)} isMobile={isMobile} />
              </div>}
            
            <div className="bg-white rounded-lg">
              <GrantDetails grant={selectedGrant} isBookmarked={isGrantSaved(selectedGrant.id)} onToggleBookmark={() => onToggleBookmark(selectedGrant.id)} isMobile={isMobile} />
            </div>
          </div>
        </ScrollArea> : <div className="flex items-center justify-center h-full p-4">
          <div className="bg-white rounded-lg w-full h-full flex items-center justify-center">
            <EmptyGrantDetails />
          </div>
        </div>}
    </div>;
};
export default GrantDetailsPanel;