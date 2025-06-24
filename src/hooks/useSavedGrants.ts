
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

        setSavedGrants({
          savedApplications: saved ? JSON.parse(saved) : [],
          activeApplications: active ? JSON.parse(active) : [],
          pendingReview: pending ? JSON.parse(pending) : [],
        });
      } catch (error) {
        console.error('Error loading saved grants:', error);
      }
    };

    loadSavedGrants();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('savedGrants', JSON.stringify(savedGrants.savedApplications));
    localStorage.setItem('activeApplications', JSON.stringify(savedGrants.activeApplications));
    localStorage.setItem('pendingReview', JSON.stringify(savedGrants.pendingReview));
  }, [savedGrants]);

  const addToSaved = useCallback((grant: Grant) => {
    setSavedGrants(prev => ({
      ...prev,
      savedApplications: prev.savedApplications.some(g => g.id === grant.id) 
        ? prev.savedApplications 
        : [...prev.savedApplications, grant]
    }));
  }, []);

  const removeFromSaved = useCallback((grantId: string) => {
    setSavedGrants(prev => ({
      ...prev,
      savedApplications: prev.savedApplications.filter(g => g.id !== grantId)
    }));
  }, []);

  const startApplication = useCallback((grant: Grant) => {
    setSavedGrants(prev => ({
      ...prev,
      savedApplications: prev.savedApplications.filter(g => g.id !== grant.id),
      activeApplications: prev.activeApplications.some(g => g.id === grant.id)
        ? prev.activeApplications
        : [...prev.activeApplications, grant]
    }));
  }, []);

  const submitForReview = useCallback((grant: Grant) => {
    setSavedGrants(prev => ({
      ...prev,
      activeApplications: prev.activeApplications.filter(g => g.id !== grant.id),
      pendingReview: prev.pendingReview.some(g => g.id === grant.id)
        ? prev.pendingReview
        : [...prev.pendingReview, grant]
    }));
  }, []);

  const isGrantSaved = useCallback((grantId: string) => {
    return savedGrants.savedApplications.some(g => g.id === grantId) ||
           savedGrants.activeApplications.some(g => g.id === grantId) ||
           savedGrants.pendingReview.some(g => g.id === grantId);
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
