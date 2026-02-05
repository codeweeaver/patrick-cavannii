import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/index';
const WishlistContext = createContext();

const wishReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_WISHLIST': {
      const product = action.payload;
      const isExist = state.items.find((item) => item.id === product.id);
      return {
        ...state,
        items: isExist
          ? state.items.filter((item) => item.id !== product.id)
          : [...state.items, product],
      };
    }
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'SET_WISHLIST':
      return { ...state, items: action.payload };
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(wishReducer, { items: [] });

  // Track server state to prevent redundant API calls
  const lastSyncedItems = useRef([]);
  // Track if initial load has finished
  const isLoaded = useRef(false);

  // 1. Initial Fetch logic
  useEffect(() => {
    let isMounted = true;

    if (user?.token && user?.id) {
      api
        .get(`/users/${user.id}`) // Usually you fetch the user object containing the wishlist
        .then((data) => {
          if (!isMounted) return;

          // Adjust this based on your API structure (e.g., data.wishlist or data.items)
          const items = data.wishlist || data.items || [];
          lastSyncedItems.current = items;
          dispatch({ type: 'SET_WISHLIST', payload: items });
          isLoaded.current = true;
        })
        .catch((err) => {
          console.error('Wishlist fetch error:', err);
          isLoaded.current = true; // Set to true anyway to allow local changes
        });
    } else {
      dispatch({ type: 'CLEAR_WISHLIST' });
      isLoaded.current = false;
    }

    return () => {
      isMounted = false;
    };
  }, [user?.token, user?.id]);

  // 2. Automated Sync (Persistence)
  useEffect(() => {
    // Only sync if:
    // 1. User is logged in
    // 2. Initial fetch has finished
    // 3. Local state differs from the last thing we synced with the server
    const hasChanged = JSON.stringify(state.items) !== JSON.stringify(lastSyncedItems.current);

    if (user?.id && isLoaded.current && hasChanged) {
      api
        .patch(`/users/${user.id}`, { wishlist: state.items })
        .then(() => {
          lastSyncedItems.current = state.items;
        })
        .catch((err) => console.error('Wishlist sync failed:', err));
    }
  }, [state.items, user?.id]);

  // 3. Memoized Helper Functions
  // Using useCallback ensures these functions don't change on every render
  const toggleWishlist = useCallback((product) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  }, []);

  const isInWishlist = useCallback(
    (productId) => {
      return state.items.some((item) => item.id === productId);
    },
    [state.items],
  );

  // 4. Memoize the final context value
  const value = useMemo(
    () => ({
      wishlistItems: state.items,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      wishlistCount: state.items.length,
    }),
    [state.items, toggleWishlist, removeFromWishlist, isInWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;
