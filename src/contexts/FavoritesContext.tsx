import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preset } from './LightingContext';

interface FavoritesContextType {
  favorites: Preset[];
  addToFavorites: (preset: Preset) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const STORAGE_KEY = 'catlight-favorites';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Preset[]>([]);
  
  // Load favorites from local storage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
    }
  }, []);
  
  // Save favorites to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }, [favorites]);
  
  const addToFavorites = (preset: Preset) => {
    setFavorites(prevFavorites => {
      // Check if preset already exists
      const exists = prevFavorites.some(fav => fav.id === preset.id);
      if (exists) {
        // Update existing preset
        return prevFavorites.map(fav => 
          fav.id === preset.id ? preset : fav
        );
      } else {
        // Add new preset
        return [...prevFavorites, preset];
      }
    });
  };
  
  const removeFromFavorites = (id: string) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(preset => preset.id !== id)
    );
  };
  
  const isFavorite = (id: string) => {
    return favorites.some(preset => preset.id === id);
  };
  
  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
  
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};