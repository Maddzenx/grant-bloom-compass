
export interface SearchQuery {
  originalQuery: string;
  correctedQuery?: string;
  detectedLanguage: string;
  tokens: SearchToken[];
  intent: QueryIntent;
  filters: SearchFilters;
  confidence: number;
}

export interface SearchToken {
  text: string;
  type: 'keyword' | 'entity' | 'filter' | 'operator' | 'emoji';
  language: string;
  corrected?: string;
  confidence: number;
}

export interface QueryIntent {
  type: 'search' | 'filter' | 'compare' | 'summarize' | 'question';
  entities: DetectedEntity[];
  timeRange?: DateRange;
  amount?: AmountRange;
  location?: string;
  confidence: number;
  alternatives?: QueryIntent[];
}

export interface DetectedEntity {
  text: string;
  type: 'organization' | 'amount' | 'date' | 'location' | 'domain' | 'person';
  normalized: string;
  confidence: number;
}

export interface SearchFilters {
  dateRange?: DateRange;
  amountRange?: AmountRange;
  organizations?: string[];
  domains?: string[];
  location?: string;
}

export interface DateRange {
  start?: Date;
  end?: Date;
  operator?: 'before' | 'after' | 'between';
}

export interface AmountRange {
  min?: number;
  max?: number;
  currency?: string;
}

export interface SearchResult {
  items: EnhancedGrantResult[];
  summary: SearchSummary;
  suggestions: SearchSuggestion[];
  confidence: number;
  sources: string[];
  processingTime: number;
}

export interface EnhancedGrantResult {
  grant: any; // Your existing Grant type
  relevanceScore: number;
  matchedFields: MatchedField[];
  snippet: string;
  reasoning: string[];
  confidence: number;
}

export interface MatchedField {
  field: string;
  matchType: 'exact' | 'fuzzy' | 'semantic' | 'synonym';
  snippet: string;
  score: number;
}

export interface SearchSummary {
  totalResults: number;
  answerText?: string;
  keyFindings: string[];
  clusters: ResultCluster[];
  citations: Citation[];
}

export interface ResultCluster {
  label: string;
  items: string[];
  count: number;
}

export interface Citation {
  text: string;
  source: string;
  confidence: number;
}

export interface SearchSuggestion {
  type: 'correction' | 'expansion' | 'related' | 'clarification';
  query: string;
  reasoning: string;
  confidence: number;
}

export interface SearchFeedback {
  queryId: string;
  type: 'click' | 'dwell' | 'explicit' | 'correction';
  target?: string;
  rating?: number;
  comment?: string;
  timestamp: Date;
}
