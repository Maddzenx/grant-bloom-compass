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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Upptäck bidrag för ditt projekt
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Sök bland {totalGrants} tillgängliga bidrag och hitta finansiering som passar dig
            </p>
          </div>

          {/* Search Mode Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center bg-white rounded-2xl border border-gray-200 p-1.5 shadow-lg backdrop-blur-sm" role="tablist" aria-label="Sökläge">
              <button 
                onClick={handleToggleSearchMode} 
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                  !isAISearch 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`} 
                role="tab"
                aria-selected={!isAISearch}
                aria-label="Nyckelordssökning"
              >
                <Search className="w-4 h-4" />
                <span>Nyckelord</span>
              </button>
              <button 
                onClick={handleToggleSearchMode} 
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                  isAISearch 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`} 
                role="tab"
                aria-selected={isAISearch}
                aria-label="AI-matchning"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI-matchning</span>
              </button>
            </div>
          </div>
          
          {/* Mode Description */}
          <div className="text-center">
            <p className="text-base text-gray-600">
              {isAISearch 
                ? 'Beskriv ditt projekt så matchar AI:n relevanta bidrag' 
                : 'Sök med specifika nyckelord och använd filter för att förfina'
              }
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-3xl mx-auto">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={(v) => onSearchChange(v)} 
              placeholder={isAISearch ? "Beskriv ditt projekt för AI-matchning..." : "Sök efter bidrag..."} 
              inputClassName="w-full rounded-2xl pr-16 py-4 md:py-5 text-base placeholder:text-gray-400 shadow-lg border border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 bg-white/80 backdrop-blur-sm" 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100" 
                  onClick={onClearSearch} 
                  aria-label="Rensa sökning"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <Button
                onClick={onSearch}
                disabled={isSearching}
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 px-3 py-2 rounded-xl shadow-md"
                aria-label="Sök"
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white text-gray-700 px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
            >
              Visa alla
            </Button>
            <Button
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white text-gray-700 px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
            >
              Organisation
            </Button>
            <Button
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white text-gray-700 px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
            >
              Fler filter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;