
import { Grant } from '@/types/grant';
import { Database } from '@/integrations/supabase/types';

// Use the actual Supabase type for grant_call_details
type SupabaseGrantRow = Database['public']['Tables']['grant_call_details']['Row'];

export const transformSupabaseGrant = (supabaseGrant: SupabaseGrantRow): Grant => {
  // Helper function to safely convert Json to string array
  const jsonToStringArray = (jsonValue: any): string[] => {
    if (Array.isArray(jsonValue)) {
      return jsonValue.filter(item => typeof item === 'string');
    }
    return [];
  };

  return {
    id: supabaseGrant.id,
    title: supabaseGrant.title || '',
    organization: supabaseGrant.organisation || '',
    description: supabaseGrant.description || '',
    fundingAmount: supabaseGrant.max_grant_per_project 
      ? `${supabaseGrant.min_grant_per_project || 0} - ${supabaseGrant.max_grant_per_project} ${supabaseGrant.currency || 'SEK'}`
      : `${supabaseGrant.total_funding_amount || 0} ${supabaseGrant.currency || 'SEK'}`,
    deadline: supabaseGrant.application_closing_date || '',
    tags: jsonToStringArray(supabaseGrant.keywords),
    qualifications: supabaseGrant.eligibility || '',
    aboutGrant: supabaseGrant.subtitle || '',
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
};
