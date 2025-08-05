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

  // Clear selection when search results change and current selection is not in results
  useEffect(() => {
    if (searchResults.length === 0) {
      setSelectedGrant(null);
      setShowDetails(false);
    } else if (selectedGrant && !searchResults.find(g => g.id === selectedGrant.id)) {
      // If current selection is not in new results, clear it
      setSelectedGrant(null);
      setShowDetails(false);
    }
  }, [searchResults, selectedGrant]);

  const handleGrantSelect = useCallback((grant: GrantListItem) => {
    // If clicking on already selected grant, toggle details panel
    if (selectedGrant && selectedGrant.id === grant.id) {
      setShowDetails(!showDetails);
    } else {
      // Select new grant and show details
      setSelectedGrant(grant);
      setShowDetails(true);
    }
  }, [selectedGrant, showDetails]);

  const toggleBookmark = useCallback((grantId: string) => {
    const grant = searchResults.find(g => g.id === grantId);
    if (!grant) return;

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
