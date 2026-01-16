"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";
import type { Product } from "@/types/product";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

type ProductAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string };

const ProductContext = createContext<{
  state: ProductState;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<Product | null>;
  updateProduct: (product: Product) => Promise<Product | null>;
  deleteProduct: (productId: string) => Promise<boolean>;
  getProduct: (productId: string) => Product | undefined;
} | null>(null);

type DbProductRow = Database["public"]["Tables"]["products"]["Row"];
type DbProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type DbProductUpdate = Database["public"]["Tables"]["products"]["Update"];

function dbProductToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    image: row.image,
    category: row.category,
    size: row.size,
    inStock: row.in_stock,
    featured: row.featured,
    rating: Number(row.rating),
    reviews: row.reviews,
  };
}

function productToDbInsert(product: Omit<Product, "id">): DbProductInsert {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    size: product.size,
    in_stock: product.inStock,
    featured: product.featured,
    rating: product.rating,
    reviews: product.reviews,
  };
}

function productToDbUpdate(product: Product): DbProductUpdate {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    size: product.size,
    in_stock: product.inStock,
    featured: product.featured,
    rating: product.rating,
    reviews: product.reviews,
  };
}

function productReducer(
  state: ProductState,
  action: ProductAction
): ProductState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, {
    products: [],
    isLoading: true,
    error: null,
  });

  const refreshProducts = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const mapped = (data ?? []).map(dbProductToProduct);
    dispatch({ type: "SET_PRODUCTS", payload: mapped });
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addProduct = async (productData: Omit<Product, "id">) => {
    dispatch({ type: "SET_ERROR", payload: null });
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .insert(productToDbInsert(productData))
      .select("*")
      .single();

    if (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      return null;
    }

    const mapped = dbProductToProduct(data);
    dispatch({ type: "ADD_PRODUCT", payload: mapped });
    return mapped;
  };

  const updateProduct = async (product: Product) => {
    dispatch({ type: "SET_ERROR", payload: null });
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .update(productToDbUpdate(product))
      .eq("id", product.id)
      .select("*")
      .single();

    if (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      return null;
    }

    const mapped = dbProductToProduct(data);
    dispatch({ type: "UPDATE_PRODUCT", payload: mapped });
    return mapped;
  };

  const deleteProduct = async (productId: string) => {
    dispatch({ type: "SET_ERROR", payload: null });
    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      return false;
    }

    dispatch({ type: "DELETE_PRODUCT", payload: productId });
    return true;
  };

  const getProduct = (productId: string) => {
    return state.products.find((p) => p.id === productId);
  };

  return (
    <ProductContext.Provider
      value={{
        state,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
