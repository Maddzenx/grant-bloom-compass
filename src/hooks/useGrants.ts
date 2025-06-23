
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Grant } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
      console.log('🔍 Starting grants fetch from grant_call_details...');
      
      const { data: grantData, error: grantError } = await supabase
        .from('grant_call_details')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('✅ Grant call details query result:', { 
        data: grantData, 
        error: grantError, 
        dataLength: grantData?.length
      });

      if (grantError) {
        console.error('❌ Supabase query error:', grantError);
        throw new Error(`Failed to fetch grants: ${grantError.message}`);
      }

      if (!grantData || !Array.isArray(grantData)) {
        console.warn('⚠️ No data returned or data is not an array:', grantData);
        return [];
      }

      if (grantData.length === 0) {
        console.warn('⚠️ Grant call details table is empty');
        return [];
      }

      console.log('🔍 Processing grant_call_details data...');
      const transformedGrants: Grant[] = [];

      for (let i = 0; i < grantData.length; i++) {
        const grant = grantData[i];
        try {
          console.log(`🔄 Transforming grant ${i + 1}/${grantData.length}:`, grant.id, grant.title);
          const transformed = transformSupabaseGrant(grant);
          transformedGrants.push(transformed);
          console.log(`✅ Successfully transformed: ${transformed.title}`);
        } catch (transformError) {
          console.error('❌ Transform error for grant:', grant.id, transformError);
          
          // Create a fallback grant object
          const fallbackGrant: Grant = {
            id: grant.id,
            title: grant.title || 'Untitled Grant',
            organization: grant.organisation || 'Unknown Organization',
            description: grant.description || grant.subtitle || 'No description available',
            fundingAmount: 'Not specified',
            deadline: 'Not specified',
            tags: [],
            qualifications: grant.eligibility || 'Not specified',
            aboutGrant: grant.subtitle || grant.description || 'No information available',
            whoCanApply: grant.eligibility || 'Not specified',
            importantDates: [],
            fundingRules: [],
            generalInfo: [],
            requirements: [],
            contact: {
              name: grant.contact_name || '',
              organization: grant.contact_title || '',
              email: grant.contact_email || '',
              phone: grant.contact_phone || ''
            },
            templates: [],
            evaluationCriteria: grant.evaluation_criteria || '',
            applicationProcess: grant.application_process || ''
          };
          
          transformedGrants.push(fallbackGrant);
        }
      }

      console.log('✅ Final transformed grants:', {
        originalCount: grantData.length,
        transformedCount: transformedGrants.length,
        sampleTitles: transformedGrants.slice(0, 3).map(g => g.title)
      });

      return transformedGrants;
    },
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
