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

const getOrganizationLogo = (organization: string) => {
  const orgLower = organization.toLowerCase();
  
  if (orgLower.includes('vinnova')) {
    return {
      src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
      alt: "Vinnova",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('energimyndigheten')) {
    return {
      src: "/lovable-uploads/f8a26579-c7af-42a6-a518-0af3d65385d6.png",
      alt: "Energimyndigheten",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('vetenskapsrådet')) {
    return {
      src: "/lovable-uploads/65e93ced-f449-4ba6-bcb0-5556c3edeb8a.png",
      alt: "Vetenskapsrådet",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('formas')) {
    return {
      src: "/lovable-uploads/24e99124-8ec2-4d23-945b-ead48b809491.png",
      alt: "Formas",
      className: "w-24 h-8 object-contain"
    };
  } else if (orgLower.includes('tillväxtverket')) {
    return {
      src: "/lovable-uploads/112d5f02-31e8-4cb1-a8d5-7b7b422b0fa2.png",
      alt: "Tillväxtverket",
      className: "w-24 h-8 object-contain"
    };
  }
  
  // Default fallback to Vinnova
  return {
    src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
    alt: organization,
    className: "w-24 h-8 object-contain"
  };
};

const GrantCard = ({ grant, isSelected, isBookmarked, onSelect, onToggleBookmark }: GrantCardProps) => {
  const orgLogo = getOrganizationLogo(grant.organization);

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
              src={orgLogo.src}
              alt={orgLogo.alt}
              className={orgLogo.className}
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
