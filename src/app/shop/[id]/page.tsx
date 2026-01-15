'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  Truck,
  Shield,
  Award,
} from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-olive-800">
            Product Not Found
          </h1>
          <Link href="/shop" className="mt-4 text-gold-600 hover:text-gold-700">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-olive-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-olive-600 mb-8">
          <Link href="/" className="hover:text-gold-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold-600 transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-olive-800">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-olive-600 hover:text-gold-600 transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Shop
        </Link>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.featured && (
              <span className="absolute top-4 left-4 px-4 py-2 bg-gold-500 text-white text-sm font-semibold rounded-full">
                Featured
              </span>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Category */}
            <span className="text-sm font-medium text-gold-600 uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </span>

            {/* Title */}
            <h1 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-olive-800">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-gold-400 fill-gold-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-olive-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6">
              <span className="text-4xl font-bold text-olive-800">
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-3 text-olive-500">/ {product.size}</span>
            </div>

            {/* Description */}
            <p className="mt-6 text-olive-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-full border border-olive-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-olive-600 hover:text-olive-800 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-medium text-olive-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-olive-600 hover:text-olive-800 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-olive-500">
                  Total: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg shadow-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 border-2 border-olive-200 text-olive-600 hover:border-red-300 hover:text-red-500 rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 border-2 border-olive-200 text-olive-600 hover:border-olive-400 hover:text-olive-800 rounded-full transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-olive-200 grid grid-cols-3 gap-4">
              {[
                { icon: Truck, text: 'Free Shipping' },
                { icon: Shield, text: 'Secure Payment' },
                { icon: Award, text: 'Quality Guarantee' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <item.icon className="w-6 h-6 text-gold-500 mb-2" />
                  <span className="text-xs text-olive-600">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-3xl font-serif font-bold text-olive-800 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
