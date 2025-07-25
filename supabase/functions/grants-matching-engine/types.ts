
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

export interface MatchingResponse {
  rankedGrants: ScoredGrant[];
  explanation: string;
}
