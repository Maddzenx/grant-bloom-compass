import { useQuery } from '@tanstack/react-query';
import { GrantListItem } from '@/types/grant';
import { fetchGrantListItems } from '@/services/grantsService';

interface UseGrantListItemsOptions {
  enabled?: boolean;
}

export const useGrantListItems = (options: UseGrantListItemsOptions = {}) => {
  const { enabled = true } = options;
  
  return useQuery({
    queryKey: ['grant-list-items'],
    queryFn: async (): Promise<GrantListItem[]> => {
      return await fetchGrantListItems();
    },
    enabled,
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 