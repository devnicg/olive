'use client';

import { useState } from 'react';
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
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'Olivia Grove',
    storeEmail: 'hello@oliviagrove.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Olive Grove Lane, Tuscany, Italy 58100',
    currency: 'USD',
    emailNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    freeShippingThreshold: 50,
    taxRate: 8,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
          className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg"
        >
          {saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </motion.button>
      </div>

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
                value={settings.storeName}
                onChange={(e) =>
                  setSettings({ ...settings, storeName: e.target.value })
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
                value={settings.storeEmail}
                onChange={(e) =>
                  setSettings({ ...settings, storeEmail: e.target.value })
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
                value={settings.storePhone}
                onChange={(e) =>
                  setSettings({ ...settings, storePhone: e.target.value })
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
                value={settings.storeAddress}
                onChange={(e) =>
                  setSettings({ ...settings, storeAddress: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.target.checked })
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
                checked={settings.orderNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, orderNotifications: e.target.checked })
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
                checked={settings.marketingEmails}
                onChange={(e) =>
                  setSettings({ ...settings, marketingEmails: e.target.checked })
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
          transition={{ delay: 0.2 }}
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
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeShippingThreshold: parseInt(e.target.value) || 0,
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
          transition={{ delay: 0.3 }}
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
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
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
                value={settings.taxRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    taxRate: parseFloat(e.target.value) || 0,
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
        className="mt-8 bg-olive-100 rounded-2xl p-6 flex items-start gap-4"
      >
        <Shield className="w-6 h-6 text-olive-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-olive-800 mb-1">Security Notice</h3>
          <p className="text-olive-600 text-sm">
            Your settings are saved locally and securely. For production use,
            we recommend implementing server-side storage with proper authentication
            and encryption.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
