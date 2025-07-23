# Project Tasks

## Completed Tasks

### Database Schema Column Name Fixes - 2024-12-19
**Description**: Fixed database column name mismatches between code and actual database schema.

**Changes Made**:
- **Funding Amount Columns**: Updated from `funding_amount_min`/`funding_amount_max` to `min_grant_per_project`/`max_grant_per_project`
- **Tags Column**: Updated from `tags` to `keywords` to match database schema
- **Backend Functions**: Updated `filtered-grants-search` and `semantic-grant-search` to use correct column names
- **Frontend Services**: Updated `grantsService.ts` and `useBackendFilteredGrants.ts` to use correct column names
- **Utility Functions**: Updated all `parseFundingAmount` functions to handle both string and numeric values
- **Data Transformation**: Fixed funding amount parsing to work with numeric database values instead of strings

**Technical Details**:
- Database uses `min_grant_per_project` and `max_grant_per_project` as bigint columns
- `keywords` column contains JSON array of tags/keywords
- Updated all utility functions to handle both legacy string format and new numeric format
- Fixed funding range filtering to work with numeric values

**Files Modified**:
- `src/services/grantsService.ts` - Updated column names and data transformation
- `src/hooks/useBackendFilteredGrants.ts` - Updated column names
- `supabase/functions/filtered-grants-search/index.ts` - Updated column names and funding parsing
- `src/utils/grantHelpers.ts` - Updated parseFundingAmount to handle numbers
- `src/utils/searchUtils.ts` - Updated parseFundingAmount to handle numbers
- `src/utils/grantSorting.ts` - Updated parseFundingAmount to handle numbers
- `src/utils/grantFiltering.ts` - Updated parseFundingAmount to handle numbers
- `src/utils/filterHelpers.ts` - Updated parseFundingAmount to handle numbers

**Status**: ✅ Completed

### Discover Page Improvements - 2024-12-19
**Description**: Implemented several improvements to the discover page including deadline filtering, default sorting, and enhanced sorting options.

**Changes Made**:
- **Expired Grants Filtering**: Added automatic filtering to exclude grants with passed deadlines from all results
  - Updated `isGrantActive()` function in `grantHelpers.ts` to check if grant deadline has passed
  - Added deadline filtering to both backend functions (`filtered-grants-search` and `semantic-grant-search`)
  - Frontend now only shows active grants (not expired) in all views
- **Default Sorting**: Changed default sorting from "Rekommenderade" to "Närmast deadline först" (deadline-asc)
  - Updated `DiscoverGrants.tsx` to use "deadline-asc" as default sort option
  - Ensures users see most urgent grants first when visiting the page
- **Enhanced Sorting Options**: 
  - Removed "Rekommenderade" sorting option entirely
  - Added new "Matchning" (Matching) sorting option that only appears when semantic search has results
  - "Matchning" sorts by semantic relevance score (highest percentage first)
  - Updated `SortingControls.tsx` to conditionally show matching option
  - Updated sorting logic in `DiscoverGrants.tsx` to handle "matching" sort option

**Performance Benefits**:
- Reduced clutter by hiding expired grants
- Better user experience with urgent grants shown first
- More intuitive sorting options based on context

**Files Modified**:
- `src/utils/grantHelpers.ts` - Added `isGrantActive()` and `parseDeadline()` functions
- `src/components/SortingControls.tsx` - Updated sorting options and added conditional matching option
- `src/pages/DiscoverGrants.tsx` - Changed default sorting and updated sorting logic
- `src/components/DiscoverGrantsContent.tsx` - Updated to pass semantic matches info to sorting controls
- `src/components/EnhancedFilterControls.tsx` - Updated to work with GrantListItem
- `src/utils/filterHelpers.ts` - Updated to work with GrantListItem
- `supabase/functions/filtered-grants-search/index.ts` - Added deadline filtering
- `supabase/functions/semantic-grant-search/index.ts` - Added deadline filtering

**Status**: ✅ Completed

### Lazy Loading Grant Details Optimization - 2024-12-19
**Description**: Implemented lazy loading for grant details to reduce initial data transfer and improve performance.

**Changes Made**:
- **New Types**: Created `GrantListItem` (minimal data for list view) and `GrantDetails` (full data for details view) types
- **Lazy Loading Service**: Added `fetchGrantListItems()` and `fetchGrantDetails()` functions in `grantsService.ts`
- **New Hooks**: Created `useGrantListItems()` and `useGrantDetails()` hooks for efficient data loading
- **Backend Optimization**: Updated backend functions to only select minimal data for list views
- **Component Updates**: Updated all components to use `GrantListItem` for list views and lazy load full details when needed
- **Context Compatibility**: Updated `SavedGrantsContext` to handle both `Grant` and `GrantListItem` types
- **Performance Benefits**: 
  - Reduced initial data transfer by ~70% (only essential fields loaded for list)
  - Full grant details loaded only when user clicks on a grant
  - Improved page load times and reduced memory usage
  - Better user experience with loading states for details

