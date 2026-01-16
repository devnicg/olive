"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
=======
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Filter,
  X,
  XCircle,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
<<<<<<< HEAD
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";
=======
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c

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

<<<<<<< HEAD
type DbOrderRow = Database["public"]["Tables"]["orders"]["Row"];
type Order = Omit<DbOrderRow, "shipping_address" | "items"> & {
  shipping_address: ShippingAddress;
  items: OrderItem[];
};

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-600", icon: Clock },
  processing: { color: "bg-blue-100 text-blue-600", icon: Package },
  shipped: { color: "bg-purple-100 text-purple-600", icon: Truck },
  completed: { color: "bg-green-100 text-green-600", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-600", icon: XCircle },
=======
interface Order {
  id: string;
  created_at: string;
  user_id: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  total: number;
  shipping_address: ShippingAddress;
  items: OrderItem[];
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-600', icon: Clock },
  processing: { color: 'bg-blue-100 text-blue-600', icon: Package },
  shipped: { color: 'bg-purple-100 text-purple-600', icon: Truck },
  completed: { color: 'bg-green-100 text-green-600', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-600', icon: XCircle },
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [search, setSearch] = useState("");
=======
  const [search, setSearch] = useState('');
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
<<<<<<< HEAD
      .from("orders")
      .select("*")
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
=======
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data as Order[]);
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

<<<<<<< HEAD
  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
=======
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
    setIsUpdating(true);
    const supabase = createClient();

    const { error } = await supabase
<<<<<<< HEAD
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
    } else {
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
=======
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
    } else {
      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
      }
    }

    setIsUpdating(false);
  };

  const filteredOrders = orders.filter((order) => {
<<<<<<< HEAD
    const customerName = `${order.shipping_address?.firstName || ""} ${
      order.shipping_address?.lastName || ""
    }`.toLowerCase();
    const customerEmail = order.shipping_address?.email?.toLowerCase() || "";
=======
    const customerName = `${order.shipping_address?.firstName || ''} ${order.shipping_address?.lastName || ''}`.toLowerCase();
    const customerEmail = order.shipping_address?.email?.toLowerCase() || '';
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
    const searchLower = search.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(searchLower) ||
      customerName.includes(searchLower) ||
      customerEmail.includes(searchLower);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
<<<<<<< HEAD
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
=======
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
    });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
<<<<<<< HEAD
          <h1 className="text-3xl font-serif font-bold text-olive-800">
            Orders
          </h1>
=======
          <h1 className="text-3xl font-serif font-bold text-olive-800">Orders</h1>
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
          <p className="text-olive-600 mt-1">
            Manage and track all customer orders ({orders.length} total)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchOrders}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-olive-100 hover:bg-olive-200 text-olive-700 rounded-lg transition-colors disabled:opacity-50"
        >
