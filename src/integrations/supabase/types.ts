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
      chats: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          product_id: string | null
          seller_id: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          product_id?: string | null
          seller_id?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          product_id?: string | null
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      counties: {
        Row: {
          code: string
          id: number
          name: string
        }
        Insert: {
          code: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string | null
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string | null
        }
        Insert: {
          chat_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          related_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          related_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          related_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          county_id: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          price: number | null
          quantity_available: number | null
          store_id: string | null
          sub_county_id: number | null
          subcategory: string | null
          title: string
          unit: string | null
          updated_at: string | null
          ward_id: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          county_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          quantity_available?: number | null
          store_id?: string | null
          sub_county_id?: number | null
          subcategory?: string | null
          title: string
          unit?: string | null
          updated_at?: string | null
          ward_id?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          county_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          quantity_available?: number | null
          store_id?: string | null
          sub_county_id?: number | null
          subcategory?: string | null
          title?: string
          unit?: string | null
          updated_at?: string | null
          ward_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sub_county_id_fkey"
            columns: ["sub_county_id"]
            isOneToOne: false
            referencedRelation: "sub_counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          county_id: number | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          notifications_enabled: boolean | null
          phone_number: string | null
          profile_picture_url: string | null
          show_phone_number: boolean | null
          sub_county_id: number | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
          ward_id: number | null
        }
        Insert: {
          county_id?: number | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          notifications_enabled?: boolean | null
          phone_number?: string | null
          profile_picture_url?: string | null
          show_phone_number?: boolean | null
          sub_county_id?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          ward_id?: number | null
        }
        Update: {
          county_id?: number | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          notifications_enabled?: boolean | null
          phone_number?: string | null
          profile_picture_url?: string | null
          show_phone_number?: boolean | null
          sub_county_id?: number | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          ward_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_sub_county_id_fkey"
            columns: ["sub_county_id"]
            isOneToOne: false
            referencedRelation: "sub_counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          county_id: number | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          owner_id: string | null
          phone_number: string | null
          show_phone_number: boolean | null
          store_image_url: string | null
          sub_county_id: number | null
          updated_at: string | null
          ward_id: number | null
        }
        Insert: {
          county_id?: number | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          owner_id?: string | null
          phone_number?: string | null
          show_phone_number?: boolean | null
          store_image_url?: string | null
          sub_county_id?: number | null
          updated_at?: string | null
          ward_id?: number | null
        }
        Update: {
          county_id?: number | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          owner_id?: string | null
          phone_number?: string | null
          show_phone_number?: boolean | null
          store_image_url?: string | null
          sub_county_id?: number | null
          updated_at?: string | null
          ward_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_sub_county_id_fkey"
            columns: ["sub_county_id"]
            isOneToOne: false
            referencedRelation: "sub_counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_counties: {
        Row: {
          county_id: number | null
          id: number
          name: string
        }
        Insert: {
          county_id?: number | null
          id?: number
          name: string
        }
        Update: {
          county_id?: number | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_counties_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
        ]
      }
      wards: {
        Row: {
          id: number
          name: string
          sub_county_id: number | null
        }
        Insert: {
          id?: number
          name: string
          sub_county_id?: number | null
        }
        Update: {
          id?: number
          name?: string
          sub_county_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wards_sub_county_id_fkey"
            columns: ["sub_county_id"]
            isOneToOne: false
            referencedRelation: "sub_counties"
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
      notification_type:
        | "message"
        | "product_inquiry"
        | "store_update"
        | "system"
      product_category:
        | "crops"
        | "livestock"
        | "dairy"
        | "poultry"
        | "aquaculture"
        | "horticulture"
        | "cereals"
        | "legumes"
        | "fruits"
        | "vegetables"
        | "farm_equipment"
        | "seeds"
        | "fertilizers"
        | "pesticides"
      user_type: "buyer" | "seller"
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
    Enums: {
      notification_type: [
        "message",
        "product_inquiry",
        "store_update",
        "system",
      ],
      product_category: [
        "crops",
        "livestock",
        "dairy",
        "poultry",
        "aquaculture",
        "horticulture",
        "cereals",
        "legumes",
        "fruits",
        "vegetables",
        "farm_equipment",
        "seeds",
        "fertilizers",
        "pesticides",
      ],
      user_type: ["buyer", "seller", "admin"],
    },
  },
} as const
