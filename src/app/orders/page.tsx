"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ShoppingBag,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Database } from "@/types/database";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

type DbOrderRow = Database["public"]["Tables"]["orders"]["Row"];
type Order = Omit<DbOrderRow, "shipping_address" | "items"> & {
  shipping_address: ShippingAddress;
  items: OrderItem[];
};

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-600",
    icon: Clock,
    label: "Order Placed",
    description: "Your order has been received and is being reviewed.",
  },
  processing: {
    color: "bg-blue-100 text-blue-600",
    icon: Package,
    label: "Processing",
    description: "Your order is being prepared for shipment.",
  },
  shipped: {
    color: "bg-purple-100 text-purple-600",
    icon: Truck,
    label: "Shipped",
    description: "Your order is on its way!",
  },
  completed: {
    color: "bg-green-100 text-green-600",
    icon: CheckCircle,
    label: "Delivered",
    description: "Your order has been delivered successfully.",
  },
  cancelled: {
    color: "bg-red-100 text-red-600",
    icon: XCircle,
    label: "Cancelled",
    description: "This order has been cancelled.",
  },
};

const statusSteps = ["pending", "processing", "shipped", "completed"];

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        const normalizedOrders: Order[] = (data ?? []).map((row) => ({
          ...row,
          shipping_address: row.shipping_address as unknown as ShippingAddress,
          items: row.items as unknown as OrderItem[],
        }));

        setOrders(normalizedOrders);
      }

      setIsLoading(false);
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIndex = (status: string) => {
    if (status === "cancelled") return -1;
    return statusSteps.indexOf(status);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-olive-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-olive-400 mx-auto mb-4 animate-spin" />
          <p className="text-olive-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-olive-50 pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ShoppingBag className="w-16 h-16 text-olive-300 mx-auto mb-6" />
          <h1 className="text-2xl font-serif font-bold text-olive-800 mb-4">
            Sign in to view your orders
          </h1>
          <p className="text-olive-600 mb-8">
            You need to be logged in to view your order history and track your
            deliveries.
          </p>
          <Link href="/login?redirect=/orders">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-olive-50 pt-24">
      {/* Header */}
      <div className="bg-olive-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
              My Orders
            </h1>
            <p className="mt-2 text-olive-200">Track and manage your orders</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 text-olive-300 mx-auto mb-6" />
            <h2 className="text-xl font-serif font-semibold text-olive-800 mb-4">
              No orders yet
            </h2>
            <p className="text-olive-600 mb-8">
              Looks like you haven&apos;t placed any orders yet. Start shopping
              to see your orders here!
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors"
              >
                Browse Products
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;
              const isExpanded = expandedOrder === order.id;
              const currentStepIndex = getStatusIndex(order.status);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Order Header */}
                  <button
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                    className="w-full p-6 flex items-center justify-between hover:bg-olive-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${statusInfo.color}`}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-olive-800">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-olive-500">
                          {formatDate(order.created_at)} •{" "}
                          {order.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-olive-800">
                          ${Number(order.total).toFixed(2)}
                        </p>
                        <p
                          className={`text-sm ${statusInfo.color
                            .replace("bg-", "text-")
                            .replace("-100", "-600")}`}
                        >
                          {statusInfo.label}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-olive-400 transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 space-y-6 border-t border-olive-100 pt-6">
                          {/* Status Tracker */}
                          {order.status !== "cancelled" && (
                            <div className="relative">
                              <div className="flex justify-between">
                                {statusSteps.map((step, idx) => {
                                  const stepInfo =
                                    statusConfig[
                                      step as keyof typeof statusConfig
                                    ];
                                  const StepIcon = stepInfo.icon;
                                  const isCompleted = idx <= currentStepIndex;
                                  const isCurrent = idx === currentStepIndex;

                                  return (
                                    <div
                                      key={step}
                                      className="flex flex-col items-center relative z-10"
                                    >
                                      <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                          isCompleted
                                            ? "bg-gold-500 text-white"
                                            : "bg-olive-100 text-olive-400"
                                        } ${
                                          isCurrent
                                            ? "ring-4 ring-gold-200"
                                            : ""
                                        }`}
                                      >
                                        <StepIcon className="w-5 h-5" />
                                      </div>
                                      <p
                                        className={`mt-2 text-xs font-medium ${
                                          isCompleted
                                            ? "text-olive-800"
                                            : "text-olive-400"
                                        }`}
                                      >
                                        {stepInfo.label}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                              {/* Progress Line */}
                              <div className="absolute top-5 left-5 right-5 h-0.5 bg-olive-100 -z-0">
                                <div
                                  className="h-full bg-gold-500 transition-all duration-500"
                                  style={{
                                    width: `${
                                      (currentStepIndex /
                                        (statusSteps.length - 1)) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Status Message */}
                          <div className={`p-4 rounded-xl ${statusInfo.color}`}>
                            <p className="font-medium">
                              {statusInfo.description}
                            </p>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-olive-800">
                              Order Items
                            </h4>
                            <div className="border border-olive-100 rounded-xl overflow-hidden">
                              {order.items?.map((item, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-4 p-4 ${
                                    idx > 0 ? "border-t border-olive-100" : ""
                                  }`}
                                >
                                  {item.image && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-olive-100">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium text-olive-800">
                                      {item.name}
                                    </p>
                                    <p className="text-sm text-olive-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-olive-800">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-olive-800 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Shipping Address
                            </h4>
                            <div className="text-olive-600 p-4 bg-olive-50 rounded-xl">
                              <p className="font-medium text-olive-800">
                                {order.shipping_address?.firstName}{" "}
                                {order.shipping_address?.lastName}
                              </p>
                              <p>{order.shipping_address?.address}</p>
                              <p>
                                {order.shipping_address?.city},{" "}
                                {order.shipping_address?.state}{" "}
                                {order.shipping_address?.zip}
                              </p>
                              <p>{order.shipping_address?.country}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
