// Browser test script for Google Analytics
// This simulates what a user would see in the browser console

console.log('🧪 Starting Google Analytics Browser Test...');

// Test 1: Check if gtag is available
if (typeof window !== 'undefined' && window.gtag) {
  console.log('✅ gtag function is available');
} else {
  console.log('❌ gtag function is not available');
}

// Test 2: Check if dataLayer exists
if (typeof window !== 'undefined' && window.dataLayer) {
  console.log('✅ dataLayer is initialized');
  console.log('📊 Current dataLayer length:', window.dataLayer.length);
} else {
  console.log('❌ dataLayer is not initialized');
}

// Test 3: Check if the tracking ID is correct
const scripts = document.querySelectorAll('script[src*="googletagmanager"]');
if (scripts.length > 0) {
  const script = scripts[0];
  const trackingId = script.src.match(/id=([^&]+)/);
  if (trackingId && trackingId[1] === 'G-2PZJF08Q21') {
    console.log('✅ Correct tracking ID found:', trackingId[1]);
  } else {
    console.log('❌ Incorrect tracking ID:', trackingId ? trackingId[1] : 'not found');
  }
} else {
  console.log('❌ Google Analytics script not found');
}

// Test 4: Simulate a page view event
if (typeof window !== 'undefined' && window.gtag) {
  try {
    window.gtag('config', 'G-2PZJF08Q21', {
      page_path: '/test-page',
      page_title: 'Test Page'
    });
    console.log('✅ Successfully sent page view event');
  } catch (error) {
    console.log('❌ Failed to send page view event:', error);
  }
}

// Test 5: Simulate a custom event
if (typeof window !== 'undefined' && window.gtag) {
  try {
    window.gtag('event', 'test_event', {
      event_category: 'testing',
      event_label: 'browser_test',
      value: 1
    });
    console.log('✅ Successfully sent custom event');
  } catch (error) {
    console.log('❌ Failed to send custom event:', error);
  }
}

console.log('🧪 Google Analytics Browser Test completed');
console.log('📊 Check the Network tab for requests to google-analytics.com'); 