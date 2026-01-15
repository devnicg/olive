'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ShowcaseData {
  id: string;
  title: string;
  description: string | null;
  product_id: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
  link_url: string | null;
  link_text: string;
}

export default function ProductShowcase() {
  const [showcase, setShowcase] = useState<ShowcaseData | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if previously dismissed in this session
    const dismissed = sessionStorage.getItem('showcase-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      setIsLoading(false);
      return;
    }

    const fetchShowcase = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('product_showcase')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // No active showcase or error
        console.log('No active showcase found');
      } else if (data) {
        setShowcase(data as ShowcaseData);
      }

      setIsLoading(false);
    };

    fetchShowcase();
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('showcase-dismissed', 'true');
  };

  if (isLoading || isDismissed || !showcase) {
    return null;
  }

  const linkHref = showcase.link_url || (showcase.product_id ? `/shop/${showcase.product_id}` : '/shop');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative overflow-hidden"
        style={{ backgroundColor: showcase.background_color }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Sparkles
                className="w-5 h-5 flex-shrink-0"
                style={{ color: showcase.text_color }}
              />
              <div className="min-w-0">
                <span
                  className="font-medium truncate"
                  style={{ color: showcase.text_color }}
                >
                  {showcase.title}
                </span>
                {showcase.description && (
                  <span
                    className="hidden sm:inline ml-2 opacity-80"
                    style={{ color: showcase.text_color }}
                  >
                    {showcase.description}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                href={linkHref}
                className="hidden sm:flex items-center gap-1 px-4 py-1.5 rounded-full font-medium text-sm transition-all hover:opacity-80"
                style={{
                  backgroundColor: showcase.text_color,
                  color: showcase.background_color,
                }}
              >
                {showcase.link_text}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={linkHref}
                className="sm:hidden"
                style={{ color: showcase.text_color }}
              >
                <ArrowRight className="w-5 h-5" />
              </Link>

              <button
                onClick={handleDismiss}
                className="p-1 rounded-full transition-colors hover:bg-black/10"
                aria-label="Dismiss banner"
              >
                <X
                  className="w-4 h-4"
                  style={{ color: showcase.text_color }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
