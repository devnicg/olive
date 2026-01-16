"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  MapPin,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { countries } from "@/data/countries";
import type { Database } from "@/types/database";

interface ProfileForm {
  full_name: string;
  phone: string;
  email: string;
}

type ProfileAddress = Database["public"]["Tables"]["profile_addresses"]["Row"];

type AddressForm = Omit<
  ProfileAddress,
  "id" | "created_at" | "updated_at" | "user_id"
>;

const emptyAddress: AddressForm = {
  label: "Home",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  is_default: false,
};

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    full_name: "",
    phone: "",
    email: "",
  });
  const [addresses, setAddresses] = useState<ProfileAddress[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ProfileAddress | null>(
    null
  );
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      const { data: profile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("full_name, phone, email")
        .eq("id", user.id)
        .single();

      if (profileFetchError) {
        setProfileError(profileFetchError.message);
      } else {
        setProfileForm({
          full_name: profile?.full_name ?? "",
          phone: profile?.phone ?? "",
          email: profile?.email ?? user.email ?? "",
        });
      }

      const { data: addressRows, error: addressFetchError } = await supabase
        .from("profile_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("updated_at", { ascending: false });

      if (addressFetchError) {
        setAddressError(addressFetchError.message);
      } else {
        setAddresses(addressRows ?? []);
      }
    };

    fetchProfileData();
  }, [supabase, user]);

  const handleProfileSave = async () => {
    if (!user) return;

    setIsSavingProfile(true);
    setProfileError(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileForm.full_name || null,
        phone: profileForm.phone || null,
      })
      .eq("id", user.id);

    if (error) {
      setProfileError(error.message);
    }

    setIsSavingProfile(false);
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      ...emptyAddress,
      email: profileForm.email || user?.email || "",
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddress = (address: ProfileAddress) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label ?? "Home",
      first_name: address.first_name,
      last_name: address.last_name,
      email: address.email,
      phone: address.phone ?? "",
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      is_default: address.is_default,
    });
    setIsAddressModalOpen(true);
  };

  const saveAddress = async () => {
    if (!user) return;

    setIsSavingAddress(true);
    setAddressError(null);

    const payload = {
      label: addressForm.label || null,
      first_name: addressForm.first_name,
      last_name: addressForm.last_name,
      email: addressForm.email,
      phone: addressForm.phone || null,
      address: addressForm.address,
      city: addressForm.city,
      state: addressForm.state,
      zip: addressForm.zip,
      country: addressForm.country,
      is_default: addressForm.is_default,
    };

    let addressId = editingAddress?.id ?? null;

    if (addressId) {
      const { error } = await supabase
        .from("profile_addresses")
        .update(payload)
        .eq("id", addressId);

      if (error) {
        setAddressError(error.message);
        setIsSavingAddress(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("profile_addresses")
        .insert({ user_id: user.id, ...payload })
        .select("*")
        .single();

      if (error) {
        setAddressError(error.message);
        setIsSavingAddress(false);
        return;
      }

      addressId = data?.id ?? null;
    }

    if (addressForm.is_default && addressId) {
      await supabase
        .from("profile_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .neq("id", addressId);
    }

    const { data: refreshed } = await supabase
      .from("profile_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("updated_at", { ascending: false });

    setAddresses(refreshed ?? []);
    setIsSavingAddress(false);
    setIsAddressModalOpen(false);
  };

  const deleteAddress = async (addressId: string) => {
    if (!user) return;

    await supabase.from("profile_addresses").delete().eq("id", addressId);

    const { data: refreshed } = await supabase
      .from("profile_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("updated_at", { ascending: false });

    setAddresses(refreshed ?? []);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-olive-50 pt-24 flex items-center justify-center">
        <p className="text-olive-600">Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-olive-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-olive-800 mb-3">
            Sign in required
          </h1>
          <p className="text-olive-600 mb-6">
            Please sign in to manage your profile and addresses.
          </p>
          <Link
            href="/login?redirect=/profile"
            className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-olive-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-gold-500" />
          <div>
            <h1 className="text-3xl font-serif font-bold text-olive-800">
              Profile
            </h1>
            <p className="text-olive-600">
              Manage your contact details and saved addresses.
            </p>
          </div>
        </div>

        {profileError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <p className="text-sm">{profileError}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-serif font-semibold text-olive-800 mb-4">
            Contact Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, full_name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-olive-200 bg-olive-50 text-olive-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleProfileSave}
              disabled={isSavingProfile}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors disabled:opacity-70"
            >
              {isSavingProfile ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-serif font-semibold text-olive-800">
                Saved Addresses
              </h2>
              <p className="text-sm text-olive-500">
                Use these during checkout to speed things up.
              </p>
            </div>
            <button
              onClick={openAddAddress}
              className="inline-flex items-center gap-2 px-4 py-2 bg-olive-600 text-white rounded-full hover:bg-olive-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          </div>

          {addressError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {addressError}
            </div>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-10 text-olive-500">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-olive-300" />
              No saved addresses yet.
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border border-olive-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-olive-800">
                        {address.label ?? "Address"}
                      </p>
                      {address.is_default && (
                        <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-olive-600">
                      {address.first_name} {address.last_name}
                    </p>
                    <p className="text-sm text-olive-600">
                      {address.address}, {address.city}, {address.state}{" "}
                      {address.zip}
                    </p>
                    <p className="text-sm text-olive-600">{address.country}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditAddress(address)}
                      className="p-2 text-olive-600 hover:bg-olive-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAddress(address.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold text-olive-800">
                  {editingAddress ? "Edit Address" : "Add Address"}
                </h3>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-2 text-olive-500 hover:bg-olive-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={addressForm.label ?? ""}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, label: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={addressForm.email}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={addressForm.first_name}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        first_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={addressForm.last_name}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        last_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone ?? ""}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={addressForm.address}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    ZIP
                  </label>
                  <input
                    type="text"
                    value={addressForm.zip}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, zip: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Country
                  </label>
                  <select
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 mt-4 text-sm text-olive-600">
                <input
                  type="checkbox"
                  checked={addressForm.is_default}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      is_default: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-olive-300 text-gold-500 focus:ring-gold-400"
                />
                Set as default shipping address
              </label>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-3 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveAddress}
                  disabled={isSavingAddress}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSavingAddress ? "Saving…" : "Save Address"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
