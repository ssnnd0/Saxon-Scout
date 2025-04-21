// src/context/api-context-provider.tsx
import React, { createContext, useState } from 'react';
import { ErrorResponse } from '../lib/api/types';

interface ApiContextType {
  loading: boolean;
  error: ErrorResponse | null;
  setLoading: (loading: boolean) => void;
  setError: (error: ErrorResponse | null) => void;
  clearError: () => void;
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const clearError = () => setError(null);

  return (
    <ApiContext.Provider
      value={{
        loading,
        error,
        setLoading,
        setError,
        clearError,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};