/**
 * Tipos del schema de Supabase — reflejan las columnas reales de Postgres
 * (snake_case), validadas ejecutando las migraciones de /supabase/migrations
 * contra una base de datos real.
 *
 * Nota: estos tipos son distintos de los de @kairos/types (que son camelCase,
 * pensados para la capa de aplicación). La conversión entre ambos se resuelve
 * en la capa de acceso a datos de cada módulo que la necesite — no existe
 * todavía porque no hay tablas de dominio más allá de tenancy.
 *
 * Se generan a mano porque `supabase gen types` requiere Docker (para correr
 * postgres-meta), no disponible en este entorno. Quedan sincronizados con
 * las migraciones a mano — cualquier cambio de columna debe reflejarse aquí
 * en el mismo PR/commit que la migración.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          default_locale: string;
          plan: "starter" | "pro" | "agency";
          settings: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          default_locale?: string;
          plan?: "starter" | "pro" | "agency";
          settings?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
        Relationships: [];
      };
      roles: {
        Row: {
          id: string;
          key: "owner" | "admin" | "advisor" | "viewer";
          permissions: string[];
        };
        Insert: {
          id?: string;
          key: "owner" | "admin" | "advisor" | "viewer";
          permissions?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["roles"]["Insert"]>;
        Relationships: [];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role_id: string;
          status: "active" | "invited" | "suspended";
          invited_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role_id: string;
          status?: "active" | "invited" | "suspended";
          invited_by?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["organization_members"]["Insert"]
        >;
        Relationships: [];
      };
      diagnostic_sessions: {
        Row: {
          id: string;
          organization_id: string;
          locale: string;
          source: string | null;
          status: "completed" | "abandoned";
          started_at: string;
          completed_at: string;
          duration_seconds: number | null;
          answers: Json;
          result: Json;
          engine_version: string;
          manychat_subscriber_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          locale?: string;
          source?: string | null;
          status?: "completed" | "abandoned";
          started_at: string;
          completed_at?: string;
          duration_seconds?: number | null;
          answers: Json;
          result: Json;
          engine_version: string;
          manychat_subscriber_id?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["diagnostic_sessions"]["Insert"]
        >;
        Relationships: [];
      };
      webhook_events: {
        Row: {
          id: string;
          organization_id: string;
          direction: "inbound" | "outbound";
          source: string;
          payload: Json;
          status: "received" | "processed" | "error";
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          direction: "inbound" | "outbound";
          source: string;
          payload: Json;
          status?: "received" | "processed" | "error";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["webhook_events"]["Insert"]>;
        Relationships: [];
      };
      pipeline_stages: {
        Row: {
          id: string;
          organization_id: string;
          key: string;
          name: string;
          order_index: number;
          color: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          key: string;
          name: string;
          order_index: number;
          color?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pipeline_stages"]["Insert"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          organization_id: string;
          diagnostic_session_id: string;
          full_name: string | null;
          instagram_username: string | null;
          email: string | null;
          manychat_subscriber_id: string | null;
          current_stage_id: string;
          assigned_advisor_id: string | null;
          last_interaction_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          diagnostic_session_id: string;
          full_name?: string | null;
          instagram_username?: string | null;
          email?: string | null;
          manychat_subscriber_id?: string | null;
          current_stage_id: string;
          assigned_advisor_id?: string | null;
          last_interaction_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_permission: {
        Args: { org_id: string; permission_key: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
