import { useQuery } from '@tanstack/react-query';
import { GrantListItem } from '@/types/grant';
import { fetchGrantListItems, ALL_ORGANIZATIONS, ALL_ELIGIBLE_APPLICANTS, ALL_REGIONS } from '@/services/grantsService';

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

// Simple function to get all organizations (hardcoded)
export const useAllOrganizations = () => {
  return {
    data: ALL_ORGANIZATIONS,
    isLoading: false,
    error: null,
    isError: false,
  };
};

// Simple function to get all eligible applicant types (hardcoded)
export const useAllEligibleApplicants = () => {
  return {
    data: ALL_ELIGIBLE_APPLICANTS,
    isLoading: false,
    error: null,
    isError: false,
  };
};

// Simple function to get all region options (hardcoded)
export const useAllRegions = () => {
  return {
    data: ALL_REGIONS,
    isLoading: false,
    error: null,
    isError: false,
  };
}; 