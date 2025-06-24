
import { useState } from 'react';
import { Grant } from '@/types/grant';
import { GrantMatcher } from '@/utils/grantMatching/grantMatcher';
import { GrantMatchResponse, ProjectData } from '@/utils/grantMatching/types';

export const useGrantMatching = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);

  const matchGrants = async (
    grants: Grant[], 
    projectData: ProjectData,
    apiKey?: string
  ): Promise<{ sortedGrants: Grant[]; matchResponse: GrantMatchResponse } | null> => {
    if (!apiKey) {
      setMatchingError('OpenAI API key is required for grant matching');
      return null;
    }

    setIsMatching(true);
    setMatchingError(null);

    try {
      const matcher = new GrantMatcher(apiKey);
      const matchResponse = await matcher.matchGrants(grants, projectData);
      const sortedGrants = matcher.sortGrantsByRelevance(grants, matchResponse);

      console.log('🎯 Grant matching completed:', {
        totalGrants: grants.length,
        highMatches: matchResponse.high_match.length,
        mediumMatches: matchResponse.medium_match.length,
        lowMatches: matchResponse.low_match.length
      });

      return { sortedGrants, matchResponse };
    } catch (error) {
      console.error('❌ Grant matching failed:', error);
      setMatchingError(error instanceof Error ? error.message : 'Grant matching failed');
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
