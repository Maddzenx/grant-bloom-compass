
import { Grant } from '@/types/grant';
import { Database } from '@/integrations/supabase/types';

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
  | 'other_templates_names'
  | 'evaluation_criteria'
  | 'application_process'
  | 'eligible_organisations'
  | 'industry_sectors'
>;

export const transformSupabaseGrant = (supabaseGrant: PartialSupabaseGrantRow): Grant => {
  console.log('🔄 Transforming grant:', supabaseGrant?.id);
  
  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonValue: any): string[] => {
    try {
      if (!jsonValue) return [];
      if (Array.isArray(jsonValue)) {
        return jsonValue.filter(item => typeof item === 'string').slice(0, 10);
      }
      if (typeof jsonValue === 'string') {
        const parsed = JSON.parse(jsonValue);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => typeof item === 'string').slice(0, 10);
        }
      }
      return [];
    } catch (error) {
      console.warn('⚠️ Error parsing JSON array:', error, jsonValue);
      return [];
    }
  };

  // Helper function to format date
  const formatDate = (dateValue: string | null): string => {
    if (!dateValue) return 'Ej specificerat';
    try {
      const date = new Date(dateValue);
      return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
    
    if (grant.max_grant_per_project && grant.min_grant_per_project) {
      return `${formatAmount(grant.min_grant_per_project)} - ${formatAmount(grant.max_grant_per_project)}`;
    }
    
    if (grant.max_grant_per_project) {
      return `Upp till ${formatAmount(grant.max_grant_per_project)}`;
    }
    
    if (grant.total_funding_amount) {
      return formatAmount(grant.total_funding_amount);
    }
    
    return 'Ej specificerat';
  };

  try {
    const transformed: Grant = {
      id: supabaseGrant.id,
      title: supabaseGrant.title || 'Ingen titel',
      organization: supabaseGrant.organisation || 'Okänd organisation',
      description: supabaseGrant.description || supabaseGrant.subtitle || 'Ingen beskrivning tillgänglig',
      fundingAmount: formatFundingAmount(supabaseGrant),
      deadline: formatDate(supabaseGrant.application_closing_date),
      tags: jsonToStringArray(supabaseGrant.keywords),
      qualifications: supabaseGrant.eligibility || 'Ej specificerat',
      aboutGrant: supabaseGrant.subtitle || supabaseGrant.description || 'Ingen information tillgänglig',
      whoCanApply: supabaseGrant.eligibility || 'Ej specificerat',
      importantDates: jsonToStringArray(supabaseGrant.information_webinar_dates),
      fundingRules: jsonToStringArray(supabaseGrant.eligible_cost_categories),
      generalInfo: [
        ...jsonToStringArray(supabaseGrant.application_templates_names),
        ...jsonToStringArray(supabaseGrant.other_templates_names)
      ].filter(Boolean),
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
      templates: [
        ...jsonToStringArray(supabaseGrant.application_templates_names),
        ...jsonToStringArray(supabaseGrant.other_templates_names)
      ].filter(Boolean),
      evaluationCriteria: supabaseGrant.evaluation_criteria || '',
      applicationProcess: supabaseGrant.application_process || ''
    };

    console.log('✅ Transformation successful for:', transformed.id);
    return transformed;
  } catch (error) {
    console.error('❌ Transformation failed for grant:', supabaseGrant?.id, error);
    throw error;
  }
};
