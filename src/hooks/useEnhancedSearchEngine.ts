
import { useState, useCallback, useMemo } from 'react';
import { Grant } from '@/types/grant';
import { EnhancedSearchEngine, createEnhancedSearchEngine } from '@/utils/searchEngine/enhancedSearchEngine';
import { SearchResult, SearchFeedback } from '@/utils/searchEngine/types';

export const useEnhancedSearchEngine = (grants: Grant[]) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  // Create search engine instance (memoized)
  const searchEngine = useMemo(() => createEnhancedSearchEngine(), []);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setCurrentQuery('');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setCurrentQuery(query);

    try {
      const results = await searchEngine.search(query, grants);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  }, [searchEngine, grants]);

  const recordFeedback = useCallback((feedback: Omit<SearchFeedback, 'queryId' | 'timestamp'>) => {
    if (!currentQuery) return;

    const fullFeedback: SearchFeedback = {
      ...feedback,
      queryId: `${currentQuery}-${Date.now()}`,
      timestamp: new Date()
    };

    searchEngine.recordFeedback(fullFeedback);
  }, [searchEngine, currentQuery]);

  const getSuggestions = useCallback(async (partialQuery: string) => {
    try {
      return await searchEngine.getSuggestions(partialQuery);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }, [searchEngine]);

  return {
    search,
    isSearching,
    searchResults,
    searchError,
    currentQuery,
    recordFeedback,
    getSuggestions
  };
};
