import {createContext, useContext, useState, useEffect} from 'react';

const FavoritesContext = createContext();

const STORAGE_KEY = 'starwars-favorites';

export function FavoritesProvider({ children }) {
  
    const [favorites, setFavorites] = useState(() => {
       
        if (typeof window !== 'undefined') {
            try {
                const savedFavorites = localStorage.getItem(STORAGE_KEY);
                return savedFavorites ? JSON.parse(savedFavorites) : [];
            } catch (error) {
                console.error('Error loading favorites from localStorage:', error);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            } catch (error) {
                console.error('Error saving favorites to localStorage:', error);
            }
        }
    }, [favorites]);

    const addFavorite = (item) => {
        setFavorites(prev => {
            if (prev.some(fav => fav.id === item.id && fav.category === item.category)) {
                return prev;
            }
            return [...prev, item];
        });
    };

    const removeFavorite = (itemId, category) => {
        setFavorites(prev => prev.filter(fav => !(fav.id === itemId && fav.category === category)));
    };

    const isFavorite = (itemId, category) => {
        return favorites.some(fav => fav.id === itemId && fav.category === category);
    };

    const getFavoritesByCategory = (category) => {
        return favorites.filter(fav => fav.category === category);
    };

    const clearAllFavorites = () => {
        setFavorites([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addFavorite,
            removeFavorite,
            isFavorite,
            getFavoritesByCategory,
            clearAllFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    );
}


export { FavoritesContext };

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}