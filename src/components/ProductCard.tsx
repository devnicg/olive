'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-olive-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <span className="px-3 py-1 bg-gold-500 text-white text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
          {!product.inStock && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => product.inStock && addToCart(product)}
            disabled={!product.inStock}
            className="p-3 bg-white rounded-full text-olive-700 hover:bg-gold-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
          <Link href={`/shop/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white rounded-full text-olive-700 hover:bg-gold-500 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="text-xs font-medium text-olive-500 uppercase tracking-wider">
          {product.category.replace('-', ' ')}
        </span>

        {/* Title */}
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-2 text-lg font-serif font-semibold text-olive-800 group-hover:text-gold-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-gold-400 fill-gold-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-olive-500">({product.reviews})</span>
        </div>

        {/* Size */}
        <p className="text-sm text-olive-500 mt-1">{product.size}</p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-olive-800">
            ${product.price.toFixed(2)}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => product.inStock && addToCart(product)}
            disabled={!product.inStock}
            className="px-4 py-2 bg-olive-600 hover:bg-olive-700 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
