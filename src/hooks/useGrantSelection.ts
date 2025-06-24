
import { useState, useEffect, useCallback } from 'react';
import { Grant } from '@/types/grant';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSavedGrantsContext } from '@/contexts/SavedGrantsContext';

interface UseGrantSelectionProps {
  searchResults: Grant[];
}

export const useGrantSelection = ({ searchResults }: UseGrantSelectionProps) => {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [bookmarkedGrants, setBookmarkedGrants] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();
  const { isGrantSaved, addToSaved, removeFromSaved, savedGrants } = useSavedGrantsContext();

  // Sync bookmarked grants with saved grants context
  useEffect(() => {
    console.log('🔄 Syncing bookmarked grants with saved grants context');
    const updateBookmarkedGrants = () => {
      const newBookmarkedGrants = new Set<string>();
      searchResults.forEach(grant => {
        if (isGrantSaved(grant.id)) {
          newBookmarkedGrants.add(grant.id);
        }
      });
      console.log('📊 Updated bookmarked grants:', Array.from(newBookmarkedGrants));
      setBookmarkedGrants(newBookmarkedGrants);
    };

    updateBookmarkedGrants();
  }, [searchResults, isGrantSaved, savedGrants]);

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
    if (isMobile) {
      setShowDetails(true);
    }
  }, [isMobile]);

  const toggleBookmark = useCallback((grantId: string) => {
    const grant = searchResults.find(g => g.id === grantId);
    if (!grant) return;

    console.log('🔖 Toggle bookmark for grant:', grantId);
    const currentlyBookmarked = isGrantSaved(grantId);
    
    setBookmarkedGrants(prev => {
      const newSet = new Set(prev);
      if (currentlyBookmarked) {
        newSet.delete(grantId);
        removeFromSaved(grantId);
        console.log('🗑️ Removed from bookmarks:', grantId);
      } else {
        newSet.add(grantId);
        addToSaved(grant);
        console.log('📝 Added to bookmarks:', grantId);
      }
      return newSet;
    });
  }, [searchResults, addToSaved, removeFromSaved, isGrantSaved]);

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
