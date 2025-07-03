export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      application_drafts: {
        Row: {
          compliance_score: number | null
          created_at: string
          generated_sections: Json | null
          generation_metadata: Json | null
          generation_status: string | null
          grant_id: string | null
          id: string
          total_word_count: number | null
          updated_at: string
          uploaded_files: Json | null
          user_context: Json | null
        }
        Insert: {
          compliance_score?: number | null
          created_at?: string
          generated_sections?: Json | null
          generation_metadata?: Json | null
          generation_status?: string | null
          grant_id?: string | null
          id?: string
          total_word_count?: number | null
          updated_at?: string
          uploaded_files?: Json | null
          user_context?: Json | null
        }
        Update: {
          compliance_score?: number | null
          created_at?: string
          generated_sections?: Json | null
          generation_metadata?: Json | null
          generation_status?: string | null
          grant_id?: string | null
          id?: string
          total_word_count?: number | null
          updated_at?: string
          uploaded_files?: Json | null
          user_context?: Json | null
        }
        Relationships: []
      }
      document_metadata: {
        Row: {
          content_hash: string | null
          content_type: string | null
          created_at: string | null
          document_type: string | null
          downloaded_at: string | null
          file_size: number | null
          filename: string | null
          grant_id: string | null
          id: string
          organisation: string | null
          original_url: string | null
          storage_path: string
        }
        Insert: {
          content_hash?: string | null
          content_type?: string | null
          created_at?: string | null
          document_type?: string | null
          downloaded_at?: string | null
          file_size?: number | null
          filename?: string | null
          grant_id?: string | null
          id?: string
          organisation?: string | null
          original_url?: string | null
          storage_path: string
        }
        Update: {
          content_hash?: string | null
          content_type?: string | null
          created_at?: string | null
          document_type?: string | null
          downloaded_at?: string | null
          file_size?: number | null
          filename?: string | null
          grant_id?: string | null
          id?: string
          organisation?: string | null
          original_url?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_metadata_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grant_call_details"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string
          created_at: string | null
          embedding: unknown | null
          id: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: unknown | null
          id?: never
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: unknown | null
          id?: never
          title?: string
        }
        Relationships: []
      }
      draft_versions: {
        Row: {
          changes_summary: string | null
          content: Json
          created_at: string
          draft_id: string | null
          id: string
          version_number: number
        }
        Insert: {
          changes_summary?: string | null
          content: Json
          created_at?: string
          draft_id?: string | null
          id?: string
          version_number: number
        }
        Update: {
          changes_summary?: string | null
          content?: Json
          created_at?: string
          draft_id?: string | null
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "draft_versions_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "application_drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      file_extractions: {
        Row: {
          created_at: string
          error_message: string | null
          extracted_text: string | null
          extraction_method: string | null
          extraction_status: string | null
          file_id: string
          file_type: string
          id: string
          original_filename: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          extracted_text?: string | null
          extraction_method?: string | null
          extraction_status?: string | null
          file_id: string
          file_type: string
          id?: string
          original_filename: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          extracted_text?: string | null
          extraction_method?: string | null
          extraction_status?: string | null
          file_id?: string
          file_type?: string
          id?: string
          original_filename?: string
          updated_at?: string
        }
        Relationships: []
      }
      grant_call_details: {
        Row: {
          ai_enabled: boolean | null
          application_closing_date: string | null
          application_opening_date: string | null
          application_process: string | null
          application_templates_links: Json | null
          application_templates_names: Json | null
          cofinancing_level: number | null
          cofinancing_required: boolean | null
          consortium_requirement: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_title: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          eligibility: string | null
          eligible_cost_categories: Json | null
          eligible_organisations: Json | null
          embedding: string | null
          error_message: string | null
          evaluation_criteria: string | null
          geographic_scope: string | null
          id: string
          industry_sectors: Json | null
          information_webinar_dates: Json | null
          information_webinar_links: Json | null
          information_webinar_names: Json | null
          is_original_source: boolean | null
          keywords: Json | null
          max_grant_per_project: number | null
          min_grant_per_project: number | null
          organisation: string | null
          original_source_url: string | null
          original_url: string
          other_sources_links: Json | null
          other_sources_names: Json | null
          other_templates_links: Json | null
          other_templates_names: Json | null
          processed_at: string | null
          processing_status: string | null
          project_duration_months_max: number | null
          project_duration_months_min: number | null
          project_end_date_max: string | null
          project_end_date_min: string | null
          project_start_date_max: string | null
          project_start_date_min: string | null
          region: string | null
          scraped_at: string | null
          search_description: string | null
          subtitle: string | null
          title: string | null
          total_funding_amount: number | null
          updated_at: string | null
        }
        Insert: {
          ai_enabled?: boolean | null
          application_closing_date?: string | null
          application_opening_date?: string | null
          application_process?: string | null
          application_templates_links?: Json | null
          application_templates_names?: Json | null
          cofinancing_level?: number | null
          cofinancing_required?: boolean | null
          consortium_requirement?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          eligibility?: string | null
          eligible_cost_categories?: Json | null
          eligible_organisations?: Json | null
          embedding?: string | null
          error_message?: string | null
          evaluation_criteria?: string | null
          geographic_scope?: string | null
          id?: string
          industry_sectors?: Json | null
          information_webinar_dates?: Json | null
          information_webinar_links?: Json | null
          information_webinar_names?: Json | null
          is_original_source?: boolean | null
          keywords?: Json | null
          max_grant_per_project?: number | null
          min_grant_per_project?: number | null
          organisation?: string | null
          original_source_url?: string | null
          original_url: string
          other_sources_links?: Json | null
          other_sources_names?: Json | null
          other_templates_links?: Json | null
          other_templates_names?: Json | null
          processed_at?: string | null
          processing_status?: string | null
          project_duration_months_max?: number | null
          project_duration_months_min?: number | null
          project_end_date_max?: string | null
          project_end_date_min?: string | null
          project_start_date_max?: string | null
          project_start_date_min?: string | null
          region?: string | null
          scraped_at?: string | null
          search_description?: string | null
          subtitle?: string | null
          title?: string | null
          total_funding_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_enabled?: boolean | null
          application_closing_date?: string | null
          application_opening_date?: string | null
          application_process?: string | null
          application_templates_links?: Json | null
          application_templates_names?: Json | null
          cofinancing_level?: number | null
          cofinancing_required?: boolean | null
          consortium_requirement?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          eligibility?: string | null
          eligible_cost_categories?: Json | null
          eligible_organisations?: Json | null
          embedding?: string | null
          error_message?: string | null
          evaluation_criteria?: string | null
          geographic_scope?: string | null
          id?: string
          industry_sectors?: Json | null
          information_webinar_dates?: Json | null
          information_webinar_links?: Json | null
          information_webinar_names?: Json | null
          is_original_source?: boolean | null
          keywords?: Json | null
          max_grant_per_project?: number | null
          min_grant_per_project?: number | null
          organisation?: string | null
          original_source_url?: string | null
          original_url?: string
          other_sources_links?: Json | null
          other_sources_names?: Json | null
          other_templates_links?: Json | null
          other_templates_names?: Json | null
          processed_at?: string | null
          processing_status?: string | null
          project_duration_months_max?: number | null
          project_duration_months_min?: number | null
          project_end_date_max?: string | null
          project_end_date_min?: string | null
          project_start_date_max?: string | null
          project_start_date_min?: string | null
          region?: string | null
          scraped_at?: string | null
          search_description?: string | null
          subtitle?: string | null
          title?: string | null
          total_funding_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      grant_call_vector_search: {
        Row: {
          content: string
          embedding: string | null
          id: string
        }
        Insert: {
          content: string
          embedding?: string | null
          id?: string
        }
        Update: {
          content?: string
          embedding?: string | null
          id?: string
        }
        Relationships: []
      }
      grantListDailyScrape: {
        Row: {
          grant_url: string
          id: string
          organisation: string
          scraped_at: string | null
          title: string
          unique_identifier: string | null
        }
        Insert: {
          grant_url: string
          id?: string
          organisation: string
          scraped_at?: string | null
          title: string
          unique_identifier?: string | null
        }
        Update: {
          grant_url?: string
          id?: string
          organisation?: string
          scraped_at?: string | null
          title?: string
          unique_identifier?: string | null
        }
        Relationships: []
      }
      template_analysis: {
        Row: {
          analysis_timestamp: string | null
          complexity_score: number | null
          created_at: string | null
          estimated_completion_time: number | null
          form_fields: Json | null
          form_sections: string[] | null
          grant_id: string | null
          id: string
          organisation: string | null
          processing_status: string | null
          template_id: string | null
          template_name: string | null
          template_url: string | null
          updated_at: string | null
        }
        Insert: {
          analysis_timestamp?: string | null
          complexity_score?: number | null
          created_at?: string | null
          estimated_completion_time?: number | null
          form_fields?: Json | null
          form_sections?: string[] | null
          grant_id?: string | null
          id: string
          organisation?: string | null
          processing_status?: string | null
          template_id?: string | null
          template_name?: string | null
          template_url?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis_timestamp?: string | null
          complexity_score?: number | null
          created_at?: string | null
          estimated_completion_time?: number | null
          form_fields?: Json | null
          form_sections?: string[] | null
          grant_id?: string | null
          id?: string
          organisation?: string | null
          processing_status?: string | null
          template_id?: string | null
          template_name?: string | null
          template_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vinnova_ansokningsomgangar: {
        Row: {
          annonseringslage_ar: number | null
          annonseringslage_period: string | null
          avlasningstillfalle_lista: Json | null
          beskrivning: string | null
          beskrivning_engelska: string | null
          created_at: string | null
          daglig_avlasning: number | null
          diarienummer: string
          diarienummer_utlysning: string | null
          dokument_lista: Json | null
          extern: number | null
          id: number
          kontakt_lista: Json | null
          lank_lista: Json | null
          last_updated: string | null
          oppningsdatum: string | null
          publik: number | null
          senast_projektslut: string | null
          senast_projektstart: string | null
          stangningsdatum: string | null
          tidigast_projektstart: string | null
          titel: string | null
          titel_engelska: string | null
          uppskattat_beslutsdatum: string | null
          webbsida: number | null
          webtext_lista: Json | null
        }
        Insert: {
          annonseringslage_ar?: number | null
          annonseringslage_period?: string | null
          avlasningstillfalle_lista?: Json | null
          beskrivning?: string | null
          beskrivning_engelska?: string | null
          created_at?: string | null
          daglig_avlasning?: number | null
          diarienummer: string
          diarienummer_utlysning?: string | null
          dokument_lista?: Json | null
          extern?: number | null
          id?: number
          kontakt_lista?: Json | null
          lank_lista?: Json | null
          last_updated?: string | null
          oppningsdatum?: string | null
          publik?: number | null
          senast_projektslut?: string | null
          senast_projektstart?: string | null
          stangningsdatum?: string | null
          tidigast_projektstart?: string | null
          titel?: string | null
          titel_engelska?: string | null
          uppskattat_beslutsdatum?: string | null
          webbsida?: number | null
          webtext_lista?: Json | null
        }
        Update: {
          annonseringslage_ar?: number | null
          annonseringslage_period?: string | null
          avlasningstillfalle_lista?: Json | null
          beskrivning?: string | null
          beskrivning_engelska?: string | null
          created_at?: string | null
          daglig_avlasning?: number | null
          diarienummer?: string
          diarienummer_utlysning?: string | null
          dokument_lista?: Json | null
          extern?: number | null
          id?: number
          kontakt_lista?: Json | null
          lank_lista?: Json | null
          last_updated?: string | null
          oppningsdatum?: string | null
          publik?: number | null
          senast_projektslut?: string | null
          senast_projektstart?: string | null
          stangningsdatum?: string | null
          tidigast_projektstart?: string | null
          titel?: string | null
          titel_engelska?: string | null
          uppskattat_beslutsdatum?: string | null
          webbsida?: number | null
          webtext_lista?: Json | null
        }
        Relationships: []
      }
      vinnova_utlysningar: {
        Row: {
          ansokningsomgang_dnr_lista: Json | null
          beskrivning: string | null
          beskrivning_engelska: string | null
          created_at: string | null
          diarienummer: string
          diarienummer_program: string | null
          dokument_lista: Json | null
          id: number
          kontakt_lista: Json | null
          lank_lista: Json | null
          last_updated: string | null
          publiceringsdatum: string | null
          publik: number | null
          titel: string | null
          titel_engelska: string | null
        }
        Insert: {
          ansokningsomgang_dnr_lista?: Json | null
          beskrivning?: string | null
          beskrivning_engelska?: string | null
          created_at?: string | null
          diarienummer: string
          diarienummer_program?: string | null
          dokument_lista?: Json | null
          id?: number
          kontakt_lista?: Json | null
          lank_lista?: Json | null
          last_updated?: string | null
          publiceringsdatum?: string | null
          publik?: number | null
          titel?: string | null
          titel_engelska?: string | null
        }
        Update: {
          ansokningsomgang_dnr_lista?: Json | null
          beskrivning?: string | null
          beskrivning_engelska?: string | null
          created_at?: string | null
          diarienummer?: string
          diarienummer_program?: string | null
          dokument_lista?: Json | null
          id?: number
          kontakt_lista?: Json | null
          lank_lista?: Json | null
          last_updated?: string | null
          publiceringsdatum?: string | null
          publik?: number | null
          titel?: string | null
          titel_engelska?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      embedding_input: {
        Args: { doc: Database["public"]["Tables"]["documents"]["Row"] }
        Returns: string
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          content: string
          created_at: string | null
          embedding: unknown | null
          id: number
          title: string
        }[]
      }
      match_grant_call_details: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          ai_enabled: boolean | null
          application_closing_date: string | null
          application_opening_date: string | null
          application_process: string | null
          application_templates_links: Json | null
          application_templates_names: Json | null
          cofinancing_level: number | null
          cofinancing_required: boolean | null
          consortium_requirement: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_title: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          eligibility: string | null
          eligible_cost_categories: Json | null
          eligible_organisations: Json | null
          embedding: string | null
          error_message: string | null
          evaluation_criteria: string | null
          geographic_scope: string | null
          id: string
          industry_sectors: Json | null
          information_webinar_dates: Json | null
          information_webinar_links: Json | null
          information_webinar_names: Json | null
          is_original_source: boolean | null
          keywords: Json | null
          max_grant_per_project: number | null
          min_grant_per_project: number | null
          organisation: string | null
          original_source_url: string | null
          original_url: string
          other_sources_links: Json | null
          other_sources_names: Json | null
          other_templates_links: Json | null
          other_templates_names: Json | null
          processed_at: string | null
          processing_status: string | null
          project_duration_months_max: number | null
          project_duration_months_min: number | null
          project_end_date_max: string | null
          project_end_date_min: string | null
          project_start_date_max: string | null
          project_start_date_min: string | null
          region: string | null
          scraped_at: string | null
          search_description: string | null
          subtitle: string | null
          title: string | null
          total_funding_amount: number | null
          updated_at: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
