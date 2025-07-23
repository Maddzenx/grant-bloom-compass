
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
  evaluationCriteria?: string;
  applicationProcess?: string;
  originalUrl?: string;
  // Additional properties from database
  industry_sectors?: string[];
  eligible_organisations?: string[];
  consortium_requirement?: boolean;
  geographic_scope?: string[];
  cofinancing_required?: boolean;
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
