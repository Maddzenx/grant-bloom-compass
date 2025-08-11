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
  const baseBtn = isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';
  
  return <div className="w-full flex-shrink-0 flex items-center px-0">
      <div className="w-full px-0 pt-0 pb-0">
        <div className="flex flex-col gap-3 mt-0 mb-2 w-full px-0">
          {/* Search Mode Toggle - Above the search bar */}
          <div className="flex justify-center">
            <div className="flex items-center bg-white rounded-full border border-zinc-200 p-1 shadow-sm" role="tablist" aria-label="Sökläge">
              <button 
                onClick={handleToggleSearchMode} 
                className={`flex items-center gap-2 ${baseBtn} rounded-full type-body font-medium transition-all duration-200 font-['Source_Sans_3'] ${!isAISearch ? 'bg-[#7D54F4] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50'}`} 
                title="Vanlig sökning"
                role="tab"
                aria-selected={!isAISearch}
                aria-label="Vanlig sökning"
              >
                <span>Vanlig sökning</span>
                
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handleToggleSearchMode} 
                      className={`flex items-center gap-2 ${baseBtn} rounded-full type-body font-medium transition-all duration-200 font-['Source_Sans_3'] ${isAISearch ? 'bg-[#7D54F4] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50'}`} 
                      title="AI sökning"
                      role="tab"
                      aria-selected={isAISearch}
                      aria-label="AI sökning"
                    >
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
          {/* Sub-label under active mode */}
          <div className="-mt-1 text-center">
            <span className="type-caption text-zinc-600">
              {isAISearch ? 'Träffar baserade på projektbeskrivning' : 'Träffar baserade på nyckelord'}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <SearchBar searchTerm={searchTerm} onSearchChange={(v) => onSearchChange(v)} placeholder={isAISearch ? "Beskriv ditt projekt för AI-matchning..." : "Sök efter bidrag..."} inputClassName="rounded-full pr-40 py-4 md:py-5" />
            {/* Right side icons container */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2" role="group" aria-label="Sökåtgärder">
              {searchTerm && <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={onClearSearch} aria-label="Clear search">
                  <X className="w-6 h-6" />
                </button>}
              {isMobile ? (
                <span className="leading-none text-sm text-zinc-600">Sök</span>
              ) : (
                <span className="hidden md:flex items-center gap-1 leading-none text-zinc-600">
                  <span className="text-sm">Enter</span>
                  <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-white/90 text-[#7D54F4] border border-white/70 text-xs">↵</kbd>
                </span>
              )}
            </div>

          </div>

          {/* Hint below search */}
          

          
        </div>
      </div>
    </div>;
};
export default DiscoverHeader;