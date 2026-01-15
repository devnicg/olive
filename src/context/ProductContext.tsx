'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, products as initialProducts } from '@/data/products';

interface ProductState {
  products: Product[];
}

type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string };

const ProductContext = createContext<{
  state: ProductState;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getProduct: (productId: string) => Product | undefined;
} | null>(null);

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { products: action.payload };
    case 'ADD_PRODUCT':
      return { products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        products: state.products.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, {
    products: initialProducts,
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('oliveoil-products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        dispatch({ type: 'SET_PRODUCTS', payload: parsed });
      } catch (e) {
        console.error('Failed to load products from storage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oliveoil-products', JSON.stringify(state.products));
  }, [state.products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };

  const updateProduct = (product: Product) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
  };

  const deleteProduct = (productId: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
  };

  const getProduct = (productId: string) => {
    return state.products.find((p) => p.id === productId);
  };

  return (
    <ProductContext.Provider
      value={{
        state,
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
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
