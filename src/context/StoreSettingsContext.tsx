'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface StoreSettings {
  id: string;
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
}

const defaultSettings: StoreSettings = {
  id: '',
  store_name: 'Olivia Grove',
  store_logo: null,
  store_email: 'hello@oliviagrove.com',
  store_phone: '+1 (555) 123-4567',
  store_address: '123 Olive Grove Lane, Tuscany, Italy 58100',
  about_title: 'Our Story',
  about_text: 'For generations, our family has cultivated the finest olive groves in the heart of Tuscany.',
  contact_title: 'Get in Touch',
  contact_text: 'Have questions about our products or want to place a bulk order? We would love to hear from you.',
  currency: 'USD',
  tax_rate: 8.0,
  free_shipping_threshold: 50.0,
  theme: 'default',
  email_notifications: true,
  order_notifications: true,
  marketing_emails: false,
};

interface StoreSettingsContextType {
  settings: StoreSettings;
  isLoading: boolean;
  updateSettings: (updates: Partial<StoreSettings>) => Promise<{ error: Error | null }>;
  refreshSettings: () => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | null>(null);

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching store settings:', error);
      // Use default settings if fetch fails
      setSettings(defaultSettings);
    } else if (data) {
      setSettings(data as StoreSettings);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (updates: Partial<StoreSettings>) => {
    const supabase = createClient();

    // If we have an existing settings ID, update it
    if (settings.id) {
      const { error } = await supabase
        .from('store_settings')
        .update(updates)
        .eq('id', settings.id);

      if (error) {
        console.error('Error updating store settings:', error);
        return { error };
      }
    } else {
      // No existing settings, insert a new row
      const { data, error } = await supabase
        .from('store_settings')
        .insert(updates)
        .select()
        .single();

      if (error) {
        console.error('Error creating store settings:', error);
        return { error };
      }

      if (data) {
        setSettings(data as StoreSettings);
        return { error: null };
      }
    }

    // Update local state
    setSettings(prev => ({ ...prev, ...updates }));
    return { error: null };
  };

  const refreshSettings = async () => {
    setIsLoading(true);
    await fetchSettings();
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateSettings,
        refreshSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
}
