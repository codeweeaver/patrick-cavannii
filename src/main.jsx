import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import './index.css';
import AppRoutes from './router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <AppRoutes />
                <Toaster position="bottom-right" />
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </LoadingProvider>
  </StrictMode>,
);
