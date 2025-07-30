import { Grant } from '@/types/grant';
import { Database } from '@/integrations/supabase/types';
import { formatFundingAmount } from '@/utils/grantHelpers';

// Use a partial type that matches what we actually select from the database
type PartialSupabaseGrantRow = Pick<
  Database['public']['Tables']['grant_call_details']['Row'],
  | 'id'
  | 'title'
  | 'organisation'
  | 'description'
  | 'subtitle'
  | 'eligibility'
  | 'application_closing_date'
  | 'max_funding_per_project'
  | 'min_funding_per_project'
  | 'total_funding_per_call'
  | 'funding_amount_eur'
  | 'currency'
  | 'keywords'
  | 'contact_name'
  | 'contact_title'
  | 'contact_email'
  | 'contact_phone'
  | 'eligible_cost_categories'
  | 'information_webinar_dates'
  | 'information_webinar_links'
  | 'information_webinar_names'
  | 'other_important_dates'
  | 'other_important_dates_labels'
  | 'application_templates_names'
  | 'other_templates_names'
  | 'evaluation_criteria'
  | 'application_process'
  | 'eligible_organisations'
  | 'industry_sectors'
  | 'original_url'
  | 'application_opening_date'
  | 'project_start_date_min'
  | 'project_start_date_max'
  | 'project_end_date_min'
  | 'project_end_date_max'
  | 'geographic_scope'
  | 'region'
  | 'cofinancing_level_min'
  | 'cofinancing_level_max'
  | 'cofinancing_required'
  | 'program'
  | 'grant_type'
  | 'project_duration_months_min'
  | 'project_duration_months_max'
>;

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

  // Helper to parse string booleans safely
  const parseBooleanString = (val: any): boolean | undefined => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const lowered = val.trim().toLowerCase();
      if (['true','1','yes','ja','required','t'].includes(lowered)) return true;
      if (['false','0','no','nej','not required','none','f'].includes(lowered)) return false;
    }
    return undefined;
  };

  try {
    const transformed: Grant = {
      id: supabaseGrant.id,
      title: supabaseGrant.title || 'Ingen titel',
      organization: supabaseGrant.organisation || 'Okänd organisation',
      description: supabaseGrant.description || supabaseGrant.subtitle || 'Ingen beskrivning tillgänglig',
      fundingAmount: formatFundingAmount(supabaseGrant),
      funding_amount_eur: supabaseGrant.funding_amount_eur || null,
      opens_at: getRawDate((supabaseGrant as any).application_opening_date),
      deadline: formatDate(supabaseGrant.application_closing_date),
      tags: jsonToStringArray(supabaseGrant.keywords),
      qualifications: supabaseGrant.eligibility || 'Ej specificerat',
      aboutGrant: supabaseGrant.subtitle || supabaseGrant.description || 'Ingen information tillgänglig',
      whoCanApply: supabaseGrant.eligibility || 'Ej specificerat',
      importantDates: jsonToStringArray(supabaseGrant.information_webinar_dates),
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
      evaluationCriteria: supabaseGrant.evaluation_criteria || '',
      applicationProcess: supabaseGrant.application_process || '',
      originalUrl: supabaseGrant.original_url || '',
      industry_sectors: jsonToStringArray(supabaseGrant.industry_sectors),
      eligible_organisations: jsonToStringArray(supabaseGrant.eligible_organisations),
      geographic_scope: [
        ...normalizeGeographicValues((supabaseGrant as any).geographic_scope),
        ...normalizeGeographicValues(supabaseGrant.region)
      ].filter((item, index, arr) => arr.indexOf(item) === index), // Remove duplicates
      region: supabaseGrant.region || undefined,
      cofinancing_required: supabaseGrant.cofinancing_required || false,
      cofinancing_level_min: supabaseGrant.cofinancing_level_min || undefined,
      cofinancing_level_max: supabaseGrant.cofinancing_level_max || undefined,
      program: supabaseGrant.program || undefined,
      grant_type: supabaseGrant.grant_type || undefined,
      // Date fields for important dates display
      application_opening_date: supabaseGrant.application_opening_date || undefined,
      application_closing_date: supabaseGrant.application_closing_date || undefined,
      project_start_date_min: supabaseGrant.project_start_date_min || undefined,
      project_start_date_max: supabaseGrant.project_start_date_max || undefined,
      project_end_date_min: supabaseGrant.project_end_date_min || undefined,
      project_end_date_max: supabaseGrant.project_end_date_max || undefined,
      information_webinar_dates: jsonToStringArray(supabaseGrant.information_webinar_dates),
      information_webinar_links: jsonToStringArray(supabaseGrant.information_webinar_links),
      information_webinar_names: jsonToStringArray(supabaseGrant.information_webinar_names),
      other_important_dates: jsonToStringArray(supabaseGrant.other_important_dates),
      other_important_dates_labels: jsonToStringArray(supabaseGrant.other_important_dates_labels),
      // Project duration fields
      project_duration_months_min: supabaseGrant.project_duration_months_min || undefined,
      project_duration_months_max: supabaseGrant.project_duration_months_max || undefined,
    };

    console.log('✅ Transformation successful for:', transformed.id, transformed.title);
    console.log('📅 Date fields in transformed grant:', {
      application_opening_date: transformed.application_opening_date,
      application_closing_date: transformed.application_closing_date,
      project_start_date_min: transformed.project_start_date_min,
      project_start_date_max: transformed.project_start_date_max,
      project_end_date_min: transformed.project_end_date_min,
      project_end_date_max: transformed.project_end_date_max,
      information_webinar_dates: transformed.information_webinar_dates,
      information_webinar_names: transformed.information_webinar_names,
      information_webinar_links: transformed.information_webinar_links,
      other_important_dates: transformed.other_important_dates,
      other_important_dates_labels: transformed.other_important_dates_labels
    });
    return transformed;
  } catch (error) {
    console.error('❌ Transformation failed for grant:', supabaseGrant?.id, error);
    throw error;
  }
};
