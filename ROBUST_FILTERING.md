# Robust Filtering Implementation

## Overview

This implementation addresses the issue where the database contains standardized fields with inconsistent data formats. Some records have data in the format `["Item1", "Item2"]` while others have `["[Item1]", "[Item2]"]`.

## Problem

The semantic search filtering was not working correctly for all grants because the data in the database uses different standards for the following fields:
- `eligible_organisations_standardized`
- `eligible_cost_categories_standardized`

## Solution

### 1. Robust Filtering Utility (`src/utils/robustFiltering.ts`)

Created a comprehensive utility that handles both data formats:

- **`normalizeString(str)`**: Removes brackets from strings
- **`normalizeArray(arr)`**: Normalizes arrays by removing brackets from each item
- **`matchesNormalizedArray(target, array)`**: Checks if a target matches any item in a normalized array
- **`matchesAnyNormalizedArray(targets, array)`**: Checks if any target matches any item in a normalized array
- **`filterByEligibleOrganizations(grants, targetOrganizations)`**: Filters grants by eligible organizations
- **`filterByEligibleCostCategories(grants, targetCategories)`**: Filters grants by cost categories

### 2. Frontend Integration

Updated `src/hooks/useSemanticFiltering.ts` to use the robust filtering for organization filtering:

```typescript
// Organization filter - use robust filtering for eligible organizations
if (filters.organizations.length > 0) {
  const matchingGrants = filterByEligibleOrganizations([grant], filters.organizations);
  if (matchingGrants.length === 0) {
    return false;
  }
}
```

### 3. Backend Integration

Updated both backend filtering functions to handle both data formats:

#### `supabase/functions/filtered-grants-search/index.ts`
- **Industry Sectors Filter**: Now checks for both `["Item"]` and `["[Item]"]` formats
- **Eligible Applicants Filter**: Now checks for both `["Item"]` and `["[Item]"]` formats

#### `supabase/functions/semantic-grant-search/index.ts`
- **Organization Filter**: Now checks for both `["Item"]` and `["[Item]"]` formats using `eligible_organisations_standardized` first, then falls back to Swedish and English fields
- **Enhanced Data Selection**: Now includes standardized fields for better consistency

### 4. Database Query Examples

The backend now generates queries like:
```sql
-- For eligible organizations (semantic search)
eligible_organisations_standardized.cs.["Company"] OR eligible_organisations_standardized.cs.["[Company]"] OR
eligible_organisations_sv.cs.["Company"] OR eligible_organisations_sv.cs.["[Company]"] OR
eligible_organisations_en.cs.["Company"] OR eligible_organisations_en.cs.["[Company]"]

-- For eligible organizations (filtered search)
eligible_organisations_standardized.cs.["Company"] OR eligible_organisations_standardized.cs.["[Company]"]

-- For industry sectors (filtered search)
industry_sectors.cs.["Technology"] OR industry_sectors.cs.["[Technology]"]
```

## Benefits

1. **Comprehensive Coverage**: Handles all data format variations in the database
2. **Backward Compatible**: Works with existing data without requiring database migrations
3. **Type Safe**: Properly typed with TypeScript interfaces
4. **Reusable**: Utility functions can be used across the application
5. **Performance**: Efficient filtering without additional database queries

## Usage

### Frontend
```typescript
import { filterByEligibleOrganizations } from '@/utils/robustFiltering';

const filteredGrants = filterByEligibleOrganizations(grants, ['Company', 'University']);
```

### Backend
The backend automatically handles both formats when filtering by:
- Industry sectors
- Eligible applicants/organizations
- Cost categories

## Testing

The implementation includes comprehensive error handling and edge cases:
- Empty arrays
- Null/undefined values
- Mixed format arrays
- Case-insensitive matching

## Future Enhancements

1. **Cost Category Filtering**: Add frontend UI for filtering by cost categories
2. **Performance Optimization**: Consider database-level normalization for better performance
3. **Caching**: Implement caching for frequently accessed filter results 