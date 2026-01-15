'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/context/I18nContext';

export default function CartDrawer() {
  const {
    state,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const { t } = useI18n();

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-olive-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-olive-600" />
                <h2 className="text-xl font-serif font-semibold text-olive-800">
                  {t('cart.title')}
                </h2>
                <span className="px-2 py-1 bg-olive-100 text-olive-600 text-sm font-medium rounded-full">
                  {totalItems} items
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-olive-500 hover:text-olive-700 hover:bg-olive-50 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-olive-200 mb-4" />
                  <p className="text-olive-600 font-medium mb-2">
                    {t('cart.empty')}
                  </p>
                  <p className="text-olive-400 text-sm mb-6">
                    Add some delicious olive oils to get started!
                  </p>
                  <Link href="/shop" onClick={closeCart}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-olive-600 hover:bg-olive-700 text-white font-medium rounded-full transition-colors"
                    >
                      Browse Products
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-olive-50 rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-olive-800 line-clamp-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-olive-500">
                          {item.product.size}
                        </p>
                        <p className="text-lg font-bold text-olive-700 mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 text-olive-600 hover:text-olive-800 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-olive-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 text-olive-600 hover:text-olive-800 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-olive-100 p-6 space-y-4">
                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Clear Cart
                </button>

                {/* Subtotal */}
                <div className="flex items-center justify-between text-olive-600">
                  <span>{t('cart.subtotal')}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-olive-600">
                  <span>Shipping</span>
                  <span>{totalPrice >= 50 ? 'Free' : '$5.99'}</span>
                </div>
                <div className="flex items-center justify-between text-xl font-bold text-olive-800 pt-2 border-t border-olive-100">
                  <span>Total</span>
                  <span>
                    ${(totalPrice >= 50 ? totalPrice : totalPrice + 5.99).toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" onClick={closeCart}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg shadow-gold-500/30"
                  >
                    {t('cart.checkout')}
                  </motion.button>
                </Link>

                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="block text-center text-olive-600 hover:text-olive-800 text-sm transition-colors"
                >
                  {t('cart.continueShopping')}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
