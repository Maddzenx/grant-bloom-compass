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
          {/* Search Mode Toggle - Simplified */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center bg-white rounded-lg border border-zinc-200 p-1 shadow-sm" role="tablist" aria-label="Sökläge">
              <button 
                onClick={handleToggleSearchMode} 
                className={`flex items-center gap-2 ${baseBtn} rounded-md transition-all duration-200 font-['Source_Sans_3'] ${!isAISearch ? 'bg-primary text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50'}`} 
                role="tab"
                aria-selected={!isAISearch}
                aria-label="Vanlig sökning"
              >
                <Search className="w-4 h-4" />
                <span className="font-medium">Nyckelord</span>
              </button>
              <button 
                onClick={handleToggleSearchMode} 
                className={`flex items-center gap-2 ${baseBtn} rounded-md transition-all duration-200 font-['Source_Sans_3'] ${isAISearch ? 'bg-primary text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50'}`} 
                role="tab"
                aria-selected={isAISearch}
                aria-label="AI sökning"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">AI-matchning</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3 h-3 opacity-70 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3">
                      <div className="space-y-2">
                        <p className="font-medium text-sm">AI-matchning</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Beskriv ditt projekt på naturligt språk. AI:n analyserar innehåll och kontext för bättre matchning än bara nyckelord.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </button>
            </div>
          </div>
          
          {/* Simplified mode description */}
          <div className="text-center mb-6">
            <p className="text-sm text-zinc-600">
              {isAISearch 
                ? 'Beskriv ditt projekt så matchar AI:n relevanta bidrag' 
                : 'Sök med specifika nyckelord och använd filter för att förfina'
              }
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={(v) => onSearchChange(v)} 
              placeholder={isAISearch ? "Beskriv ditt projekt för AI-matchning..." : "Sök efter bidrag..."} 
              inputClassName="rounded-full pr-40 py-4 md:py-5" 
            />
            {/* Right side icons container */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2" role="group" aria-label="Sökåtgärder">
              {searchTerm && (
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded" 
                  onClick={onClearSearch} 
                  aria-label="Rensa sökning"
                  title="Rensa sökning"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <Button
                onClick={onSearch}
                disabled={isSearching}
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 px-3 py-1.5 text-sm font-medium"
                aria-label="Utför sökning"
              >
                {isSearching ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    <span className="sr-only">Söker...</span>
                  </div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Hint below search */}
          

          
        </div>
      </div>
    </div>;
};
export default DiscoverHeader;