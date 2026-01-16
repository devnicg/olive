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
      favorites: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          product_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          product_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          product_id?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          price?: number;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: 'extra-virgin' | 'infused' | 'organic' | 'gift-sets';
          size: string;
          in_stock: boolean;
          featured: boolean;
          rating: number;
          reviews: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: 'extra-virgin' | 'infused' | 'organic' | 'gift-sets';
          size: string;
          in_stock?: boolean;
          featured?: boolean;
          rating?: number;
          reviews?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string;
          price?: number;
          image?: string;
          category?: 'extra-virgin' | 'infused' | 'organic' | 'gift-sets';
          size?: string;
          in_stock?: boolean;
          featured?: boolean;
          rating?: number;
          reviews?: number;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          user_id: string | null;
          status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
          total: number;
          shipping_address: Json;
          items: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
          total: number;
          shipping_address: Json;
          items: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
          total?: number;
          shipping_address?: Json;
          items?: Json;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          address: string | null;
          is_admin: boolean;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          is_admin?: boolean;
        };
        Relationships: [];
      };
      profile_addresses: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          label: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          address: string;
          city: string;
          state: string;
          zip: string;
          country: string;
          is_default: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          label?: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          address: string;
          city: string;
          state: string;
          zip: string;
          country: string;
          is_default?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          label?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          address?: string;
          city?: string;
          state?: string;
          zip?: string;
          country?: string;
          is_default?: boolean;
        };
        Relationships: [];
      };
      product_showcase: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string | null;
          product_id: string | null;
          background_color: string | null;
          text_color: string | null;
          is_active: boolean;
          link_url: string | null;
          link_text: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description?: string | null;
          product_id?: string | null;
          background_color?: string | null;
          text_color?: string | null;
          is_active?: boolean;
          link_url?: string | null;
          link_text?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string | null;
          product_id?: string | null;
          background_color?: string | null;
          text_color?: string | null;
          is_active?: boolean;
          link_url?: string | null;
          link_text?: string | null;
        };
        Relationships: [];
      };
      store_settings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          store_name: string;
          store_logo: string | null;
          store_email: string;
          store_phone: string | null;
          store_address: string | null;
          about_title: string | null;
          about_text: string | null;
          contact_title: string | null;
          contact_text: string | null;
          currency: string;
          tax_rate: number;
          free_shipping_threshold: number;
          theme: string;
          email_notifications: boolean;
          order_notifications: boolean;
          marketing_emails: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          store_name?: string;
          store_logo?: string | null;
          store_email?: string;
          store_phone?: string | null;
          store_address?: string | null;
          about_title?: string | null;
          about_text?: string | null;
          contact_title?: string | null;
          contact_text?: string | null;
          currency?: string;
          tax_rate?: number;
          free_shipping_threshold?: number;
          theme?: string;
          email_notifications?: boolean;
          order_notifications?: boolean;
          marketing_emails?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          store_name?: string;
          store_logo?: string | null;
          store_email?: string;
          store_phone?: string | null;
          store_address?: string | null;
          about_title?: string | null;
          about_text?: string | null;
          contact_title?: string | null;
          contact_text?: string | null;
          currency?: string;
          tax_rate?: number;
          free_shipping_threshold?: number;
          theme?: string;
          email_notifications?: boolean;
          order_notifications?: boolean;
          marketing_emails?: boolean;
        };
        Relationships: [];
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

export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type ProductShowcase = Database['public']['Tables']['product_showcase']['Row'];
export type StoreSettings = Database['public']['Tables']['store_settings']['Row'];
