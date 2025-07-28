
import { supabase } from '@/integrations/supabase/client';
import { Grant, GrantListItem, GrantDetails } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';
import { insertSampleGrantsData } from '@/data/sampleGrants';
import { formatFundingAmount } from '@/utils/grantHelpers';
import { getGrantLanguage, createLanguageAwareSelect } from '@/utils/grantLanguageUtils';

export const fetchGrantsData = async (): Promise<Grant[]> => {
  console.log('🔍 Starting grants fetch from grant_call_details...');
  
  // First, let's check if we can connect to the database at all
  const { data: testData, error: testError } = await supabase
    .from('grant_call_details')
    .select('count', { count: 'exact' });
  
  console.log('🔍 Database connection test:', { testData, testError });
  
  // Use language-aware select for all grants
  const selectFields = [
    'id', 'organisation', 'original_url', 'application_closing_date', 'application_opening_date',
    'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max',
    'information_webinar_dates', 'information_webinar_links', 'project_duration_months_min',
    'project_duration_months_max', 'max_funding_per_project', 'min_funding_per_project',
    'total_funding_per_call', 'currency', 'cofinancing_level_min', 'application_templates_links',
    'other_sources_links', 'contact_name', 'contact_email', 'contact_phone', 'processing_status',
    'scraped_at', 'processed_at', 'created_at', 'updated_at', 'ai_enabled', 'other_templates_links',
    'is_original_source', 'original_source_url', 'cofinancing_required', 'embedding',
    'cofinancing_level_max', 'program', 'grant_type', 'comments', 'other_important_dates',
    'eligible_organisations_standardized', 'eligible_cost_categories_standardized',
    'keywords', 'industry_sectors', 'geographic_scope',
    // Language-specific fields
    'title', 'region', 'eligible_organisations', 'consortium_requirement', 'subtitle',
    'description', 'eligibility', 'evaluation_criteria', 'application_process',
    'information_webinar_names', 'eligible_cost_categories', 'application_templates_names',
    'other_sources_names', 'contact_title', 'other_templates_names', 'other_important_dates_labels'
  ];

  // For the main fetch, we'll use Swedish as default and handle language selection in transformation
  const selectStatement = createLanguageAwareSelect(selectFields, 'sv');
  
  const { data: grantData, error: grantError } = await supabase
    .from('grant_call_details')
    .select(selectStatement)
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
  
  const selectFields = [
    'id', 'organisation', 'min_funding_per_project', 'max_funding_per_project', 
    'total_funding_per_call', 'currency', 'application_opening_date', 'application_closing_date', 
    'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max', 
    'information_webinar_dates', 'information_webinar_links', 'geographic_scope', 
    'cofinancing_required', 'cofinancing_level_min', 'created_at', 'updated_at',
    // Language-specific fields
    'title', 'subtitle', 'information_webinar_names', 'application_templates_names', 
    'application_templates_links', 'other_templates_names', 'other_templates_links', 
    'other_sources_names', 'other_sources_links', 'keywords', 'industry_sectors', 
    'eligible_organisations', 'region', 'eligible_cost_categories'
  ];

  // For list items, we'll use Swedish as default and handle language selection in transformation
  const selectStatement = createLanguageAwareSelect(selectFields, 'sv');
  
  const { data: grantData, error: grantError } = await supabase
    .from('grant_call_details')
    .select(selectStatement)
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
  
  // First, get the organization to determine the language
  const { data: orgData, error: orgError } = await supabase
    .from('grant_call_details')
    .select('organisation')
    .eq('id', grantId)
    .single();

  if (orgError || !orgData) {
    throw new Error(`Grant with ID ${grantId} not found`);
  }

  const language = getGrantLanguage(orgData.organisation);
  console.log(`🔍 Using language '${language}' for organization: ${orgData.organisation}`);

  const selectFields = [
    'id', 'organisation', 'original_url', 'application_closing_date', 'application_opening_date',
    'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max',
    'information_webinar_dates', 'information_webinar_links', 'project_duration_months_min',
    'project_duration_months_max', 'max_funding_per_project', 'min_funding_per_project',
    'total_funding_per_call', 'currency', 'cofinancing_level_min', 'application_templates_links',
    'other_sources_links', 'contact_name', 'contact_email', 'contact_phone', 'processing_status',
    'scraped_at', 'processed_at', 'created_at', 'updated_at', 'ai_enabled', 'other_templates_links',
    'is_original_source', 'original_source_url', 'cofinancing_required', 'embedding',
    'cofinancing_level_max', 'program', 'grant_type', 'comments', 'other_important_dates',
    'eligible_organisations_standardized', 'eligible_cost_categories_standardized',
    'keywords', 'industry_sectors', 'geographic_scope',
    // Language-specific fields
    'title', 'region', 'eligible_organisations', 'consortium_requirement', 'subtitle',
    'description', 'eligibility', 'evaluation_criteria', 'application_process',
    'information_webinar_names', 'eligible_cost_categories', 'application_templates_names',
    'other_sources_names', 'contact_title', 'other_templates_names', 'other_important_dates_labels'
  ];

  const selectStatement = createLanguageAwareSelect(selectFields, language);
  
  const { data: grantData, error: grantError } = await supabase
    .from('grant_call_details')
    .select(selectStatement)
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
        fundingAmount: formatFundingAmount(grant),
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
        other_important_dates: parseJsonArray(grant.other_important_dates),
        other_important_dates_labels: parseJsonArray(grant.other_important_dates_labels),
        // Project duration fields
        project_duration_months_min: grant.project_duration_months_min || undefined,
        project_duration_months_max: grant.project_duration_months_max || undefined,
        // Template fields for files and documents
        templates: parseJsonArray(grant.application_templates_names) || [],
        generalInfo: parseJsonArray(grant.other_templates_names) || [],
        application_templates_links: parseJsonArray(grant.application_templates_links),
        other_templates_links: parseJsonArray(grant.other_templates_links),
        other_sources_links: parseJsonArray(grant.other_sources_links),
        other_sources_names: parseJsonArray(grant.other_sources_names),
        cofinancing_required: parseBooleanString(grant.cofinancing_required),
        cofinancing_level: grant.cofinancing_level_min ?? null,
        cofinancing_level_min: grant.cofinancing_level_min || undefined,
        cofinancing_level_max: grant.cofinancing_level_max || undefined,
        consortium_requirement: (typeof grant.consortium_requirement === 'string' ? grant.consortium_requirement.trim() : grant.consortium_requirement) || undefined,
        region: grant.region || '',
        fundingRules: parseJsonArray(grant.eligible_cost_categories) || [],
        // Timestamp fields
        created_at: grant.created_at,
        updated_at: grant.updated_at
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

  // Create a GrantDetails object that includes the region field
  const grantDetails: GrantDetails = {
    ...transformedGrant,
    region: grant.region || '',
    // Ensure all GrantDetails specific fields are properly set
    description: grant.description || grant.subtitle || 'No description available',
    long_description: grant.long_description || undefined,
    qualifications: grant.eligibility || 'Not specified',
    whoCanApply: grant.eligibility || 'Not specified',
    importantDates: parseJsonArray(grant.information_webinar_dates) || [],
    fundingRules: parseJsonArray(grant.eligible_cost_categories) || [],
    generalInfo: parseJsonArray(grant.other_templates_names) || [],
    requirements: [
      ...(parseJsonArray(grant.eligible_cost_categories) || []),
      ...(parseJsonArray(grant.eligible_organisations) || []),
      ...(parseJsonArray(grant.industry_sectors) || [])
    ].filter(Boolean),
    contact: {
      name: grant.contact_name || '',
      organization: grant.contact_title || '',
      email: grant.contact_email || '',
      phone: grant.contact_phone || ''
    },
    templates: parseJsonArray(grant.application_templates_names) || [],
    application_templates_links: parseJsonArray(grant.application_templates_links),
    other_templates_links: parseJsonArray(grant.other_templates_links),
    other_sources_links: parseJsonArray(grant.other_sources_links),
    other_sources_names: parseJsonArray(grant.other_sources_names),
    evaluationCriteria: grant.evaluation_criteria || '',
    applicationProcess: grant.application_process || '',
    originalUrl: grant.original_url || '',
    consortium_requirement: (typeof grant.consortium_requirement === 'string' ? grant.consortium_requirement.trim() : grant.consortium_requirement) || undefined,
    cofinancing_required: parseBooleanString(grant.cofinancing_required),
          cofinancing_level: grant.cofinancing_level_min ?? null,
    cofinancing_level_min: grant.cofinancing_level_min || undefined,
    cofinancing_level_max: grant.cofinancing_level_max || undefined,
    application_opening_date: grant.application_opening_date,
    application_closing_date: grant.application_closing_date,
    project_start_date_min: grant.project_start_date_min,
    project_start_date_max: grant.project_start_date_max,
    project_end_date_min: grant.project_end_date_min,
    project_end_date_max: grant.project_end_date_max,
    information_webinar_dates: parseJsonArray(grant.information_webinar_dates),
    information_webinar_links: parseJsonArray(grant.information_webinar_links),
    information_webinar_names: parseJsonArray(grant.information_webinar_names),
    other_important_dates: parseJsonArray(grant.other_important_dates),
    other_important_dates_labels: parseJsonArray(grant.other_important_dates_labels),
    project_duration_months_min: grant.project_duration_months_min || undefined,
    project_duration_months_max: grant.project_duration_months_max || undefined
  };

  return grantDetails;
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

const parseBooleanString = (val: any): boolean | undefined => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const lowered = val.trim().toLowerCase();
    if (['true','1','yes','ja','required','t'].includes(lowered)) return true;
    if (['false','0','no','nej','not required','none','f'].includes(lowered)) return false;
  }
  return undefined;
};
