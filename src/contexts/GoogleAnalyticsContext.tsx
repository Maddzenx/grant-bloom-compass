import React, { createContext, useContext, ReactNode } from 'react';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

interface GoogleAnalyticsContextType {
  trackEvent: (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => void;
  trackSearch: (searchTerm: string, resultsCount: number) => void;
  trackGrantInteraction: (action: string, grantId: string, grantTitle: string) => void;
  trackFilterUsage: (filterType: string, filterValue: string) => void;
  trackEngagement: (action: string, details?: string) => void;
}

const GoogleAnalyticsContext = createContext<GoogleAnalyticsContextType | undefined>(undefined);

export const useGoogleAnalyticsContext = () => {
  const context = useContext(GoogleAnalyticsContext);
  if (context === undefined) {
    throw new Error('useGoogleAnalyticsContext must be used within a GoogleAnalyticsProvider');
  }
  return context;
};

interface GoogleAnalyticsProviderProps {
  children: ReactNode;
}

export const GoogleAnalyticsProvider: React.FC<GoogleAnalyticsProviderProps> = ({ children }) => {
  const analytics = useGoogleAnalytics();

  return (
    <GoogleAnalyticsContext.Provider value={analytics}>
      {children}
    </GoogleAnalyticsContext.Provider>
  );
}; 