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
  const { isGrantSaved } = useSavedGrantsContext();

  useEffect(() => {
    const handleScroll = () => {
      const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (!viewport) return;
      const currentY = viewport.scrollTop;
      const scrollingDown = currentY > lastScrollY.current;
      const pastThreshold = currentY > 150;
      const nearTop = currentY < 50;

      if (scrollingDown && pastThreshold && !showStickyHeader) {
        setShowStickyHeader(true);
      } else if (nearTop && showStickyHeader) {
        setShowStickyHeader(false);
      }
      lastScrollY.current = currentY;
    };

    const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    viewport?.addEventListener("scroll", handleScroll);
    return () => viewport?.removeEventListener("scroll", handleScroll);
  }, [showStickyHeader]);

  useEffect(() => {
    setShowStickyHeader(false);
    lastScrollY.current = 0;
  }, [selectedGrant?.id]);

  // containerClass still uses the global canvas background
  const containerClass = isMobile
    ? "w-full bg-[#f0f1f3] overflow-hidden relative"
    : "w-[65%] bg-[#f0f1f3] overflow-hidden relative";

  return (
    <div className={containerClass}>
      {isMobile && selectedGrant && onBackToList && (
        <div className="sticky top-0 z-20 bg-[#f0f1f3] p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till listan
          </Button>
        </div>
      )}

      {selectedGrant ? (
        <ScrollArea ref={scrollRef} className="h-full" data-grant-details-scroll>
          <div className="relative bg-[#f0f1f3] px-0 py-1 md:px-1 md:py-1 pl-0 pr-10">
            {selectedGrant && (
              <div
                className={`absolute top-0 left-2 right-2 md:left-4 md:right-4 z-30 transition-all duration-300 ease-in-out ${
                  showStickyHeader
                    ? "opacity-100 translate-y-0 shadow-lg"
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
              >
                <GrantStickyHeader
                  grant={selectedGrant}
                  isBookmarked={isGrantSaved(selectedGrant.id)}
                  onToggleBookmark={() => onToggleBookmark(selectedGrant.id)}
                  orgLogo={getOrganizationLogo(selectedGrant.organization)}
                  isMobile={isMobile}
                />
              </div>
            )}

            <div className="bg-white rounded-lg">
              <GrantDetails
                grant={selectedGrant}
                isBookmarked={isGrantSaved(selectedGrant.id)}
                onToggleBookmark={() => onToggleBookmark(selectedGrant.id)}
                isMobile={isMobile}
              />
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center h-full p-4">
          <div className="bg-white rounded-lg w-full h-full flex items-center justify-center">
            <EmptyGrantDetails />
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantDetailsPanel;
