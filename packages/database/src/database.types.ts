
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      diagnostic_sessions: {
        Row: {
          answers: Json
          completed_at: string
          created_at: string
          duration_seconds: number | null
          engine_version: string
          id: string
          locale: string
          manychat_subscriber_id: string | null
          organization_id: string
          result: Json
          source: string | null
          started_at: string
          status: string
        }
        Insert: {
          answers: Json
          completed_at?: string
          created_at?: string
          duration_seconds?: number | null
          engine_version: string
          id?: string
          locale?: string
          manychat_subscriber_id?: string | null
          organization_id: string
          result: Json
          source?: string | null
          started_at: string
          status?: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          created_at?: string
          duration_seconds?: number | null
          engine_version?: string
          id?: string
          locale?: string
          manychat_subscriber_id?: string | null
          organization_id?: string
          result?: Json
          source?: string | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_advisor_id: string | null
          created_at: string
          current_stage_id: string
          diagnostic_session_id: string
          email: string | null
          full_name: string | null
          id: string
          instagram_username: string | null
          last_interaction_at: string | null
          manychat_subscriber_id: string | null
          organization_id: string
          phone_country_code: string | null
          phone_number: string | null
        }
        Insert: {
          assigned_advisor_id?: string | null
          created_at?: string
          current_stage_id: string
          diagnostic_session_id: string
          email?: string | null
          full_name?: string | null
          id?: string
          instagram_username?: string | null
          last_interaction_at?: string | null
          manychat_subscriber_id?: string | null
          organization_id: string
          phone_country_code?: string | null
          phone_number?: string | null
        }
        Update: {
          assigned_advisor_id?: string | null
          created_at?: string
          current_stage_id?: string
          diagnostic_session_id?: string
          email?: string | null
          full_name?: string | null
          id?: string
          instagram_username?: string | null
          last_interaction_at?: string | null
          manychat_subscriber_id?: string | null
          organization_id?: string
          phone_country_code?: string | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_diagnostic_session_id_fkey"
            columns: ["diagnostic_session_id"]
            isOneToOne: true
            referencedRelation: "diagnostic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_completions: {
        Row: {
          completed_at: string
          id: string
          reflection_answer: string | null
          route_day_id: string
          user_id: string
          user_plan_progress_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          reflection_answer?: string | null
          route_day_id: string
          user_id: string
          user_plan_progress_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          reflection_answer?: string | null
          route_day_id?: string
          user_id?: string
          user_plan_progress_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_completions_route_day_id_fkey"
            columns: ["route_day_id"]
            isOneToOne: false
            referencedRelation: "route_day_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_completions_user_plan_progress_id_fkey"
            columns: ["user_plan_progress_id"]
            isOneToOne: false
            referencedRelation: "user_plan_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          default_locale: string
          id: string
          name: string
          plan: string
          settings: Json
          slug: string
        }
        Insert: {
          created_at?: string
          default_locale?: string
          id?: string
          name: string
          plan?: string
          settings?: Json
          slug: string
        }
        Update: {
          created_at?: string
          default_locale?: string
          id?: string
          name?: string
          plan?: string
          settings?: Json
          slug?: string
        }
        Relationships: []
      }
      pillar_point_events: {
        Row: {
          earned_at: string
          id: string
          mission_completion_id: string
          pillar: string
          points: number
          user_id: string
          user_plan_progress_id: string
        }
        Insert: {
          earned_at?: string
          id?: string
          mission_completion_id: string
          pillar: string
          points: number
          user_id: string
          user_plan_progress_id: string
        }
        Update: {
          earned_at?: string
          id?: string
          mission_completion_id?: string
          pillar?: string
          points?: number
          user_id?: string
          user_plan_progress_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_point_events_mission_completion_id_fkey"
            columns: ["mission_completion_id"]
            isOneToOne: false
            referencedRelation: "mission_completions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pillar_point_events_user_plan_progress_id_fkey"
            columns: ["user_plan_progress_id"]
            isOneToOne: false
            referencedRelation: "user_plan_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          color: string
          id: string
          key: string
          name: string
          order_index: number
          organization_id: string
        }
        Insert: {
          color?: string
          id?: string
          key: string
          name: string
          order_index: number
          organization_id: string
        }
        Update: {
          color?: string
          id?: string
          key?: string
          name?: string
          order_index?: number
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_accounts: {
        Row: {
          access_status: string
          activated_at: string | null
          activated_by: string | null
          created_at: string
          diagnostic_session_id: string | null
          id: string
          payment_provider: string | null
          payment_reference: string | null
          timezone: string | null
          user_id: string
        }
        Insert: {
          access_status?: string
          activated_at?: string | null
          activated_by?: string | null
          created_at?: string
          diagnostic_session_id?: string | null
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          timezone?: string | null
          user_id: string
        }
        Update: {
          access_status?: string
          activated_at?: string | null
          activated_by?: string | null
          created_at?: string
          diagnostic_session_id?: string | null
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          timezone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_accounts_diagnostic_session_id_fkey"
            columns: ["diagnostic_session_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          auth_user_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          auth_user_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          auth_user_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          route_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          route_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          route_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          key: string
          permissions: Json
        }
        Insert: {
          id?: string
          key: string
          permissions?: Json
        }
        Update: {
          id?: string
          key?: string
          permissions?: Json
        }
        Relationships: []
      }
      route_day_content: {
        Row: {
          celebration: string
          created_at: string
          daily_quote: string | null
          day_number: number
          estimated_minutes: number | null
          id: string
          intro: string
          is_published: boolean
          journal_prompt: string
          mission: string
          primary_pillar: string | null
          primary_points: number | null
          program_id: string | null
          reflection: string
          route_id: string
          secondary_pillar: string | null
          secondary_points: number | null
          sort_order: number
          subtitle: string
          title: string
          video_title: string | null
          video_url: string | null
        }
        Insert: {
          celebration?: string
          created_at?: string
          daily_quote?: string | null
          day_number: number
          estimated_minutes?: number | null
          id?: string
          intro?: string
          is_published?: boolean
          journal_prompt?: string
          mission: string
          primary_pillar?: string | null
          primary_points?: number | null
          program_id?: string | null
          reflection: string
          route_id: string
          secondary_pillar?: string | null
          secondary_points?: number | null
          sort_order: number
          subtitle?: string
          title?: string
          video_title?: string | null
          video_url?: string | null
        }
        Update: {
          celebration?: string
          created_at?: string
          daily_quote?: string | null
          day_number?: number
          estimated_minutes?: number | null
          id?: string
          intro?: string
          is_published?: boolean
          journal_prompt?: string
          mission?: string
          primary_pillar?: string | null
          primary_points?: number | null
          program_id?: string | null
          reflection?: string
          route_id?: string
          secondary_pillar?: string | null
          secondary_points?: number | null
          sort_order?: number
          subtitle?: string
          title?: string
          video_title?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_day_content_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_days_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          block_key: string
          created_at: string
          focus_description: string
          id: string
          title: string
        }
        Insert: {
          block_key: string
          created_at?: string
          focus_description: string
          id?: string
          title: string
        }
        Update: {
          block_key?: string
          created_at?: string
          focus_description?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      user_day_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string | null
          day_id: string
          id: string
          minutes_watched: number | null
          updated_at: string | null
          user_program_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          day_id: string
          id?: string
          minutes_watched?: number | null
          updated_at?: string | null
          user_program_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          day_id?: string
          id?: string
          minutes_watched?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_day_progress_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "route_day_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_day_progress_user_program_id_fkey"
            columns: ["user_program_id"]
            isOneToOne: false
            referencedRelation: "user_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_plan_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          route_id: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          route_id: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          route_id?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_plan_progress_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_programs: {
        Row: {
          active: boolean
          completed_at: string | null
          created_at: string | null
          current_day: number
          id: string
          program_id: string
          route_id: string | null
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          completed_at?: string | null
          created_at?: string | null
          current_day?: number
          id?: string
          program_id: string
          route_id?: string | null
          started_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          completed_at?: string | null
          created_at?: string | null
          id?: string
          program_id?: string
          route_id?: string | null
          started_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_programs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string
          direction: string
          id: string
          organization_id: string
          payload: Json
          source: string
          status: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          organization_id: string
          payload: Json
          source: string
          status?: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          organization_id?: string
          payload?: Json
          source?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_permission: {
        Args: { org_id: string; permission_key: string }
        Returns: boolean
      }
      has_staff_permission: {
        Args: { permission_key: string }
        Returns: boolean
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

