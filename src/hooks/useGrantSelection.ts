import { useState, useEffect, useCallback } from 'react';
import { GrantListItem } from '@/types/grant';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSavedGrantsContext } from '@/contexts/SavedGrantsContext';

interface UseGrantSelectionProps {
  searchResults: GrantListItem[];
}

interface UseGrantSelectionReturn {
  selectedGrant: GrantListItem | null;
  showDetails: boolean;
  handleGrantSelect: (grant: GrantListItem) => void;
  toggleBookmark: (grantId: string) => void;
  handleBackToList: () => void;
  setSelectedGrant: (grant: GrantListItem | null) => void;
}

export const useGrantSelection = ({ searchResults }: UseGrantSelectionProps): UseGrantSelectionReturn => {
  const [selectedGrant, setSelectedGrant] = useState<GrantListItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const isMobile = useIsMobile();
  const { isGrantSaved, addToSaved, removeFromSaved } = useSavedGrantsContext();

  // Auto-select first grant when results change, but only if we don't have a valid selection
  useEffect(() => {
    // Removed expensive console logging to improve performance

    if (searchResults.length > 0) {
      // If no selection or current selection is not in results, select first
      if (!selectedGrant || !searchResults.find(g => g.id === selectedGrant.id)) {
        setSelectedGrant(searchResults[0]);
      }
    } else if (searchResults.length === 0) {
      setSelectedGrant(null);
    }
  }, [searchResults, selectedGrant]);

  const handleGrantSelect = useCallback((grant: GrantListItem) => {
    // Removed expensive console logging to improve performance
    // Always set the selected grant and show details when a grant is clicked
    setSelectedGrant(grant);
    setShowDetails(true);
  }, []);

  const toggleBookmark = useCallback((grantId: string) => {
    const grant = searchResults.find(g => g.id === grantId);
    if (!grant) return;

    // Removed expensive console logging to improve performance
    const currentlyBookmarked = isGrantSaved(grantId);
    
    if (currentlyBookmarked) {
      removeFromSaved(grantId);
    } else {
      addToSaved(grant);
    }
  }, [searchResults, addToSaved, removeFromSaved, isGrantSaved]);

  const handleBackToList = useCallback(() => {
    setShowDetails(false);
  }, []);

  return {
    selectedGrant,
    showDetails,
    handleGrantSelect,
    toggleBookmark,
    handleBackToList,
    setSelectedGrant,
  };
};
