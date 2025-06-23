
import { useState, useEffect } from 'react';

const DEBOUNCE_DELAY = 300; // 300ms

export const useDebouncedSearch = (searchTerm: string) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return {
    debouncedSearchTerm,
    isSearching: searchTerm !== debouncedSearchTerm,
  };
};
