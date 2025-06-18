
import { Grant } from '@/types/grant';
import { Database } from '@/integrations/supabase/types';

// Use the actual Supabase type for grant_call_details
type SupabaseGrantRow = Database['public']['Tables']['grant_call_details']['Row'];

export const transformSupabaseGrant = (supabaseGrant: SupabaseGrantRow): Grant => {
  console.log('Transforming grant:', supabaseGrant);
  
  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonValue: any): string[] => {
    try {
      if (Array.isArray(jsonValue)) {
        return jsonValue.filter(item => typeof item === 'string');
      }
      if (typeof jsonValue === 'string') {
        const parsed = JSON.parse(jsonValue);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => typeof item === 'string');
        }
      }
      return [];
    } catch (error) {
      console.warn('Error parsing JSON array:', error, jsonValue);
      return [];
    }
  };

  // Helper function to format date
  const formatDate = (dateValue: string | null): string => {
    if (!dateValue) return '';
    try {
      return new Date(dateValue).toLocaleDateString('sv-SE');
    } catch (error) {
      console.warn('Error formatting date:', error, dateValue);
      return dateValue;
    }
  };

  // Helper function to format funding amount
  const formatFundingAmount = (grant: SupabaseGrantRow): string => {
    const currency = grant.currency || 'SEK';
    
    if (grant.max_grant_per_project && grant.min_grant_per_project) {
      return `${grant.min_grant_per_project.toLocaleString()} - ${grant.max_grant_per_project.toLocaleString()} ${currency}`;
    }
    
    if (grant.max_grant_per_project) {
      return `Upp till ${grant.max_grant_per_project.toLocaleString()} ${currency}`;
    }
    
    if (grant.total_funding_amount) {
      return `${grant.total_funding_amount.toLocaleString()} ${currency}`;
    }
    
    return 'Ej specificerat';
  };

  const transformed: Grant = {
    id: supabaseGrant.id,
    title: supabaseGrant.title || 'Ingen titel',
    organization: supabaseGrant.organisation || '',
    description: supabaseGrant.description || supabaseGrant.subtitle || '',
    fundingAmount: formatFundingAmount(supabaseGrant),
    deadline: formatDate(supabaseGrant.application_closing_date),
    tags: jsonToStringArray(supabaseGrant.keywords),
    qualifications: supabaseGrant.eligibility || '',
    aboutGrant: supabaseGrant.subtitle || supabaseGrant.description || '',
    whoCanApply: supabaseGrant.eligibility || '',
    importantDates: jsonToStringArray(supabaseGrant.information_webinar_dates),
    fundingRules: jsonToStringArray(supabaseGrant.eligible_cost_categories),
    generalInfo: jsonToStringArray(supabaseGrant.files_names),
    requirements: jsonToStringArray(supabaseGrant.eligible_cost_categories),
    contact: {
      name: supabaseGrant.contact_name || '',
      organization: supabaseGrant.contact_title || '',
      email: supabaseGrant.contact_email || '',
      phone: supabaseGrant.contact_phone || ''
    },
    templates: jsonToStringArray(supabaseGrant.templates_names)
  };

  console.log('Transformation result:', transformed);
  return transformed;
};
