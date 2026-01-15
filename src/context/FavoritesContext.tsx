'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[]; // Array of product IDs
  isLoading: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      // Load from localStorage for non-authenticated users
      const stored = localStorage.getItem('oliveoil-favorites');
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch {
          setFavorites([]);
        }
      }
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else if (data) {
      setFavorites(data.map(f => f.product_id));
    }

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Sync to localStorage when favorites change (for non-authenticated users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('oliveoil-favorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (productId: string) => {
    const isCurrentlyFavorite = favorites.includes(productId);

    if (!user) {
      // Handle locally for non-authenticated users
      if (isCurrentlyFavorite) {
        setFavorites(prev => prev.filter(id => id !== productId));
      } else {
        setFavorites(prev => [...prev, productId]);
      }
      return;
    }

    const supabase = createClient();

    if (isCurrentlyFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing favorite:', error);
        return;
      }

      setFavorites(prev => prev.filter(id => id !== productId));
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (error) {
        console.error('Error adding favorite:', error);
        return;
      }

      setFavorites(prev => [...prev, productId]);
    }
  }, [favorites, user]);

  const refreshFavorites = useCallback(async () => {
    setIsLoading(true);
    await fetchFavorites();
  }, [fetchFavorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
