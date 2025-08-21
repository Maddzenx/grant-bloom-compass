# Google Analytics Integration

This project has been configured with Google Analytics 4 (GA4) tracking to monitor user behavior and engagement.

## Setup

### 1. Google Analytics Code
The Google Analytics tracking code has been added to `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-2PZJF08Q21"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-2PZJF08Q21');
</script>
```

### 2. React Integration
The application uses a custom React hook and context provider for tracking:

- **Hook**: `src/hooks/useGoogleAnalytics.ts`
- **Context**: `src/contexts/GoogleAnalyticsContext.tsx`
- **Provider**: Added to `src/App.tsx`

## Usage

### Basic Usage
Import and use the Google Analytics context in any component:

```tsx
import { useGoogleAnalyticsContext } from '@/contexts/GoogleAnalyticsContext';

const MyComponent = () => {
  const { trackEvent, trackSearch, trackGrantInteraction } = useGoogleAnalyticsContext();
  
  const handleClick = () => {
    trackEvent('button_click', 'engagement', 'example_button');
  };
  
  return <button onClick={handleClick}>Click me</button>;
};
```

### Available Tracking Functions

#### 1. `trackEvent(action, category, label?, value?)`
Track custom events with specific parameters.

```tsx
trackEvent('button_click', 'engagement', 'cta_button', 1);
```

#### 2. `trackSearch(searchTerm, resultsCount)`
Track search events with the search term and number of results.

```tsx
trackSearch('innovation grants', 15);
```

#### 3. `trackGrantInteraction(action, grantId, grantTitle)`
Track interactions with specific grants.

```tsx
trackGrantInteraction('grant_clicked', 'grant-123', 'Innovation Grant 2024');
```

#### 4. `trackFilterUsage(filterType, filterValue)`
Track when users apply filters.

```tsx
trackFilterUsage('organization', 'Sverige');
```

#### 5. `trackEngagement(action, details?)`
Track general user engagement events.

```tsx
trackEngagement('page_viewed', 'homepage');
```

## Automatic Tracking

### Page Views
Page views are automatically tracked when users navigate between routes using React Router.

### Search Tracking
Search events are automatically tracked in the DiscoverGrants page with:
- Search term
- Number of results
- Search mode (AI vs Regular)

## Google Analytics Dashboard

### Real-time Reports
- Go to your Google Analytics dashboard
- Navigate to Reports > Realtime
- You'll see live data including:
  - Active users
  - Page views
  - Events
  - Traffic sources

### Custom Reports
You can create custom reports based on the events being tracked:

1. **Search Analysis**: Track which search terms are most popular
2. **Grant Engagement**: See which grants get the most clicks
3. **Filter Usage**: Understand which filters are most commonly used
4. **User Journey**: Track how users navigate through your application

### Event Parameters
Events are tracked with the following parameters:
- `event_category`: The category of the event (e.g., 'engagement', 'grant_interaction')
- `event_label`: Additional context about the event
- `value`: Numeric value associated with the event

## Privacy Considerations

### GDPR Compliance
- The tracking code respects user privacy settings
- No personally identifiable information (PII) is tracked
- Users can opt out through browser settings

### Data Retention
- Google Analytics data retention is controlled by your GA4 property settings
- Consider setting appropriate data retention periods for your use case

## Testing

### Development Testing
1. Open your browser's developer tools
2. Go to the Network tab
3. Filter by "google-analytics" or "gtag"
4. Perform actions in your app
5. Verify that tracking requests are being sent

### Production Verification
1. Deploy your application
2. Visit your Google Analytics Real-time reports
3. Perform test actions on your live site
4. Verify that events appear in real-time

## Troubleshooting

### Common Issues

1. **Events not appearing in GA4**
   - Check that the tracking ID is correct
   - Verify that the gtag script is loading
   - Check browser console for errors

2. **Page views not tracking**
   - Ensure the GoogleAnalyticsProvider is wrapping your Router
   - Check that useLocation is working correctly

3. **Custom events not firing**
   - Verify that the context is available in your component
   - Check that the tracking function is being called

### Debug Mode
To enable debug mode, add this to your tracking code:

```tsx
// In development only
if (process.env.NODE_ENV === 'development') {
  window.gtag('config', 'G-2PZJF08Q21', {
    debug_mode: true
  });
}
```

## Example Implementation

See `src/components/GoogleAnalyticsExample.tsx` for a complete example of how to use all tracking functions.

## Support

For questions about Google Analytics integration, refer to:
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [gtag.js Reference](https://developers.google.com/tag-platform/gtagjs/reference) 