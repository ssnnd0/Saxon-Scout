// src/context/auth-context-provider.tsx
import React, { createContext, useEffect, useState } from 'react';
import { UserData } from '../lib/auth/types';
import authService from '../lib/auth/auth-service';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    setUser(authService.getCurrentUser());
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (email: string, password: string, name: string) => {
    await authService.register({ email, password, name });
    setUser(authService.getCurrentUser());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};