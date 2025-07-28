
export interface GrantCandidate {
  id: string;
  title: string;
  subtitle: string;
  organisation: string;
  description: string;
  keywords: string[];
  industry_sectors: string[];
  eligibility: string;
  geographic_scope: string;
  min_funding_per_project: number;
  max_funding_per_project: number;
  application_opening_date: string;
  application_closing_date: string;
  eligible_organisations: string[];
  currency: string;
  application_process: string;
  evaluation_criteria: string;
}

export interface ScoredGrant {
  grantId: string;
  relevanceScore: number;
  matchingReasons: string[];
}

export interface RankedGrant {
  id: string;
  title: string;
  organization: string;
  description: string;
  aboutGrant: string;
  fundingAmount: string;
  opens_at: string;
  deadline: string;
  tags: string[];
  industry_sectors: string[];
  eligible_organisations: string[];
  geographic_scope: string[];
  region?: string;
  cofinancing_required: boolean;
  cofinancing_level_min?: number;
  consortium_requirement?: string | boolean;
  fundingRules: string[];
  application_opening_date?: string;
  application_closing_date?: string;
  project_start_date_min?: string;
  project_start_date_max?: string;
  project_end_date_min?: string;
  project_end_date_max?: string;
  information_webinar_dates: string[];
  information_webinar_links: string[];
  information_webinar_names: string[];
  templates: string[];
  generalInfo: string[];
  application_templates_links: string[];
  other_templates_links: string[];
  other_sources_links: string[];
  other_sources_names: string[];
  created_at?: string;
  updated_at?: string;
  relevanceScore: number;
  matchingReasons: string[];
}

export interface MatchingResponse {
  rankedGrants: RankedGrant[];
  explanation: string;
}
