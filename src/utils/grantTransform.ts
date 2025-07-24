import { Grant } from '@/types/grant';
import { Database } from '@/integrations/supabase/types';

// Use a partial type that matches what we actually select from the database
// Note: Using type assertion since the generated types might be outdated
type PartialSupabaseGrantRow = Pick<
  Database['public']['Tables']['grant_call_details']['Row'],
  | 'id'
  | 'title'
  | 'organisation'
  | 'description'
  | 'subtitle'
  | 'eligibility'
  | 'application_closing_date'
  | 'max_grant_per_project'
  | 'min_grant_per_project'
  | 'total_funding_amount'
  | 'currency'
  | 'keywords'
  | 'contact_name'
  | 'contact_title'
  | 'contact_email'
  | 'contact_phone'
  | 'eligible_cost_categories'
  | 'information_webinar_dates'
  | 'application_templates_names'
  | 'application_templates_links'
  | 'other_templates_names'
  | 'other_templates_links'
  | 'evaluation_criteria'
  | 'application_process'
  | 'eligible_organisations'
  | 'industry_sectors'
  | 'original_url'
  | 'application_opening_date'
  | 'geographic_scope'
  | 'region'
  | 'project_start_date_min'
  | 'project_start_date_max'
  | 'project_end_date_min'
  | 'project_end_date_max'
  | 'information_webinar_links'
  | 'information_webinar_names'
  | 'consortium_requirement'
  | 'cofinancing_required'
  | 'cofinancing_level'
> & {
  long_description?: string | null;
};

