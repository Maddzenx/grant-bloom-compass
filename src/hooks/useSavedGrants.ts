
import { useState, useEffect, useCallback } from 'react';
import { Grant } from '@/types/grant';

interface SavedGrantsState {
  savedApplications: Grant[];
  activeApplications: Grant[];
  pendingReview: Grant[];
}

export const useSavedGrants = () => {
  const [savedGrants, setSavedGrants] = useState<SavedGrantsState>({
    savedApplications: [],
    activeApplications: [],
    pendingReview: [],
  });

  // Load saved grants from localStorage on component mount
  useEffect(() => {
    const loadSavedGrants = () => {
      try {
        const saved = localStorage.getItem('savedGrants');
        const active = localStorage.getItem('activeApplications');
        const pending = localStorage.getItem('pendingReview');

        const loadedState = {
          savedApplications: saved ? JSON.parse(saved) : [],
          activeApplications: active ? JSON.parse(active) : [],
          pendingReview: pending ? JSON.parse(pending) : [],
        };

        console.log('Loading saved grants from localStorage:', loadedState);
        setSavedGrants(loadedState);
      } catch (error) {
        console.error('Error loading saved grants:', error);
      }
    };

    loadSavedGrants();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    console.log('Saving grants to localStorage:', savedGrants);
    localStorage.setItem('savedGrants', JSON.stringify(savedGrants.savedApplications));
    localStorage.setItem('activeApplications', JSON.stringify(savedGrants.activeApplications));
    localStorage.setItem('pendingReview', JSON.stringify(savedGrants.pendingReview));
  }, [savedGrants]);

  const addToSaved = useCallback((grant: Grant) => {
    console.log('Adding grant to saved:', grant.id, grant.title);
    setSavedGrants(prev => {
      const newState = {
        ...prev,
        savedApplications: prev.savedApplications.some(g => g.id === grant.id) 
          ? prev.savedApplications 
          : [...prev.savedApplications, grant]
      };
      console.log('New state after adding to saved:', newState);
      return newState;
    });
  }, []);

  const removeFromSaved = useCallback((grantId: string) => {
    console.log('Removing grant from saved:', grantId);
    setSavedGrants(prev => {
      const newState = {
        ...prev,
        savedApplications: prev.savedApplications.filter(g => g.id !== grantId)
      };
      console.log('New state after removing from saved:', newState);
      return newState;
    });
  }, []);

  const startApplication = useCallback((grant: Grant) => {
    console.log('Starting application for grant:', grant.id, grant.title);
    setSavedGrants(prev => {
      const newState = {
        ...prev,
        savedApplications: prev.savedApplications.filter(g => g.id !== grant.id),
        activeApplications: prev.activeApplications.some(g => g.id === grant.id)
          ? prev.activeApplications
          : [...prev.activeApplications, grant]
      };
      console.log('New state after starting application:', newState);
      return newState;
    });
  }, []);

  const submitForReview = useCallback((grant: Grant) => {
    console.log('Submitting grant for review:', grant.id, grant.title);
    setSavedGrants(prev => {
      const newState = {
        ...prev,
        activeApplications: prev.activeApplications.filter(g => g.id !== grant.id),
        pendingReview: prev.pendingReview.some(g => g.id === grant.id)
          ? prev.pendingReview
          : [...prev.pendingReview, grant]
      };
      console.log('New state after submitting for review:', newState);
      return newState;
    });
  }, []);

  const isGrantSaved = useCallback((grantId: string) => {
    const isSaved = savedGrants.savedApplications.some(g => g.id === grantId) ||
           savedGrants.activeApplications.some(g => g.id === grantId) ||
           savedGrants.pendingReview.some(g => g.id === grantId);
    console.log('Checking if grant is saved:', grantId, 'Result:', isSaved);
    return isSaved;
  }, [savedGrants]);

  return {
    savedGrants,
    addToSaved,
    removeFromSaved,
    startApplication,
    submitForReview,
    isGrantSaved,
  };
};
