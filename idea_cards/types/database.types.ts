export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          company_description: string | null
          company_history: string | null
          competitive_position: string | null
          confidence: string | null
          created_at: string | null
          deal_activity: string | null
          employee_count: number | null
          executive_summary: string | null
          financial_highlights: Json | null
          founded_year: number | null
          generated_by_model: string | null
          geographies: string[] | null
          id: string
          industry: string | null
          industry_memberships: string | null
          industry_tailwinds: string | null
          last_monitored_at: string | null
          legal_name: string | null
          location: string
          major_projects: string | null
          markdown_content: string | null
          markets_customers: string | null
          model_metadata: Json | null
          name: string
          ownership_type: string | null
          products_services: string | null
          province: string
          research_date: string | null
          revenue_estimate: number | null
          score_activity_trajectory: number | null
          score_legacy_signals: number | null
          score_nextgen_clarity: number | null
          score_owner_age: number | null
          score_tenure: number | null
          stock_exchange: string | null
          succession_composite: number | null
          succession_readiness: string | null
          ticker_symbol: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          company_description?: string | null
          company_history?: string | null
          competitive_position?: string | null
          confidence?: string | null
          created_at?: string | null
          deal_activity?: string | null
          employee_count?: number | null
          executive_summary?: string | null
          financial_highlights?: Json | null
          founded_year?: number | null
          generated_by_model?: string | null
          geographies?: string[] | null
          id?: string
          industry?: string | null
          industry_memberships?: string | null
          industry_tailwinds?: string | null
          last_monitored_at?: string | null
          legal_name?: string | null
          location: string
          major_projects?: string | null
          markdown_content?: string | null
          markets_customers?: string | null
          model_metadata?: Json | null
          name: string
          ownership_type?: string | null
          products_services?: string | null
          province: string
          research_date?: string | null
          revenue_estimate?: number | null
          score_activity_trajectory?: number | null
          score_legacy_signals?: number | null
          score_nextgen_clarity?: number | null
          score_owner_age?: number | null
          score_tenure?: number | null
          stock_exchange?: string | null
          succession_composite?: number | null
          succession_readiness?: string | null
          ticker_symbol?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          company_description?: string | null
          company_history?: string | null
          competitive_position?: string | null
          confidence?: string | null
          created_at?: string | null
          deal_activity?: string | null
          employee_count?: number | null
          executive_summary?: string | null
          financial_highlights?: Json | null
          founded_year?: number | null
          generated_by_model?: string | null
          geographies?: string[] | null
          id?: string
          industry?: string | null
          industry_memberships?: string | null
          industry_tailwinds?: string | null
          last_monitored_at?: string | null
          legal_name?: string | null
          location?: string
          major_projects?: string | null
          markdown_content?: string | null
          markets_customers?: string | null
          model_metadata?: Json | null
          name?: string
          ownership_type?: string | null
          products_services?: string | null
          province?: string
          research_date?: string | null
          revenue_estimate?: number | null
          score_activity_trajectory?: number | null
          score_legacy_signals?: number | null
          score_nextgen_clarity?: number | null
          score_owner_age?: number | null
          score_tenure?: number | null
          stock_exchange?: string | null
          succession_composite?: number | null
          succession_readiness?: string | null
          ticker_symbol?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      company_investors: {
        Row: {
          board_seat: boolean | null
          company_id: string | null
          created_at: string | null
          generated_by_model: string | null
          id: string
          investment_amount: number | null
          investment_date: string | null
          investor_id: string | null
          model_metadata: Json | null
          round_type: string | null
          source_url: string
        }
        Insert: {
          board_seat?: boolean | null
          company_id?: string | null
          created_at?: string | null
          generated_by_model?: string | null
          id?: string
          investment_amount?: number | null
          investment_date?: string | null
          investor_id?: string | null
          model_metadata?: Json | null
          round_type?: string | null
          source_url: string
        }
        Update: {
          board_seat?: boolean | null
          company_id?: string | null
          created_at?: string | null
          generated_by_model?: string | null
          id?: string
          investment_amount?: number | null
          investment_date?: string | null
          investor_id?: string | null
          model_metadata?: Json | null
          round_type?: string | null
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_investors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_investors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_investors_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      comparable_transactions: {
        Row: {
          acquirer_name: string | null
          company_id: string
          created_at: string | null
          deal_value: number | null
          description: string | null
          generated_by_model: string | null
          id: string
          model_metadata: Json | null
          multiple: string | null
          source_url: string | null
          target_name: string
          transaction_date: string | null
        }
        Insert: {
          acquirer_name?: string | null
          company_id: string
          created_at?: string | null
          deal_value?: number | null
          description?: string | null
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          multiple?: string | null
          source_url?: string | null
          target_name: string
          transaction_date?: string | null
        }
        Update: {
          acquirer_name?: string | null
          company_id?: string
          created_at?: string | null
          deal_value?: number | null
          description?: string | null
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          multiple?: string | null
          source_url?: string | null
          target_name?: string
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comparable_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparable_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          company_id: string | null
          connection_detail: string
          connection_type: string | null
          created_at: string | null
          generated_by_model: string | null
          id: string
          introducer_relationship: string | null
          model_metadata: Json | null
          potential_introducer: string | null
          source_url: string
        }
        Insert: {
          company_id?: string | null
          connection_detail: string
          connection_type?: string | null
          created_at?: string | null
          generated_by_model?: string | null
          id?: string
          introducer_relationship?: string | null
          model_metadata?: Json | null
          potential_introducer?: string | null
          source_url: string
        }
        Update: {
          company_id?: string | null
          connection_detail?: string
          connection_type?: string | null
          created_at?: string | null
          generated_by_model?: string | null
          id?: string
          introducer_relationship?: string | null
          model_metadata?: Json | null
          potential_introducer?: string | null
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
      investors: {
        Row: {
          created_at: string | null
          generated_by_model: string | null
          geographic_focus: string[] | null
          id: string
          investor_type: string | null
          model_metadata: Json | null
          name: string
          sectors: string[] | null
          source_url: string
          website: string | null
        }
        Insert: {
          created_at?: string | null
          generated_by_model?: string | null
          geographic_focus?: string[] | null
          id?: string
          investor_type?: string | null
          model_metadata?: Json | null
          name: string
          sectors?: string[] | null
          source_url: string
          website?: string | null
        }
        Update: {
          created_at?: string | null
          generated_by_model?: string | null
          geographic_focus?: string[] | null
          id?: string
          investor_type?: string | null
          model_metadata?: Json | null
          name?: string
          sectors?: string[] | null
          source_url?: string
          website?: string | null
        }
        Relationships: []
      }
      key_people: {
        Row: {
          affiliation: string | null
          age_estimate: number | null
          company_id: string | null
          conversation_starters: string | null
          created_at: string | null
          generated_by_model: string | null
          id: string
          linkedin_about: string | null
          linkedin_headline: string | null
          linkedin_scraped_at: string | null
          linkedin_themes: string | null
          linkedin_url: string | null
          model_metadata: Json | null
          name: string
          notes: string | null
          ownership_percentage: number | null
          person_type: string | null
          role: string | null
          source_url: string
          tenure_years: number | null
          title: string | null
        }
        Insert: {
          affiliation?: string | null
          age_estimate?: number | null
          company_id?: string | null
          conversation_starters?: string | null
          created_at?: string | null
          generated_by_model?: string | null
          id?: string
          linkedin_about?: string | null
          linkedin_headline?: string | null
          linkedin_scraped_at?: string | null
          linkedin_themes?: string | null
          linkedin_url?: string | null
          model_metadata?: Json | null
          name: string
          notes?: string | null
          ownership_percentage?: number | null
          person_type?: string | null
          role?: string | null
          source_url: string
          tenure_years?: number | null
          title?: string | null
        }
        Update: {
          affiliation?: string | null
          age_estimate?: number | null
          company_id?: string | null
          conversation_starters?: string | null
          created_at?: string | null
          generated_by_model?: string | null
          id?: string
          linkedin_about?: string | null
          linkedin_headline?: string | null
          linkedin_scraped_at?: string | null
          linkedin_themes?: string | null
          linkedin_url?: string | null
          model_metadata?: Json | null
          name?: string
          notes?: string | null
          ownership_percentage?: number | null
          person_type?: string | null
          role?: string | null
          source_url?: string
          tenure_years?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "key_people_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_people_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
      ma_transactions: {
        Row: {
          company_id: string
          counterparty: string | null
          created_at: string | null
          deal_value: number | null
          description: string
          generated_by_model: string | null
          id: string
          model_metadata: Json | null
          source_url: string | null
          transaction_date: string | null
          transaction_type: string | null
        }
        Insert: {
          company_id: string
          counterparty?: string | null
          created_at?: string | null
          deal_value?: number | null
          description: string
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          source_url?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
        }
        Update: {
          company_id?: string
          counterparty?: string | null
          created_at?: string | null
          deal_value?: number | null
          description?: string
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          source_url?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ma_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ma_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline: {
        Row: {
          client_type: string | null
          company_id: string | null
          created_at: string | null
          id: string
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          priority: number | null
          stage: string | null
          updated_at: string | null
        }
        Insert: {
          client_type?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          priority?: number | null
          stage?: string | null
          updated_at?: string | null
        }
        Update: {
          client_type?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          priority?: number | null
          stage?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
      potential_acquirers: {
        Row: {
          acquirer_name: string
          acquirer_type: string | null
          company_id: string | null
          created_at: string | null
          generated_by_model: string | null
          id: string
          model_metadata: Json | null
          rationale: string | null
          recent_deals: string | null
          source_url: string
        }
        Insert: {
          acquirer_name: string
          acquirer_type?: string | null
          company_id?: string | null
          created_at?: string | null
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          rationale?: string | null
          recent_deals?: string | null
          source_url: string
        }
        Update: {
          acquirer_name?: string
          acquirer_type?: string | null
          company_id?: string | null
          created_at?: string | null
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          rationale?: string | null
          recent_deals?: string | null
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "potential_acquirers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "potential_acquirers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          generated_by_model: string | null
          id: string
          model_metadata: Json | null
          name: string
          product_type: string | null
          source_url: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          name: string
          product_type?: string | null
          source_url?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          name?: string
          product_type?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
      research_sources: {
        Row: {
          access_date: string | null
          company_id: string | null
          confidence: string | null
          created_at: string | null
          data_points: string[] | null
          generated_by_model: string | null
          id: string
          model_metadata: Json | null
          source_name: string
          source_type: string | null
          source_url: string
        }
        Insert: {
          access_date?: string | null
          company_id?: string | null
          confidence?: string | null
          created_at?: string | null
          data_points?: string[] | null
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          source_name: string
          source_type?: string | null
          source_url: string
        }
        Update: {
          access_date?: string | null
          company_id?: string | null
          confidence?: string | null
          created_at?: string | null
          data_points?: string[] | null
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          source_name?: string
          source_type?: string | null
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_sources_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_sources_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
      signal_feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          signal_id: string
          updated_at: string
          vote: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          signal_id: string
          updated_at?: string
          vote: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          signal_id?: string
          updated_at?: string
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "signal_feedback_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: true
            referencedRelation: "signals"
            referencedColumns: ["id"]
          },
        ]
      }
      signals: {
        Row: {
          company_id: string | null
          confidence: string | null
          created_at: string | null
          description: string
          generated_by_model: string | null
          id: string
          model_metadata: Json | null
          signal_category: string | null
          signal_date: string | null
          signal_type: string | null
          source_url: string
        }
        Insert: {
          company_id?: string | null
          confidence?: string | null
          created_at?: string | null
          description: string
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          signal_category?: string | null
          signal_date?: string | null
          signal_type?: string | null
          source_url: string
        }
        Update: {
          company_id?: string | null
          confidence?: string | null
          created_at?: string | null
          description?: string
          generated_by_model?: string | null
          id?: string
          model_metadata?: Json | null
          signal_category?: string | null
          signal_date?: string | null
          signal_type?: string | null
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "signals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          accuracy_score: number | null
          actionability_score: number | null
          company_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          novelty_score: number | null
          updated_at: string | null
          would_pursue: boolean | null
        }
        Insert: {
          accuracy_score?: number | null
          actionability_score?: number | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          novelty_score?: number | null
          updated_at?: string | null
          would_pursue?: boolean | null
        }
        Update: {
          accuracy_score?: number | null
          actionability_score?: number | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          novelty_score?: number | null
          updated_at?: string | null
          would_pursue?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_dashboard_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      company_dashboard_view: {
        Row: {
          accuracy_score: number | null
          acquirer_count: number | null
          actionability_score: number | null
          company_description: string | null
          company_history: string | null
          competitive_position: string | null
          confidence: string | null
          created_at: string | null
          deal_activity: string | null
          employee_count: number | null
          executive_summary: string | null
          feedback_notes: string | null
          founded_year: number | null
          id: string | null
          industry: string | null
          industry_memberships: string | null
          legal_name: string | null
          location: string | null
          major_projects: string | null
          markdown_content: string | null
          markets_customers: string | null
          name: string | null
          novelty_score: number | null
          ownership_type: string | null
          people_count: number | null
          pipeline_client_type: string | null
          pipeline_priority: number | null
          pipeline_stage: string | null
          products_services: string | null
          province: string | null
          research_date: string | null
          revenue_estimate: number | null
          score_activity_trajectory: number | null
          score_legacy_signals: number | null
          score_nextgen_clarity: number | null
          score_owner_age: number | null
          score_tenure: number | null
          source_count: number | null
          succession_composite: number | null
          succession_readiness: string | null
          updated_at: string | null
          website: string | null
          would_pursue: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Convenience types for the new multi-agent tables
export type Company = Database['public']['Tables']['companies']['Row']
export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type KeyPerson = Database['public']['Tables']['key_people']['Row']
export type PotentialAcquirer = Database['public']['Tables']['potential_acquirers']['Row']
export type ResearchSource = Database['public']['Tables']['research_sources']['Row']
export type UserFeedback = Database['public']['Tables']['user_feedback']['Row']
export type CompanyDashboardView = Database['public']['Views']['company_dashboard_view']['Row']

// New multi-agent system types
export type Investor = Database['public']['Tables']['investors']['Row']
export type InvestorInsert = Database['public']['Tables']['investors']['Insert']
export type CompanyInvestor = Database['public']['Tables']['company_investors']['Row']
export type CompanyInvestorInsert = Database['public']['Tables']['company_investors']['Insert']
export type Signal = Database['public']['Tables']['signals']['Row']
export type SignalInsert = Database['public']['Tables']['signals']['Insert']
export type SignalFeedback = Database['public']['Tables']['signal_feedback']['Row']
export type SignalFeedbackInsert = Database['public']['Tables']['signal_feedback']['Insert']
export type Connection = Database['public']['Tables']['connections']['Row']
export type ConnectionInsert = Database['public']['Tables']['connections']['Insert']
export type Pipeline = Database['public']['Tables']['pipeline']['Row']
export type PipelineInsert = Database['public']['Tables']['pipeline']['Insert']

// Signal type enums for type safety
export type SignalType = 'sell_side' | 'buy_side' | 'growth' | 'leadership' | 'financial' | 'strategic'
export type SignalVote = 'up' | 'down'
export type ConnectionType = 'board' | 'conference' | 'philanthropy' | 'advisor' | 'alumni' | 'investor' | 'personal' | 'other'
export type PipelineStage = 'prospect' | 'researching' | 'outreach' | 'engaged' | 'active_deal' | 'closed' | 'passed'
export type ClientType = 'sell_side' | 'buy_side' | 'growth_capital'
export type InvestorType = 'pe' | 'family_office' | 'strategic' | 'angel' | 'institutional'
