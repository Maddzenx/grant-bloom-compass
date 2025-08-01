
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SemanticSearchResponse {
  rankedGrants: Array<{
    grantId: string;
    relevanceScore: number;
    // Grant data with both language versions
    id: string;
    title_sv: string;
    title_en: string;
    organization: string;
    subtitle_sv: string;
    subtitle_en: string;
    fundingAmount: string;
    funding_amount_eur: null;
    opens_at: string;
    deadline: string;
    tags: string[];
    industry_sectors: string[];
    eligible_organisations: string[];
    geographic_scope: string[];
    region_sv?: string;
    region_en?: string;
    cofinancing_required: boolean;
    cofinancing_level_min?: number;
    consortium_requirement?: string;
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
  }>;
  explanation: string;
}

export const useSemanticSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchGrants = async (query: string, organizationFilter: string[] = []): Promise<SemanticSearchResponse | null> => {
    if (!query.trim()) {
      return null;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      console.log('🔍 Calling semantic search function with query:', query);
      console.log('🏢 Organization filter:', organizationFilter);

      const { data, error } = await supabase.functions.invoke('semantic-grant-search', {
        body: { 
          query: query.trim(),
          organizationFilter: organizationFilter
        }
      });

      console.log('📡 Supabase function response:', { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(error.message || 'Function call failed');
      }

      if (!data) {
        console.error('❌ No response from semantic search service');
        throw new Error('No response from semantic search service');
      }

      if (data.error) {
        console.error('❌ Semantic search service error:', data.error);
        throw new Error(data.error);
      }

      console.log('✅ Semantic search completed successfully:', {
        rankedCount: data.rankedGrants?.length || 0,
        explanation: data.explanation
      });

      return data as SemanticSearchResponse;

    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Semantic search failed';
      setSearchError(errorMessage);
      
      // Return empty results instead of null to indicate search was attempted
      return {
        rankedGrants: [],
        explanation: 'Search encountered an error - please try again'
      };
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchGrants,
    isSearching,
    searchError
  };
};
