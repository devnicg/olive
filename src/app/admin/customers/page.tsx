"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  MapPin,
  Users,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  orders: number;
  totalSpent: number;
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      const supabase = createClient();

      // Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .order("created_at", { ascending: false });

      if (profiles && profiles.length > 0) {
        // Fetch order stats for each customer
        const customersWithStats = await Promise.all(
          (profiles as Profile[]).map(async (profile) => {
            const { data: orders } = await supabase
              .from("orders")
              .select("total")
              .eq("user_id", profile.id);

            const orderCount = orders?.length || 0;
            const totalSpent =
              orders?.reduce(
                (sum, order) => sum + ((order as { total: number }).total || 0),
                0
              ) || 0;

            return {
              id: profile.id,
              email: profile.email || "",
              full_name: profile.full_name,
              created_at: profile.created_at,
              orders: orderCount,
              totalSpent,
            };
          })
        );

        setCustomers(customersWithStats);
      }

      setIsLoading(false);
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.full_name?.toLowerCase() || "").includes(
        search.toLowerCase()
      ) || customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-olive-400 mx-auto mb-4 animate-spin" />
          <p className="text-olive-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-olive-800">
          Customers
        </h1>
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
              <p className="text-2xl font-bold text-olive-800">
                {totalCustomers}
              </p>
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
      {filteredCustomers.length > 0 ? (
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
                    {(customer.full_name || customer.email)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-olive-500">
                  Since {new Date(customer.created_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-olive-800 mb-2">
                {customer.full_name || "No name"}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-olive-600 text-sm">
                  <Mail className="w-4 h-4 text-olive-400" />
                  {customer.email}
                </div>
              </div>

              <div className="pt-4 border-t border-olive-100 flex justify-between">
                <div>
                  <p className="text-sm text-olive-500">Orders</p>
                  <p className="font-semibold text-olive-800">
                    {customer.orders}
                  </p>
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
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <Users className="w-12 h-12 text-olive-300 mx-auto mb-4" />
          <p className="text-olive-600">
            {search
              ? "No customers found matching your search"
              : "No customers yet"}
          </p>
        </div>
      )}
    </div>
  );
}
