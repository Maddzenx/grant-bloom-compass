
import { Grant } from '@/types/grant';

interface SupabaseGrantData {
  id: string;
  title: string;
  organisation: string;
  description: string;
  keywords: string[];
  eligibility: string;
  application_closing_date: string;
  total_funding_amount: number;
  currency: string;
  subtitle: string;
  application_process: string;
  evaluation_criteria: string;
  information_webinar_dates: string[];
  templates_names: string[];
  contact_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
  eligible_cost_categories: string[];
  files_names: string[];
  max_grant_per_project: number;
  min_grant_per_project: number;
}

export const transformSupabaseGrant = (supabaseGrant: SupabaseGrantData): Grant => {
  return {
    id: supabaseGrant.id,
    title: supabaseGrant.title || '',
    organization: supabaseGrant.organisation || '',
    description: supabaseGrant.description || '',
    fundingAmount: supabaseGrant.max_grant_per_project 
      ? `${supabaseGrant.min_grant_per_project || 0} - ${supabaseGrant.max_grant_per_project} ${supabaseGrant.currency || 'SEK'}`
      : `${supabaseGrant.total_funding_amount || 0} ${supabaseGrant.currency || 'SEK'}`,
    deadline: supabaseGrant.application_closing_date || '',
    tags: supabaseGrant.keywords || [],
    qualifications: supabaseGrant.eligibility || '',
    aboutGrant: supabaseGrant.subtitle || '',
    whoCanApply: supabaseGrant.eligibility || '',
    importantDates: supabaseGrant.information_webinar_dates || [],
    fundingRules: supabaseGrant.eligible_cost_categories || [],
    generalInfo: supabaseGrant.files_names || [],
    requirements: supabaseGrant.eligible_cost_categories || [],
    contact: {
      name: supabaseGrant.contact_name || '',
      organization: supabaseGrant.contact_title || '',
      email: supabaseGrant.contact_email || '',
      phone: supabaseGrant.contact_phone || ''
    },
    templates: supabaseGrant.templates_names || []
  };
};
