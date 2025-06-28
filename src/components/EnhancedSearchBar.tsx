import React, { useState, useRef, useEffect } from "react";
import { Search, X, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface EnhancedSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  suggestions: string[];
  isSearching: boolean;
  searchMetrics?: {
    resultsCount: number;
    searchLatency: number;
    cacheHitRate: number;
  };
}
const EnhancedSearchBar = ({
  searchTerm,
  onSearchChange,
  suggestions,
  isSearching,
  searchMetrics
}: EnhancedSearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('grantSearchHistory');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading search history:', e);
      }
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = (search: string) => {
    if (!search.trim() || search.length < 2) return;
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('grantSearchHistory', JSON.stringify(updated));
  };
  const handleInputChange = (value: string) => {
    onSearchChange(value);
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(value.length > 0);
  };
  const handleInputFocus = () => {
    setShowSuggestions(searchTerm.length > 0 || recentSearches.length > 0);
  };
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };
  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    saveSearchToHistory(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    const allSuggestions = [...suggestions, ...recentSearches].filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev < allSuggestions.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && allSuggestions[selectedSuggestionIndex]) {
          handleSuggestionClick(allSuggestions[selectedSuggestionIndex]);
        } else if (searchTerm.trim()) {
          saveSearchToHistory(searchTerm);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };
  const clearSearch = () => {
    onSearchChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  const allSuggestions = [...suggestions, ...recentSearches].filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()) && s !== searchTerm);
  return <div className="relative w-full">
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isSearching ? 'text-gray-500 animate-pulse' : 'text-gray-400'}`} />
        <Input ref={inputRef} placeholder="Sök efter bidrag, organisation eller område..." value={searchTerm} onChange={e => handleInputChange(e.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} onKeyDown={handleKeyDown} className="pl-12 pr-10 py-3 border-gray-300 bg-white rounded-xl text-base font-medium shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 w-full text-black placeholder:text-black" />
        {searchTerm && <Button variant="ghost" size="sm" onClick={clearSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full">
            <X className="w-4 h-4" />
          </Button>}
      </div>

      {/* Search suggestions dropdown */}
      {showSuggestions && allSuggestions.length > 0 && <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {/* Current suggestions */}
          {suggestions.length > 0 && <div className="p-2">
              <div className="text-xs text-gray-500 mb-2 px-2">Förslag</div>
              {suggestions.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()) && s !== searchTerm).map((suggestion, index) => <button key={`suggestion-${suggestion}`} onClick={() => handleSuggestionClick(suggestion)} className={`w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-2 ${index === selectedSuggestionIndex ? 'bg-gray-50 text-black' : ''}`}>
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="truncate text-black">{suggestion}</span>
                  </button>)}
            </div>}

          {/* Recent searches */}
          {recentSearches.length > 0 && <div className="p-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2 px-2">Senaste sökningar</div>
              {recentSearches.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()) && s !== searchTerm).slice(0, 3).map((recent, index) => <button key={`recent-${recent}`} onClick={() => handleSuggestionClick(recent)} className={`w-full text-left px-3 py-2 rounded hover:bg-gray-50 flex items-center gap-2 ${index + suggestions.length === selectedSuggestionIndex ? 'bg-gray-50 text-black' : ''}`}>
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="truncate text-black">{recent}</span>
                  </button>)}
            </div>}
        </div>}

      {/* Search metrics (only show in development or for debugging) */}
      {searchMetrics && process.env.NODE_ENV === 'development'}
    </div>;
};
export default EnhancedSearchBar;
