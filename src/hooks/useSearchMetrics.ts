
import { useState, useCallback } from 'react';

interface SearchMetrics {
  searchLatency: number;
  resultsCount: number;
  cacheHitRate: number;
}

export const useSearchMetrics = () => {
  const [searchMetrics, setSearchMetrics] = useState<SearchMetrics>({
    searchLatency: 0,
    resultsCount: 0,
    cacheHitRate: 0,
  });

  const updateMetrics = useCallback((
    latency: number,
    resultsCount: number,
    cacheHitRate: number
  ) => {
    setSearchMetrics({
      searchLatency: latency,
      resultsCount,
      cacheHitRate,
    });
  }, []);

  return {
    searchMetrics,
    updateMetrics,
  };
};
