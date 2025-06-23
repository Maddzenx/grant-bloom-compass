
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
        .select(`
          id,
          title,
          organisation,
          description,
          subtitle,
          eligibility,
          application_closing_date,
          max_grant_per_project,
          min_grant_per_project,
          total_funding_amount,
          currency,
          keywords,
          contact_name,
          contact_title,
          contact_email,
          contact_phone,
          eligible_cost_categories,
          information_webinar_dates,
          application_templates_names,
          other_templates_names,
          evaluation_criteria,
          application_process,
          eligible_organisations,
          industry_sectors
        `)
        .order('created_at', { ascending: false });

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
            console.log(`Transforming grant ${index + 1}:`, item.title || 'No title');
            const transformed = transformSupabaseGrant(item);
            console.log(`Transformed grant ${index + 1}:`, { 
              id: transformed.id, 
              title: transformed.title,
              organization: transformed.organization 
            });
            return transformed;
          } catch (transformError) {
            console.error(`Error transforming grant ${index + 1}:`, transformError, item);
            return null;
          }
        })
        .filter((grant): grant is Grant => grant !== null);
      
      console.log('Final transformed grants:', transformedGrants.length);
      console.log('First few grants:', transformedGrants.slice(0, 3).map(g => ({ 
        id: g.id, 
        title: g.title, 
        organization: g.organization 
      })));
      
      return transformedGrants;
    },
    staleTime: 60000, // 1 minute cache
    gcTime: 300000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: true,
  });
};
