
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
          .order('created_at', { ascending: false })
          .limit(50); // Increased limit to get more data

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
        throw error; // Let the error bubble up so UI can handle it properly
      }
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 60000, // 1 minute
    retry: 2, // Retry twice on failure
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    // Force query to run
    enabled: true,
  });
};
