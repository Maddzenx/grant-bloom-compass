
import { useQuery } from '@tanstack/react-query';
import { Grant } from '@/types/grant';
import { fetchGrantsData } from '@/services/grantsService';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
      return await fetchGrantsData();
    },
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
