
import { useState, useEffect, useCallback } from 'react';
import { Grant, GrantListItem } from '@/types/grant';

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

        console.log('🔄 Loading saved grants from localStorage:', loadedState);
        setSavedGrants(loadedState);
      } catch (error) {
        console.error('❌ Error loading saved grants:', error);
      }
    };

    loadSavedGrants();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    console.log('💾 Saving grants to localStorage:', savedGrants);
    try {
      localStorage.setItem('savedGrants', JSON.stringify(savedGrants.savedApplications));
      localStorage.setItem('activeApplications', JSON.stringify(savedGrants.activeApplications));
      localStorage.setItem('pendingReview', JSON.stringify(savedGrants.pendingReview));
      console.log('✅ Successfully saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }, [savedGrants]);

  const addToSaved = useCallback((grant: Grant | GrantListItem) => {
    console.log('📝 Adding grant to saved:', grant.id, grant.title);
    setSavedGrants(prev => {
      // Check if grant already exists in saved applications
      const existsInSaved = prev.savedApplications.some(g => g.id === grant.id);
      
      if (existsInSaved) {
        console.log('⚠️ Grant already exists in saved, not adding again');
        return prev;
      }

      // Convert GrantListItem to Grant if needed
      const grantToSave = 'description' in grant ? grant : {
        ...grant,
        description: grant.aboutGrant,
        qualifications: '',
        whoCanApply: '',
        importantDates: [],
        fundingRules: [],
        generalInfo: [],
        requirements: [],
        contact: {
          name: '',
          organization: '',
          email: '',
          phone: ''
        },
        templates: [],
        evaluationCriteria: '',
        applicationProcess: ''
      } as Grant;

      const newState = {
        ...prev,
        savedApplications: [...prev.savedApplications, grantToSave]
      };
      console.log('✅ New state after adding to saved:', newState);
      return newState;
    });
  }, []);

  const removeFromSaved = useCallback((grantId: string) => {
    console.log('🗑️ Removing grant from saved:', grantId);
    setSavedGrants(prev => {
      const newState = {
        ...prev,
        savedApplications: prev.savedApplications.filter(g => g.id !== grantId)
      };
      console.log('✅ New state after removing from saved:', newState);
      return newState;
    });
  }, []);

  const startApplication = useCallback((grant: Grant | GrantListItem) => {
    console.log('🚀 Starting application for grant:', grant.id, grant.title);
    setSavedGrants(prev => {
      console.log('📊 Current state before starting application:', prev);
      
      // Remove from saved applications and add to active applications
      const newSavedApplications = prev.savedApplications.filter(g => g.id !== grant.id);
      const existsInActive = prev.activeApplications.some(g => g.id === grant.id);
      
      // Convert GrantListItem to Grant if needed
      const grantToSave = 'description' in grant ? grant : {
        ...grant,
        description: grant.aboutGrant,
        qualifications: '',
        whoCanApply: '',
        importantDates: [],
        fundingRules: [],
        generalInfo: [],
        requirements: [],
        contact: {
          name: '',
          organization: '',
          email: '',
          phone: ''
        },
        templates: [],
        evaluationCriteria: '',
        applicationProcess: ''
      } as Grant;
      
      const newActiveApplications = existsInActive 
        ? prev.activeApplications 
        : [...prev.activeApplications, grantToSave];

      const newState = {
        ...prev,
        savedApplications: newSavedApplications,
        activeApplications: newActiveApplications
      };
      
      console.log('✅ New state after starting application:', newState);
      console.log('📈 Active applications count:', newState.activeApplications.length);
      return newState;
    });
  }, []);

  const submitForReview = useCallback((grant: Grant | GrantListItem) => {
    console.log('📤 Submitting grant for review:', grant.id, grant.title);
    setSavedGrants(prev => {
      // Convert GrantListItem to Grant if needed
      const grantToSave = 'description' in grant ? grant : {
        ...grant,
        description: grant.aboutGrant,
        qualifications: '',
        whoCanApply: '',
        importantDates: [],
        fundingRules: [],
        generalInfo: [],
        requirements: [],
        contact: {
          name: '',
          organization: '',
          email: '',
          phone: ''
        },
        templates: [],
        evaluationCriteria: '',
        applicationProcess: ''
      } as Grant;

      const newState = {
        ...prev,
        activeApplications: prev.activeApplications.filter(g => g.id !== grant.id),
        pendingReview: prev.pendingReview.some(g => g.id === grant.id)
          ? prev.pendingReview
          : [...prev.pendingReview, grantToSave]
      };
      console.log('✅ New state after submitting for review:', newState);
      return newState;
    });
  }, []);

  const removeFromActive = useCallback((grantId: string) => {
    console.log('🗑️ Removing grant from active applications:', grantId);
    setSavedGrants(prev => {
      const newState = {
        ...prev,
        activeApplications: prev.activeApplications.filter(g => g.id !== grantId)
      };
      console.log('✅ New state after removing from active:', newState);
      return newState;
    });
  }, []);

  const removeFromPending = useCallback((grantId: string) => {
    console.log('🗑️ Removing grant from pending review:', grantId);
    setSavedGrants(prev => {
      const newState = {
        ...prev,
        pendingReview: prev.pendingReview.filter(g => g.id !== grantId)
      };
      console.log('✅ New state after removing from pending:', newState);
      return newState;
    });
  }, []);

  // OPTIMIZED: Use Set for O(1) lookup instead of Array.some() O(n) search
  const isGrantSaved = useCallback((grantId: string) => {
    // Create a Set of saved grant IDs for O(1) lookup
    const savedGrantIds = new Set(savedGrants.savedApplications.map(g => g.id));
    const isSaved = savedGrantIds.has(grantId);
    
    // Removed expensive console logging to improve performance
    return isSaved;
  }, [savedGrants.savedApplications]);

  return {
    savedGrants,
    addToSaved,
    removeFromSaved,
    removeFromActive,
    removeFromPending,
    startApplication,
    submitForReview,
    isGrantSaved,
  };
};
