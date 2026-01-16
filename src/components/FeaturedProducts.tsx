'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const { state } = useProducts();
  const featuredProducts = state.products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-600 font-medium uppercase tracking-wider text-sm">
            Our Selection
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-olive-800">
            Featured Products
          </h2>
          <p className="mt-4 text-xl text-olive-600 max-w-2xl mx-auto">
            Discover our most beloved olive oils, each crafted with passion and
            generations of expertise.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <p className="text-olive-600 col-span-full text-center">
              {state.isLoading
                ? 'Loading featured products…'
                : 'No featured products available yet.'}
            </p>
          )}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-olive-600 hover:bg-olive-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg"
            >
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
