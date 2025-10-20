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
      announcements: {
        Row: {
          admin_id: string | null
          content: string
          created_at: string | null
          id: string
          title: string
        }
        Insert: {
          admin_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          title: string
        }
        Update: {
          admin_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_permits: {
        Row: {
          created_at: string | null
          id: string
          purpose: string | null
          requester_id: string | null
          status: Database["public"]["Enums"]["request_status"] | null
          subject_id: string | null
          subject_role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          purpose?: string | null
          requester_id?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          subject_id?: string | null
          subject_role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          purpose?: string | null
          requester_id?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          subject_id?: string | null
          subject_role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gate_permits_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_permits_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_requests: {
        Row: {
          available_time: string
          created_at: string | null
          id: string
          provider_id: string | null
          resident_address: string
          resident_id: string | null
          resident_name: string
          service_category: Database["public"]["Enums"]["service_category"]
          service_description: string
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string | null
        }
        Insert: {
          available_time: string
          created_at?: string | null
          id?: string
          provider_id?: string | null
          resident_address: string
          resident_id?: string | null
          resident_name: string
          service_category: Database["public"]["Enums"]["service_category"]
          service_description: string
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Update: {
          available_time?: string
          created_at?: string | null
          id?: string
          provider_id?: string | null
          resident_address?: string
          resident_id?: string | null
          resident_name?: string
          service_category?: Database["public"]["Enums"]["service_category"]
          service_description?: string
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_requests_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_requests: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          is_outside_estate: boolean | null
          phone_number: string
          role: Database["public"]["Enums"]["user_role"]
          service_category:
            | Database["public"]["Enums"]["service_category"]
            | null
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          is_outside_estate?: boolean | null
          phone_number: string
          role: Database["public"]["Enums"]["user_role"]
          service_category?:
            | Database["public"]["Enums"]["service_category"]
            | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          is_outside_estate?: boolean | null
          phone_number?: string
          role?: Database["public"]["Enums"]["user_role"]
          service_category?:
            | Database["public"]["Enums"]["service_category"]
            | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          hours_of_operation: string | null
          id: string
          is_approved: boolean | null
          is_outside_estate: boolean | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          service_category:
            | Database["public"]["Enums"]["service_category"]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          hours_of_operation?: string | null
          id: string
          is_approved?: boolean | null
          is_outside_estate?: boolean | null
          phone_number?: string | null
          role: Database["public"]["Enums"]["user_role"]
          service_category?:
            | Database["public"]["Enums"]["service_category"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          hours_of_operation?: string | null
          id?: string
          is_approved?: boolean | null
          is_outside_estate?: boolean | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          service_category?:
            | Database["public"]["Enums"]["service_category"]
            | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rider_requests: {
        Row: {
          created_at: string | null
          delivery_location: string | null
          id: string
          pickup_location: string | null
          requester_id: string | null
          rider_id: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_location?: string | null
          id?: string
          pickup_location?: string | null
          requester_id?: string | null
          rider_id?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_location?: string | null
          id?: string
          pickup_location?: string | null
          requester_id?: string | null
          rider_id?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rider_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rider_requests_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      job_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "completed"
        | "in_progress"
      request_status: "pending" | "approved" | "rejected"
      service_category:
        | "plumber"
        | "electrician"
        | "carpenter"
        | "painter"
        | "welder"
        | "mechanic"
        | "cleaner"
        | "gardener"
        | "other"
      user_role: "resident" | "store" | "service_provider" | "rider" | "admin"
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
      job_status: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "in_progress",
      ],
      request_status: ["pending", "approved", "rejected"],
      service_category: [
        "plumber",
        "electrician",
        "carpenter",
        "painter",
        "welder",
        "mechanic",
        "cleaner",
        "gardener",
        "other",
      ],
      user_role: ["resident", "store", "service_provider", "rider", "admin"],
    },
  },
} as const
