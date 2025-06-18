
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Grant } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
      console.log('Fetching grants from Supabase...');
      
      // Create a timeout promise that rejects after 5 seconds
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      );
      
      try {
        const queryPromise = supabase
          .from('grant_call_details')
          .select('*')
          .limit(50); // Limit results to prevent large data transfers

        // Race between the query and timeout
        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

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
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retry
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false, // Don't refetch on reconnect
    networkMode: 'offlineFirst', // Use cached data when network is slow
  });
};
