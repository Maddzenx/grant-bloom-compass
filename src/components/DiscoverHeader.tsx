import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import EnhancedSearchBar from "@/components/EnhancedSearchBar";
import SortingControls, { SortOption } from "@/components/SortingControls";
interface DiscoverHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  totalGrants: number;
  suggestions?: string[];
  isSearching?: boolean;
  searchMetrics?: {
    resultsCount: number;
    searchLatency: number;
    cacheHitRate: number;
  };
}
const DiscoverHeader = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  totalGrants,
  suggestions = [],
  isSearching = false,
  searchMetrics
}: DiscoverHeaderProps) => {
  const isMobile = useIsMobile();
  return <div className="w-full bg-[#f8f4ec] flex-shrink-0">
      <div className="px-[16px] md:px-[24px] py-[2px]">
        {/* Header with title */}
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <h1 className={`font-bold text-gray-900 py-[10px] ${isMobile ? 'text-lg' : 'text-xl'}`}>
            Upptäck bidrag
          </h1>
        </div>
        
        {/* Search bar and controls */}
        <div className="space-y-3 md:space-y-4">
          {/* Centered enhanced search bar */}
          <div className="flex justify-between ">
            <div className="w-full max-w-md">
              <EnhancedSearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} suggestions={suggestions} isSearching={isSearching} searchMetrics={searchMetrics} />
            </div>
          </div>
          
          {/* Results count and sorting */}
          <div className={`flex items-center ${isMobile ? 'flex-col gap-2' : 'justify-between'} my-0`}>
            <div className={`text-black text-xs rounded-none ${isMobile ? 'order-2' : ''}`}>
              {totalGrants} bidrag hittade
              {isSearching && <span className="ml-1 text-blue-600">• Söker...</span>}
            </div>
            <div className={isMobile ? 'order-1 w-full flex justify-center' : ''}>
              <SortingControls sortBy={sortBy} onSortChange={onSortChange} hasSearchTerm={!!searchTerm.trim()} />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default DiscoverHeader;