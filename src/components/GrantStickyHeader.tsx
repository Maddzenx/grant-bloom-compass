
import React, { useState, useEffect, useRef } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";

interface GrantStickyHeaderProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  orgLogo: {
    src: string;
    alt: string;
    className: string;
  };
}

const GrantStickyHeader = ({ grant, isBookmarked, onToggleBookmark, orgLogo }: GrantStickyHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the ScrollArea viewport element
      const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const shouldShow = scrollContainer.scrollTop > 200;
        setIsVisible(shouldShow);
      }
    };

    // Find the ScrollArea viewport and attach scroll listener
    const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
    }`}>
      <div className="flex items-center justify-between px-6 py-3 max-w-full">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img 
            src={orgLogo.src} 
            alt={orgLogo.alt} 
            className={orgLogo.className}
          />
          <h1 className="font-bold text-gray-900 text-lg truncate">
            {grant.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleBookmark}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"}`} />
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrantStickyHeader;
