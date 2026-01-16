'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  shipping_address: {
    firstName?: string;
    lastName?: string;
  } | null;
}

export default function AdminDashboard() {
  const { state } = useProducts();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();

      // Fetch recent orders
<<<<<<< HEAD
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: orders } = await (supabase
        .from('orders') as any)
=======
      const { data: orders } = await supabase
        .from('orders')
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (orders) {
<<<<<<< HEAD
        setRecentOrders(orders as Order[]);
      }

      // Fetch stats
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: allOrders } = await (supabase
        .from('orders') as any)
        .select('total, status');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: customerCount } = await (supabase
        .from('profiles') as any)
        .select('*', { count: 'exact', head: true });

      if (allOrders) {
        const totalRevenue = (allOrders as { total: number }[]).reduce((sum, order) => sum + (order.total || 0), 0);
=======
        setRecentOrders(orders);
      }

      // Fetch stats
      const { data: allOrders } = await supabase
        .from('orders')
        .select('total, status');

      const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (allOrders) {
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
>>>>>>> 60b07578e8ba6fd37b7b38231b828b4c926e2e6c
        setStats({
          totalRevenue,
          totalOrders: allOrders.length,
          totalCustomers: customerCount || 0,
        });
      }

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-olive-800">Dashboard</h1>
        <p className="text-olive-600 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-olive-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-olive-800 mt-1">
                {isLoading ? '...' : `$${stats.totalRevenue.toFixed(2)}`}
              </p>
            </div>
            <div className="p-3 bg-olive-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-olive-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-olive-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-olive-800 mt-1">
                {isLoading ? '...' : stats.totalOrders}
              </p>
            </div>
            <div className="p-3 bg-olive-100 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-olive-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-olive-500 text-sm">Active Products</p>
              <p className="text-3xl font-bold text-olive-800 mt-1">
                {state.products.length}
              </p>
            </div>
            <div className="p-3 bg-olive-100 rounded-xl">
              <Package className="w-6 h-6 text-olive-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-olive-500 text-sm">Total Customers</p>
              <p className="text-3xl font-bold text-olive-800 mt-1">
                {isLoading ? '...' : stats.totalCustomers}
              </p>
            </div>
            <div className="p-3 bg-olive-100 rounded-xl">
              <Users className="w-6 h-6 text-olive-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-serif font-semibold text-olive-800 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-olive-400 animate-spin" />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-olive-500 text-center py-8">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-olive-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-olive-800">
                      {order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-olive-500">
                      {order.shipping_address?.firstName || 'Guest'} {order.shipping_address?.lastName || ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-olive-800">${order.total.toFixed(2)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : order.status === 'processing'
                          ? 'bg-blue-100 text-blue-600'
                          : order.status === 'shipped'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-serif font-semibold text-olive-800 mb-4">
            Top Products
          </h2>
          <div className="space-y-4">
            {state.products.slice(0, 5).map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 py-3 border-b border-olive-100 last:border-0"
              >
                <span className="w-8 h-8 bg-olive-100 rounded-full flex items-center justify-center text-olive-600 font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-olive-800 line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-sm text-olive-500">{product.category}</p>
                </div>
                <p className="font-semibold text-olive-800">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-8 bg-gradient-to-r from-olive-600 to-olive-700 rounded-2xl p-6 text-white"
      >
        <h2 className="text-xl font-serif font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/products"
            className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center"
          >
            <Package className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Add Product</span>
          </a>
          <a
            href="/admin/orders"
            className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center"
          >
            <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">View Orders</span>
          </a>
          <a
            href="/admin/customers"
            className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center"
          >
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Customers</span>
          </a>
          <a
            href="/admin/settings"
            className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-center"
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Analytics</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
