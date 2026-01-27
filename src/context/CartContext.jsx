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
      // FIX: Use sku, falling back to id to ensure we always have a unique key
      const identifier = newItem.sku || newItem.id;
      const existingItemIndex = state.items.findIndex(
        (item) => (item.sku || item.id) === identifier,
      );

      const quantityToAdd = newItem.quantity || 1;

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantityToAdd,
        };
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, { ...newItem, quantity: quantityToAdd }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        // FIX: Check both sku and id to ensure the filter actually removes the item
        items: state.items.filter(
          (item) => item.sku !== action.payload && item.id !== action.payload,
        ),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.sku === action.payload.sku || item.id === action.payload.sku
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_CART':
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialCart);

  // Sync with LocalStorage and API
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'));
    let storage = localStorage;

    if (!user) {
      user = JSON.parse(sessionStorage.getItem('user'));
      storage = sessionStorage;
    }

    if (user) {
      const updatedUser = { ...user, cart: state.items };
      storage.setItem('user', JSON.stringify(updatedUser));

      if (user.id) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        fetch(`${baseUrl}/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: state.items }),
        }).catch((err) => console.error('Failed to sync cart:', err));
      }
    }
  }, [state.items]);

  const addToCart = (item) => {
    // FIX: More flexible validation (allow id if sku is missing)
    if (!item?.id) return;

    const itemSku = item.sku || item.id;
    const variant = item.inventory?.variants?.find((v) => v.sku === itemSku);

    const maxQty = variant
      ? (variant.stock ?? variant.quantity)
      : (item.inventory?.totalStock ?? item.inventory?.quantity ?? 99);

    const existingInCart = state.items.find((i) => (i.sku || i.id) === itemSku);
    const currentQtyInCart = existingInCart ? existingInCart.quantity : 0;
    const requestedTotal = currentQtyInCart + (item.quantity || 1);

    if (requestedTotal > maxQty) {
      toast.error(`Stock limit reached. Only ${maxQty} available.`);
      return;
    }

    dispatch({ type: 'ADD_ITEM', payload: { ...item, sku: itemSku } });
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (idOrSku) => {
    dispatch({ type: 'REMOVE_ITEM', payload: idOrSku });
    toast.success('Item removed');
  };

  const updateQuantity = (idOrSku, quantity) => {
    if (quantity < 1) return;
    const item = state.items.find((i) => i.sku === idOrSku || i.id === idOrSku);
    if (!item) return;

    const variant = item.inventory?.variants?.find((v) => v.sku === idOrSku);
    const maxQty = variant ? (variant.stock ?? variant.quantity) : (item.inventory?.quantity ?? 99);

    if (quantity > maxQty) {
      toast.error(`Only ${maxQty} items in stock.`);
      return;
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { sku: idOrSku, quantity } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

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
