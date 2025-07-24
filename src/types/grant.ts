
export interface Grant {
  id: string;
  title: string;
  organization: string;
  description: string;
  long_description?: string;
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
  application_templates_links?: string[];
  other_templates_links?: string[];
  other_sources_links?: string[];
  other_sources_names?: string[];
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
  cofinancing_level?: number;
  // New date fields from database
  application_opening_date?: string;
  application_closing_date?: string;
  project_start_date_min?: string;
  project_start_date_max?: string;
  project_end_date_min?: string;
  project_end_date_max?: string;
  information_webinar_dates?: string[];
  information_webinar_links?: string[];
  information_webinar_names?: string[];
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
  consortium_requirement?: boolean;
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
  consortium_requirement?: boolean;
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
}
