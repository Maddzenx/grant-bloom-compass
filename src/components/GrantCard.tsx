
import React from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grant } from "@/types/grant";

interface GrantCardProps {
  grant: Grant;
  isSelected: boolean;
  isBookmarked: boolean;
  onSelect: () => void;
  onToggleBookmark: () => void;
}

const GrantCard = ({ grant, isSelected, isBookmarked, onSelect, onToggleBookmark }: GrantCardProps) => {
  return (
    <div
      className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-sm ${
        isSelected ? "ring-2 ring-blue-500 border-blue-200" : "border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src="/lovable-uploads/23db7362-fc6c-4227-9a07-bbc3e401ec75.png" 
              alt="Vinnova" 
              className="w-16 h-6 object-contain"
            />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-2">{grant.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{grant.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          className="ml-2 p-1 hover:bg-gray-100"
        >
          <Bookmark
            className={`w-4 h-4 ${
              isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`}
          />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {grant.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs bg-teal-50 text-teal-700 border-0 font-normal">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600 text-xs block">Funding amount</span>
          <div className="text-gray-900 font-medium">{grant.fundingAmount}</div>
        </div>
        <div>
          <span className="text-gray-600 text-xs block">Application deadline</span>
          <div className="text-gray-900 font-medium">{grant.deadline}</div>
        </div>
      </div>
      
      <div className="mt-3 text-sm">
        <span className="text-gray-600 text-xs block">Qualifications</span>
        <div className="text-gray-900 font-normal">{grant.qualifications}</div>
      </div>
    </div>
  );
};

export default GrantCard;
