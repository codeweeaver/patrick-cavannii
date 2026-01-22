import { createContext, useContext, useEffect, useState } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  // Default to USD as requested
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  const [exchangeRate, setExchangeRate] = useState(1500); // Default fallback

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates?.NGN) {
          setExchangeRate(data.rates.NGN);
        }
      })
      .catch((err) => console.error('Failed to fetch exchange rate:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const setCurrencyValue = (value) => {
    setCurrency(value);
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';

    const value = currency === 'USD' ? price : price * exchangeRate;

    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-NG', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setCurrencyValue, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
