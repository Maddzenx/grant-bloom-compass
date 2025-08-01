
import { supabase } from '@/integrations/supabase/client';
import { Grant, GrantListItem, GrantDetails } from '@/types/grant';
import { transformSupabaseGrant } from '@/utils/grantTransform';
import { insertSampleGrantsData } from '@/data/sampleGrants';
import { formatFundingAmount } from '@/utils/grantHelpers';
import { getGrantLanguage, createLanguageAwareSelect } from '@/utils/grantLanguageUtils';
import { debugLog, debugGrant } from '@/utils/debug';

export const fetchGrantsData = async (): Promise<Grant[]> => {
  debugLog('Starting grants fetch from grant_call_details...');
  
  // First, let's check if we can connect to the database at all
  const { data: testData, error: testError } = await supabase
    .from('grant_call_details')
    .select('count', { count: 'exact' });
  
  debugLog('Database connection test:', { testData, testError });
  
  // Use language-aware select for all grants
  const selectFields = [
    'id', 'organisation', 'original_url', 'application_closing_date', 'application_opening_date',
    'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max',
    'information_webinar_dates', 'information_webinar_links', 'project_duration_months_min',
    'project_duration_months_max', 'max_funding_per_project', 'min_funding_per_project',
    'total_funding_per_call', 'funding_amount_eur', 'currency', 'cofinancing_level_min', 'application_templates_links',
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
  // Use the language-specific field names directly
  const selectFieldsWithLanguage = selectFields.map(field => {
    const hasLanguageVersion = [
      'title', 'subtitle', 'description', 'eligibility', 'evaluation_criteria',
      'application_process', 'consortium_requirement', 'region',
      'eligible_organisations', 'eligible_cost_categories', 'information_webinar_names',
      'application_templates_names', 'other_sources_names', 'contact_title',
      'other_templates_names', 'other_important_dates_labels'
    ].includes(field);
    
    if (hasLanguageVersion) {
      return `${field}_sv`;
    }
    return field;
  });
  
  const { data: grantData, error: grantError } = await supabase
    .from('grant_call_details')
    .select(selectFieldsWithLanguage.join(', '))
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

  debugLog('Processing grant_call_details data...');
  return transformGrantsData(grantData);
};

// New function to fetch minimal grant data for list view
export const fetchGrantListItems = async (): Promise<GrantListItem[]> => {
  debugLog('Starting grant list items fetch with language debugging...');
  
  const selectFields = [
    'id', 'organisation', 'min_funding_per_project', 'max_funding_per_project', 
    'total_funding_per_call', 'funding_amount_eur', 'currency', 'application_opening_date', 'application_closing_date', 
    'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max', 
    'information_webinar_dates', 'information_webinar_links', 'geographic_scope', 
    'cofinancing_required', 'cofinancing_level_min', 'created_at', 'updated_at',
    // Language-specific fields - fetch both languages
    'title_sv', 'title_en', 'subtitle_sv', 'subtitle_en', 'information_webinar_names_sv', 'information_webinar_names_en', 
    'application_templates_names_sv', 'application_templates_names_en', 'application_templates_links', 
    'other_templates_names_sv', 'other_templates_names_en', 'other_templates_links', 
    'other_sources_names_sv', 'other_sources_names_en', 'other_sources_links', 'keywords', 'industry_sectors', 
    'eligible_organisations_standardized', 'region_sv', 'region_en', 'eligible_cost_categories_standardized'
  ];
  
  const { data: grantData, error: grantError } = await supabase
    .from('grant_call_details')
    .select(selectFields.join(', '))
    .order('created_at', { ascending: false });

  if (grantError) {
    console.error('❌ Supabase query error:', grantError);
    throw new Error(`Failed to fetch grant list items: ${grantError.message}`);
  }

  if (!grantData || !Array.isArray(grantData)) {
    console.warn('⚠️ No data returned or data is not an array:', grantData);
    return [];
  }

  debugLog('Processing grant list items...', {
    totalGrants: grantData.length,
    sampleEUGrants: grantData.filter((g: any) => g.organisation && (g.organisation.toLowerCase().includes('eu') || g.organisation.toLowerCase().includes('european'))).slice(0, 2).map((g: any) => ({
      id: g.id,
      organisation: g.organisation,
      title_sv: g.title_sv,
      title_en: g.title_en,
      subtitle_sv: g.subtitle_sv,
      subtitle_en: g.subtitle_en,
      information_webinar_names_sv: g.information_webinar_names_sv,
      information_webinar_names_en: g.information_webinar_names_en
    }))
  });
  
  return transformGrantListItems(grantData);
};

// New function to fetch full grant details by ID
export const fetchGrantDetails = async (grantId: string): Promise<GrantDetails> => {
  debugLog('Fetching full grant details for ID:', grantId);
  
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
  debugLog(`Using language '${language}' for organization: ${orgData.organisation}`);

  const selectFields = [
    'id', 'organisation', 'original_url', 'application_closing_date', 'application_opening_date',
    'project_start_date_min', 'project_start_date_max', 'project_end_date_min', 'project_end_date_max',
    'information_webinar_dates', 'information_webinar_links', 'project_duration_months_min',
    'project_duration_months_max', 'max_funding_per_project', 'min_funding_per_project',
    'total_funding_per_call', 'funding_amount_eur', 'currency', 'cofinancing_level_min', 'application_templates_links',
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

  // Use the language-specific field names directly
  const selectFieldsWithLanguage = selectFields.map(field => {
    const hasLanguageVersion = [
      'title', 'subtitle', 'description', 'eligibility', 'evaluation_criteria',
      'application_process', 'consortium_requirement', 'region',
      'eligible_organisations', 'eligible_cost_categories', 'information_webinar_names',
      'application_templates_names', 'other_sources_names', 'contact_title',
      'other_templates_names', 'other_important_dates_labels'
    ].includes(field);
    
    if (hasLanguageVersion) {
      return `${field}_${language}`;
    }
    return field;
  });
  
  const { data: grantData, error: grantError } = await supabase
    .from('grant_call_details')
    .select(selectFieldsWithLanguage.join(', '))
    .eq('id', grantId)
    .single();

  if (grantError) {
    console.error('❌ Supabase query error:', grantError);
    throw new Error(`Failed to fetch grant details: ${grantError.message}`);
  }

  if (!grantData) {
    throw new Error(`Grant with ID ${grantId} not found`);
  }

  debugLog('Grant details fetched successfully');
  return transformSupabaseGrantToDetails(grantData);
};

// Helper function to normalize field names from language-specific to base names
const normalizeGrantData = (grant: any): any => {
  const normalized = { ...grant };
  
  // Map language-specific fields back to base field names
  const languageFields = [
    'title', 'subtitle', 'description', 'eligibility', 'evaluation_criteria',
    'application_process', 'consortium_requirement', 'region',
    'eligible_organisations', 'eligible_cost_categories', 'information_webinar_names',
    'application_templates_names', 'other_sources_names', 'contact_title',
    'other_templates_names', 'other_important_dates_labels'
  ];
  
  languageFields.forEach(field => {
    // Check if the language-specific field exists and map it to the base field
    if (grant[`${field}_sv`] !== undefined) {
      normalized[field] = grant[`${field}_sv`];
    } else if (grant[`${field}_en`] !== undefined) {
      normalized[field] = grant[`${field}_en`];
    }
  });
  
  return normalized;
};

const transformGrantsData = (grantData: any[]): Grant[] => {
  const transformedGrants: Grant[] = [];

  for (let i = 0; i < grantData.length; i++) {
    const grant = grantData[i];
    try {
      // Normalize the grant data to use base field names
      const normalizedGrant = normalizeGrantData(grant);
      
      console.log(`🔄 Transforming grant ${i + 1}/${grantData.length}:`, normalizedGrant.id, normalizedGrant.title);
      const transformed = transformSupabaseGrant(normalizedGrant);
      transformedGrants.push(transformed);
      console.log(`✅ Successfully transformed: ${transformed.title}`);
    } catch (transformError) {
      console.error('❌ Transform error for grant:', grant.id, transformError);
      
      // Create a fallback grant object with all required properties
      const fallbackGrant: Grant = {
        id: grant.id,
        title: grant.title_sv || grant.title_en || 'Untitled Grant',
        organization: grant.organisation || 'Unknown Organization',
        description: grant.description_sv || grant.description_en || grant.subtitle_sv || grant.subtitle_en || 'No description available',
        fundingAmount: 'Not specified',
        opens_at: grant.application_opening_date || '2024-01-01',
        deadline: grant.application_closing_date || 'Not specified',
        tags: [],
        qualifications: grant.eligibility_sv || grant.eligibility_en || 'Not specified',
        aboutGrant: grant.subtitle_sv || grant.subtitle_en || grant.description_sv || grant.description_en || 'No information available',
        whoCanApply: grant.eligibility_sv || grant.eligibility_en || 'Not specified',
        importantDates: [],
        fundingRules: [],
        generalInfo: [],
        requirements: [],
        contact: {
          name: grant.contact_name || '',
          organization: grant.contact_title_sv || grant.contact_title_en || '',
          email: grant.contact_email || '',
          phone: grant.contact_phone || ''
        },
        templates: [],
        evaluationCriteria: grant.evaluation_criteria_sv || grant.evaluation_criteria_en || '',
        applicationProcess: grant.application_process_sv || grant.application_process_en || ''
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
      // Apply language selection based on organization (exactly like filtered grants search)
      const language = getGrantLanguage(grant.organisation);
      const title = language === 'en' ? grant.title_en : grant.title_sv;
      const subtitle = language === 'en' ? grant.subtitle_en : grant.subtitle_sv;
      const region = language === 'en' ? grant.region_en : grant.region_sv;
      
      // Debug logging for EU grants or grants with missing titles
      const isEUGrant = grant.organisation && (grant.organisation.toLowerCase().includes('eu') || grant.organisation.toLowerCase().includes('european'));
      if (isEUGrant || !title || title === 'Untitled Grant') {
        debugGrant('language selection', {
          id: grant.id,
          organisation: grant.organisation,
          isEUGrant,
          detectedLanguage: language,
          title_sv: grant.title_sv,
          title_en: grant.title_en,
          subtitle_sv: grant.subtitle_sv,
          subtitle_en: grant.subtitle_en,
          selectedTitle: title,
          selectedSubtitle: subtitle,
          titleSource: language === 'en' ? 'title_en' : 'title_sv',
          subtitleSource: language === 'en' ? 'subtitle_en' : 'subtitle_sv'
        });
      }
      
      const transformed: GrantListItem = {
        id: grant.id,
        title: title || 'Untitled Grant',
        organization: grant.organisation || 'Unknown Organization',
        aboutGrant: subtitle || 'No information available',
        fundingAmount: grant.funding_amount_eur ? `${grant.funding_amount_eur.toLocaleString()} EUR` : 'Not specified',
        funding_amount_eur: grant.funding_amount_eur || null,
        opens_at: grant.application_opening_date || '2024-01-01',
        deadline: grant.application_closing_date || 'Not specified',
        tags: parseJsonArray(grant.keywords) || [],
        industry_sectors: parseJsonArray(grant.industry_sectors),
        eligible_organisations: parseJsonArray(grant.eligible_organisations_standardized),
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
        information_webinar_names: parseJsonArray(language === 'en' ? grant.information_webinar_names_en : grant.information_webinar_names_sv),
        other_important_dates: parseJsonArray(grant.other_important_dates),
        other_important_dates_labels: parseJsonArray(grant.other_important_dates_labels),
        // Project duration fields
        project_duration_months_min: grant.project_duration_months_min || undefined,
        project_duration_months_max: grant.project_duration_months_max || undefined,
        // Template fields for files and documents
        templates: parseJsonArray(language === 'en' ? grant.application_templates_names_en : grant.application_templates_names_sv) || [],
        generalInfo: parseJsonArray(language === 'en' ? grant.other_templates_names_en : grant.other_templates_names_sv) || [],
        application_templates_links: parseJsonArray(grant.application_templates_links),
        other_templates_links: parseJsonArray(grant.other_templates_links),
        other_sources_links: parseJsonArray(grant.other_sources_links),
        other_sources_names: parseJsonArray(language === 'en' ? grant.other_sources_names_en : grant.other_sources_names_sv),
        cofinancing_required: parseBooleanString(grant.cofinancing_required),
        cofinancing_level: grant.cofinancing_level_min ?? null,
        cofinancing_level_min: grant.cofinancing_level_min || undefined,
        cofinancing_level_max: grant.cofinancing_level_max || undefined,
        consortium_requirement: (typeof grant.consortium_requirement === 'string' ? grant.consortium_requirement.trim() : grant.consortium_requirement) || undefined,
        region: region || '',
        fundingRules: parseJsonArray(grant.eligible_cost_categories_standardized) || [],
        // Timestamp fields
        created_at: grant.created_at,
        updated_at: grant.updated_at
      };
      
      transformedItems.push(transformed);
    } catch (transformError) {
      console.error('❌ Transform error for grant list item:', grant.id, transformError);
    }
  }

  debugLog('Final transformed grant list items:', {
    originalCount: grantData.length,
    transformedCount: transformedItems.length
  });

  return transformedItems;
};

const transformSupabaseGrantToDetails = (grant: any): GrantDetails => {
  // Normalize the grant data to use base field names
  const normalizedGrant = normalizeGrantData(grant);
  
  const transformedGrant = transformSupabaseGrant(normalizedGrant);

  // Create a GrantDetails object that includes the region field
  const grantDetails: GrantDetails = {
    ...transformedGrant,
    region: normalizedGrant.region || '',
    // Ensure all GrantDetails specific fields are properly set
    description: normalizedGrant.description || normalizedGrant.subtitle || 'No description available',
    long_description: normalizedGrant.long_description || undefined,
    qualifications: normalizedGrant.eligibility || 'Not specified',
    whoCanApply: normalizedGrant.eligibility || 'Not specified',
    importantDates: parseJsonArray(normalizedGrant.information_webinar_dates) || [],
    fundingRules: parseJsonArray(normalizedGrant.eligible_cost_categories) || [],
    generalInfo: parseJsonArray(normalizedGrant.other_templates_names) || [],
    requirements: [
      ...(parseJsonArray(normalizedGrant.eligible_cost_categories) || []),
      ...(parseJsonArray(normalizedGrant.eligible_organisations) || []),
      ...(parseJsonArray(normalizedGrant.industry_sectors) || [])
    ].filter(Boolean),
    contact: {
      name: normalizedGrant.contact_name || '',
      organization: normalizedGrant.contact_title || '',
      email: normalizedGrant.contact_email || '',
      phone: normalizedGrant.contact_phone || ''
    },
    templates: parseJsonArray(normalizedGrant.application_templates_names) || [],
    application_templates_links: parseJsonArray(normalizedGrant.application_templates_links),
    other_templates_links: parseJsonArray(normalizedGrant.other_templates_links),
    other_sources_links: parseJsonArray(normalizedGrant.other_sources_links),
    other_sources_names: parseJsonArray(normalizedGrant.other_sources_names),
    evaluationCriteria: normalizedGrant.evaluation_criteria || '',
    applicationProcess: normalizedGrant.application_process || '',
    originalUrl: normalizedGrant.original_url || '',
    consortium_requirement: (typeof normalizedGrant.consortium_requirement === 'string' ? normalizedGrant.consortium_requirement.trim() : normalizedGrant.consortium_requirement) || undefined,
    cofinancing_required: parseBooleanString(normalizedGrant.cofinancing_required),
          cofinancing_level: normalizedGrant.cofinancing_level_min ?? null,
    cofinancing_level_min: normalizedGrant.cofinancing_level_min || undefined,
    cofinancing_level_max: normalizedGrant.cofinancing_level_max || undefined,
    application_opening_date: normalizedGrant.application_opening_date,
    application_closing_date: normalizedGrant.application_closing_date,
    project_start_date_min: normalizedGrant.project_start_date_min,
    project_start_date_max: normalizedGrant.project_start_date_max,
    project_end_date_min: normalizedGrant.project_end_date_min,
    project_end_date_max: normalizedGrant.project_end_date_max,
    information_webinar_dates: parseJsonArray(normalizedGrant.information_webinar_dates),
    information_webinar_links: parseJsonArray(normalizedGrant.information_webinar_links),
    information_webinar_names: parseJsonArray(normalizedGrant.information_webinar_names),
    other_important_dates: parseJsonArray(normalizedGrant.other_important_dates),
    other_important_dates_labels: parseJsonArray(normalizedGrant.other_important_dates_labels),
    project_duration_months_min: normalizedGrant.project_duration_months_min || undefined,
    project_duration_months_max: normalizedGrant.project_duration_months_max || undefined
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
