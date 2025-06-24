
import React, { createContext, useContext } from 'react';
import { useSavedGrants } from '@/hooks/useSavedGrants';
import { Grant } from '@/types/grant';

interface SavedGrantsContextType {
  savedGrants: {
    savedApplications: Grant[];
    activeApplications: Grant[];
    pendingReview: Grant[];
  };
  addToSaved: (grant: Grant) => void;
  removeFromSaved: (grantId: string) => void;
  startApplication: (grant: Grant) => void;
  submitForReview: (grant: Grant) => void;
  isGrantSaved: (grantId: string) => boolean;
}

const SavedGrantsContext = createContext<SavedGrantsContextType | undefined>(undefined);

export const SavedGrantsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedGrantsHook = useSavedGrants();

  return (
    <SavedGrantsContext.Provider value={savedGrantsHook}>
      {children}
    </SavedGrantsContext.Provider>
  );
};

export const useSavedGrantsContext = () => {
  const context = useContext(SavedGrantsContext);
  if (context === undefined) {
    throw new Error('useSavedGrantsContext must be used within a SavedGrantsProvider');
  }
  return context;
};
