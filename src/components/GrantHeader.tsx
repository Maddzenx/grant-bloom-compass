import React from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  isMobile?: boolean;
}

const GrantHeader = ({
  grant,
  isBookmarked,
  onToggleBookmark,
  orgLogo,
  isMobile = false
}: GrantHeaderProps) => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/editor', { state: { grant } });
  };

  return (
    <div className={`flex items-start ${isMobile ? 'flex-col gap-3' : 'justify-between'} mb-4 md:mb-5`}>
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <img 
            src={orgLogo.src} 
            alt={orgLogo.alt} 
            className={`${orgLogo.className} ${isMobile ? 'w-5 h-5' : ''}`} 
          />
        </div>
        <h1 className={`font-bold text-gray-900 mb-2 md:mb-3 leading-tight ${isMobile ? 'text-lg' : 'text-xl'}`}>
          {grant.title}
        </h1>
        <p className={`text-gray-700 leading-relaxed mb-3 md:mb-4 w-full ${isMobile ? 'text-sm' : 'text-sm'}`}>
          {grant.description}
        </p>
      </div>
      <div className={`flex gap-2 ${isMobile ? 'w-full' : 'flex-shrink-0'}`}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleBookmark} 
          className={`p-2 hover:bg-gray-100 rounded-lg ${isMobile ? 'flex-1' : ''}`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"}`} />
          {isMobile && <span className="ml-2">Spara</span>}
        </Button>
        <Button 
          onClick={handleApplyClick}
          className={`bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm ${
            isMobile ? 'flex-1 px-4 py-2' : 'px-6 py-2'
          }`}
        >
          Ansök
        </Button>
      </div>
    </div>
  );
};

export default GrantHeader;
