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
    <div className="w-full bg-canvas-cloud flex-shrink-0 min-h-[50vh] flex items-center justify-center sticky top-0 z-30">
      <div className="w-full max-w-4xl mx-auto px-6 md:px-8 pt-8 pb-2">
        {/* Centered content block */}
        <div className="text-center space-y-4">
          {/* Header with title */}
          <h1 className="headline text-ink-obsidian text-3xl font-bold mb-2">Upptäck bidrag</h1>
          {/* Search bar and button in a single row */}
          <div className="flex justify-center mt-0 mb-2">
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
          <div className="flex flex-row items-center justify-between max-w-2xl mx-auto gap-4 mt-2 mb-0">
            <div className="text-ink-secondary body-text">
              {totalGrants} bidrag hittade
              {isSearching && <span className="ml-2 text-ink-secondary">• Söker...</span>}
            </div>
            <div className="flex flex-row items-center gap-3">
              {/* Advanced filter placeholder (to be replaced with actual filter component if needed) */}
              <span className="text-sm text-gray-500">Avancerat filter</span>
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
