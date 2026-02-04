/**
 * Supabase Database Types
 *
 * These types should be generated using the Supabase CLI:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 *
 * For now, we define them manually based on our schema.
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
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          slug: string;
          description: string;
          short_description: string;
          price: number;
          compare_at_price: number | null;
          images: Json;
          category: string;
          subcategory: string | null;
          tags: string[];
          in_stock: boolean;
          quantity: number;
          low_stock_threshold: number;
          attributes: Json;
          care_guide: Json | null;
          related_products: string[] | null;
          accessories: string[] | null;
          vendor: string | null;
          lightspeed_item_id: string;
          is_archived: boolean;
          is_featured: boolean;
          is_plant_of_month: boolean;
          created_at: string;
          updated_at: string;
          synced_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          slug: string;
          description: string;
          short_description: string;
          price: number;
          compare_at_price?: number | null;
          images: Json;
          category: string;
          subcategory?: string | null;
          tags?: string[];
          in_stock?: boolean;
          quantity?: number;
          low_stock_threshold?: number;
          attributes: Json;
          care_guide?: Json | null;
          related_products?: string[] | null;
          accessories?: string[] | null;
          vendor?: string | null;
          lightspeed_item_id: string;
          is_archived?: boolean;
          is_featured?: boolean;
          is_plant_of_month?: boolean;
          created_at?: string;
          updated_at?: string;
          synced_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          name?: string;
          slug?: string;
          description?: string;
          short_description?: string;
          price?: number;
          compare_at_price?: number | null;
          images?: Json;
          category?: string;
          subcategory?: string | null;
          tags?: string[];
          in_stock?: boolean;
          quantity?: number;
          low_stock_threshold?: number;
          attributes?: Json;
          care_guide?: Json | null;
          related_products?: string[] | null;
          accessories?: string[] | null;
          vendor?: string | null;
          lightspeed_item_id?: string;
          is_archived?: boolean;
          is_featured?: boolean;
          is_plant_of_month?: boolean;
          created_at?: string;
          updated_at?: string;
          synced_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          lightspeed_id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lightspeed_id: string;
          name: string;
          slug: string;
          parent_id?: string | null;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lightspeed_id?: string;
          name?: string;
          slug?: string;
          parent_id?: string | null;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          addresses: Json;
          lightspeed_customer_id: string | null;
          mailchimp_subscriber_id: string | null;
          marketing_segments: string[];
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          addresses?: Json;
          lightspeed_customer_id?: string | null;
          mailchimp_subscriber_id?: string | null;
          marketing_segments?: string[];
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          addresses?: Json;
          lightspeed_customer_id?: string | null;
          mailchimp_subscriber_id?: string | null;
          marketing_segments?: string[];
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          customer_id: string;
          product_id: string;
          notify_on_restock: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          product_id: string;
          notify_on_restock?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          product_id?: string;
          notify_on_restock?: boolean;
          created_at?: string;
        };
      };
      back_in_stock_notifications: {
        Row: {
          id: string;
          email: string;
          product_id: string;
          notified: boolean;
          created_at: string;
          notified_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          product_id: string;
          notified?: boolean;
          created_at?: string;
          notified_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          product_id?: string;
          notified?: boolean;
          created_at?: string;
          notified_at?: string | null;
        };
      };
      sync_logs: {
        Row: {
          id: string;
          sync_type: string;
          status: "started" | "completed" | "failed";
          items_synced: number;
          errors: Json | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          sync_type: string;
          status: "started" | "completed" | "failed";
          items_synced?: number;
          errors?: Json | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          sync_type?: string;
          status?: "started" | "completed" | "failed";
          items_synced?: number;
          errors?: Json | null;
          started_at?: string;
          completed_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
