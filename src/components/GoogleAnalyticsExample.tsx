import React from 'react';
import { useGoogleAnalyticsContext } from '@/contexts/GoogleAnalyticsContext';
import { Button } from '@/components/ui/button';

// Example component showing how to use Google Analytics tracking
export const GoogleAnalyticsExample: React.FC = () => {
  const { 
    trackEvent, 
    trackGrantInteraction, 
    trackFilterUsage, 
    trackEngagement 
  } = useGoogleAnalyticsContext();

  const handleGrantClick = () => {
    // Track when a user clicks on a grant
    trackGrantInteraction('grant_clicked', 'grant-123', 'Innovation Grant 2024');
  };

  const handleFilterApplied = () => {
    // Track when a user applies a filter
    trackFilterUsage('organization', 'Sverige');
  };

  const handleButtonClick = () => {
    // Track custom engagement events
    trackEngagement('button_clicked', 'example_button');
  };

  const handleCustomEvent = () => {
    // Track custom events with specific parameters
    trackEvent('custom_action', 'user_interaction', 'example_action', 1);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Google Analytics Tracking Examples</h3>
      
      <div className="space-y-2">
        <Button onClick={handleGrantClick} variant="outline">
          Track Grant Click
        </Button>
        
        <Button onClick={handleFilterApplied} variant="outline">
          Track Filter Applied
        </Button>
        
        <Button onClick={handleButtonClick} variant="outline">
          Track Engagement
        </Button>
        
        <Button onClick={handleCustomEvent} variant="outline">
          Track Custom Event
        </Button>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Check your Google Analytics dashboard to see these events being tracked.</p>
        <p>Events will appear in Real-time reports and can be used for custom reports.</p>
      </div>
    </div>
  );
}; 