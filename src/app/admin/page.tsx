'use client';

import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

const stats = [
  {
    label: 'Total Revenue',
    value: '$24,580',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    label: 'Total Orders',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    label: 'Active Products',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Package,
  },
  {
    label: 'Total Customers',
    value: '1,245',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
  },
];

const recentOrders = [
  { id: 'OLV-001', customer: 'Sarah M.', amount: '$125.99', status: 'completed' },
  { id: 'OLV-002', customer: 'John D.', amount: '$89.50', status: 'processing' },
  { id: 'OLV-003', customer: 'Emily C.', amount: '$234.00', status: 'completed' },
  { id: 'OLV-004', customer: 'Michael R.', amount: '$67.25', status: 'pending' },
  { id: 'OLV-005', customer: 'Lisa T.', amount: '$156.75', status: 'completed' },
];

export default function AdminDashboard() {
  const { state } = useProducts();

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
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-olive-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-olive-800 mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-olive-100 rounded-xl">
                <stat.icon className="w-6 h-6 text-olive-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {stat.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-olive-400 text-sm">vs last month</span>
            </div>
          </motion.div>
        ))}
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
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-olive-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-olive-800">{order.id}</p>
                  <p className="text-sm text-olive-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-olive-800">{order.amount}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : order.status === 'processing'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
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
