
export interface Grant {
  id: string;
  title: string;
  organization: string;
  description: string;
  fundingAmount: string;
  opens_at: string;
  deadline: string;
  tags: string[];
  qualifications: string;
  aboutGrant: string;
  whoCanApply: string;
  importantDates: string[];
  fundingRules: string[];
  generalInfo: string[];
  requirements: string[];
  contact: {
    name: string;
    organization: string;
    email: string;
    phone: string;
  };
  templates: string[];
  evaluationCriteria?: string;
  applicationProcess?: string;
  originalUrl?: string;
  // Additional properties from database
  industry_sectors?: string[];
  eligible_organisations?: string[];
  consortium_requirement?: boolean;
  geographic_scope?: string[];
  region?: string;
  cofinancing_required?: boolean;
  cofinancing_level_min?: number;
  cofinancing_level_max?: number;
  program?: string;
  grant_type?: string;
  // Date fields for important dates display
  application_opening_date?: string;
  application_closing_date?: string;
  project_start_date_min?: string;
  project_start_date_max?: string;
  project_end_date_min?: string;
  project_end_date_max?: string;
  information_webinar_dates?: string[];
  information_webinar_links?: string[];
  information_webinar_names?: string[];
  other_important_dates?: string[];
  other_important_dates_labels?: string[];
  // Project duration fields
  project_duration_months_min?: number;
  project_duration_months_max?: number;
}

// Minimal data for grant list items
export interface GrantListItem {
  id: string;
  title: string;
  organization: string;
  aboutGrant: string;
  fundingAmount: string;
  opens_at: string;
  deadline: string;
  tags: string[];
  industry_sectors?: string[];
  eligible_organisations?: string[];
  geographic_scope?: string[];
  region?: string;
  // Date fields for important dates display
  application_opening_date?: string;
  application_closing_date?: string;
  project_start_date_min?: string;
  project_start_date_max?: string;
  project_end_date_min?: string;
  project_end_date_max?: string;
  information_webinar_dates?: string[];
  information_webinar_links?: string[];
  information_webinar_names?: string[];
  other_important_dates?: string[];
  other_important_dates_labels?: string[];
  // Template fields for files and documents
  templates?: string[];
  generalInfo?: string[];
  application_templates_links?: string[];
  other_templates_links?: string[];
  other_sources_links?: string[];
  other_sources_names?: string[];
  // Cofinancing fields
  cofinancing_required?: boolean;
  cofinancing_level?: number;
  cofinancing_level_min?: number;
  cofinancing_level_max?: number;
  consortium_requirement?: string | boolean;
  fundingRules?: string[];
  // Timestamp fields
  created_at?: string;
  updated_at?: string;
  // Project duration fields
  project_duration_months_min?: number;
  project_duration_months_max?: number;
}

// Full data for grant details (extends GrantListItem)
export interface GrantDetails extends GrantListItem {
  description: string;
  long_description?: string;
  qualifications: string;
  whoCanApply: string;
  importantDates: string[];
  fundingRules: string[];
  generalInfo: string[];
  requirements: string[];
  contact: {
    name: string;
    organization: string;
    email: string;
    phone: string;
  };
  templates: string[];
  application_templates_links?: string[];
  other_templates_links?: string[];
  other_sources_links?: string[];
  other_sources_names?: string[];
  evaluationCriteria?: string;
  applicationProcess?: string;
  originalUrl?: string;
  consortium_requirement?: string | boolean;
  cofinancing_required?: boolean;
  cofinancing_level?: number;
  region?: string;
  application_opening_date?: string;
  application_closing_date?: string;
  project_start_date_min?: string;
  project_start_date_max?: string;
  project_end_date_min?: string;
  project_end_date_max?: string;
  information_webinar_dates?: string[];
  information_webinar_links?: string[];
  information_webinar_names?: string[];
  other_important_dates?: string[];
  other_important_dates_labels?: string[];
  // Project duration fields
  project_duration_months_min?: number;
  project_duration_months_max?: number;
}
