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
      <div className="w-full px-0 pt-0 pb-8">
        <div className="flex flex-col gap-6 mt-0 mb-0 w-full px-0">
          {/* Search Mode Toggle - Better spacing and sizing */}
          <div className="flex justify-center">
            <div className="inline-flex items-center bg-white rounded-xl border border-zinc-200 p-1.5 shadow-sm" role="tablist" aria-label="Sökläge">
              <button 
                onClick={handleToggleSearchMode} 
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg transition-all duration-200 font-['Source_Sans_3'] text-sm font-medium ${!isAISearch ? 'bg-primary text-white shadow-sm' : 'text-black hover:text-black hover:bg-zinc-50'}`} 
                role="tab"
                aria-selected={!isAISearch}
                aria-label="Vanlig sökning"
              >
                <Search className="w-4 h-4" />
                <span>Nyckelord</span>
              </button>
              <button 
                onClick={handleToggleSearchMode} 
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg transition-all duration-200 font-['Source_Sans_3'] text-sm font-medium ${isAISearch ? 'bg-primary text-white shadow-sm' : 'text-black hover:text-black hover:bg-zinc-50'}`} 
                role="tab"
                aria-selected={isAISearch}
                aria-label="AI sökning"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI-matchning</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 opacity-70 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3">
                      <div className="space-y-2">
                        <p className="font-medium text-sm">AI-matchning</p>
                        <p className="text-xs text-black leading-relaxed">
                          Beskriv ditt projekt på naturligt språk. AI:n analyserar innehåll och kontext för bättre matchning än bara nyckelord.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </button>
            </div>
          </div>
          
          {/* Simplified mode description - Better typography */}
          <div className="text-center">
            <p className="text-sm text-black leading-relaxed">
              {isAISearch 
                ? 'Beskriv ditt projekt så matchar AI:n relevanta bidrag' 
                : 'Sök med specifika nyckelord och använd filter för att förfina'
              }
            </p>
          </div>

          {/* Search Bar - Enhanced proportions */}
          <div className="relative w-full max-w-3xl mx-auto">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={(v) => onSearchChange(v)} 
              placeholder={isAISearch ? "Beskriv ditt projekt för AI-matchning..." : "Sök efter bidrag..."} 
              inputClassName="rounded-2xl pr-44 py-5 md:py-6 text-base placeholder:text-black shadow-sm border border-zinc-200 focus:border-primary/30 focus:ring-4 focus:ring-primary/10" 
            />
            {/* Right side icons container - Better spacing */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3" role="group" aria-label="Sökåtgärder">
              {searchTerm && (
                <button 
                  className="text-black hover:text-black transition-colors p-1.5 rounded-lg hover:bg-muted/50" 
                  onClick={onClearSearch} 
                  aria-label="Rensa sökning"
                  title="Rensa sökning"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <Button
                onClick={onSearch}
                disabled={isSearching}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium rounded-xl shadow-sm"
                aria-label="Utför sökning"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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