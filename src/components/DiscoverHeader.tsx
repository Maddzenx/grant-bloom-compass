
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { X, ArrowRight, Sparkles, Search, HelpCircle } from 'lucide-react';
import { Button } from "./ui/button";
import SortingControls, { SortOption } from "@/components/SortingControls";
import { CustomDateRangePicker } from "./deadline-filter/CustomDateRangePicker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  isAISearch?: boolean;
  onToggleSearchMode?: (isAI: boolean) => void;
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
  searchMetrics,
  isAISearch = false,
  onToggleSearchMode
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

  const handleToggleSearchMode = () => {
    onToggleSearchMode?.(!isAISearch);
  };

  return (
    <div className="w-full flex-shrink-0 flex items-center px-0">
      <div className="w-full px-0 pt-0 pb-0">
        <div className="flex flex-col gap-3 mt-0 mb-2 w-full px-0">
          {/* Search Mode Toggle - Above the search bar */}
          <div className="flex justify-center">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
              <button
                onClick={handleToggleSearchMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  !isAISearch 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                title={isAISearch ? 'AI sökning' : 'Vanlig sökning'}
              >
                <Search className="w-4 h-4" />
                <span>Vanlig sökning</span>
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleToggleSearchMode}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                        isAISearch 
                          ? 'bg-purple-600 text-white shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                      title={isAISearch ? 'AI sökning' : 'Vanlig sökning'}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>AI sökning</span>
                      <HelpCircle className="w-3 h-3 opacity-70" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-3">
                    <div className="space-y-2">
                      <p className="font-medium text-sm">AI-sökning</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Beskriv ditt projekt på naturligt språk och få intelligenta matchningar baserade på innehåll och kontext, inte bara nyckelord.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`relative w-full ${isMobile ? 'sticky top-0 z-30 bg-canvas-cloud' : ''}`}>
            <input
              className="w-full pl-6 pr-16 py-4 rounded-lg border border-gray-200 bg-white text-base font-medium text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none placeholder:text-gray-500"
              placeholder={isAISearch ? "Beskriv ditt projekt för AI-matchning..." : "Sök efter bidrag..."}
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Search grants"
            />
            
            {/* Right side icons container */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              <button
                className="text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
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
