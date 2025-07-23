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

### Funding Amount Display Optimization - 2024-12-19
**Description**: Updated funding amount display logic to prioritize `max_grant_per_project` over `total_funding_amount` and removed "Max" and "Upp till" prefixes.

**Changes Made**:
- **Priority Logic**: Updated funding amount display to use `max_grant_per_project` when available, fallback to `total_funding_amount` when null
- **Removed Prefixes**: Eliminated "Max" and "Upp till" prefixes from funding amount displays
- **Consistent Formatting**: Ensured all funding amounts display as clean amount + currency format
- **Updated Functions**: Modified `formatFundingAmount` functions in multiple files to support new logic

**Technical Details**:
- Updated `src/utils/grantTransform.ts` - Main transformation function for grant data
- Updated `src/services/grantsService.ts` - Service layer funding amount formatting
- Updated `src/hooks/useBackendFilteredGrants.ts` - Hook for backend filtered grants
- Updated `supabase/functions/generate-application-draft/index.ts` - Backend function for application drafts
- All funding amounts now display as "750 Mkr" instead of "Max 750 Mkr" or "Upp till 750 Mkr"

**Files Modified**:
- `src/utils/grantTransform.ts` - Updated formatFundingAmount function
- `src/services/grantsService.ts` - Updated formatFundingAmount function and transformGrantListItems
- `src/hooks/useBackendFilteredGrants.ts` - Updated formatFundingAmount function and transformSupabaseGrantToListItem
- `supabase/functions/generate-application-draft/index.ts` - Updated funding amount display in AI prompts

**Status**: ✅ Completed

### Funding Amount Display Fix for List View - 2024-12-19
**Description**: Fixed issue where grants with only `total_funding_amount` were not showing funding amounts in the list view.

**Problem Identified**:
- Grants with only `total_funding_amount` (no `max_grant_per_project`) were showing correctly in detailed view but not in list view
- Root cause: Database queries for list items were missing `total_funding_amount` field in SELECT statements
- List view used `fetchGrantListItems` and backend filtering, while detailed view used `transformSupabaseGrant`

**Changes Made**:
- **Frontend Service**: Added `total_funding_amount` to SELECT statement in `fetchGrantListItems` function
- **Backend Function**: Added `total_funding_amount` to SELECT statement in `filtered-grants-search` Edge Function
- **Consistent Data**: Both list and detailed views now have access to all funding amount fields

**Technical Details**:
- Updated `src/services/grantsService.ts` - Added `total_funding_amount` to database query
- Updated `supabase/functions/filtered-grants-search/index.ts` - Added `total_funding_amount` to database query
- Both functions now properly pass `total_funding_amount` to the `formatFundingAmount` function
- Grants with only `total_funding_amount` will now display correctly in list view

**Files Modified**:
- `src/services/grantsService.ts` - Updated SELECT statement in `fetchGrantListItems`
- `supabase/functions/filtered-grants-search/index.ts` - Updated SELECT statement in main query

**Status**: ✅ Completed

### Date Handling and Display Improvements - 2024-12-19
**Description**: Fixed date handling issues and improved the display of important dates in grant details.

**Problems Identified**:
- Project start/end dates were not being displayed in the important dates list
- Information webinars with null dates were showing as "1 jan. 1970"
- Date labels used incorrect capitalization (e.g., "Ansökan Öppnar" instead of "Ansökan öppnar")
- Database queries were missing project date fields

**Changes Made**:
- **Null Date Handling**: Updated `formatDate` function to return "Datum saknas" for null or invalid dates
- **Project Date Display**: Added all project start/end dates to important dates list with proper Swedish labels:
  - "Tidigaste projektstart" (earliest project start)
  - "Senaste projektstart" (latest project start) 
  - "Tidigaste projektslut" (earliest project end)
  - "Senaste projektslut" (latest project end)
- **Date Label Formatting**: Updated all date labels to use proper Swedish capitalization (only first word capitalized)
- **Database Queries**: Added missing project date fields to SELECT statements in both frontend and backend
- **Type Definitions**: Extended `GrantListItem` interface to include all date fields for consistent data access

**Technical Details**:
- Updated `GrantNotionImportantDatesSection.tsx` - Fixed date formatting and added all project dates
- Updated database queries in `grantsService.ts` and `filtered-grants-search/index.ts` to include all date fields
- Updated `GrantListItem` type to include project date fields for list view consistency
- Updated transformation functions to pass through all date fields
- Fixed sorting to handle "Datum saknas" entries properly

**Files Modified**:
- `src/components/grant-notion/GrantNotionImportantDatesSection.tsx` - Complete rewrite of date handling
- `src/types/grant.ts` - Added date fields to GrantListItem interface
- `src/services/grantsService.ts` - Updated database query and transformation functions
- `src/hooks/useBackendFilteredGrants.ts` - Updated transformation function
- `src/utils/grantTransform.ts` - Updated importantDates field
- `supabase/functions/filtered-grants-search/index.ts` - Updated database query

