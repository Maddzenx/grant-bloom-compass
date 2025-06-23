
import { useState, useEffect, useCallback } from 'react';
import { Grant } from '@/types/grant';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSeenGrants } from '@/hooks/useSeenGrants';

interface UseGrantSelectionProps {
  searchResults: Grant[];
}

export const useGrantSelection = ({ searchResults }: UseGrantSelectionProps) => {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();
  const { markAsSeen, isGrantSeen } = useSeenGrants();

  // Auto-select first grant when results change, but only if we don't have a valid selection
  useEffect(() => {
    console.log('🔥 useGrantSelection effect:', { 
      searchResultsLength: searchResults.length, 
      selectedGrantId: selectedGrant?.id,
      selectedGrantStillValid: selectedGrant && searchResults.find(g => g.id === selectedGrant.id)
    });

    if (searchResults.length > 0) {
      // If no selection or current selection is not in results, select first
      if (!selectedGrant || !searchResults.find(g => g.id === selectedGrant.id)) {
        console.log('🔥 Selecting first grant from results:', searchResults[0]);
        setSelectedGrant(searchResults[0]);
      }
    } else if (searchResults.length === 0) {
      console.log('🔥 No results, clearing selection');
      setSelectedGrant(null);
    }
  }, [searchResults, selectedGrant]);

  const handleGrantSelect = useCallback((grant: Grant) => {
    console.log('🔥 Grant selected:', grant);
    setSelectedGrant(grant);
    markAsSeen(grant.id); // Mark the grant as seen when selected
    if (isMobile) {
      setShowDetails(true);
    }
  }, [isMobile, markAsSeen]);

  const toggleBookmark = useCallback((grantId: string) => {
    setBookmarkedGrants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(grantId)) {
        newSet.delete(grantId);
      } else {
        newSet.add(grantId);
      }
      return newSet;
    });
  }, []);

  const handleBackToList = useCallback(() => {
    setShowDetails(false);
  }, []);

  // Create a Set for seen grants to pass to components
  const seenGrantsSet = new Set(
    searchResults.filter(grant => isGrantSeen(grant.id)).map(grant => grant.id)
  );

  return {
    selectedGrant,
    showDetails,
    bookmarkedGrants,
    seenGrants: seenGrantsSet,
    handleGrantSelect,
    toggleBookmark,
    handleBackToList,
  };
};
