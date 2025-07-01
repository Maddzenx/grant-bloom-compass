
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIGrantMatch {
  grantId: string;
  relevanceScore: number;
  matchingReasons: string[];
}

export interface AISearchResult {
  rankedGrants: AIGrantMatch[];
  explanation: string;
}

export const useAIGrantSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchGrants = async (query: string): Promise<AISearchResult | null> => {
    if (!query.trim()) {
      return null;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      console.log('🤖 Starting AI grant search for query:', query);

      const { data, error } = await supabase.functions.invoke('ai-grant-search', {
        body: { query: query.trim() }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No response from AI search service');
      }

      console.log('✅ AI search completed:', {
        rankedCount: data.rankedGrants?.length || 0,
        explanation: data.explanation
      });

      return data as AISearchResult;

    } catch (error) {
      console.error('❌ AI grant search failed:', error);
      setSearchError(error instanceof Error ? error.message : 'AI search failed');
      return null;
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
