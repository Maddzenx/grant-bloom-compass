// Simple test to verify Google Analytics is working
console.log('🧪 Testing Google Analytics Implementation...');

// Test 1: Check if gtag is available globally
if (typeof window !== 'undefined' && window.gtag) {
  console.log('✅ gtag function is available globally');
  
  // Test 2: Check if dataLayer exists
  if (window.dataLayer) {
    console.log('✅ dataLayer is initialized');
  } else {
    console.log('❌ dataLayer is not initialized');
  }
  
  // Test 3: Test sending a custom event
  try {
    window.gtag('event', 'test_event', {
      event_category: 'testing',
      event_label: 'implementation_test',
      value: 1
    });
    console.log('✅ Successfully sent test event to Google Analytics');
  } catch (error) {
    console.log('❌ Failed to send test event:', error);
  }
  
} else {
  console.log('❌ gtag function is not available');
}

// Test 4: Check if the tracking ID is correct
const scripts = document.querySelectorAll('script[src*="googletagmanager"]');
if (scripts.length > 0) {
  const script = scripts[0];
  const trackingId = script.src.match(/id=([^&]+)/);
  if (trackingId && trackingId[1] === 'G-2PZJF08Q21') {
    console.log('✅ Correct tracking ID found:', trackingId[1]);
  } else {
    console.log('❌ Incorrect or missing tracking ID');
  }
} else {
  console.log('❌ Google Analytics script not found');
}

console.log('🧪 Google Analytics test completed'); 