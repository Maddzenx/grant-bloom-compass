
import { useState, useCallback } from 'react';

interface SearchCache {
  [key: string]: {
    results: any[];
    timestamp: number;
  };
}

interface SearchMetrics {
  searchLatency: number;
  resultsCount: number;
  cacheHitRate: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useSearchCache = () => {
  const [searchCache, setSearchCache] = useState<SearchCache>({});
  const [totalSearches, setTotalSearches] = useState(0);
  const [cacheHits, setCacheHits] = useState(0);

  const getCachedResult = useCallback((cacheKey: string) => {
    const cached = searchCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
    return null;
  }, [searchCache]);

  const setCachedResult = useCallback((cacheKey: string, results: any[]) => {
    setSearchCache(prev => ({
      ...prev,
      [cacheKey]: {
        results,
        timestamp: Date.now()
      }
    }));
  }, []);

  const recordCacheHit = useCallback(() => {
    setCacheHits(prev => prev + 1);
  }, []);

  const recordSearch = useCallback(() => {
    setTotalSearches(prev => prev + 1);
  }, []);

  const getCacheHitRate = useCallback(() => {
    return totalSearches > 0 ? cacheHits / totalSearches : 0;
  }, [totalSearches, cacheHits]);

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

  return {
    getCachedResult,
    setCachedResult,
    recordCacheHit,
    recordSearch,
    getCacheHitRate,
    cleanCache,
  };
};
