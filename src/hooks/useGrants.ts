
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Grant } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
      console.log('Fetching grants from Supabase...');
      
      try {
        const { data, error } = await supabase
          .from('grant_call_details')
          .select('*');

        if (error) {
          console.error('Error fetching grants:', error);
          throw error;
        }

        console.log('Raw Supabase data:', data);
        
        // Transform the Supabase data to match our Grant interface
        const transformedGrants = data?.map(transformSupabaseGrant) || [];
        
        console.log('Transformed grants:', transformedGrants);
        return transformedGrants;
      } catch (error) {
        console.error('Failed to fetch grants:', error);
        // Return empty array as fallback to prevent infinite loading
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2, // Reduce retry attempts to prevent long loading times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Reduce max retry delay
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Only fetch once per mount
  });
};
