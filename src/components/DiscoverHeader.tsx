
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import EnhancedSearchBar from "@/components/EnhancedSearchBar";
import SortingControls, { SortOption } from "@/components/SortingControls";

interface DiscoverHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
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
  onSearch,
  sortBy,
  onSortChange,
  totalGrants,
  suggestions = [],
  isSearching = false,
  searchMetrics
}: DiscoverHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full bg-canvas-cloud flex-shrink-0">
      <div className="py-6">
        {/* Header with title */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="headline text-ink-obsidian">
            Upptäck bidrag
          </h1>
        </div>
        
        {/* Search bar and controls */}
        <div className="space-y-6">
          {/* Enhanced search bar */}
          <div className="flex justify-between mx-0 px-0">
            <div className="w-full max-w-md">
              <EnhancedSearchBar 
                searchTerm={searchTerm} 
                onSearchChange={onSearchChange} 
                onSearch={onSearch} 
                suggestions={suggestions} 
                isSearching={isSearching} 
                searchMetrics={searchMetrics} 
              />
            </div>
          </div>
          
          {/* Results count and sorting */}
          <div className={`flex items-center ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
            <div className={`text-ink-secondary body-text ${isMobile ? 'order-2' : ''}`}>
              {totalGrants} bidrag hittade
              {isSearching && <span className="ml-2 text-ink-secondary">• Söker...</span>}
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
      </div>
    </div>
  );
};

export default DiscoverHeader;
