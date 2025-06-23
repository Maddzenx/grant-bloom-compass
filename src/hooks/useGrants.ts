
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Grant } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: async (): Promise<Grant[]> => {
      console.log('🔍 Starting grants fetch...');
      
      // First try to get data from grant_call_details
      const { data: grantData, error: grantError } = await supabase
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

      console.log('🔍 Grant call details query result:', { 
        data: grantData, 
        error: grantError, 
        dataLength: grantData?.length
      });

      // If grant_call_details is empty, try vinnova_ansokningsomgangar as fallback
      if (!grantData || grantData.length === 0) {
        console.log('🔍 No data in grant_call_details, trying vinnova_ansokningsomgangar...');
        
        const { data: vinnovaData, error: vinnovaError } = await supabase
          .from('vinnova_ansokningsomgangar')
          .select(`
            id,
            titel,
            beskrivning,
            stangningsdatum,
            oppningsdatum,
            kontakt_lista,
            dokument_lista,
            diarienummer
          `)
          .limit(50);

        console.log('🔍 Vinnova query result:', { 
          data: vinnovaData, 
          error: vinnovaError, 
          dataLength: vinnovaData?.length
        });

        if (vinnovaError) {
          console.error('❌ Vinnova query error:', vinnovaError);
          throw new Error(`Failed to fetch grants: ${vinnovaError.message}`);
        }

        if (vinnovaData && vinnovaData.length > 0) {
          // Transform Vinnova data to Grant format
          const transformedGrants: Grant[] = vinnovaData.map((item, index) => {
            const grant: Grant = {
              id: item.id?.toString() || `vinnova-${index}`,
              title: item.titel || 'Untitled Grant',
              organization: 'Vinnova',
              description: item.beskrivning || 'No description available',
              fundingAmount: 'Not specified',
              deadline: item.stangningsdatum ? new Date(item.stangningsdatum).toLocaleDateString('sv-SE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Not specified',
              tags: ['Vinnova', 'Innovation'],
              qualifications: 'See grant details',
              aboutGrant: item.beskrivning || 'No information available',
              whoCanApply: 'See grant details',
              importantDates: [],
              fundingRules: [],
              generalInfo: [],
              requirements: [],
              contact: {
                name: '',
                organization: 'Vinnova',
                email: '',
                phone: ''
              },
              templates: [],
              evaluationCriteria: '',
              applicationProcess: ''
            };
            return grant;
          });

          console.log('✅ Transformed Vinnova grants:', {
            count: transformedGrants.length,
            sampleTitles: transformedGrants.slice(0, 3).map(g => g.title)
          });

          return transformedGrants;
        }
      }

      if (grantError) {
        console.error('❌ Supabase query error:', grantError);
        throw new Error(`Failed to fetch grants: ${grantError.message}`);
      }

      if (!grantData || !Array.isArray(grantData)) {
        console.warn('⚠️ No data returned or data is not an array:', grantData);
        return [];
      }

      if (grantData.length === 0) {
        console.warn('⚠️ Both tables are empty - no grants in database');
        return [];
      }

      console.log('🔍 Processing grant_call_details data...');
      const transformedGrants: Grant[] = [];

      for (let i = 0; i < grantData.length; i++) {
        const grant = grantData[i];
        try {
          console.log(`🔄 Transforming grant ${i + 1}/${grantData.length}:`, grant.id);
          const transformed = transformSupabaseGrant(grant);
          transformedGrants.push(transformed);
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
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};
