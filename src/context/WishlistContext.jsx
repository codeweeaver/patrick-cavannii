import { createContext, useEffect, useReducer } from 'react';

const WishlistContext = createContext();

const getInitialWishlist = () => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
  return {
    items: user?.wishlist || [],
  };
};

const wishReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_WISHLIST': {
      const product = action.payload;
      const isExist = state.items.find((item) => item.id === product.id);

      if (isExist) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== product.id),
        };
      }
      return {
        ...state,
        items: [...state.items, product],
      };
    }
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'SET_WISHLIST':
      return {
        ...state,
        items: action.payload,
      };
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishReducer, null, getInitialWishlist);

  // Sync wishlist with the user object in localStorage
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'));
    let storage = localStorage;

    if (!user) {
      user = JSON.parse(sessionStorage.getItem('user'));
      storage = sessionStorage;
    }
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];

    if (user) {
      const updatedUser = { ...user, wishlist: state.items };
      storage.setItem('user', JSON.stringify(updatedUser));

      const updatedUsersList = allUsers.map((u) => (u.id === user.id ? updatedUser : u));
      localStorage.setItem('users', JSON.stringify(updatedUsersList));

      // 3. Persist to Backend (Fix for data loss on logout/login)
      if (user.id) {
        fetch(`import.meta.env.VITE_API_URL/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wishlist: state.items }),
        }).catch((err) => console.error('Failed to sync wishlist to server:', err));
      }
    }
  }, [state.items]);

  // Sync state if localStorage changes (e.g., login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      dispatch({ type: 'SET_WISHLIST', payload: user?.wishlist || [] });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleWishlist = (product) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const isInWishlist = (productId) => {
    return state.items.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: state.items,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: state.items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
