import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Create the authentication context
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('saxonScoutingToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set auth header
        axios.defaults.headers.common['x-auth-token'] = token;
        
        // Verify token with server
        const res = await axios.get('/api/auth');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth error:', err.response ? err.response.data : err.message);
        localStorage.removeItem('saxonScoutingToken');
        delete axios.defaults.headers.common['x-auth-token'];
        setError(err.response?.data?.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login user
  const login = async (username, password) => {
    try {
      setError(null);
      const res = await axios.post('/api/auth', { username, password });
      const { token, user } = res.data;

      // Store token in local storage
      localStorage.setItem('saxonScoutingToken', token);
      
      // Set auth header
      axios.defaults.headers.common['x-auth-token'] = token;

      setIsAuthenticated(true);
      setUser(user);
      return true;
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('/api/users', userData);
      return res.data;
    } catch (err) {
      console.error('Register error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('saxonScoutingToken');
    delete axios.defaults.headers.common['x-auth-token'];
    setIsAuthenticated(false);
    setUser(null);
  };

  // Clear error
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// No default export needed - we're using named exports