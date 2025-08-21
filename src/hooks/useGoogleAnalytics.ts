import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Declare gtag as a global function
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const useGoogleAnalytics = () => {
  const location = useLocation();

  // Track page views when location changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-2PZJF08Q21', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Helper function to track custom events
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // Helper function to track search events
  const trackSearch = (searchTerm: string, resultsCount: number) => {
    trackEvent('search', 'engagement', searchTerm, resultsCount);
  };

  // Helper function to track grant interactions
  const trackGrantInteraction = (action: string, grantId: string, grantTitle: string) => {
    trackEvent(action, 'grant_interaction', grantTitle);
  };

  // Helper function to track filter usage
  const trackFilterUsage = (filterType: string, filterValue: string) => {
    trackEvent('filter_applied', 'engagement', `${filterType}: ${filterValue}`);
  };

  // Helper function to track user engagement
  const trackEngagement = (action: string, details?: string) => {
    trackEvent(action, 'engagement', details);
  };

  return {
    trackEvent,
    trackSearch,
    trackGrantInteraction,
    trackFilterUsage,
    trackEngagement,
  };
}; 