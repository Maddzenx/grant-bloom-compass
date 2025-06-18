
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
      className={`bg-white rounded-xl border p-6 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-500 border-blue-200 shadow-md" : "border-gray-200 shadow-sm"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <img 
              src="/lovable-uploads/23db7362-fc6c-4227-9a07-bbc3e401ec75.png" 
              alt="Vinnova" 
              className="w-16 h-6 object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">{grant.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{grant.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          className="ml-3 p-2 hover:bg-gray-100 rounded-lg"
        >
          <Bookmark
            className={`w-5 h-5 ${
              isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"
            }`}
          />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {grant.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs bg-teal-50 text-teal-700 border-0 font-medium px-3 py-1 rounded-full">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 text-xs block mb-1 font-medium">Funding amount</span>
          <div className="text-gray-900 font-semibold">{grant.fundingAmount}</div>
        </div>
        <div>
          <span className="text-gray-500 text-xs block mb-1 font-medium">Application deadline</span>
          <div className="text-gray-900 font-semibold">{grant.deadline}</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm">
        <span className="text-gray-500 text-xs block mb-1 font-medium">Qualifications</span>
        <div className="text-gray-700 leading-relaxed">{grant.qualifications}</div>
      </div>
    </div>
  );
};

export default GrantCard;
