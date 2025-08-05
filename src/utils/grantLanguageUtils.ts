/**
 * Utility functions for handling grant language selection
 */

export type GrantLanguage = 'sv' | 'en';

/**
 * Determines the appropriate language for a grant based on the organization
 * @param organisation - The organization name
 * @returns The language to use for this grant
 */
export const getGrantLanguage = (organisation: string | null): GrantLanguage => {
  if (!organisation) return 'sv'; // Default to Swedish
  
  // EU grants (Europeiska Kommissionen) use English
  if (organisation === 'Europeiska Kommissionen') {
    return 'en';
  }
  
  // All other grants use Swedish
  return 'sv';
};

/**
 * Gets the appropriate field suffix for a given language
 * @param language - The language to get the suffix for
 * @returns The field suffix (_sv or _en)
 */
export const getLanguageSuffix = (language: GrantLanguage): string => {
  return `_${language}`;
};

/**
 * Builds a language-aware field selection for database queries
 * @param baseFields - Array of base field names (without language suffix)
 * @param language - The language to use
 * @returns Object with field mappings for database query
 */
export const buildLanguageAwareFields = (
  baseFields: string[], 
  language: GrantLanguage
): Record<string, string> => {
  const fieldMappings: Record<string, string> = {};
  
  baseFields.forEach(field => {
    // Check if this field has language-specific versions
    const hasLanguageVersion = [
      'title', 'subtitle', 'description', 'eligibility', 'evaluation_criteria',
      'application_process', 'consortium_requirement', 'region',
      'eligible_organisations', 'eligible_cost_categories', 'information_webinar_names',
      'application_templates_names', 'other_sources_names', 'contact_title',
      'other_templates_names', 'other_important_dates_labels'
    ].includes(field);
    
    if (hasLanguageVersion) {
      fieldMappings[field] = `${field}_${language}`;
    } else {
      fieldMappings[field] = field;
    }
  });
  
  return fieldMappings;
};

/**
 * Creates a SELECT statement for language-aware grant queries
 * @param fields - Array of field names to select
 * @param language - The language to use
 * @returns Formatted SELECT statement string
 */
export const createLanguageAwareSelect = (
  fields: string[], 
  language: GrantLanguage
): string => {
  const fieldMappings = buildLanguageAwareFields(fields, language);
  
  return Object.entries(fieldMappings)
    .map(([alias, field]) => `${field} as ${alias}`)
    .join(', ');
}; 