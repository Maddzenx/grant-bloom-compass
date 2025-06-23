
import { useState, useEffect, useCallback } from 'react';
import { Grant } from '@/types/grant';
import { useIsMobile } from '@/hooks/use-mobile';

interface UseGrantSelectionProps {
  searchResults: Grant[];
}

export const useGrantSelection = ({ searchResults }: UseGrantSelectionProps) => {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());
  const [hasInitialized, setHasInitialized] = useState(false);
  const isMobile = useIsMobile();

  // Auto-select first grant when grants are loaded or search changes
  useEffect(() => {
    console.log('🔥 useGrantSelection effect triggered:', { 
      searchResultsLength: searchResults.length, 
      hasInitialized,
      selectedGrantId: selectedGrant?.id 
    });

    // Only proceed if we have results and haven't initialized yet, or if the current selection is invalid
    if (searchResults.length > 0) {
      if (!hasInitialized) {
        console.log('🔥 First time initialization - selecting first grant:', searchResults[0]);
        setSelectedGrant(searchResults[0]);
        setHasInitialized(true);
      } else if (selectedGrant && !searchResults.find(g => g.id === selectedGrant.id)) {
        console.log('🔥 Current selection not in filtered results, selecting first filtered grant');
        setSelectedGrant(searchResults[0]);
      }
    } else if (searchResults.length === 0 && hasInitialized) {
      console.log('🔥 No grants available after initialization, clearing selection');
      setSelectedGrant(null);
    }
  }, [searchResults, selectedGrant, hasInitialized]);

  const handleGrantSelect = useCallback((grant: Grant) => {
    console.log('🔥 Grant selected:', grant);
    setSelectedGrant(grant);
    if (isMobile) {
      setShowDetails(true);
    }
  }, [isMobile]);

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

  return {
    selectedGrant,
    showDetails,
    bookmarkedGrants,
    handleGrantSelect,
    toggleBookmark,
    handleBackToList,
  };
};
