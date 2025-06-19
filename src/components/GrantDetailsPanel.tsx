
import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GrantDetails from "@/components/GrantDetails";
import GrantStickyHeader from "@/components/GrantStickyHeader";
import EmptyGrantDetails from "@/components/EmptyGrantDetails";
import { Grant } from "@/types/grant";
import { getOrganizationLogo } from "@/utils/organizationLogos";

interface GrantDetailsPanelProps {
  selectedGrant: Grant | null;
  bookmarkedGrants: Set<string>;
  onToggleBookmark: (grantId: string) => void;
  isMobile: boolean;
  onBackToList?: () => void;
}

const GrantDetailsPanel = ({
  selectedGrant,
  bookmarkedGrants,
  onToggleBookmark,
  isMobile,
  onBackToList
}: GrantDetailsPanelProps) => {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (!scrollArea) return;

      const currentScrollY = scrollArea.scrollTop;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const hasScrolled = currentScrollY > 200; // Show after scrolling 200px

      console.log('Scroll data:', { currentScrollY, isScrollingDown, hasScrolled, showStickyHeader });

      // Show sticky header when scrolling down and has scrolled enough
      if (hasScrolled && isScrollingDown && !showStickyHeader) {
        setShowStickyHeader(true);
      } else if (currentScrollY < 100) {
        // Hide when scrolled back to near the top
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

  const containerClass = isMobile 
    ? "w-full bg-[#f8f4ec] overflow-hidden relative" 
    : "w-3/5 bg-[#f8f4ec] overflow-hidden relative";

  return (
    <div className={containerClass}>
      {/* Mobile Back Button */}
      {isMobile && selectedGrant && onBackToList && (
        <div className="sticky top-0 z-20 bg-[#f8f4ec] border-b border-gray-200 p-3">
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

      {/* Conditional Sticky Header - only render when we have a grant and should show */}
      {selectedGrant && showStickyHeader && (
        <div className="animate-fade-in">
          <GrantStickyHeader
            grant={selectedGrant}
            isBookmarked={bookmarkedGrants.has(selectedGrant.id)}
            onToggleBookmark={() => onToggleBookmark(selectedGrant.id)}
            orgLogo={getOrganizationLogo(selectedGrant.organization)}
            isMobile={isMobile}
          />
        </div>
      )}
      
      {selectedGrant ? (
        <ScrollArea ref={scrollRef} className="h-full" data-grant-details-scroll>
          <div className="p-2 md:p-4 border-transparent px-0 py-0">
            <div className="bg-white rounded-lg">
              <GrantDetails
                grant={selectedGrant}
                isBookmarked={bookmarkedGrants.has(selectedGrant.id)}
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
