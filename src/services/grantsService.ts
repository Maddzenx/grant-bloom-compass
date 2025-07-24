
import { supabase } from '@/integrations/supabase/client';
import { Grant, GrantListItem, GrantDetails } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';
import { insertSampleGrantsData } from '@/data/sampleGrants';

export const fetchGrantsData = async (): Promise<Grant[]> => {
  console.log('🔍 Starting grants fetch from grant_call_details...');
  
  // First, let's check if we can connect to the database at all
  const { data: testData, error: testError } = await supabase
    .from('grant_call_details')
    .select('count', { count: 'exact' });
  
  console.log('🔍 Database connection test:', { testData, testError });
  
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
    
    // Let's try to insert some data directly if the table is empty
    console.log('🔄 Attempting to insert sample data...');
    const insertedData = await insertSampleGrantsData();
    
    if (insertedData && insertedData.length > 0) {
      console.log('✅ Successfully inserted sample data, using it...');
      return transformGrantsData(insertedData);
    }
    
    return [];
  }

  console.log('🔍 Processing grant_call_details data...');
  return transformGrantsData(grantData);
};

// New function to fetch minimal grant data for list view
export const fetchGrantListItems = async (): Promise<GrantListItem[]> => {
  console.log('🔍 Starting grant list items fetch...');
  
  const { data: grantData, error: grantError } = await supabase
    .from('grant_call_details')
    .select(`
      id, title, organisation, subtitle, min_grant_per_project, max_grant_per_project, total_funding_amount,
      application_opening_date, application_closing_date, project_start_date_min, project_start_date_max,
      project_end_date_min, project_end_date_max, information_webinar_dates, information_webinar_links,
      information_webinar_names, application_templates_names, application_templates_links, other_templates_names,
      other_templates_links, other_sources_names, other_sources_links, keywords, industry_sectors, eligible_organisations, 
      geographic_scope, cofinancing_required, cofinancing_level, consortium_requirement, region
    `)
    .order('created_at', { ascending: false });

  if (grantError) {
    console.error('❌ Supabase query error:', grantError);
    throw new Error(`Failed to fetch grant list items: ${grantError.message}`);
  }

  if (!grantData || !Array.isArray(grantData)) {
    console.warn('⚠️ No data returned or data is not an array:', grantData);
    return [];
  }

  console.log('🔍 Processing grant list items...');
  return transformGrantListItems(grantData);
};

// New function to fetch full grant details by ID
export const fetchGrantDetails = async (grantId: string): Promise<GrantDetails> => {
  console.log('🔍 Fetching full grant details for ID:', grantId);
  
  const { data: grantData, error: grantError } = await supabase
    .from('grant_call_details')
    .select('*')
    .eq('id', grantId)
    .single();

  if (grantError) {
    console.error('❌ Supabase query error:', grantError);
    throw new Error(`Failed to fetch grant details: ${grantError.message}`);
  }

  if (!grantData) {
    throw new Error(`Grant with ID ${grantId} not found`);
  }

  console.log('✅ Grant details fetched successfully');
  return transformSupabaseGrantToDetails(grantData);
};

const transformGrantsData = (grantData: any[]): Grant[] => {
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
      
      // Create a fallback grant object with all required properties
      const fallbackGrant: Grant = {
        id: grant.id,
        title: grant.title || 'Untitled Grant',
        organization: grant.organisation || 'Unknown Organization',
        description: grant.description || grant.subtitle || 'No description available',
        fundingAmount: 'Not specified',
        opens_at: grant.application_opening_date || '2024-01-01',
        deadline: grant.application_closing_date || 'Not specified',
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
};

const transformGrantListItems = (grantData: any[]): GrantListItem[] => {
  const transformedItems: GrantListItem[] = [];

  for (const grant of grantData) {
    try {
      const transformed: GrantListItem = {
        id: grant.id,
        title: grant.title || 'Untitled Grant',
        organization: grant.organisation || 'Unknown Organization',
        aboutGrant: grant.subtitle || grant.description || 'No information available',
        fundingAmount: formatFundingAmount(grant.min_grant_per_project, grant.max_grant_per_project, grant.total_funding_amount),
        opens_at: grant.application_opening_date || '2024-01-01',
        deadline: grant.application_closing_date || 'Not specified',
        tags: parseJsonArray(grant.keywords) || [],
        industry_sectors: parseJsonArray(grant.industry_sectors),
        eligible_organisations: parseJsonArray(grant.eligible_organisations),
        geographic_scope: parseJsonArray(grant.geographic_scope),
        // Date fields for important dates display
        application_opening_date: grant.application_opening_date,
        application_closing_date: grant.application_closing_date,
        project_start_date_min: grant.project_start_date_min,
        project_start_date_max: grant.project_start_date_max,
        project_end_date_min: grant.project_end_date_min,
        project_end_date_max: grant.project_end_date_max,
        information_webinar_dates: parseJsonArray(grant.information_webinar_dates),
        information_webinar_links: parseJsonArray(grant.information_webinar_links),
        information_webinar_names: parseJsonArray(grant.information_webinar_names),
        // Template fields for files and documents
        templates: parseJsonArray(grant.application_templates_names) || [],
        generalInfo: parseJsonArray(grant.other_templates_names) || [],
        application_templates_links: parseJsonArray(grant.application_templates_links),
        other_templates_links: parseJsonArray(grant.other_templates_links),
        other_sources_links: parseJsonArray(grant.other_sources_links),
        other_sources_names: parseJsonArray(grant.other_sources_names),
        cofinancing_required: grant.cofinancing_required || false,
        cofinancing_level: grant.cofinancing_level || null,
        consortium_requirement: grant.consortium_requirement === 'true' ? true : grant.consortium_requirement === 'false' ? false : undefined,
        region: grant.region || ''
      };
      
      transformedItems.push(transformed);
    } catch (transformError) {
      console.error('❌ Transform error for grant list item:', grant.id, transformError);
    }
  }

  console.log('✅ Final transformed grant list items:', {
    originalCount: grantData.length,
    transformedCount: transformedItems.length
  });

  return transformedItems;
};

const transformSupabaseGrantToDetails = (grant: any): GrantDetails => {
  const transformedGrant = transformSupabaseGrant(grant);

  // GrantDetails extends Grant, so we can cast it after transformation,
  // assuming transformSupabaseGrant populates all necessary fields.
  // We may need to add fields to Grant or handle them here if they are truly details-only.
  return transformedGrant as GrantDetails;
};

const formatFundingAmount = (min?: number, max?: number, total?: number): string => {
  // Priority: max_grant_per_project if not null, otherwise total_funding_amount
  if (max) {
    if (min && min !== max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} kr`;
    } else {
      return `${max.toLocaleString()} kr`;
    }
  }
  
  if (total) {
    return `${total.toLocaleString()} kr`;
  }
  
  if (min) {
    return `${min.toLocaleString()} kr`;
  }
  
  return 'Ej specificerat';
};

const parseJsonArray = (jsonValue: any): string[] | undefined => {
  if (!jsonValue) return undefined;
  if (Array.isArray(jsonValue)) return jsonValue;
  try {
    const parsed = JSON.parse(jsonValue);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};
