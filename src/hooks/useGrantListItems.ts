import { useQuery } from '@tanstack/react-query';
import { GrantListItem } from '@/types/grant';
import { fetchGrantListItems } from '@/services/grantsService';

export const useGrantListItems = () => {
  return useQuery({
    queryKey: ['grant-list-items'],
    queryFn: async (): Promise<GrantListItem[]> => {
      return await fetchGrantListItems();
    },
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 