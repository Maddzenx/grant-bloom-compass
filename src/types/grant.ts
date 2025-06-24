
export interface Grant {
  id: string;
  title: string;
  organization: string;
  description: string;
  fundingAmount: string;
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
}
