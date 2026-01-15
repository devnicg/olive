'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Users, ShoppingBag } from 'lucide-react';

const customers = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    orders: 12,
    totalSpent: 1580.50,
    joinDate: '2023-06-15',
  },
  {
    id: '2',
    name: 'John Davidson',
    email: 'john@example.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, CA',
    orders: 8,
    totalSpent: 945.75,
    joinDate: '2023-08-22',
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily@example.com',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, CA',
    orders: 15,
    totalSpent: 2340.00,
    joinDate: '2023-03-10',
  },
  {
    id: '4',
    name: 'Michael Roberts',
    email: 'michael@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Chicago, IL',
    orders: 5,
    totalSpent: 425.25,
    joinDate: '2023-11-05',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa@example.com',
    phone: '+1 (555) 567-8901',
    location: 'Miami, FL',
    orders: 22,
    totalSpent: 3156.75,
    joinDate: '2022-12-01',
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.orders, 0);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-olive-800">Customers</h1>
        <p className="text-olive-600 mt-1">
          View and manage your customer base
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-olive-100 rounded-xl">
              <Users className="w-6 h-6 text-olive-600" />
            </div>
            <div>
              <p className="text-olive-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-olive-800">{totalCustomers}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-100 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <p className="text-olive-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-olive-800">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-olive-500 text-sm">Avg. Order Value</p>
              <p className="text-2xl font-bold text-olive-800">
                ${avgOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-olive-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                <span className="text-gold-600 font-bold text-lg">
                  {customer.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm text-olive-500">
                Since {customer.joinDate}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-olive-800 mb-2">
              {customer.name}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-olive-600 text-sm">
                <Mail className="w-4 h-4 text-olive-400" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-olive-600 text-sm">
                <Phone className="w-4 h-4 text-olive-400" />
                {customer.phone}
              </div>
              <div className="flex items-center gap-2 text-olive-600 text-sm">
                <MapPin className="w-4 h-4 text-olive-400" />
                {customer.location}
              </div>
            </div>

            <div className="pt-4 border-t border-olive-100 flex justify-between">
              <div>
                <p className="text-sm text-olive-500">Orders</p>
                <p className="font-semibold text-olive-800">{customer.orders}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-olive-500">Total Spent</p>
                <p className="font-semibold text-olive-800">
                  ${customer.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <Users className="w-12 h-12 text-olive-300 mx-auto mb-4" />
          <p className="text-olive-600">No customers found</p>
        </div>
      )}
    </div>
  );
}
