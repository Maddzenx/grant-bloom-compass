
import { useState, useCallback } from 'react';

export const useSeenGrants = () => {
  const [seenGrants, setSeenGrants] = useState<Set<string>>(new Set());

  const markGrantAsSeen = useCallback((grantId: string) => {
    setSeenGrants(prev => {
      const newSet = new Set(prev);
      newSet.add(grantId);
      return newSet;
    });
  }, []);

  const isGrantSeen = useCallback((grantId: string) => {
    return seenGrants.has(grantId);
  }, [seenGrants]);

  return {
    markGrantAsSeen,
    isGrantSeen,
  };
};
