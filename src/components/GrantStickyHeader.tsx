
import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/editor');
  };

  useEffect(() => {
    const handleScroll = () => {
      // Look for the scroll viewport created by Radix ScrollArea
      const scrollViewport = document.querySelector('[data-grant-details-scroll] [data-radix-scroll-area-viewport]');
      
      if (scrollViewport) {
        const scrollTop = scrollViewport.scrollTop;
        const shouldShow = scrollTop > 200;
        console.log('Scroll detected - scrollTop:', scrollTop, 'shouldShow:', shouldShow);
        setIsVisible(shouldShow);
      }
    };

    // Add a small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      const scrollViewport = document.querySelector('[data-grant-details-scroll] [data-radix-scroll-area-viewport]');
      
      if (scrollViewport) {
        console.log('ScrollArea viewport found, attaching listener');
        scrollViewport.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
          scrollViewport.removeEventListener('scroll', handleScroll);
        };
      } else {
        console.log('ScrollArea viewport not found');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
          <Button 
            onClick={handleApplyClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm"
          >
            Ansök
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrantStickyHeader;