export const transformSupabaseGrant = (supabaseGrant: PartialSupabaseGrantRow): Grant => {
  console.log('🔄 Starting transformation for grant:', supabaseGrant?.id);
  console.log('🔍 Grant data:', JSON.stringify(supabaseGrant, null, 2));
  
  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonValue: any): string[] => {
    try {
      if (!jsonValue) {
        console.log('🔍 jsonToStringArray: null/undefined value');
        return [];
      }
      if (Array.isArray(jsonValue)) {
        const result = jsonValue.filter(item => typeof item === 'string').slice(0, 10);
        console.log('🔍 jsonToStringArray: array input ->', result);
        return result;
      }
      if (typeof jsonValue === 'string') {
        const parsed = JSON.parse(jsonValue);
        if (Array.isArray(parsed)) {
          const result = parsed.filter(item => typeof item === 'string').slice(0, 10);
          console.log('🔍 jsonToStringArray: string input ->', result);
          return result;
        }
      }
      console.log('🔍 jsonToStringArray: unhandled type ->', typeof jsonValue);
      return [];
    } catch (error) {
      console.warn('⚠️ Error parsing JSON array:', error, jsonValue);
      return [];
    }
  };

  // Helper function to format date
  const formatDate = (dateValue: string | null): string => {
    if (!dateValue) {
      console.log('🔍 formatDate: null date');
      return 'Ej specificerat';
    }
    try {
      const date = new Date(dateValue);
      const formatted = date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      console.log('🔍 formatDate:', dateValue, '->', formatted);
      return formatted;
    } catch (error) {
      console.warn('⚠️ Error formatting date:', error, dateValue);
      return 'Ej specificerat';
    }
  };

  // Helper function to format funding amount with MSEK format
  const formatFundingAmount = (grant: PartialSupabaseGrantRow): string => {
    const currency = grant.currency || 'SEK';
    
    // Helper to format large amounts in millions
    const formatAmount = (amount: number): string => {
      if (amount >= 1000000) {
        const millions = amount / 1000000;
        return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)} M${currency}`;
      }
      return `${amount.toLocaleString()} ${currency}`;
    };
    
    // Priority: max_grant_per_project if not null, otherwise total_funding_amount
    if (grant.max_grant_per_project) {
      if (grant.min_grant_per_project && grant.min_grant_per_project !== grant.max_grant_per_project) {
        const result = `${formatAmount(grant.min_grant_per_project)} - ${formatAmount(grant.max_grant_per_project)}`;
        console.log('🔍 formatFundingAmount: min-max ->', result);
        return result;
      } else {
        const result = formatAmount(grant.max_grant_per_project);
        console.log('🔍 formatFundingAmount: max only ->', result);
        return result;
      }
    }
    
    if (grant.total_funding_amount) {
      const result = formatAmount(grant.total_funding_amount);
      console.log('🔍 formatFundingAmount: total ->', result);
      return result;
    }
    
    console.log('🔍 formatFundingAmount: no amount specified');
    return 'Ej specificerat';
  };

  // Helper function to get raw date (ISO string or null)
  const getRawDate = (dateValue: string | null): string => {
    if (!dateValue) return '';
    return dateValue;
  };

  // Helper to normalize geographic/region values
  const normalizeGeographicValues = (input: any): string[] => {
    let values: string[] = [];
    if (!input) return values;
    if (Array.isArray(input)) {
      values = input;
    } else if (typeof input === 'string') {
      // Try to parse as JSON array
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
          values = parsed;
        } else {
          // If not a JSON array, treat as comma-separated string
          values = input.split(',');
        }
      } catch {
        // Not JSON, treat as comma-separated string
        values = input.split(',');
      }
    }
    // Split any comma-separated items, trim, and flatten
    return values.flatMap(v => v.split(',')).map(v => v.trim()).filter(Boolean);
  };

  const formatArray = (arr?: string[] | null) => arr && arr.length > 0 ? arr.join(", ") : null;

  try {
    const transformed: Grant = {
      id: supabaseGrant.id,
      title: supabaseGrant.title || 'Ingen titel',
      organization: supabaseGrant.organisation || 'Okänd organisation',
      description: supabaseGrant.description || supabaseGrant.subtitle || 'Ingen beskrivning tillgänglig',
      long_description: supabaseGrant.long_description || undefined,
      fundingAmount: formatFundingAmount(supabaseGrant),
      opens_at: getRawDate((supabaseGrant as any).application_opening_date),
      deadline: formatDate(supabaseGrant.application_closing_date),
      tags: jsonToStringArray(supabaseGrant.keywords),
      qualifications: supabaseGrant.eligibility || 'Ej specificerat',
      aboutGrant: supabaseGrant.subtitle || supabaseGrant.description || 'Ingen information tillgänglig',
      whoCanApply: formatArray(jsonToStringArray(supabaseGrant.eligible_organisations)) || supabaseGrant.eligibility || 'Ej specificerat',
      importantDates: [], // This will be populated by the frontend component using the individual date fields
      fundingRules: jsonToStringArray(supabaseGrant.eligible_cost_categories),
      generalInfo: jsonToStringArray(supabaseGrant.other_templates_names), // Only other_templates_names
      requirements: [
        ...jsonToStringArray(supabaseGrant.eligible_cost_categories),
        ...jsonToStringArray(supabaseGrant.eligible_organisations),
        ...jsonToStringArray(supabaseGrant.industry_sectors)
      ].filter(Boolean),
      contact: {
        name: supabaseGrant.contact_name || '',
        organization: supabaseGrant.contact_title || '',
        email: supabaseGrant.contact_email || '',
        phone: supabaseGrant.contact_phone || ''
      },
      templates: jsonToStringArray(supabaseGrant.application_templates_names), // Only application_templates_names
      application_templates_links: jsonToStringArray(supabaseGrant.application_templates_links),
      other_templates_links: jsonToStringArray(supabaseGrant.other_templates_links),
      evaluationCriteria: supabaseGrant.evaluation_criteria || '',
      applicationProcess: supabaseGrant.application_process || '',
      originalUrl: supabaseGrant.original_url || '',
      industry_sectors: jsonToStringArray(supabaseGrant.industry_sectors),
      eligible_organisations: jsonToStringArray(supabaseGrant.eligible_organisations),
      geographic_scope: [
        ...normalizeGeographicValues((supabaseGrant as any).geographic_scope)
      ].filter((item, index, arr) => arr.indexOf(item) === index), // Remove duplicates
      region: supabaseGrant.region || undefined,
      consortium_requirement: supabaseGrant.consortium_requirement === 'true' ? true : supabaseGrant.consortium_requirement === 'false' ? false : undefined,
      cofinancing_required: supabaseGrant.cofinancing_required || undefined,
      cofinancing_level: supabaseGrant.cofinancing_level || undefined,
      // New date fields from database
      application_opening_date: supabaseGrant.application_opening_date || undefined,
      application_closing_date: supabaseGrant.application_closing_date || undefined,
      project_start_date_min: supabaseGrant.project_start_date_min || undefined,
      project_start_date_max: supabaseGrant.project_start_date_max || undefined,
      project_end_date_min: supabaseGrant.project_end_date_min || undefined,
      project_end_date_max: supabaseGrant.project_end_date_max || undefined,
      information_webinar_dates: jsonToStringArray(supabaseGrant.information_webinar_dates),
      information_webinar_links: jsonToStringArray(supabaseGrant.information_webinar_links),
      information_webinar_names: jsonToStringArray(supabaseGrant.information_webinar_names),
    };

    console.log('✅ Transformation successful for:', transformed.id, transformed.title);
    console.log('🔍 Transformed cofinancing/consortium data:', {
      consortium_requirement: transformed.consortium_requirement,
      cofinancing_required: transformed.cofinancing_required,
      cofinancing_level: transformed.cofinancing_level,
      region: transformed.region
    });
    return transformed;
  } catch (error) {
    console.error('❌ Transformation failed for grant:', supabaseGrant?.id, error);
    throw error;
  }
};
