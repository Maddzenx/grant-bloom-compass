import React, { useEffect } from 'react';
import { useGoogleAnalyticsContext } from '@/contexts/GoogleAnalyticsContext';
import { Button } from '@/components/ui/button';

export const GoogleAnalyticsTest: React.FC = () => {
  const { 
    trackEvent, 
    trackSearch, 
    trackGrantInteraction, 
    trackFilterUsage, 
    trackEngagement 
  } = useGoogleAnalyticsContext();

  // Test that the context is working on component mount
  useEffect(() => {
    console.log('🧪 GoogleAnalyticsTest: Context is available');
    trackEngagement('test_component_mounted', 'GoogleAnalyticsTest');
  }, [trackEngagement]);

  const runTests = () => {
    console.log('🧪 Running Google Analytics tests...');
    
    // Test 1: Track a custom event
    trackEvent('test_event', 'testing', 'manual_test', 1);
    console.log('✅ Sent test_event');
    
    // Test 2: Track a search
    trackSearch('test search term', 5);
    console.log('✅ Sent test search');
    
    // Test 3: Track a grant interaction
    trackGrantInteraction('test_click', 'test-grant-123', 'Test Grant');
    console.log('✅ Sent test grant interaction');
    
    // Test 4: Track filter usage
    trackFilterUsage('test_filter', 'test_value');
    console.log('✅ Sent test filter usage');
    
    // Test 5: Track engagement
    trackEngagement('test_button_click', 'test_button');
    console.log('✅ Sent test engagement');
    
    console.log('🧪 All Google Analytics tests completed');
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Google Analytics Test</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click the button below to test Google Analytics tracking functions.
        Check the browser console and Google Analytics Real-time reports.
      </p>
      <Button onClick={runTests} variant="outline">
        Run Google Analytics Tests
      </Button>
    </div>
  );
}; 