"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Package,
  Star,
  AlertCircle,
} from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import type { Product } from "@/types/product";

type ModalMode = "add" | "edit" | null;

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  image:
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
  category: "extra-virgin",
  size: "500ml",
  inStock: true,
  featured: false,
  rating: 4.5,
  reviews: 0,
};

export default function ProductsPage() {
  const { state, addProduct, updateProduct, deleteProduct, refreshProducts } =
    useProducts();
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [currentProduct, setCurrentProduct] = useState<
    Product | Omit<Product, "id">
  >(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredProducts = state.products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentProduct(emptyProduct);
    setModalMode("add");
  };

  const handleOpenEdit = (product: Product) => {
    setCurrentProduct(product);
    setModalMode("edit");
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (modalMode === "add") {
        await addProduct(currentProduct as Omit<Product, "id">);
      } else if (modalMode === "edit" && "id" in currentProduct) {
        await updateProduct(currentProduct as Product);
      }
      setModalMode(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-olive-800">
            Products
          </h1>
          <p className="text-olive-600 mt-1">
            Manage your product catalog ({state.products.length} products)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Product operation failed</p>
            <p className="text-sm opacity-90">{state.error}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-olive-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-olive-100 flex items-center justify-between">
          <p className="text-sm text-olive-600">
            {state.isLoading ? "Loading products…" : "Products"}
          </p>
          <button
            onClick={() => refreshProducts()}
            className="text-sm text-olive-600 hover:text-olive-800"
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-olive-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-olive-700">
                  Rating
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-olive-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-olive-100">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-olive-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-olive-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-olive-800 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-sm text-olive-500">{product.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-olive-100 text-olive-600 text-sm rounded-full capitalize">
                      {product.category.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-olive-800">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        product.inStock
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                      <span className="text-olive-700">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 text-olive-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 text-olive-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-olive-300 mx-auto mb-4" />
            <p className="text-olive-600">
              {state.isLoading ? "Loading…" : "No products found"}
            </p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:pl-[calc(16rem+1rem)]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalMode(null)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-auto max-h-[90vh]"
            >
              <div className="p-6 border-b border-olive-100 flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-olive-800">
                  {modalMode === "add" ? "Add New Product" : "Edit Product"}
                </h2>
                <button
                  onClick={() => setModalMode(null)}
                  className="p-2 text-olive-500 hover:bg-olive-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={currentProduct.name}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    value={currentProduct.description}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentProduct.price}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Size *
                    </label>
                    <input
                      type="text"
                      value={currentProduct.size}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          size: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={currentProduct.category}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          category: e.target.value as Product["category"],
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all bg-white"
                    >
                      <option value="extra-virgin">Extra Virgin</option>
                      <option value="infused">Infused</option>
                      <option value="organic">Organic</option>
                      <option value="gift-sets">Gift Sets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-olive-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={currentProduct.image}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          image: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-olive-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentProduct.inStock}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          inStock: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-olive-300 text-gold-500 focus:ring-gold-400"
                    />
                    <span className="text-olive-700">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentProduct.featured}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          featured: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-olive-300 text-gold-500 focus:ring-gold-400"
                    />
                    <span className="text-olive-700">Featured Product</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-olive-100 flex gap-4">
                <button
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-3 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {isSaving
                    ? "Saving…"
                    : modalMode === "add"
                    ? "Add Product"
                    : "Save Changes"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:pl-[calc(16rem+1rem)]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-serif font-bold text-olive-800 mb-2">
                  Delete Product?
                </h3>
                <p className="text-olive-600 mb-6">
                  This action cannot be undone. The product will be permanently
                  removed.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-3 border-2 border-olive-200 text-olive-600 font-semibold rounded-full hover:bg-olive-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