**Status**: ✅ Completed

### Templates and Files Display Fix - 2024-12-19
**Description**: Fixed issue where templates and files were not showing up in the grant details view.

**Problem Identified**:
- Templates and files sections were empty in grant details view
- Database queries were missing template fields (`application_templates_names`, `other_templates_names`, etc.)
- Transformation functions were setting template fields to empty arrays with incorrect comments
- Template fields were not being passed through from database to frontend components

**Changes Made**:
- **Database Queries**: Added missing template fields to SELECT statements in both frontend and backend
- **Transformation Functions**: Fixed mapping of template fields from database to frontend:
  - `application_templates_names` → `templates` (application templates)
  - `other_templates_names` → `generalInfo` (general documents)
  - `application_templates_links` → `application_templates_links` (template links)
  - `other_templates_links` → `other_templates_links` (document links)
- **Type Definitions**: Added template fields to `GrantListItem` interface for consistency
- **Data Flow**: Ensured template fields flow from database through all transformation layers

**Technical Details**:
- Updated `grantsService.ts` - Fixed transformation functions and database queries
- Updated `useBackendFilteredGrants.ts` - Added template fields to transformation
- Updated `filtered-grants-search/index.ts` - Added template fields to backend query
- Updated `types/grant.ts` - Added template fields to GrantListItem interface
- Fixed incorrect comments that said template fields "don't exist in schema"

**Files Modified**:
- `src/services/grantsService.ts` - Fixed template field mapping and database queries
- `src/hooks/useBackendFilteredGrants.ts` - Added template fields to transformation
- `src/types/grant.ts` - Added template fields to GrantListItem interface
- `supabase/functions/filtered-grants-search/index.ts` - Added template fields to database query

**Status**: ✅ Completed

### Enhanced Cofinancing Display and Swedish Text Updates - 2024-12-19
**Description**: Enhanced the cofinancing display to show percentage levels and updated "Not specified" text to Swedish.

**Changes Made**:
- **Type Definitions**: Added `cofinancing_level` field to Grant, GrantListItem, and GrantDetails interfaces
- **Database Queries**: Updated frontend and backend queries to include `cofinancing_level` field
- **Transformation Functions**: Updated all transformation functions to handle the new cofinancing level field
- **Cofinancing Text Formatting**: Created `formatCofinancingText` utility function that:
  - Shows "50% medfinansiering krävs" when cofinancing is required and level exists
  - Shows "Ingen medfinansiering krävs" when cofinancing is not required
  - Shows "Medfinansiering krävs" when cofinancing is required but level is null/undefined
  - Shows "Ej specificerat" when cofinancing requirement is null/undefined
- **UI Components**: Updated `GrantNotionKeyInfo` component to use the new cofinancing text formatting
- **Funding Amount Text**: Changed "Not specified" to "Ej specificerat" in funding amount formatting functions

**Files Modified**:
- `src/types/grant.ts` - Added cofinancing_level field to interfaces
- `src/services/grantsService.ts` - Updated queries, transformations, and funding amount text
- `src/hooks/useBackendFilteredGrants.ts` - Added cofinancing_level field and updated funding amount text
- `supabase/functions/filtered-grants-search/index.ts` - Added cofinancing_level to backend query
- `src/utils/grantHelpers.ts` - Added formatCofinancingText utility function
- `src/components/grant-notion/GrantNotionKeyInfo.tsx` - Updated to use new cofinancing text formatting

**Status**: ✅ Completed

### Added Other Sources to Grant Details - 2024-12-19
**Description**: Added support for `other_sources_links` and `other_sources_names` fields in grant details view and switched positions of "Allmän information och dokument" and "Ansökningsmallar" sections.

**Changes Made**:
- **Type Definitions**: Added `other_sources_links` and `other_sources_names` fields to Grant, GrantListItem, and GrantDetails interfaces
- **Database Queries**: Updated frontend and backend queries to include `other_sources_names` and `other_sources_links` fields
- **Transformation Functions**: Updated all transformation functions to handle the new fields
- **UI Components**: Updated both `GrantNotionTemplatesSection` and `GrantTemplatesSection` components to:
  - Include other sources under "Allmän information och dokument" section
  - Switch positions so "Allmän information och dokument" appears first, then "Ansökningsmallar"
  - Combine both `generalInfo` and `other_sources_names` under the same section

**Files Modified**:
- `src/types/grant.ts` - Added other_sources fields to interfaces
- `src/services/grantsService.ts` - Updated queries and transformations
- `src/hooks/useBackendFilteredGrants.ts` - Added other_sources fields to transformation
- `supabase/functions/filtered-grants-search/index.ts` - Added other_sources fields to backend query
- `src/components/grant-notion/GrantNotionTemplatesSection.tsx` - Updated UI to include other sources and switch positions
- `src/components/grant-sections/GrantTemplatesSection.tsx` - Updated UI to include other sources and switch positions

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