
import React from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";

interface GrantHeaderProps {
  grant: Grant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  orgLogo: {
    src: string;
    alt: string;
    className: string;
  };
}

const GrantHeader = ({
  grant,
  isBookmarked,
  onToggleBookmark,
  orgLogo
}: GrantHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-5">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-3">
          <img 
            src={orgLogo.src} 
            alt={orgLogo.alt} 
            className={orgLogo.className} 
          />
        </div>
        <h1 className="font-bold text-gray-900 mb-3 leading-tight text-xl">{grant.title}</h1>
        <p className="text-gray-700 leading-relaxed mb-4 text-sm">{grant.description}</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleBookmark} 
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Bookmark 
            className={`w-5 h-5 ${
              isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`} 
          />
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default GrantHeader;
