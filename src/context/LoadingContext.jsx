import { createContext, useState } from 'react';
import LoadingSpinner from '../components/global/LoadingSpinner';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
