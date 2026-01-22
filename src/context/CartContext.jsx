import { createContext, useEffect, useReducer } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

const getInitialCart = () => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
  return {
    items: user?.cart || [],
  };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      const quantityToAdd = newItem.quantity || 1;

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + quantityToAdd } : item,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...newItem, quantity: quantityToAdd }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialCart);

  // Sync cart with the user object in localStorage
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'));
    let storage = localStorage;

    if (!user) {
      user = JSON.parse(sessionStorage.getItem('user'));
      storage = sessionStorage;
    }

    if (user) {
      // 1. Update the current session user object
      const updatedUser = { ...user, cart: state.items };
      storage.setItem('user', JSON.stringify(updatedUser));

      // 3. Persist to Backend (Fix for data loss on logout/login)
      if (user.id) {
        fetch(`import.meta.env.VITE_API_URL/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cart: state.items }),
        }).catch((err) => console.error('Failed to sync cart to server:', err));
      }
    }
  }, [state.items]);

  // Listen for login/logout to reset cart state
  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      dispatch({ type: 'SET_CART', payload: user?.cart || [] });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (item) => {
    // Safety check: Ensure item is a valid product with an ID, not a click event
    if (!item?.id || item?.nativeEvent) {
      console.error(
        'Invalid item passed to addToCart. Ensure you are using () => addToCart(product)',
      );
      return;
    }

    // Inventory Check
    const existingItem = state.items.find((i) => i.id === item.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const quantityToAdd = item.quantity || 1;
    const maxQty = item.inventory?.quantity || 0;

    if (currentQty + quantityToAdd > maxQty) {
      toast.error(`Sorry, only ${maxQty} items available in stock.`);
      return;
    }

    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success('Added to cart');
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast.success('Removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    const item = state.items.find((i) => i.id === itemId);
    if (item && item.inventory?.quantity && quantity > item.inventory.quantity) {
      toast.error(`Sorry, only ${item.inventory.quantity} items available.`);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Derived state
  const cartCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
