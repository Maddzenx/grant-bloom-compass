import React, { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { X, ArrowRight, Sparkles, Search, HelpCircle } from 'lucide-react';
import { Button } from "./ui/button";
import SortingControls, { SortOption } from "@/components/SortingControls";
import { CustomDateRangePicker } from "./deadline-filter/CustomDateRangePicker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SearchBar from "./SearchBar";

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
  onClearSearch?: () => void;
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
  onToggleSearchMode,
  onClearSearch
}: DiscoverHeaderProps) => {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSearch();
    }
  };

  const handleSearchClick = () => {
    onSearch();
  };

  const handleToggleSearchMode = () => {
    onToggleSearchMode?.(!isAISearch);
  };

  // Auto-resize textarea on mount and when searchTerm changes
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 180); // Max 4 rows (40px per row)
      textarea.style.height = newHeight + 'px';
    }
  }, [searchTerm]);

  return (
    <div className="bg-gradient-to-br from-purple-200 via-purple-100 to-purple-50 px-4 py-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Sök bland {totalGrants} bidrag
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Hitta bidrag som passar ditt projekt och din organisation
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-white rounded-2xl p-1" role="tablist">
            <button 
              onClick={handleToggleSearchMode} 
              className={`px-8 py-3 rounded-xl transition-all duration-300 text-base font-medium ${
                !isAISearch 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`} 
              role="tab"
              aria-selected={!isAISearch}
            >
              Vanlig sökning
            </button>
            <button 
              onClick={handleToggleSearchMode} 
              className={`px-8 py-3 rounded-xl transition-all duration-300 text-base font-medium ${
                isAISearch 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`} 
              role="tab"
              aria-selected={isAISearch}
            >
              AI sökning
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-4xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Sök efter bidrag..."
            className="w-full rounded-2xl px-6 py-5 text-lg placeholder:text-gray-500 border border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white outline-none"
          />
          <button
            onClick={onSearch}
            disabled={isSearching}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700 p-2"
            aria-label="Sök"
          >
            {isSearching ? (
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button
            variant="outline"
            className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl text-base font-medium"
          >
            Visa alla
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl text-base font-medium"
          >
            Organisation
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl text-base font-medium"
          >
            Stödberättigad sökande
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl text-base font-medium"
          >
            Region
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl text-base font-medium"
          >
            Övriga filter
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;