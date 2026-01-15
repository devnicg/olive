'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductShowcase from '@/components/ProductShowcase';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name';

export default function ShopPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-olive-50 pt-24">
      {/* Product Showcase Banner */}
      <ProductShowcase />

      {/* Header */}
      <div className="bg-olive-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
              Our Collection
            </h1>
            <p className="mt-4 text-xl text-olive-200 max-w-2xl mx-auto">
              Explore our full range of premium olive oils, from classic extra
              virgin to specialty infused varieties.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-olive-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all text-olive-800 placeholder:text-olive-400 bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-olive-400 hover:text-olive-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-6 py-3 rounded-full border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all text-olive-800 bg-white cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-olive-600 text-white rounded-full font-medium"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <motion.aside
            initial={false}
            animate={{
              width: showFilters ? 'auto' : 0,
              opacity: showFilters ? 1 : 0,
            }}
            className={`lg:!w-64 lg:!opacity-100 overflow-hidden ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-28">
              <h3 className="font-serif font-semibold text-lg text-olive-800 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    !selectedCategory
                      ? 'bg-gold-100 text-gold-700 font-medium'
                      : 'text-olive-600 hover:bg-olive-50'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-gold-100 text-gold-700 font-medium'
                        : 'text-olive-600 hover:bg-olive-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Price Range Info */}
              <div className="mt-8 pt-6 border-t border-olive-100">
                <h3 className="font-serif font-semibold text-lg text-olive-800 mb-2">
                  Price Range
                </h3>
                <p className="text-olive-600 text-sm">
                  ${Math.min(...products.map((p) => p.price)).toFixed(2)} -{' '}
                  ${Math.max(...products.map((p) => p.price)).toFixed(2)}
                </p>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || search) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearch('');
                  }}
                  className="mt-6 w-full py-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <p className="text-olive-600 mb-6">
              Showing {filteredProducts.length} of {products.length} products
            </p>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-olive-600 text-lg">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearch('');
                  }}
                  className="mt-4 text-gold-600 hover:text-gold-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
