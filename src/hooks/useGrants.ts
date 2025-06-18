
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
          .limit(10); // Further reduce limit for faster loading

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Failed to fetch grants: ${error.message}`);
        }

        if (!data || data.length === 0) {
          console.log('No grants found in database');
          return [];
        }

        console.log('Raw Supabase data:', data);
        
        // Transform the Supabase data to match our Grant interface
        const transformedGrants = data.map(transformSupabaseGrant);
        
        console.log('Transformed grants:', transformedGrants);
        return transformedGrants;
      } catch (error) {
        console.error('Failed to fetch grants:', error);
        // Return empty array instead of throwing to prevent infinite loading
        return [];
      }
    },
    staleTime: 30000, // 30 seconds
    gcTime: 60000, // 1 minute
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    // Add enabled flag to ensure query runs
    enabled: true,
  });
};
