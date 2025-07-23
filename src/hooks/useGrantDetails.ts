import { useQuery } from '@tanstack/react-query';
import { GrantDetails } from '@/types/grant';
import { fetchGrantDetails } from '@/services/grantsService';

export const useGrantDetails = (grantId: string | null) => {
  return useQuery({
    queryKey: ['grant-details', grantId],
    queryFn: async (): Promise<GrantDetails> => {
      if (!grantId) {
        throw new Error('Grant ID is required');
      }
      return await fetchGrantDetails(grantId);
    },
    enabled: !!grantId,
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 