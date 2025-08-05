/**
 * Utility functions for robust filtering of standardized fields
 * Handles different data formats: ["Item1", "Item2"] vs ["[Item1]", "[Item2]"]
 */

/**
 * Normalizes a string by removing brackets and trimming whitespace
 */
export const normalizeString = (str: string): string => {
  if (!str) return '';
  return str.replace(/^\[|\]$/g, '').trim();
};

/**
 * Normalizes an array of strings by removing brackets from each item
 */
export const normalizeArray = (arr: string[] | null | undefined): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => normalizeString(item)).filter(item => item.length > 0);
};

/**
 * Checks if a target string matches any item in a normalized array
 * Handles both formats: ["Item1", "Item2"] and ["[Item1]", "[Item2]"]
 */
export const matchesNormalizedArray = (
  target: string, 
  array: string[] | null | undefined
): boolean => {
  if (!target || !Array.isArray(array)) return false;
  
  const normalizedTarget = normalizeString(target);
  const normalizedArray = normalizeArray(array);
  
  return normalizedArray.some(item => 
    item.toLowerCase() === normalizedTarget.toLowerCase()
  );
};

/**
 * Checks if any of the target strings match any item in a normalized array
 */
export const matchesAnyNormalizedArray = (
  targets: string[], 
  array: string[] | null | undefined
): boolean => {
  if (!targets.length || !Array.isArray(array)) return false;
  
  return targets.some(target => matchesNormalizedArray(target, array));
};

interface GrantWithOrganizations {
  id?: string;
  organization?: string;
  eligible_organisations?: string[];
  fundingRules?: string[];
}

/**
 * Filters an array of grants based on eligible organizations
 * Handles both data formats robustly
 */
export const filterByEligibleOrganizations = (
  grants: GrantWithOrganizations[], 
  targetOrganizations: string[]
): GrantWithOrganizations[] => {
  if (!targetOrganizations.length) return grants;
  
  return grants.filter(grant => {
    // Check against eligible_organisations field
    if (grant.eligible_organisations) {
      if (matchesAnyNormalizedArray(targetOrganizations, grant.eligible_organisations)) {
        return true;
      }
    }
    
    // Also check against organization field as fallback
    if (grant.organization && targetOrganizations.includes(grant.organization)) {
      return true;
    }
    
    return false;
  });
};

/**
 * Filters an array of grants based on eligible cost categories
 * Handles both data formats robustly
 */
export const filterByEligibleCostCategories = (
  grants: GrantWithOrganizations[], 
  targetCategories: string[]
): GrantWithOrganizations[] => {
  if (!targetCategories.length) return grants;
  
  return grants.filter(grant => {
    if (grant.fundingRules) {
      return matchesAnyNormalizedArray(targetCategories, grant.fundingRules);
    }
    return false;
  });
};

/**
 * Creates a robust filter function that can handle different data formats
 */
export const createRobustFilter = (fieldName: string) => {
  return (grants: GrantWithOrganizations[], targetValues: string[]): GrantWithOrganizations[] => {
    if (!targetValues.length) return grants;
    
    return grants.filter(grant => {
      const fieldValue = grant[fieldName as keyof GrantWithOrganizations];
      if (Array.isArray(fieldValue)) {
        return matchesAnyNormalizedArray(targetValues, fieldValue);
      }
      return false;
    });
  };
}; 