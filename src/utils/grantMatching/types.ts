
export interface GrantMatchResult {
  grant_id: string;
  name: string;
  score: number;
}

export interface GrantMatchResponse {
  high_match: GrantMatchResult[];
  medium_match: GrantMatchResult[];
  low_match: GrantMatchResult[];
}

export interface ProjectData {
  description: string;
  attachments?: string[];
}
