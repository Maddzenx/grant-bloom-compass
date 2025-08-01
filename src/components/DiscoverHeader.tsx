
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { X, ArrowRight } from 'lucide-react';
import { Button } from "./ui/button";
import SortingControls, { SortOption } from "@/components/SortingControls";
import { CustomDateRangePicker } from "./deadline-filter/CustomDateRangePicker";

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleSearchClick = () => {
    onSearch();
  };

  return (
    <div className="w-full bg-canvas-cloud flex-shrink-0 flex items-center px-0">
      <div className="w-full px-0 pt-0 pb-0">
        <div className="flex items-center gap-2 mt-0 mb-2 w-full px-0">
          <div className={`relative w-full ${isMobile ? 'sticky top-0 z-30 bg-canvas-cloud' : ''}`}>
            <input
              className="w-full pl-4 pr-12 py-3 rounded-lg border border-[#E0E0E0] bg-white text-sm font-medium text-ink-obsidian focus:ring-accent-lavender focus:outline-none placeholder:text-gray-500"
              placeholder="Search grants..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Search grants"
            />
            {/* Right side icons container */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button
                  className="text-ink-secondary hover:text-accent-lavender transition-colors"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              <button
                className="text-accent-lavender hover:text-accent-lavender/80 transition-colors cursor-pointer"
                onClick={handleSearchClick}
                aria-label="Search"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;
