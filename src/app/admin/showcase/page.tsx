'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ShowcaseData {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  product_id: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
  link_url: string | null;
  link_text: string;
}

const defaultShowcase: Omit<ShowcaseData, 'id' | 'created_at'> = {
  title: '',
  description: '',
  product_id: null,
  background_color: '#f5f0e6',
  text_color: '#3d4a2d',
  is_active: true,
  link_url: '',
  link_text: 'Shop Now',
};

export default function ShowcasePage() {
  const [showcases, setShowcases] = useState<ShowcaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShowcase, setEditingShowcase] = useState<Partial<ShowcaseData> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchShowcases = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('product_showcase')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching showcases:', error);
    } else {
      setShowcases(data as ShowcaseData[]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchShowcases();
  }, []);

  const handleOpenAdd = () => {
    setEditingShowcase(defaultShowcase);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (showcase: ShowcaseData) => {
    setEditingShowcase(showcase);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingShowcase?.title) return;

    setIsSaving(true);
    const supabase = createClient();

    const showcaseData = {
      title: editingShowcase.title,
      description: editingShowcase.description || null,
      product_id: editingShowcase.product_id || null,
      background_color: editingShowcase.background_color || '#f5f0e6',
      text_color: editingShowcase.text_color || '#3d4a2d',
      is_active: editingShowcase.is_active ?? true,
      link_url: editingShowcase.link_url || null,
      link_text: editingShowcase.link_text || 'Shop Now',
    };

    if ('id' in editingShowcase && editingShowcase.id) {
      // Update existing
      const { error } = await supabase
        .from('product_showcase')
        .update(showcaseData)
        .eq('id', editingShowcase.id);

      if (error) {
        console.error('Error updating showcase:', error);
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('product_showcase')
        .insert(showcaseData);

      if (error) {
        console.error('Error creating showcase:', error);
      }
    }

    setIsSaving(false);
    setIsModalOpen(false);
    setEditingShowcase(null);
    fetchShowcases();
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();

    const { error } = await supabase
      .from('product_showcase')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting showcase:', error);
    }

    setDeleteConfirm(null);
    fetchShowcases();
  };

  const toggleActive = async (showcase: ShowcaseData) => {
    const supabase = createClient();

    const { error } = await supabase
      .from('product_showcase')
      .update({ is_active: !showcase.is_active })
      .eq('id', showcase.id);

    if (error) {
      console.error('Error toggling showcase:', error);
    } else {
      setShowcases(prev =>
        prev.map(s => s.id === showcase.id ? { ...s, is_active: !s.is_active } : s)
      );
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-olive-800">Product Showcase</h1>
          <p className="text-olive-600 mt-1">
            Manage promotional banners displayed on the shop page
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Showcase
        </motion.button>
      </div>

      {/* Showcases List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-olive-400 animate-spin" />
        </div>
      ) : showcases.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Sparkles className="w-12 h-12 text-olive-300 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-semibold text-olive-800 mb-2">
            No showcases yet
          </h2>
          <p className="text-olive-600 mb-6">
            Create your first promotional banner to display on the shop page.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAdd}
            className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors"
          >
            Create Showcase
          </motion.button>
        </div>
      ) : (
        <div className="space-y-4">
          {showcases.map((showcase) => (
            <motion.div
              key={showcase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Preview Banner */}
              <div
                className="p-4"
                style={{ backgroundColor: showcase.background_color }}
              >
                <div className="flex items-center gap-3">
                  <Sparkles
                    className="w-5 h-5"
                    style={{ color: showcase.text_color }}
                  />
                  <div>
                    <span
                      className="font-medium"
                      style={{ color: showcase.text_color }}
                    >
                      {showcase.title}
                    </span>
                    {showcase.description && (
                      <span
                        className="ml-2 opacity-80"
                        style={{ color: showcase.text_color }}
                      >
                        {showcase.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 flex items-center justify-between border-t border-olive-100">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleActive(showcase)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      showcase.is_active
                        ? 'bg-green-100 text-green-600'
                        : 'bg-olive-100 text-olive-500'
                    }`}
                  >
                    {showcase.is_active ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Inactive
                      </>
                    )}
                  </button>
                  <span className="text-sm text-olive-500">
                    Link: {showcase.link_url || `/shop/${showcase.product_id}` || '/shop'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(showcase)}
                    className="p-2 text-olive-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(showcase.id)}
                    className="p-2 text-olive-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingShowcase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:pl-[calc(16rem+1rem)]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-auto max-h-[90vh]"
            >
              <div className="p-6 border-b border-olive-100 flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-olive-800">
                  {'id' in editingShowcase ? 'Edit Showcase' : 'Add Showcase'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-olive-500 hover:bg-olive-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Preview */}
                <div className="rounded-xl overflow-hidden">
                  <div
                    className="p-4"
                    style={{ backgroundColor: editingShowcase.background_color || '#f5f0e6' }}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles
                        className="w-5 h-5"
                        style={{ color: editingShowcase.text_color || '#3d4a2d' }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: editingShowcase.text_color || '#3d4a2d' }}
                      >
                        {editingShowcase.title || 'Preview text'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingShowcase.title || ''}
                    onChange={(e) =>
                      setEditingShowcase({ ...editingShowcase, title: e.target.value })
                    }
                    placeholder="e.g., Free Shipping on Orders Over $50!"
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingShowcase.description || ''}
                    onChange={(e) =>
                      setEditingShowcase({ ...editingShowcase, description: e.target.value })
                    }
                    placeholder="Additional text (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={editingShowcase.background_color || '#f5f0e6'}
                        onChange={(e) =>
                          setEditingShowcase({ ...editingShowcase, background_color: e.target.value })
                        }
                        className="w-12 h-12 rounded-lg border border-olive-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingShowcase.background_color || '#f5f0e6'}
                        onChange={(e) =>
                          setEditingShowcase({ ...editingShowcase, background_color: e.target.value })
                        }
                        className="flex-1 px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={editingShowcase.text_color || '#3d4a2d'}
                        onChange={(e) =>
                          setEditingShowcase({ ...editingShowcase, text_color: e.target.value })
                        }
                        className="w-12 h-12 rounded-lg border border-olive-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingShowcase.text_color || '#3d4a2d'}
                        onChange={(e) =>
                          setEditingShowcase({ ...editingShowcase, text_color: e.target.value })
                        }
                        className="flex-1 px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Link URL
                    </label>
                    <input
                      type="text"
                      value={editingShowcase.link_url || ''}
                      onChange={(e) =>
                        setEditingShowcase({ ...editingShowcase, link_url: e.target.value })
                      }
                      placeholder="/shop or external URL"
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={editingShowcase.link_text || 'Shop Now'}
                      onChange={(e) =>
                        setEditingShowcase({ ...editingShowcase, link_text: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingShowcase.is_active ?? true}
                    onChange={(e) =>
                      setEditingShowcase({ ...editingShowcase, is_active: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-olive-300 text-gold-500 focus:ring-gold-400"
                  />
                  <span className="text-olive-700">Active (visible on shop page)</span>
                </label>
              </div>

              <div className="p-6 border-t border-olive-100 flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving || !editingShowcase.title}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Showcase
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:pl-[calc(16rem+1rem)]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-serif font-bold text-olive-800 mb-2">
                  Delete Showcase?
                </h3>
                <p className="text-olive-600 mb-6">
                  This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-3 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