<<<<<<< HEAD
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
=======
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
          Refresh
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-olive-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-olive-400" />
          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length;
          const Icon = config.icon;
          return (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setStatusFilter(statusFilter === status ? null : status)
              }
              className={`p-4 rounded-xl border-2 transition-colors ${
                statusFilter === status
                  ? "border-gold-400 bg-gold-50"
                  : "border-olive-100 bg-white hover:border-olive-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-olive-800">{count}</p>
                  <p className="text-sm text-olive-500 capitalize">{status}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-12 h-12 text-olive-300 mx-auto mb-4 animate-spin" />
            <p className="text-olive-600">Loading orders...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-olive-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-olive-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-olive-100">
                  {filteredOrders.map((order) => {
<<<<<<< HEAD
                    const StatusIcon =
                      statusConfig[order.status]?.icon || Clock;
                    const statusStyle =
                      statusConfig[order.status]?.color ||
                      "bg-gray-100 text-gray-600";
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-olive-50/50 transition-colors"
                      >
=======
                    const StatusIcon = statusConfig[order.status]?.icon || Clock;
                    const statusStyle = statusConfig[order.status]?.color || 'bg-gray-100 text-gray-600';
                    return (
                      <tr key={order.id} className="hover:bg-olive-50/50 transition-colors">
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
                        <td className="px-6 py-4 font-medium text-olive-800">
                          {order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-olive-800">
<<<<<<< HEAD
                              {order.shipping_address?.firstName}{" "}
                              {order.shipping_address?.lastName}
                            </p>
                            <p className="text-sm text-olive-500">
                              {order.shipping_address?.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-olive-600">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 text-olive-600">
                          {order.items?.length || 0} items
                        </td>
=======
                              {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                            </p>
                            <p className="text-sm text-olive-500">{order.shipping_address?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-olive-600">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4 text-olive-600">{order.items?.length || 0} items</td>
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
                        <td className="px-6 py-4 font-semibold text-olive-800">
                          ${Number(order.total).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${statusStyle}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-olive-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-olive-300 mx-auto mb-4" />
                <p className="text-olive-600">No orders found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:pl-[calc(16rem+1rem)]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-auto max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-olive-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-olive-800">
                    Order Details
                  </h2>
                  <p className="text-olive-500 text-sm">
                    #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-olive-500 hover:bg-olive-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Update */}
                <div className="flex items-center justify-between p-4 bg-olive-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-olive-700 font-medium">Status:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${
<<<<<<< HEAD
                        statusConfig[selectedOrder.status]?.color ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {(() => {
                        const Icon =
                          statusConfig[selectedOrder.status]?.icon || Clock;
=======
                        statusConfig[selectedOrder.status]?.color || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {(() => {
                        const Icon = statusConfig[selectedOrder.status]?.icon || Clock;
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
                        return <Icon className="w-4 h-4" />;
                      })()}
                      <span className="capitalize">{selectedOrder.status}</span>
                    </span>
                  </div>
                  <select
                    value={selectedOrder.status}
<<<<<<< HEAD
                    onChange={(e) =>
                      updateOrderStatus(
                        selectedOrder.id,
                        e.target.value as Order["status"]
                      )
                    }
=======
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
                    disabled={isUpdating}
                    className="px-3 py-2 rounded-lg border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white text-sm disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-olive-800 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Customer Information
                    </h3>
                    <div className="text-olive-600 space-y-1">
                      <p className="font-medium text-olive-800">
<<<<<<< HEAD
                        {selectedOrder.shipping_address?.firstName}{" "}
                        {selectedOrder.shipping_address?.lastName}
=======
                        {selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
                      </p>
                      <p>{selectedOrder.shipping_address?.email}</p>
                      {selectedOrder.shipping_address?.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedOrder.shipping_address.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-olive-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </h3>
                    <div className="text-olive-600 space-y-1">
                      <p>{selectedOrder.shipping_address?.address}</p>
                      <p>
<<<<<<< HEAD
                        {selectedOrder.shipping_address?.city},{" "}
                        {selectedOrder.shipping_address?.state}{" "}
                        {selectedOrder.shipping_address?.zip}
=======
                        {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.zip}
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
                      </p>
                      <p>{selectedOrder.shipping_address?.country}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-olive-800 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Items
                  </h3>
                  <div className="border border-olive-100 rounded-xl overflow-hidden">
                    {selectedOrder.items?.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-4 p-4 ${
<<<<<<< HEAD
                          index > 0 ? "border-t border-olive-100" : ""
=======
                          index > 0 ? 'border-t border-olive-100' : ''
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
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
<<<<<<< HEAD
                          <p className="font-medium text-olive-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-olive-500">
                            Qty: {item.quantity}
                          </p>
=======
                          <p className="font-medium text-olive-800">{item.name}</p>
                          <p className="text-sm text-olive-500">Qty: {item.quantity}</p>
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-olive-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
<<<<<<< HEAD
                          <p className="text-sm text-olive-500">
                            ${item.price.toFixed(2)} each
                          </p>
=======
                          <p className="text-sm text-olive-500">${item.price.toFixed(2)} each</p>
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center p-4 bg-gold-50 rounded-xl">
<<<<<<< HEAD
                  <span className="font-semibold text-olive-800">
                    Order Total
                  </span>
=======
                  <span className="font-semibold text-olive-800">Order Total</span>
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
                  <span className="text-2xl font-bold text-olive-800">
                    ${Number(selectedOrder.total).toFixed(2)}
                  </span>
                </div>

                {/* Order Date */}
                <p className="text-sm text-olive-500 text-center">
                  Order placed on {formatDate(selectedOrder.created_at)}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
