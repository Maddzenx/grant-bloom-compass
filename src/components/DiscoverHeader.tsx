import React, { useEffect, useRef } from "react";
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
  const defaultSuggestionChips = suggestions.length > 0 ? suggestions : ['Stöd till små och medelstora företag', 'EU-bidrag för forskningsprojekt', 'Digitalisering i offentlig sektor'];

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
  const [showAllChips, setShowAllChips] = React.useState(false);
  const chipsToShow = showAllChips ? defaultSuggestionChips : defaultSuggestionChips.slice(0, 3);
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
                {!isAISearch && <span className="text-xs opacity-90">• Aktivt</span>}
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
                      {isAISearch && <span className="text-xs opacity-90">• Aktivt</span>}
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
          <div className={`relative w-full ${isMobile ? 'sticky z-30 bg-canvas-cloud/95 backdrop-blur supports-[backdrop-filter]:bg-canvas-cloud/80' : ''}`} style={isMobile ? {
          top: 'calc(env(safe-area-inset-top, 0px) + 0px)'
        } : undefined}>
            <textarea 
              ref={textareaRef} 
              className="w-full pl-6 pr-24 py-4 rounded-full border border-zinc-200 bg-white type-body font-medium text-zinc-900 focus:ring-2 focus:ring-[#7D54F4] focus:border-[#7D54F4] focus:outline-none placeholder:text-zinc-500 resize-none overflow-hidden font-['Source_Sans_3']" 
              placeholder={isAISearch ? "Beskriv ditt projekt för AI-matchning..." : "Sök efter bidrag..."} 
              value={searchTerm} 
              onChange={e => {
            const maxChars = 300;
            if (e.target.value.length <= maxChars) {
              onSearchChange(e.target.value);
            }
          }} 
              onFocus={() => setIsInputFocused(true)} 
              onBlur={() => setIsInputFocused(false)} 
              onKeyPress={handleKeyPress} 
              onInput={e => {
            const textarea = e.target as HTMLTextAreaElement;
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 180);
            textarea.style.height = newHeight + 'px';
          }} 
              rows={1} 
              maxLength={300} 
              aria-label="Search grants" 
              style={{
            minHeight: '56px',
            maxHeight: '180px'
          }} />
            {/* Right side icons container */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2" role="group" aria-label="Sökåtgärder">
              {searchTerm && <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={onClearSearch} aria-label="Clear search">
                  <X className="w-6 h-6" />
                </button>}
              <button className={`flex items-center gap-1 rounded-full ${isMobile ? 'px-3 py-2 min-h-[44px]' : 'p-2'} bg-[#7D54F4] hover:bg-[#6a40f2] text-white shadow-sm active:scale-[0.98]`} onClick={handleSearchClick} aria-label="Search">
                {isMobile && <span className="text-sm">Sök</span>}
                <ArrowRight className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
              </button>
            </div>
          </div>

          {/* Hint below search */}
          {!isInputFocused && (
            <div className="text-center mt-2">
              <p className="type-caption text-zinc-500" aria-live="polite">
                Tryck Enter för att söka
              </p>
            </div>
          )}

          {/* Suggestion chips - horizontal scroll with gradient edges and expand */}
          {!isInputFocused && <div className="relative mt-1 px-1 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
              <div className="inline-flex gap-2 pr-4">
                {chipsToShow.map((s, idx) => <button key={idx} className="inline-flex type-secondary text-zinc-700 bg-white rounded-full px-3 py-1 transition-colors border-0 shadow-none hover:bg-zinc-50 hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#7D54F4] focus:ring-offset-2" onClick={() => {
              onSearchChange(s);
              setTimeout(onSearch, 0);
            }} aria-label={`Sökförslag: ${s}`}>
                    {s}
                  </button>)}
                {defaultSuggestionChips.length > 3 && !showAllChips && <button className="inline-flex type-secondary text-zinc-700 bg-white rounded-full px-3 py-1 transition-colors border-0 shadow-none hover:bg-zinc-50 hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#7D54F4] focus:ring-offset-2" onClick={() => setShowAllChips(true)} aria-label="Visa fler sökförslag">
                    Visa fler
                  </button>}
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default DiscoverHeader;