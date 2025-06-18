
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
      className={`bg-white rounded-lg border p-6 cursor-pointer transition-all hover:shadow-sm ${
        isSelected ? "ring-1 ring-blue-200 shadow-sm" : "border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <img 
              src="/lovable-uploads/23db7362-fc6c-4227-9a07-bbc3e401ec75.png" 
              alt="Vinnova" 
              className="w-20 h-8 object-contain"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{grant.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{grant.description}</p>
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
      
      <div className="flex flex-wrap gap-2 mb-4">
        {grant.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-gray-700">Bidrag</span>
          <div className="text-gray-900">{grant.fundingAmount}</div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Ansökningsdeadline</span>
          <div className="text-gray-900">{grant.deadline}</div>
        </div>
        <div>
          <span className="font-medium text-gray-700">Kvalifikationer</span>
          <div className="text-gray-900">{grant.qualifications}</div>
        </div>
      </div>
    </div>
  );
};

export default GrantCard;
