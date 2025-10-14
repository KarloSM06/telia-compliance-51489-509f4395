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
      bookings: {
        Row: {
          bokningstyp: string | null
          created_at: string | null
          datum_tid: string | null
          epost: string | null
          extra_info: string | null
          id: string
          info: string | null
          kundnamn: string | null
          status: string | null
          telefonnummer: string | null
          user_id: string | null
        }
        Insert: {
          bokningstyp?: string | null
          created_at?: string | null
          datum_tid?: string | null
          epost?: string | null
          extra_info?: string | null
          id?: string
          info?: string | null
          kundnamn?: string | null
          status?: string | null
          telefonnummer?: string | null
          user_id?: string | null
        }
        Update: {
          bokningstyp?: string | null
          created_at?: string | null
          datum_tid?: string | null
          epost?: string | null
          extra_info?: string | null
          id?: string
          info?: string | null
          kundnamn?: string | null
          status?: string | null
          telefonnummer?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      call_history: {
        Row: {
          booking_id: string | null
          callee: string | null
          caller: string | null
          created_at: string | null
          duration: string | null
          id: string
          outcome: string | null
          transcript: string | null
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          callee?: string | null
          caller?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          outcome?: string | null
          transcript?: string | null
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          callee?: string | null
          caller?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          outcome?: string | null
          transcript?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      calls: {
        Row: {
          created_at: string
          deletion_scheduled_at: string | null
          duration: string | null
          encrypted_agent_name: string | null
          encrypted_analysis: Json | null
          encrypted_customer_name: string | null
          encrypted_customer_phone: string | null
          encrypted_transcript: string | null
          external_call_id: string | null
          file_name: string
          file_path: string | null
          file_size: number | null
          id: string
          leaddesk_campaign_id: string | null
          leaddesk_metadata: Json | null
          sale_outcome: boolean | null
          score: number | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deletion_scheduled_at?: string | null
          duration?: string | null
          encrypted_agent_name?: string | null
          encrypted_analysis?: Json | null
          encrypted_customer_name?: string | null
          encrypted_customer_phone?: string | null
          encrypted_transcript?: string | null
          external_call_id?: string | null
          file_name: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          leaddesk_campaign_id?: string | null
          leaddesk_metadata?: Json | null
          sale_outcome?: boolean | null
          score?: number | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deletion_scheduled_at?: string | null
          duration?: string | null
          encrypted_agent_name?: string | null
          encrypted_analysis?: Json | null
          encrypted_customer_name?: string | null
          encrypted_customer_phone?: string | null
          encrypted_transcript?: string | null
          external_call_id?: string | null
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          leaddesk_campaign_id?: string | null
          leaddesk_metadata?: Json | null
          sale_outcome?: boolean | null
          score?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_shares: {
        Row: {
          created_at: string
          dashboard_id: string
          expires_at: string | null
          id: string
          permission_level: string
          share_token: string | null
          shared_with_user_id: string | null
        }
        Insert: {
          created_at?: string
          dashboard_id: string
          expires_at?: string | null
          id?: string
          permission_level?: string
          share_token?: string | null
          shared_with_user_id?: string | null
        }
        Update: {
          created_at?: string
          dashboard_id?: string
          expires_at?: string | null
          id?: string
          permission_level?: string
          share_token?: string | null
          shared_with_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_shares_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_widgets: {
        Row: {
          config: Json
          created_at: string
          dashboard_id: string
          data_source: Json | null
          id: string
          page_id: string
          position: Json
          widget_type: string
        }
        Insert: {
          config?: Json
          created_at?: string
          dashboard_id: string
          data_source?: Json | null
          id?: string
          page_id?: string
          position?: Json
          widget_type: string
        }
        Update: {
          config?: Json
          created_at?: string
          dashboard_id?: string
          data_source?: Json | null
          id?: string
          page_id?: string
          position?: Json
          widget_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboards: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          is_template: boolean | null
          layout: Json | null
          pages: Json | null
          theme: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          layout?: Json | null
          pages?: Json | null
          theme?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          layout?: Json | null
          pages?: Json | null
          theme?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_access_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_access_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Hiems_Kunddata: {
        Row: {
          Antaletminuter: number | null
          AntaletSMS: number | null
          call_transfers: string | null
          Chrono_Nummer: number | null
          concurrent_calls: string | null
          created_at: string | null
          email: string | null
          Hermes_Nummer: number | null
          minutes_transfed_call: string | null
          plan: string | null
          status: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          Antaletminuter?: number | null
          AntaletSMS?: number | null
          call_transfers?: string | null
          Chrono_Nummer?: number | null
          concurrent_calls?: string | null
          created_at?: string | null
          email?: string | null
          Hermes_Nummer?: number | null
          minutes_transfed_call?: string | null
          plan?: string | null
          status?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          Antaletminuter?: number | null
          AntaletSMS?: number | null
          call_transfers?: string | null
          Chrono_Nummer?: number | null
          concurrent_calls?: string | null
          created_at?: string | null
          email?: string | null
          Hermes_Nummer?: number | null
          minutes_transfed_call?: string | null
          plan?: string | null
          status?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      leaddesk_agent_mapping: {
        Row: {
          created_at: string | null
          encrypted_agent_name: string | null
          id: string
          leaddesk_agent_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          encrypted_agent_name?: string | null
          id?: string
          leaddesk_agent_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          encrypted_agent_name?: string | null
          id?: string
          leaddesk_agent_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaddesk_agent_mapping_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          Antal_segment: number | null
          content: string | null
          created_at: string | null
          direction: string | null
          id: string
          recipient: number | null
          sender: number | null
          Twilio_ID: string | null
          user_id: string | null
        }
        Insert: {
          Antal_segment?: number | null
          content?: string | null
          created_at?: string | null
          direction?: string | null
          id?: string
          recipient?: number | null
          sender?: number | null
          Twilio_ID?: string | null
          user_id?: string | null
        }
        Update: {
          Antal_segment?: number | null
          content?: string | null
          created_at?: string | null
          direction?: string | null
          id?: string
          recipient?: number | null
          sender?: number | null
          Twilio_ID?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          phone_number: string
          summary: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          phone_number: string
          summary?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          phone_number?: string
          summary?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          max_members: number | null
          name: string
          owner_id: string | null
          plan_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_members?: number | null
          name: string
          owner_id?: string | null
          plan_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_members?: number | null
          name?: string
          owner_id?: string | null
          plan_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      phone_numbers: {
        Row: {
          created_at: string
          id: string
          phone_number: string
        }
        Insert: {
          created_at?: string
          id?: string
          phone_number: string
        }
        Update: {
          created_at?: string
          id?: string
          phone_number?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          data_retention_days: number
          email: string | null
          gdpr_consent: boolean | null
          gdpr_consent_date: string | null
          id: string
          leaddesk_consent: boolean | null
          leaddesk_consent_date: string | null
          leaddesk_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          data_retention_days?: number
          email?: string | null
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id: string
          leaddesk_consent?: boolean | null
          leaddesk_consent_date?: string | null
          leaddesk_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          data_retention_days?: number
          email?: string | null
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          leaddesk_consent?: boolean | null
          leaddesk_consent_date?: string | null
          leaddesk_enabled?: boolean | null
        }
        Relationships: []
      }
      settings_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          is_hiems_admin: boolean | null
          target_id: string | null
          target_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          is_hiems_admin?: boolean | null
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          is_hiems_admin?: boolean | null
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          full_analysis_enabled: boolean
          id: string
          leaddesk_addon: boolean
          number_of_agents: number
          plan_type: string
          smart_analysis_enabled: boolean
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          full_analysis_enabled?: boolean
          id?: string
          leaddesk_addon?: boolean
          number_of_agents?: number
          plan_type?: string
          smart_analysis_enabled?: boolean
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          full_analysis_enabled?: boolean
          id?: string
          leaddesk_addon?: boolean
          number_of_agents?: number
          plan_type?: string
          smart_analysis_enabled?: boolean
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          email: string
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          role: string
          status: string
          user_id: string | null
        }
        Insert: {
          email: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          role: string
          status?: string
          user_id?: string | null
        }
        Update: {
          email?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          role?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analysis: {
        Row: {
          average_score: number | null
          encrypted_insights: Json | null
          id: string
          success_rate: number | null
          total_calls: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_score?: number | null
          encrypted_insights?: Json | null
          id?: string
          success_rate?: number | null
          total_calls?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_score?: number | null
          encrypted_insights?: Json | null
          id?: string
          success_rate?: number | null
          total_calls?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_products: {
        Row: {
          created_at: string
          id: string
          minutes_purchased: number | null
          product_id: string
          purchased_at: string
          status: string
          stripe_price_id: string
          stripe_session_id: string | null
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          minutes_purchased?: number | null
          product_id: string
          purchased_at?: string
          status?: string
          stripe_price_id: string
          stripe_session_id?: string | null
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          minutes_purchased?: number | null
          product_id?: string
          purchased_at?: string
          status?: string
          stripe_price_id?: string
          stripe_session_id?: string | null
          tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      widget_templates: {
        Row: {
          category: string | null
          config_template: Json
          created_at: string
          creator_id: string | null
          description: string | null
          downloads: number | null
          id: string
          is_public: boolean | null
          name: string
          preview_image: string | null
          rating: number | null
          widget_type: string
        }
        Insert: {
          category?: string | null
          config_template?: Json
          created_at?: string
          creator_id?: string | null
          description?: string | null
          downloads?: number | null
          id?: string
          is_public?: boolean | null
          name: string
          preview_image?: string | null
          rating?: number | null
          widget_type: string
        }
        Update: {
          category?: string | null
          config_template?: Json
          created_at?: string
          creator_id?: string | null
          description?: string | null
          downloads?: number | null
          id?: string
          is_public?: boolean | null
          name?: string
          preview_image?: string | null
          rating?: number | null
          widget_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_delete_old_calls: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrypt_text: {
        Args: { encrypted_data: string; key: string }
        Returns: string
      }
      encrypt_text: {
        Args: { data: string; key: string }
        Returns: string
      }
      has_org_role: {
        Args: { required_roles: string[]; user_uuid: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      user_can_access_dashboard: {
        Args: { dashboard_uuid: string; user_uuid: string }
        Returns: boolean
      }
      user_organization_id: {
        Args: { user_uuid: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
