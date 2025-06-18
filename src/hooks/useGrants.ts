
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Grant } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
      console.log('Fetching grants from Supabase...');
      
      const { data, error } = await supabase
        .from('grant_call_details')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20); // Reduce limit for better performance

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch grants: ${error.message}`);
      }

      console.log('Raw Supabase data:', data);
      console.log('Number of records:', data?.length || 0);

      if (!data || data.length === 0) {
        console.log('No grants found in database');
        return [];
      }

      // Transform the data with better error handling
      const transformedGrants = data
        .map((item, index) => {
          try {
            console.log(`Transforming grant ${index + 1}:`, item);
            const transformed = transformSupabaseGrant(item);
            console.log(`Transformed grant ${index + 1}:`, transformed);
            return transformed;
          } catch (transformError) {
            console.error(`Error transforming grant ${index + 1}:`, transformError, item);
            return null;
          }
        })
        .filter((grant): grant is Grant => grant !== null);
      
      console.log('Final transformed grants:', transformedGrants);
      console.log('Number of successfully transformed grants:', transformedGrants.length);
      
      return transformedGrants;
    },
    staleTime: 30000, // 30 seconds cache
    gcTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: true,
  });
};