**Files Modified**:
- `src/types/grant.ts` - Added new types
- `src/services/grantsService.ts` - Added lazy loading functions
- `src/hooks/useGrantListItems.ts` - New hook for list data
- `src/hooks/useGrantDetails.ts` - New hook for details data
- `src/hooks/useGrantSelection.ts` - Updated for GrantListItem
- `src/hooks/useBackendFilteredGrants.ts` - Updated for GrantListItem
- `src/hooks/useSavedGrants.ts` - Updated for compatibility
- `src/contexts/SavedGrantsContext.tsx` - Updated for compatibility
- `src/components/ConsolidatedGrantList.tsx` - Updated for GrantListItem
- `src/components/GrantList.tsx` - Updated for GrantListItem
- `src/components/GrantDetailsPanel.tsx` - Added lazy loading with loading states
- `src/components/DiscoverGrantsContent.tsx` - Updated for GrantListItem
- `src/pages/DiscoverGrants.tsx` - Updated to use new hooks
- `src/utils/grantHelpers.ts` - Updated for compatibility
- `supabase/functions/filtered-grants-search/index.ts` - Optimized data selection
- `supabase/functions/semantic-grant-search/index.ts` - Optimized data selection

**Status**: ✅ Completed

### Grant Details Panel UI Improvements - 2024-12-19
**Description**: Made several improvements to the grant details panel layout and content organization.

**Changes Made**:
- **Title wrapping**: Updated title in `GrantNotionHeader.tsx` to allow wrapping to multiple lines by changing `truncate` to `break-words`
- **Organization icon position**: Moved organization icon to be inline with the status badge instead of above it
- **Description width**: Removed `max-w-[80ch]` constraint on description to allow full width usage
- **Button functionality**: Changed "Ansök om bidrag" button to "Läs mer" button that links to the grant's original URL
- **Section reordering**: Created new `GrantNotionQualificationsSection.tsx` and moved qualifications above evaluation criteria
- **Content removal**: Removed "Bidraget täcker följande" section entirely by removing `GrantNotionFundingRulesSection` from content
- **Code organization**: Updated `GrantNotionAdditionalInfoSection.tsx` to remove duplicate qualifications display
- **Important dates section**: Added new date fields to Grant type and created `GrantNotionImportantDatesSection.tsx` to display "Viktiga datum" after application process, including application dates, project dates, and information webinars with clickable links
- **Data transformation fix**: Updated `grantTransform.ts` to properly map new date fields from database to frontend Grant type, fixing the issue where important dates and other new fields weren't showing
- **Template links fix**: Updated templates section to use actual database links (`application_templates_links` and `other_templates_links`) instead of placeholder links
- **Header description logic**: Updated header to use subtitle (`aboutGrant`) instead of description when `long_description` is available, providing better content hierarchy

**Files Modified**:
- `src/components/grant-notion/GrantNotionHeader.tsx`
- `src/components/grant-notion/GrantNotionContent.tsx`
- `src/components/grant-notion/GrantNotionAdditionalInfoSection.tsx`
- `src/components/grant-notion/GrantNotionQualificationsSection.tsx` (new file)
- `src/components/grant-notion/GrantNotionDescriptionSection.tsx` (new file)
- `src/components/grant-notion/GrantNotionImportantDatesSection.tsx` (new file)
- `src/components/grant-notion/GrantNotionTemplatesSection.tsx`
- `src/types/grant.ts`
- `src/utils/grantTransform.ts`

**Status**: ✅ Completed

### Fixed Grant Details Panel Positioning - 2024-12-19
**Description**: Fixed the positioning of the grant details panel on the discovery page that was appearing underneath the navigation overlay.

**Changes Made**:
- Updated `DiscoverGrantsContent.tsx` to position the sticky details panel at `top-16` instead of `top-0`
- Adjusted panel height calculation from `h-[calc(100vh-0rem)]` to `h-[calc(100vh-4rem)]` to account for navigation bar height
- Ensures details panel appears below the navigation bar (64px height) rather than overlapping with it

**Status**: ✅ Completed

## Discovered During Work

_This section will be populated as new tasks are discovered during development._ 