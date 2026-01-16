"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ChevronLeft,
  CheckCircle,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { countries } from "@/data/countries";
import type { Database } from "@/types/database";

type Step = "shipping" | "delivery" | "payment" | "confirmation";

type ProfileAddress = Database["public"]["Tables"]["profile_addresses"]["Row"];

type ShippingOption = {
  id: "standard" | "express" | "overnight";
  label: string;
  description: string;
  eta: string;
  cost: number;
};

export default function CheckoutPage() {
  const { state, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useStoreSettings();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<ProfileAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [saveAddress, setSaveAddress] = useState(true);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [shippingOptionId, setShippingOptionId] =
    useState<ShippingOption["id"]>("standard");

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const shippingOptions = useMemo<ShippingOption[]>(() => {
    const standardCost =
      totalPrice >= settings.free_shipping_threshold ? 0 : 5.99;

    return [
      {
        id: "standard",
        label: standardCost === 0 ? "Standard (Free)" : "Standard",
        description: "Reliable delivery with tracking.",
        eta: "3-5 business days",
        cost: standardCost,
      },
      {
        id: "express",
        label: "Express",
        description: "Faster delivery with priority handling.",
        eta: "1-2 business days",
        cost: 14.99,
      },
      {
        id: "overnight",
        label: "Overnight",
        description: "Next business day delivery in most areas.",
        eta: "Next business day",
        cost: 29.99,
      },
    ];
  }, [settings.free_shipping_threshold, totalPrice]);

  const selectedShippingOption = useMemo(
    () =>
      shippingOptions.find((option) => option.id === shippingOptionId) ??
      shippingOptions[0],
    [shippingOptions, shippingOptionId]
  );

  const shippingCost = selectedShippingOption?.cost ?? 0;
  const tax = totalPrice * (settings.tax_rate / 100);
  const finalTotal = totalPrice + shippingCost + tax;

  useEffect(() => {
    const fetchProfileAndAddresses = async () => {
      if (!user) {
        setAddresses([]);
        setSelectedAddressId(null);
        setShippingData((prev) => ({
          ...prev,
          email: prev.email || "",
        }));
        return;
      }

      setIsAddressLoading(true);
      setAddressError(null);
      const supabase = createClient();

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, phone, email")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setAddressError(profileError.message);
      }

      const { data: addressRows, error: addressError } = await supabase
        .from("profile_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("updated_at", { ascending: false });

      if (addressError) {
        setAddressError(addressError.message);
      }

      const mappedAddresses = addressRows ?? [];
      setAddresses(mappedAddresses);

      const defaultAddress =
        mappedAddresses.find((addr) => addr.is_default) ?? mappedAddresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setShippingData({
          firstName: defaultAddress.first_name,
          lastName: defaultAddress.last_name,
          email: defaultAddress.email,
          phone: defaultAddress.phone ?? "",
          address: defaultAddress.address,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zip: defaultAddress.zip,
          country: defaultAddress.country,
        });
      } else {
        const fullName = profile?.full_name ?? "";
        const [firstName = "", ...rest] = fullName.split(" ");
        const lastName = rest.join(" ");

        setShippingData((prev) => ({
          ...prev,
          firstName: prev.firstName || firstName,
          lastName: prev.lastName || lastName,
          email: prev.email || profile?.email || user.email || "",
          phone: prev.phone || profile?.phone || "",
        }));
      }

      setIsAddressLoading(false);
    };

    fetchProfileAndAddresses();
  }, [user]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("delivery");
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const supabase = createClient();

      if (user && saveAddress) {
        let addressId = selectedAddressId;

        if (addressId) {
          await supabase
            .from("profile_addresses")
            .update({
              label:
                addresses.find((addr) => addr.id === addressId)?.label ?? null,
              first_name: shippingData.firstName,
              last_name: shippingData.lastName,
              email: shippingData.email,
              phone: shippingData.phone || null,
              address: shippingData.address,
              city: shippingData.city,
              state: shippingData.state,
              zip: shippingData.zip,
              country: shippingData.country,
              is_default: true,
            })
            .eq("id", addressId);
        } else {
          const { data: inserted } = await supabase
            .from("profile_addresses")
            .insert({
              user_id: user.id,
              label: "Default",
              first_name: shippingData.firstName,
              last_name: shippingData.lastName,
              email: shippingData.email,
              phone: shippingData.phone || null,
              address: shippingData.address,
              city: shippingData.city,
              state: shippingData.state,
              zip: shippingData.zip,
              country: shippingData.country,
              is_default: true,
            })
            .select("id")
            .single();

          addressId = inserted?.id ?? null;
          if (addressId) {
            setSelectedAddressId(addressId);
          }
        }

        if (addressId) {
          await supabase
            .from("profile_addresses")
            .update({ is_default: false })
            .eq("user_id", user.id)
            .neq("id", addressId);
        }

        const fullName =
          `${shippingData.firstName} ${shippingData.lastName}`.trim();
        const addressSummary = `${shippingData.address}, ${shippingData.city}, ${shippingData.state} ${shippingData.zip}, ${shippingData.country}`;
        await supabase
          .from("profiles")
          .update({
            full_name: fullName || null,
            phone: shippingData.phone || null,
            address: addressSummary,
          })
          .eq("id", user.id);
      }

      // Prepare order items for storage
      const orderItems = state.items.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      // Create the order in Supabase
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          status: "processing",
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
            shippingOption: selectedShippingOption?.id,
            shippingLabel: selectedShippingOption?.label,
            shippingCost,
          },
          items: orderItems,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error creating order:", error);
      }

      if (order) {
        setOrderId(order.id);
      }

      setCurrentStep("confirmation");
      clearCart();
    } catch (error) {
      console.error("Error processing order:", error);
      setCurrentStep("confirmation");
      clearCart();
    }
  };

  if (state.items.length === 0 && currentStep !== "confirmation") {
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

  if (currentStep === "confirmation") {
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
            transition={{ delay: 0.2, type: "spring" }}
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
            Order #
            {orderId
              ? orderId.slice(0, 8).toUpperCase()
              : `OLV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
          </p>
          <div className="space-y-4">
            <Link href="/orders">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors"
              >
                Track Your Order
              </motion.button>
            </Link>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-3 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </div>
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
          {["shipping", "delivery", "payment"].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === step
                    ? "bg-gold-500 text-white"
                    : (currentStep === "payment" ||
                        currentStep === "delivery") &&
                      step === "shipping"
                    ? "bg-green-500 text-white"
                    : currentStep === "payment" && step === "delivery"
                    ? "bg-green-500 text-white"
                    : "bg-olive-200 text-olive-500"
                }`}
              >
                {(currentStep === "payment" || currentStep === "delivery") &&
                step === "shipping" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : currentStep === "payment" && step === "delivery" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`ml-2 font-medium capitalize ${
                  currentStep === step ? "text-olive-800" : "text-olive-400"
                }`}
              >
                {step}
              </span>
              {index < 2 && <div className="w-24 h-0.5 mx-4 bg-olive-200" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
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
                  {user && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-olive-700">
                          Saved Addresses
                        </p>
                        <Link
                          href="/profile"
                          className="text-sm text-gold-600 hover:text-gold-700"
                        >
                          Manage in Profile
                        </Link>
                      </div>
                      {addressError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {addressError}
                        </div>
                      )}
                      <select
                        value={selectedAddressId ?? ""}
                        onChange={(e) => {
                          const value = e.target.value || null;
                          setSelectedAddressId(value);
                          const found = addresses.find(
                            (addr) => addr.id === value
                          );
                          if (found) {
                            setShippingData({
                              firstName: found.first_name,
                              lastName: found.last_name,
                              email: found.email,
                              phone: found.phone ?? "",
                              address: found.address,
                              city: found.city,
                              state: found.state,
                              zip: found.zip,
                              country: found.country,
                            });
                          }
                        }}
                        disabled={isAddressLoading || addresses.length === 0}
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white disabled:bg-olive-50"
                      >
                        <option value="">
                          {isAddressLoading
                            ? "Loading addresses…"
                            : addresses.length === 0
                            ? "No saved addresses"
                            : "Select a saved address"}
                        </option>
                        {addresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {(address.label ? `${address.label} - ` : "") +
                              `${address.address}, ${address.city}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-olive-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={shippingData.firstName}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            firstName: e.target.value,
                          })
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
                          setShippingData({
                            ...shippingData,
                            lastName: e.target.value,
                          })
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
                          setShippingData({
                            ...shippingData,
                            email: e.target.value,
                          })
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
                          setShippingData({
                            ...shippingData,
                            phone: e.target.value,
                          })
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
                        setShippingData({
                          ...shippingData,
                          address: e.target.value,
                        })
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
                          setShippingData({
                            ...shippingData,
                            city: e.target.value,
                          })
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
                          setShippingData({
                            ...shippingData,
                            state: e.target.value,
                          })
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
                          setShippingData({
                            ...shippingData,
                            zip: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Country *
                    </label>
                    <select
                      value={shippingData.country}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          country: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white"
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  {user && (
                    <label className="flex items-center gap-2 text-sm text-olive-600">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4 h-4 rounded border-olive-300 text-gold-500 focus:ring-gold-400"
                      />
                      Save this address to my profile and set as default.
                    </label>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg"
                  >
                    Continue to Shipping Options
                  </motion.button>
                </form>
              </motion.div>
            )}

            {currentStep === "delivery" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-6 h-6 text-gold-500" />
                  <h2 className="text-2xl font-serif font-bold text-olive-800">
                    Shipping Options
                  </h2>
                </div>

                <div className="space-y-4">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                        shippingOptionId === option.id
                          ? "border-gold-500 bg-gold-50"
                          : "border-olive-200 hover:border-olive-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping-option"
                        value={option.id}
                        checked={shippingOptionId === option.id}
                        onChange={() => setShippingOptionId(option.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-olive-800">
                              {option.label}
                            </p>
                            <p className="text-sm text-olive-500">
                              {option.description}
                            </p>
                          </div>
                          <p className="font-semibold text-olive-800">
                            {option.cost === 0
                              ? "Free"
                              : `$${option.cost.toFixed(2)}`}
                          </p>
                        </div>
                        <p className="text-sm text-olive-500 mt-1">
                          {option.eta}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("shipping")}
                    className="flex-1 py-4 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep("payment")}
                    className="flex-1 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg"
                  >
                    Continue to Payment
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === "payment" && (
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

                <StripeCheckoutForm
                  amount={finalTotal}
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setCurrentStep("delivery")}
                />
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
                      <p className="text-olive-500 text-xs">
                        Qty: {item.quantity}
                      </p>
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
                  <span>
                    {selectedShippingOption?.label ?? "Shipping"}{" "}
                    {shippingCost === 0
                      ? "(Free)"
                      : `($${shippingCost.toFixed(2)})`}
                  </span>
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
                  <p>Powered by Stripe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
