
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

const GrantHeader = ({ grant, isBookmarked, onToggleBookmark, orgLogo }: GrantHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex-1 pr-8">
        <div className="flex items-center gap-2 mb-4">
          <img 
            src={orgLogo.src}
            alt={orgLogo.alt}
            className={orgLogo.className}
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{grant.title}</h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-none">{grant.description}</p>
      </div>
      <div className="flex gap-3 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleBookmark}
          className="p-3 hover:bg-gray-100 rounded-lg"
        >
          <Bookmark
            className={`w-6 h-6 ${
              isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`}
          />
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default GrantHeader;
