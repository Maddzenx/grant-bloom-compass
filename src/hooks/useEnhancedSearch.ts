
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Grant } from '@/types/grant';
import { calculateRelevanceScore, generateSearchSuggestions } from '@/utils/searchAlgorithms';
import { FilterOptions } from '@/components/FilterControls';

interface SearchCache {
  [key: string]: {
    results: Grant[];
    timestamp: number;
  };
}

interface UseEnhancedSearchProps {
  grants: Grant[];
  filters: FilterOptions;
  sortBy: string;
}

interface SearchMetrics {
  searchLatency: number;
  resultsCount: number;
  cacheHitRate: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEBOUNCE_DELAY = 300; // 300ms

export const useEnhancedSearch = ({ grants, filters, sortBy }: UseEnhancedSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchCache, setSearchCache] = useState<SearchCache>({});
  const [searchMetrics, setSearchMetrics] = useState<SearchMetrics>({
    searchLatency: 0,
    resultsCount: 0,
    cacheHitRate: 0,
  });
  const [totalSearches, setTotalSearches] = useState(0);
  const [cacheHits, setCacheHits] = useState(0);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Generate cache key - memoized to prevent recreating on every render
  const generateCacheKey = useCallback((term: string, filters: FilterOptions, sortBy: string) => {
    return `${term}|${JSON.stringify(filters)}|${sortBy}`;
  }, []);

  // Clean expired cache entries
  const cleanCache = useCallback(() => {
    const now = Date.now();
    setSearchCache(prev => {
      const cleaned: SearchCache = {};
      Object.keys(prev).forEach(key => {
        if (now - prev[key].timestamp <= CACHE_DURATION) {
          cleaned[key] = prev[key];
        }
      });
      return cleaned;
    });
  }, []);

  // Enhanced search with caching and metrics - separated from state updates
  const searchResults = useMemo(() => {
    const startTime = performance.now();
    const cacheKey = generateCacheKey(debouncedSearchTerm, filters, sortBy);
    
    // Check cache first
    const cached = searchCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      // Update metrics separately to avoid dependency loop
      setTimeout(() => {
        setCacheHits(prev => prev + 1);
        setTotalSearches(prev => {
          const newTotal = prev + 1;
          const newCacheHits = cacheHits + 1;
          const endTime = performance.now();
          setSearchMetrics({
            searchLatency: endTime - startTime,
            resultsCount: cached.results.length,
            cacheHitRate: newCacheHits / newTotal,
          });
          return newTotal;
        });
      }, 0);
      
      return cached.results;
    }

    // Perform search
    let results = grants;

    // Apply text search if term provided
    if (debouncedSearchTerm.trim()) {
      results = grants
        .map(grant => ({
          grant,
          relevanceScore: calculateRelevanceScore(grant, debouncedSearchTerm)
        }))
        .filter(item => item.relevanceScore > 0.1) // Minimum relevance threshold
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .map(item => item.grant);
    }

    // Apply filters
    results = applyFilters(results, filters);

    // Apply sorting
    results = applySorting(results, sortBy, debouncedSearchTerm);

    // Cache results and update metrics separately
    setTimeout(() => {
      setSearchCache(prev => ({
        ...prev,
        [cacheKey]: {
          results,
          timestamp: Date.now()
        }
      }));

      setTotalSearches(prev => {
        const newTotal = prev + 1;
        const endTime = performance.now();
        setSearchMetrics({
          searchLatency: endTime - startTime,
          resultsCount: results.length,
          cacheHitRate: totalSearches > 0 ? cacheHits / newTotal : 0,
        });
        return newTotal;
      });
    }, 0);

    return results;
  }, [debouncedSearchTerm, grants, filters, sortBy, searchCache, generateCacheKey]);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    return generateSearchSuggestions(grants, searchTerm);
  }, [grants, searchTerm]);

  // Clean cache periodically
  useEffect(() => {
    const interval = setInterval(cleanCache, 60000); // Clean every minute
    return () => clearInterval(interval);
  }, [cleanCache]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    searchMetrics,
    isSearching: searchTerm !== debouncedSearchTerm,
  };
};

// Helper function to apply filters
const applyFilters = (grants: Grant[], filters: FilterOptions): Grant[] => {
  return grants.filter(grant => {
    // Organization filter
    if (filters.organization && grant.organization !== filters.organization) {
      return false;
    }

    // Funding amount filters
    if (filters.minFunding || filters.maxFunding) {
      const grantAmount = parseFundingAmount(grant.fundingAmount);
      
      if (filters.minFunding) {
        const minAmount = parseInt(filters.minFunding, 10);
        if (grantAmount < minAmount) return false;
      }
      
      if (filters.maxFunding) {
        const maxAmount = parseInt(filters.maxFunding, 10);
        if (grantAmount > maxAmount) return false;
      }
    }

    // Deadline filter
    if (filters.deadline) {
      const days = parseInt(filters.deadline, 10);
      if (!isDeadlineWithinDays(grant.deadline, days)) return false;
    }

    return true;
  });
};

// Helper function to apply sorting
const applySorting = (grants: Grant[], sortBy: string, searchTerm: string): Grant[] => {
  if (sortBy === "none") return grants;
  
  return [...grants].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        const dateA = parseDeadline(a.deadline);
        const dateB = parseDeadline(b.deadline);
        return dateA.getTime() - dateB.getTime();
      
      case "funding":
        const amountA = parseFundingAmount(a.fundingAmount);
        const amountB = parseFundingAmount(b.fundingAmount);
        return amountB - amountA;
      
      case "relevance":
        if (searchTerm) {
          const scoreA = calculateRelevanceScore(a, searchTerm);
          const scoreB = calculateRelevanceScore(b, searchTerm);
          return scoreB - scoreA;
        }
        return 0;
      
      default:
        return 0;
    }
  });
};

// Helper functions (keep existing implementations)
const parseFundingAmount = (fundingAmount: string): number => {
  const match = fundingAmount.match(/(\d+(?:[.,]\d+)?)\s*M?SEK/i);
  if (match) {
    const amount = parseFloat(match[1].replace(',', '.'));
    return fundingAmount.includes('M') ? amount * 1000000 : amount;
  }
  
  const numbers = fundingAmount.match(/\d+(?:\s*\d+)*/g);
  if (!numbers) return 0;
  
  const firstNumber = numbers[0].replace(/\s/g, '');
  return parseInt(firstNumber, 10) || 0;
};

const parseDeadline = (deadline: string): Date => {
  if (deadline === 'Ej specificerat') return new Date(2099, 11, 31);
  
  const months: { [key: string]: number } = {
    'januari': 0, 'februari': 1, 'mars': 2, 'april': 3, 'maj': 4, 'juni': 5,
    'juli': 6, 'augusti': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
  };
  
  const parts = deadline.toLowerCase().split(' ');
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  
  return new Date();
};

const isDeadlineWithinDays = (deadline: string, days: number): boolean => {
  if (deadline === 'Ej specificerat') return false;
  
  const months: { [key: string]: number } = {
    'januari': 0, 'februari': 1, 'mars': 2, 'april': 3, 'maj': 4, 'juni': 5,
    'juli': 6, 'augusti': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
  };
  
  const parts = deadline.toLowerCase().split(' ');
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      const deadlineDate = new Date(year, month, day);
      const today = new Date();
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays <= days && diffDays >= 0;
    }
  }
  
  return false;
};
