'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react';

const orders = [
  {
    id: 'OLV-001',
    customer: 'Sarah Mitchell',
    email: 'sarah@example.com',
    date: '2024-01-15',
    total: 125.99,
    status: 'completed',
    items: 3,
  },
  {
    id: 'OLV-002',
    customer: 'John Davidson',
    email: 'john@example.com',
    date: '2024-01-15',
    total: 89.50,
    status: 'processing',
    items: 2,
  },
  {
    id: 'OLV-003',
    customer: 'Emily Chen',
    email: 'emily@example.com',
    date: '2024-01-14',
    total: 234.00,
    status: 'shipped',
    items: 5,
  },
  {
    id: 'OLV-004',
    customer: 'Michael Roberts',
    email: 'michael@example.com',
    date: '2024-01-14',
    total: 67.25,
    status: 'pending',
    items: 1,
  },
  {
    id: 'OLV-005',
    customer: 'Lisa Thompson',
    email: 'lisa@example.com',
    date: '2024-01-13',
    total: 156.75,
    status: 'completed',
    items: 4,
  },
  {
    id: 'OLV-006',
    customer: 'David Wilson',
    email: 'david@example.com',
    date: '2024-01-13',
    total: 312.00,
    status: 'completed',
    items: 6,
  },
];

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-600', icon: Clock },
  processing: { color: 'bg-blue-100 text-blue-600', icon: Package },
  shipped: { color: 'bg-purple-100 text-purple-600', icon: Truck },
  completed: { color: 'bg-green-100 text-green-600', icon: CheckCircle },
};

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-olive-800">Orders</h1>
        <p className="text-olive-600 mt-1">
          Manage and track all customer orders
        </p>
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
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length;
          const Icon = config.icon;
          return (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter(statusFilter === status ? null : status)}
              className={`p-4 rounded-xl border-2 transition-colors ${
                statusFilter === status
                  ? 'border-gold-400 bg-gold-50'
                  : 'border-olive-100 bg-white hover:border-olive-200'
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
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                return (
                  <tr key={order.id} className="hover:bg-olive-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-olive-800">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-olive-800">{order.customer}</p>
                        <p className="text-sm text-olive-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-olive-600">{order.date}</td>
                    <td className="px-6 py-4 text-olive-600">{order.items} items</td>
                    <td className="px-6 py-4 font-semibold text-olive-800">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${
                          statusConfig[order.status as keyof typeof statusConfig].color
                        }`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-olive-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors">
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
      </div>
    </div>
  );
}
