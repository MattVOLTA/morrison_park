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
          confidence: string | null
          created_at: string | null
          employee_count: number | null
          founded_year: number | null
          id: string
          industry: string | null
          legal_name: string | null
          location: string
          markdown_content: string | null
          name: string
          ownership_type: string | null
          province: string
          research_date: string | null
          revenue_estimate: number | null
          score_activity_trajectory: number | null
          score_legacy_signals: number | null
          score_nextgen_clarity: number | null
          score_owner_age: number | null
          score_tenure: number | null
          succession_composite: number | null
          succession_readiness: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          confidence?: string | null
          created_at?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          location: string
          markdown_content?: string | null
          name: string
          ownership_type?: string | null
          province: string
          research_date?: string | null
          revenue_estimate?: number | null
          score_activity_trajectory?: number | null
          score_legacy_signals?: number | null
          score_nextgen_clarity?: number | null
          score_owner_age?: number | null
          score_tenure?: number | null
          succession_composite?: number | null
          succession_readiness?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          confidence?: string | null
          created_at?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          location?: string
          markdown_content?: string | null
          name?: string
          ownership_type?: string | null
          province?: string
          research_date?: string | null
          revenue_estimate?: number | null
          score_activity_trajectory?: number | null
          score_legacy_signals?: number | null
          score_nextgen_clarity?: number | null
          score_owner_age?: number | null
          score_tenure?: number | null
          succession_composite?: number | null
          succession_readiness?: string | null
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
          id: string
          investment_amount: number | null
          investment_date: string | null
          investor_id: string | null
          source_url: string
        }
        Insert: {
          board_seat?: boolean | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          investment_amount?: number | null
          investment_date?: string | null
          investor_id?: string | null
          source_url: string
        }
        Update: {
          board_seat?: boolean | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          investment_amount?: number | null
          investment_date?: string | null
          investor_id?: string | null
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
      connections: {
        Row: {
          company_id: string | null
          connection_detail: string
          connection_type: string | null
          created_at: string | null
          id: string
          introducer_relationship: string | null
          potential_introducer: string | null
          source_url: string
        }
        Insert: {
          company_id?: string | null
          connection_detail: string
          connection_type?: string | null
          created_at?: string | null
          id?: string
          introducer_relationship?: string | null
          potential_introducer?: string | null
          source_url: string
        }
        Update: {
          company_id?: string | null
          connection_detail?: string
          connection_type?: string | null
          created_at?: string | null
          id?: string
          introducer_relationship?: string | null
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
          geographic_focus: string[] | null
          id: string
          investor_type: string | null
          name: string
          sectors: string[] | null
          source_url: string
          website: string | null
        }
        Insert: {
          created_at?: string | null
          geographic_focus?: string[] | null
          id?: string
          investor_type?: string | null
          name: string
          sectors?: string[] | null
          source_url: string
          website?: string | null
        }
        Update: {
          created_at?: string | null
          geographic_focus?: string[] | null
          id?: string
          investor_type?: string | null
          name?: string
          sectors?: string[] | null
          source_url?: string
          website?: string | null
        }
        Relationships: []
      }
      key_people: {
        Row: {
          age_estimate: number | null
          company_id: string | null
          created_at: string | null
          id: string
          linkedin_url: string | null
          name: string
          notes: string | null
          ownership_percentage: number | null
          role: string | null
          source_url: string
          tenure_years: number | null
          title: string | null
        }
        Insert: {
          age_estimate?: number | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          notes?: string | null
          ownership_percentage?: number | null
          role?: string | null
          source_url: string
          tenure_years?: number | null
          title?: string | null
        }
        Update: {
          age_estimate?: number | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          notes?: string | null
          ownership_percentage?: number | null
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
          id: string
          rationale: string | null
          recent_deals: string | null
          source_url: string
        }
        Insert: {
          acquirer_name: string
          acquirer_type?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          rationale?: string | null
          recent_deals?: string | null
          source_url: string
        }
        Update: {
          acquirer_name?: string
          acquirer_type?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
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
      research_sources: {
        Row: {
          access_date: string | null
          company_id: string | null
          confidence: string | null
          created_at: string | null
          data_points: string[] | null
          id: string
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
          id?: string
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
          id?: string
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
      signals: {
        Row: {
          company_id: string | null
          confidence: string | null
          created_at: string | null
          description: string
          id: string
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
          id?: string
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
          id?: string
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
          confidence: string | null
          created_at: string | null
          employee_count: number | null
          feedback_notes: string | null
          founded_year: number | null
          id: string | null
          industry: string | null
          legal_name: string | null
          location: string | null
          markdown_content: string | null
          name: string | null
          novelty_score: number | null
          ownership_type: string | null
          people_count: number | null
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
export type Connection = Database['public']['Tables']['connections']['Row']
export type ConnectionInsert = Database['public']['Tables']['connections']['Insert']
export type Pipeline = Database['public']['Tables']['pipeline']['Row']
export type PipelineInsert = Database['public']['Tables']['pipeline']['Insert']

// Signal type enums for type safety
export type SignalType = 'sell_side' | 'buy_side' | 'growth' | 'leadership' | 'financial' | 'strategic'
export type ConnectionType = 'board' | 'conference' | 'philanthropy' | 'advisor' | 'alumni' | 'investor' | 'personal' | 'other'
export type PipelineStage = 'prospect' | 'researching' | 'outreach' | 'engaged' | 'active_deal' | 'closed' | 'passed'
export type ClientType = 'sell_side' | 'buy_side' | 'growth_capital'
export type InvestorType = 'pe' | 'family_office' | 'strategic' | 'angel' | 'institutional'
