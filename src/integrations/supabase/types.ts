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
      ai_consultations: {
        Row: {
          ai_goals: string[] | null
          ai_goals_other: string | null
          ai_priority: number | null
          ai_users: string[] | null
          ai_users_other: string | null
          budget: string | null
          business_description: string
          company_name: string
          contact_person: string
          created_at: string | null
          current_systems: string | null
          data_quality: number | null
          data_types: string[] | null
          data_types_other: string | null
          email: string
          ethical_limitations: string | null
          existing_ai: string | null
          gdpr_compliant: string | null
          historical_data: string | null
          id: string
          internal_resources: string[] | null
          internal_resources_other: string | null
          long_term_goals: string | null
          manual_processes: string | null
          open_to_experiments: string | null
          phone: string
          regulatory_requirements: string | null
          sensitive_data: string | null
          success_definition: string | null
          timeframe: string | null
          training_needed: string | null
        }
        Insert: {
          ai_goals?: string[] | null
          ai_goals_other?: string | null
          ai_priority?: number | null
          ai_users?: string[] | null
          ai_users_other?: string | null
          budget?: string | null
          business_description: string
          company_name: string
          contact_person: string
          created_at?: string | null
          current_systems?: string | null
          data_quality?: number | null
          data_types?: string[] | null
          data_types_other?: string | null
          email: string
          ethical_limitations?: string | null
          existing_ai?: string | null
          gdpr_compliant?: string | null
          historical_data?: string | null
          id?: string
          internal_resources?: string[] | null
          internal_resources_other?: string | null
          long_term_goals?: string | null
          manual_processes?: string | null
          open_to_experiments?: string | null
          phone: string
          regulatory_requirements?: string | null
          sensitive_data?: string | null
          success_definition?: string | null
          timeframe?: string | null
          training_needed?: string | null
        }
        Update: {
          ai_goals?: string[] | null
          ai_goals_other?: string | null
          ai_priority?: number | null
          ai_users?: string[] | null
          ai_users_other?: string | null
          budget?: string | null
          business_description?: string
          company_name?: string
          contact_person?: string
          created_at?: string | null
          current_systems?: string | null
          data_quality?: number | null
          data_types?: string[] | null
          data_types_other?: string | null
          email?: string
          ethical_limitations?: string | null
          existing_ai?: string | null
          gdpr_compliant?: string | null
          historical_data?: string | null
          id?: string
          internal_resources?: string[] | null
          internal_resources_other?: string | null
          long_term_goals?: string | null
          manual_processes?: string | null
          open_to_experiments?: string | null
          phone?: string
          regulatory_requirements?: string | null
          sensitive_data?: string | null
          success_definition?: string | null
          timeframe?: string | null
          training_needed?: string | null
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          is_locked: boolean | null
          is_template: boolean | null
          specific_date: string | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          is_locked?: boolean | null
          is_template?: boolean | null
          specific_date?: string | null
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          is_locked?: boolean | null
          is_template?: boolean | null
          specific_date?: string | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      booking_sync_queue: {
        Row: {
          attempts: number | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          error_message: string | null
          external_id: string | null
          id: string
          integration_id: string
          max_attempts: number | null
          operation: string
          payload: Json | null
          processed_at: string | null
          scheduled_at: string | null
          status: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          integration_id: string
          max_attempts?: number | null
          operation: string
          payload?: Json | null
          processed_at?: string | null
          scheduled_at?: string | null
          status?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string
          max_attempts?: number | null
          operation?: string
          payload?: Json | null
          processed_at?: string | null
          scheduled_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_sync_queue_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "booking_system_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_system_integrations: {
        Row: {
          created_at: string | null
          encrypted_credentials: Json | null
          failed_syncs: number | null
          field_mappings: Json | null
          id: string
          integration_type: string
          is_configured: boolean | null
          is_enabled: boolean | null
          last_sync_at: string | null
          last_sync_error: string | null
          last_sync_status: string | null
          next_sync_at: string | null
          organization_id: string | null
          provider: string
          provider_display_name: string
          sync_settings: Json | null
          total_synced_events: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          encrypted_credentials?: Json | null
          failed_syncs?: number | null
          field_mappings?: Json | null
          id?: string
          integration_type?: string
          is_configured?: boolean | null
          is_enabled?: boolean | null
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          next_sync_at?: string | null
          organization_id?: string | null
          provider: string
          provider_display_name: string
          sync_settings?: Json | null
          total_synced_events?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          encrypted_credentials?: Json | null
          failed_syncs?: number | null
          field_mappings?: Json | null
          id?: string
          integration_type?: string
          is_configured?: boolean | null
          is_enabled?: boolean | null
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          next_sync_at?: string | null
          organization_id?: string | null
          provider?: string
          provider_display_name?: string
          sync_settings?: Json | null
          total_synced_events?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_system_integrations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_system_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_webhooks: {
        Row: {
          created_at: string | null
          event_types: Json | null
          id: string
          integration_id: string
          is_active: boolean | null
          last_received_at: string | null
          webhook_secret: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          event_types?: Json | null
          id?: string
          integration_id: string
          is_active?: boolean | null
          last_received_at?: string | null
          webhook_secret?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          event_types?: Json | null
          id?: string
          integration_id?: string
          is_active?: boolean | null
          last_received_at?: string | null
          webhook_secret?: string | null
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_webhooks_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "booking_system_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      calendar_events: {
        Row: {
          address: string | null
          all_day: boolean | null
          attendees: Json | null
          booking_system_integration_id: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          event_type: string
          external_id: string | null
          id: string
          last_synced_at: string | null
          lead_id: string | null
          next_steps: string | null
          notes: string | null
          organization_id: string | null
          outcome: string | null
          reminders: Json | null
          source: string | null
          start_time: string
          status: string | null
          sync_status: string | null
          timezone: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          all_day?: boolean | null
          attendees?: Json | null
          booking_system_integration_id?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          event_type?: string
          external_id?: string | null
          id?: string
          last_synced_at?: string | null
          lead_id?: string | null
          next_steps?: string | null
          notes?: string | null
          organization_id?: string | null
          outcome?: string | null
          reminders?: Json | null
          source?: string | null
          start_time: string
          status?: string | null
          sync_status?: string | null
          timezone?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          all_day?: boolean | null
          attendees?: Json | null
          booking_system_integration_id?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          event_type?: string
          external_id?: string | null
          id?: string
          last_synced_at?: string | null
          lead_id?: string | null
          next_steps?: string | null
          notes?: string | null
          organization_id?: string | null
          outcome?: string | null
          reminders?: Json | null
          source?: string | null
          start_time?: string
          status?: string | null
          sync_status?: string | null
          timezone?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_booking_system_integration_id_fkey"
            columns: ["booking_system_integration_id"]
            isOneToOne: false
            referencedRelation: "booking_system_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      call_history: {
        Row: {
          booking_id: string | null
          callee: string | null
          caller: string | null
          created_at: string | null
          duration: number | null
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
          duration?: number | null
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
          duration?: number | null
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
          AntaletMinuter: string | null
          AntaletSMS: string | null
          call_transfers: string | null
          Chrono_Nummer: string | null
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
          AntaletMinuter?: string | null
          AntaletSMS?: string | null
          call_transfers?: string | null
          Chrono_Nummer?: string | null
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
          AntaletMinuter?: string | null
          AntaletSMS?: string | null
          call_transfers?: string | null
          Chrono_Nummer?: string | null
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
      lead_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          lead_id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_searches: {
        Row: {
          apartment_range: string | null
          company_size: string | null
          construction_year_range: string | null
          created_at: string
          employee_range: string | null
          id: string
          industry: string[] | null
          keywords: string[] | null
          last_run_at: string | null
          lead_type: string | null
          leads_generated: number | null
          leads_target: number | null
          location: string[] | null
          monthly_fee_range: string | null
          organization_id: string | null
          organization_type: string | null
          revenue_range: string | null
          search_name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          apartment_range?: string | null
          company_size?: string | null
          construction_year_range?: string | null
          created_at?: string
          employee_range?: string | null
          id?: string
          industry?: string[] | null
          keywords?: string[] | null
          last_run_at?: string | null
          lead_type?: string | null
          leads_generated?: number | null
          leads_target?: number | null
          location?: string[] | null
          monthly_fee_range?: string | null
          organization_id?: string | null
          organization_type?: string | null
          revenue_range?: string | null
          search_name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          apartment_range?: string | null
          company_size?: string | null
          construction_year_range?: string | null
          created_at?: string
          employee_range?: string | null
          id?: string
          industry?: string[] | null
          keywords?: string[] | null
          last_run_at?: string | null
          lead_type?: string | null
          leads_generated?: number | null
          leads_target?: number | null
          location?: string[] | null
          monthly_fee_range?: string | null
          organization_id?: string | null
          organization_type?: string | null
          revenue_range?: string | null
          search_name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_searches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      leads: {
        Row: {
          Adress: string | null
          ai_reasoning: string | null
          ai_score: number | null
          apartment_count: number | null
          company_name: string
          company_size: string | null
          construction_year: number | null
          contact_person: string | null
          contacted_at: string | null
          converted_at: string | null
          created_at: string
          description: string | null
          email: string | null
          employee_count: number | null
          Facebook: string | null
          id: string
          industry: string | null
          Instagram: string | null
          kontakt_person: string | null
          kontakt_person_facebook: string | null
          kontakt_person_insta: string | null
          kontakt_person_LinkedIN: string | null
          kontakt_person_mail: string | null
          kontakt_person_telefon: string | null
          lead_type: string | null
          LinkedIn: string | null
          location: string | null
          monthly_fee: number | null
          notes: string | null
          organization_id: string | null
          organization_type: string | null
          phone: string | null
          Postal_Area: string | null
          priority: string | null
          search_id: string | null
          source: string | null
          status: string
          Twitter: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          Adress?: string | null
          ai_reasoning?: string | null
          ai_score?: number | null
          apartment_count?: number | null
          company_name: string
          company_size?: string | null
          construction_year?: number | null
          contact_person?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count?: number | null
          Facebook?: string | null
          id?: string
          industry?: string | null
          Instagram?: string | null
          kontakt_person?: string | null
          kontakt_person_facebook?: string | null
          kontakt_person_insta?: string | null
          kontakt_person_LinkedIN?: string | null
          kontakt_person_mail?: string | null
          kontakt_person_telefon?: string | null
          lead_type?: string | null
          LinkedIn?: string | null
          location?: string | null
          monthly_fee?: number | null
          notes?: string | null
          organization_id?: string | null
          organization_type?: string | null
          phone?: string | null
          Postal_Area?: string | null
          priority?: string | null
          search_id?: string | null
          source?: string | null
          status?: string
          Twitter?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          Adress?: string | null
          ai_reasoning?: string | null
          ai_score?: number | null
          apartment_count?: number | null
          company_name?: string
          company_size?: string | null
          construction_year?: number | null
          contact_person?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count?: number | null
          Facebook?: string | null
          id?: string
          industry?: string | null
          Instagram?: string | null
          kontakt_person?: string | null
          kontakt_person_facebook?: string | null
          kontakt_person_insta?: string | null
          kontakt_person_LinkedIN?: string | null
          kontakt_person_mail?: string | null
          kontakt_person_telefon?: string | null
          lead_type?: string | null
          LinkedIn?: string | null
          location?: string | null
          monthly_fee?: number | null
          notes?: string | null
          organization_id?: string | null
          organization_type?: string | null
          phone?: string | null
          Postal_Area?: string | null
          priority?: string | null
          search_id?: string | null
          source?: string | null
          status?: string
          Twitter?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "lead_searches"
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          phone_number: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          phone_number?: string
          user_id?: string | null
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
