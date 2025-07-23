
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SemanticSearchResponse {
  rankedGrants: Array<{
    grantId: string;
    relevanceScore: number;
    matchingReasons: string[];
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
