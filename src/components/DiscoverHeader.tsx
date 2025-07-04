import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from 'lucide-react';
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

  return (
    <div className="w-full bg-canvas-cloud flex-shrink-0 flex items-center sticky top-0 z-30 px-0">
      <div className="w-full px-0 pt-0 pb-0">
        <div className="flex items-center gap-2 mt-2 mb-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-lavender">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </span>
            <input
              className="w-full pl-10 pr-10 py-3 rounded-full border border-[#E0E0E0] bg-white text-sm font-medium text-ink-obsidian focus:ring-accent-lavender focus:outline-none"
              placeholder="Search grants..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              aria-label="Search grants"
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-accent-lavender"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <Button
            className="ml-2 px-3 py-2 rounded-full bg-accent-lavender text-white font-semibold text-sm shadow-none hover:bg-accent-lavender/90"
            onClick={onSearch}
            aria-label="Search"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;
