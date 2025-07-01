
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
  
  return (
    <div className="py-8">
      {/* Header with title */}
      <div className="mb-8">
        <h1 className="text-4xl font-normal text-black mb-2">
          Upptäck bidrag
        </h1>
      </div>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="max-w-md">
          <EnhancedSearchBar 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange} 
            suggestions={suggestions} 
            isSearching={isSearching} 
            searchMetrics={searchMetrics} 
          />
        </div>
      </div>
      
      {/* Results count and sorting */}
      <div className={`flex items-center ${isMobile ? 'flex-col gap-4' : 'justify-between'} mb-4`}>
        <div className={`text-gray-600 ${isMobile ? 'order-2' : ''}`}>
          {totalGrants} bidrag hittade
          {isSearching && <span className="ml-2 text-gray-500">• Söker...</span>}
        </div>
        <div className={isMobile ? 'order-1 w-full flex justify-center' : ''}>
          <SortingControls 
            sortBy={sortBy} 
            onSortChange={onSortChange} 
            hasSearchTerm={!!searchTerm.trim()} 
          />
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;
