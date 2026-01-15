'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Mail,
  Bell,
  CreditCard,
  Truck,
  Shield,
  Save,
  CheckCircle,
  Palette,
  FileText,
  Image,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

const themes = [
  { id: 'default', name: 'Classic Olive', primary: '#4a5d23', secondary: '#d4a853' },
  { id: 'modern', name: 'Modern Sage', primary: '#2d3b24', secondary: '#8b9a46' },
  { id: 'warm', name: 'Warm Terra', primary: '#5c4033', secondary: '#c9a959' },
  { id: 'ocean', name: 'Mediterranean', primary: '#1e3a5f', secondary: '#e0a458' },
];

export default function SettingsPage() {
  const { settings: storeSettings, isLoading, updateSettings } = useStoreSettings();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [localSettings, setLocalSettings] = useState({
    store_name: '',
    store_logo: '',
    store_email: '',
    store_phone: '',
    store_address: '',
    about_title: '',
    about_text: '',
    contact_title: '',
    contact_text: '',
    currency: 'USD',
    tax_rate: 8,
    free_shipping_threshold: 50,
    theme: 'default',
    email_notifications: true,
    order_notifications: true,
    marketing_emails: false,
  });

  // Sync local state with store settings
  useEffect(() => {
    if (storeSettings.id) {
      setLocalSettings({
        store_name: storeSettings.store_name || '',
        store_logo: storeSettings.store_logo || '',
        store_email: storeSettings.store_email || '',
        store_phone: storeSettings.store_phone || '',
        store_address: storeSettings.store_address || '',
        about_title: storeSettings.about_title || '',
        about_text: storeSettings.about_text || '',
        contact_title: storeSettings.contact_title || '',
        contact_text: storeSettings.contact_text || '',
        currency: storeSettings.currency || 'USD',
        tax_rate: storeSettings.tax_rate || 8,
        free_shipping_threshold: storeSettings.free_shipping_threshold || 50,
        theme: storeSettings.theme || 'default',
        email_notifications: storeSettings.email_notifications ?? true,
        order_notifications: storeSettings.order_notifications ?? true,
        marketing_emails: storeSettings.marketing_emails ?? false,
      });
    }
  }, [storeSettings]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const { error } = await updateSettings(localSettings);

    if (error) {
      setError('Failed to save settings. Please try again.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-olive-400 mx-auto mb-4 animate-spin" />
          <p className="text-olive-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-olive-800">Settings</h1>
          <p className="text-olive-600 mt-1">
            Manage your store configuration
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg disabled:opacity-70"
        >
          {saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Saved!
            </>
          ) : saving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600"
        >
          <AlertCircle className="w-5 h-5" />
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-olive-100 rounded-xl">
              <Store className="w-6 h-6 text-olive-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-olive-800">
              Store Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={localSettings.store_name}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, store_name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={localSettings.store_email}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, store_email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={localSettings.store_phone}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, store_phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Address
              </label>
              <textarea
                rows={2}
                value={localSettings.store_address}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, store_address: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-olive-800">
              Logo & Branding
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Store Logo (SVG URL or Data URI)
              </label>
              <textarea
                rows={3}
                value={localSettings.store_logo}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, store_logo: e.target.value })
                }
                placeholder="Enter SVG URL or paste SVG data URI..."
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all resize-none font-mono text-sm"
              />
              <p className="text-sm text-olive-500 mt-2">
                Paste an SVG URL or data URI for your store logo
              </p>
            </div>
            {localSettings.store_logo && (
              <div className="p-4 bg-olive-50 rounded-xl">
                <p className="text-sm font-medium text-olive-700 mb-2">Preview:</p>
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={localSettings.store_logo}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-olive-800">
              About Section
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                About Title
              </label>
              <input
                type="text"
                value={localSettings.about_title}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, about_title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                About Text
              </label>
              <textarea
                rows={4}
                value={localSettings.about_text}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, about_text: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-100 rounded-xl">
              <Mail className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-olive-800">
              Contact Section
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Contact Title
              </label>
              <input
                type="text"
                value={localSettings.contact_title}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, contact_title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Contact Text
              </label>
              <textarea
                rows={4}
                value={localSettings.contact_text}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, contact_text: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-pink-100 rounded-xl">
              <Palette className="w-6 h-6 text-pink-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-olive-800">
              Theme
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setLocalSettings({ ...localSettings, theme: theme.id })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  localSettings.theme === theme.id
                    ? 'border-gold-400 bg-gold-50'
                    : 'border-olive-100 hover:border-olive-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: theme.secondary }}
                  />
                </div>
                <p className="text-sm font-medium text-olive-800 text-left">
                  {theme.name}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gold-100 rounded-xl">
              <Bell className="w-6 h-6 text-gold-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-olive-800">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-olive-50 rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-olive-600" />
                <div>
                  <p className="font-medium text-olive-800">Email Notifications</p>
                  <p className="text-sm text-olive-500">Receive updates via email</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.email_notifications}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, email_notifications: e.target.checked })
                }
                className="w-5 h-5 rounded border-olive-300 text-gold-500 focus:ring-gold-400"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-olive-50 rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-olive-600" />
                <div>
                  <p className="font-medium text-olive-800">Order Notifications</p>
                  <p className="text-sm text-olive-500">Alert for new orders</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.order_notifications}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, order_notifications: e.target.checked })
                }
                className="w-5 h-5 rounded border-olive-300 text-gold-500 focus:ring-gold-400"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-olive-50 rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-olive-600" />
                <div>
                  <p className="font-medium text-olive-800">Marketing Emails</p>
                  <p className="text-sm text-olive-500">Promotional content</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.marketing_emails}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, marketing_emails: e.target.checked })
                }
                className="w-5 h-5 rounded border-olive-300 text-gold-500 focus:ring-gold-400"
              />
            </label>
          </div>
        </motion.div>

        {/* Shipping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-olive-800">
              Shipping
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                value={localSettings.free_shipping_threshold}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    free_shipping_threshold: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
              />
              <p className="text-sm text-olive-500 mt-2">
                Orders above this amount get free shipping
              </p>
            </div>
          </div>
        </motion.div>

        {/* Payment & Tax */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-olive-800">
              Payment & Tax
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Currency
              </label>
              <select
                value={localSettings.currency}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, currency: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={localSettings.tax_rate}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    tax_rate: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4"
      >
        <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-green-800 mb-1">Secure Storage</h3>
          <p className="text-green-700 text-sm">
            Your settings are securely stored in Supabase with row-level security.
            Only administrators can view and modify these settings.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
