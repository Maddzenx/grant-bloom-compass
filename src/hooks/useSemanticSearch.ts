
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SemanticSearchResult {
  grantId: string;
  relevanceScore: number;
  matchingReasons: string[];
}

export interface SemanticSearchResponse {
  rankedGrants: SemanticSearchResult[];
  explanation: string;
}

export const useSemanticSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchGrants = async (query: string): Promise<SemanticSearchResponse | null> => {
    if (!query.trim()) {
      return null;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      console.log('🔍 Starting semantic search for query:', query);

      const { data, error } = await supabase.functions.invoke('semantic-grant-search', {
        body: { query: query.trim() }
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(error.message);
      }

      if (!data) {
        console.error('❌ No response from semantic search service');
        throw new Error('No response from semantic search service');
      }

      if (data.error) {
        console.error('❌ Semantic search service error:', data.error);
        throw new Error(data.error);
      }

      console.log('✅ Semantic search completed:', {
        rankedCount: data.rankedGrants?.length || 0,
        explanation: data.explanation
      });

      return data as SemanticSearchResponse;

    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Semantic search failed';
      setSearchError(errorMessage);
      
      return {
        rankedGrants: [],
        explanation: 'Search encountered an error - showing all grants'
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
