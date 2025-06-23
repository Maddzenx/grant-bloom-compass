
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Grant } from '@/types/grant';
import { calculateRelevanceScore, generateSearchSuggestions } from '@/utils/searchAlgorithms';
import { FilterOptions } from '@/components/FilterControls';
import { useSearchCache } from './useSearchCache';
import { useSearchMetrics } from './useSearchMetrics';
import { useDebouncedSearch } from './useDebouncedSearch';
import {
  applyFilters,
  applySorting,
  generateCacheKey,
} from '@/utils/searchUtils';

interface UseEnhancedSearchProps {
  grants: Grant[];
  filters: FilterOptions;
  sortBy: string;
}

export const useEnhancedSearch = ({ grants, filters, sortBy }: UseEnhancedSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { debouncedSearchTerm, isSearching } = useDebouncedSearch(searchTerm);
  const { searchMetrics, updateMetrics } = useSearchMetrics();
  const {
    getCachedResult,
    setCachedResult,
    recordCacheHit,
    recordSearch,
    getCacheHitRate,
    cleanCache,
  } = useSearchCache();

  // Enhanced search with caching and metrics
  const searchResults = useMemo(() => {
    const startTime = performance.now();
    
    console.log('Enhanced search processing:', {
      grantsCount: grants.length,
      debouncedSearchTerm,
      hasSearchTerm: !!debouncedSearchTerm.trim()
    });

    // If no search term, return all grants (already filtered) with sorting applied
    if (!debouncedSearchTerm.trim()) {
      const results = applySorting(grants, sortBy, '');
      console.log('No search term - returning all grants:', results.length);
      
      setTimeout(() => {
        recordSearch();
        const endTime = performance.now();
        updateMetrics(endTime - startTime, results.length, getCacheHitRate());
      }, 0);
      
      return results;
    }

    const cacheKey = generateCacheKey(debouncedSearchTerm, filters, sortBy);
    
    // Check cache first
    const cached = getCachedResult(cacheKey);
    if (cached) {
      setTimeout(() => {
        recordCacheHit();
        recordSearch();
        const endTime = performance.now();
        updateMetrics(endTime - startTime, cached.results.length, getCacheHitRate());
      }, 0);
      
      return cached.results;
    }

    // Perform text search with relevance scoring
    let results = grants
      .map(grant => ({
        grant,
        relevanceScore: calculateRelevanceScore(grant, debouncedSearchTerm)
      }))
      .filter(item => item.relevanceScore > 0.1) // Minimum relevance threshold
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map(item => item.grant);

    // Apply filters (though grants should already be filtered)
    results = applyFilters(results, filters);

    // Apply sorting
    results = applySorting(results, sortBy, debouncedSearchTerm);

    console.log('Search with term completed:', {
      searchTerm: debouncedSearchTerm,
      resultsCount: results.length
    });

    // Cache results and update metrics
    setTimeout(() => {
      setCachedResult(cacheKey, results);
      recordSearch();
      const endTime = performance.now();
      updateMetrics(endTime - startTime, results.length, getCacheHitRate());
    }, 0);

    return results;
  }, [debouncedSearchTerm, grants, filters, sortBy, getCachedResult, setCachedResult, recordCacheHit, recordSearch, getCacheHitRate, updateMetrics]);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    return generateSearchSuggestions(grants, searchTerm);
  }, [grants, searchTerm]);

  // Clean cache periodically
  useEffect(() => {
    const interval = setInterval(cleanCache, 60000); // Clean every minute
    return () => clearInterval(interval);
  }, [cleanCache]);

  console.log('Enhanced search hook result:', {
    searchTerm,
    debouncedSearchTerm,
    searchResultsCount: searchResults.length,
    grantsCount: grants.length
  });

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    searchMetrics,
    isSearching,
  };
};
