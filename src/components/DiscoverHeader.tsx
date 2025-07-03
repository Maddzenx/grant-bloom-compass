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
    <div className="w-full bg-canvas-cloud flex-shrink-0 min-h-[30vh] flex items-center justify-center sticky top-0 z-30">
      <div className="w-full max-w-4xl mx-auto px-6 md:px-8 pt-4 pb-0">
        {/* Centered content block */}
        <div className="text-center space-y-2">
          {/* Header with title */}
          <h1 className="headline text-ink-obsidian text-2xl font-bold mb-1">Upptäck bidrag</h1>
          {/* Search bar and button in a single row */}
          <div className="flex justify-center mt-0 mb-1">
            <div className="w-full max-w-2xl flex items-center gap-2">
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
          {/* Advanced filter and sorting controls side by side */}
          <div className="flex flex-row items-center justify-between max-w-2xl mx-auto gap-2 mt-1 mb-0">
            <div className="text-ink-secondary text-sm">
              {totalGrants} bidrag hittade
              {isSearching && <span className="ml-2 text-ink-secondary">• Söker...</span>}
            </div>
            <div className="flex flex-row items-center gap-2">
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
