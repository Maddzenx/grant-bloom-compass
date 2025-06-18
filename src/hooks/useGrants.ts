
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
          .select('*')
          .limit(20); // Reduce limit for faster loading

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
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retry
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
