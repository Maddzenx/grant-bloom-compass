
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GrantMatch {
  grantId: string;
  relevanceScore: number;
  matchingReasons: string[];
}

export interface GrantsMatchingResult {
  rankedGrants: GrantMatch[];
  explanation: string;
}

export const useGrantsMatchingEngine = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);

  const matchGrants = async (query: string): Promise<GrantsMatchingResult | null> => {
    if (!query.trim()) {
      return null;
    }

    setIsMatching(true);
    setMatchingError(null);

    try {
      console.log('🔍 Starting structured grants matching for query:', query);

      const { data, error } = await supabase.functions.invoke('grants-matching-engine', {
        body: { query: query.trim() }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No response from grants matching service');
      }

      console.log('✅ Grants matching completed:', {
        rankedCount: data.rankedGrants?.length || 0,
        explanation: data.explanation
      });

      return data as GrantsMatchingResult;

    } catch (error) {
      console.error('❌ Grants matching failed:', error);
      setMatchingError(error instanceof Error ? error.message : 'Grants matching failed');
      return null;
    } finally {
      setIsMatching(false);
    }
  };

  return {
    matchGrants,
    isMatching,
    matchingError
  };
};
