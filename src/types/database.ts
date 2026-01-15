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
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
          total: number;
          shipping_address: Json;
          items: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
          total: number;
          shipping_address: Json;
          items: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
          total?: number;
          shipping_address?: Json;
          items?: Json;
        };
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
