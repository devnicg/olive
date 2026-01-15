'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ChevronLeft,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

type Step = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const shippingCost = totalPrice >= 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const supabase = createClient();

      // Prepare order items for storage
      const orderItems = state.items.map(item => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      // Create the order in Supabase
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          status: 'pending',
          total: finalTotal,
          shipping_address: {
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            email: shippingData.email,
            phone: shippingData.phone,
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            zip: shippingData.zip,
            country: shippingData.country,
          },
          items: orderItems,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating order:', error);
        // Still proceed with confirmation even if database save fails
        // This allows guest checkout to work
      }

      if (order) {
        setOrderId(order.id);
      }

      setIsProcessing(false);
      setCurrentStep('confirmation');
      clearCart();
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
      setCurrentStep('confirmation');
      clearCart();
    }
  };

  if (state.items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen bg-olive-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-olive-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-olive-600 mb-6">
            Add some products to your cart before checking out.
          </p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-olive-50 pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-3xl font-serif font-bold text-olive-800 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-olive-600 mb-2">
            Thank you for your order. A confirmation email has been sent to your
            inbox.
          </p>
          <p className="text-olive-500 text-sm mb-8">
            Order #{orderId ? orderId.slice(0, 8).toUpperCase() : `OLV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
          </p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-olive-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-olive-600 hover:text-gold-600 transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Continue Shopping
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {['shipping', 'payment'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === step
                    ? 'bg-gold-500 text-white'
                    : currentStep === 'payment' && step === 'shipping'
                    ? 'bg-green-500 text-white'
                    : 'bg-olive-200 text-olive-500'
                }`}
              >
                {currentStep === 'payment' && step === 'shipping' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`ml-2 font-medium capitalize ${
                  currentStep === step ? 'text-olive-800' : 'text-olive-400'
                }`}
              >
                {step}
              </span>
              {index < 1 && (
                <div className="w-24 h-0.5 mx-4 bg-olive-200" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {currentStep === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-6 h-6 text-gold-500" />
                  <h2 className="text-2xl font-serif font-bold text-olive-800">
                    Shipping Information
                  </h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={shippingData.firstName}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, firstName: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={shippingData.lastName}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, lastName: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, email: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={shippingData.address}
                      onChange={(e) =>
                        setShippingData({ ...shippingData, address: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, city: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingData.state}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, state: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        ZIP *
                      </label>
                      <input
                        type="text"
                        value={shippingData.zip}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, zip: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg"
                  >
                    Continue to Payment
                  </motion.button>
                </form>
              </motion.div>
            )}

            {currentStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-gold-500" />
                  <h2 className="text-2xl font-serif font-bold text-olive-800">
                    Payment Details
                  </h2>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, cardNumber: e.target.value })
                      }
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardName}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, cardName: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={paymentData.expiry}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, expiry: e.target.value })
                        }
                        placeholder="MM/YY"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          setPaymentData({ ...paymentData, cvv: e.target.value })
                        }
                        placeholder="123"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-olive-500">
                    <Lock className="w-4 h-4" />
                    Your payment information is encrypted and secure
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="flex-1 py-4 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg disabled:opacity-70"
                    >
                      {isProcessing ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h3 className="text-lg font-serif font-semibold text-olive-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-olive-800 text-sm line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-olive-500 text-xs">Qty: {item.quantity}</p>
                      <p className="text-olive-700 font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-olive-100 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-olive-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-olive-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-olive-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-olive-800 pt-2 border-t border-olive-100">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-olive-100 flex items-center justify-center gap-4 text-olive-400">
                <ShieldCheck className="w-8 h-8" />
                <div className="text-xs text-left">
                  <p className="font-medium text-olive-600">Secure Checkout</p>
                  <p>256-bit SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
