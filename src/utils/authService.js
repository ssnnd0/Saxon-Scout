/**
 * Auth Service
 * Handles authentication, session management, and JWT handling
 */
import apiService from './apiService';
import storageService from './storageService';

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
    
    // Initialize apiService with stored token if available
    const token = this.getToken();
    if (token) {
      apiService.setAuthToken(token);
    }
  }

  // Get authentication token from storage
  getToken() {
    return storageService.get(this.tokenKey);
  }

  // Save token and user data to storage
  setToken(token, userData) {
    storageService.save(this.tokenKey, token);
    storageService.save(this.userKey, userData);
    apiService.setAuthToken(token);
  }

  // Clear authentication data from storage
  clearToken() {
    storageService.remove(this.tokenKey);
    storageService.remove(this.userKey);
    apiService.setAuthToken(null);
  }

  // Get stored user data
  getUser() {
    return storageService.get(this.userKey);
  }
  
  // Check if the user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    // Parse JWT payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert exp to milliseconds
      return Date.now() < expirationTime;
    } catch (e) {
      console.error('Error parsing JWT token', e);
      return false;
    }
  }

  // Login and store user data
  async login(username, password) {
    try {
      const response = await apiService.login(username, password);
      const { token, user } = response;
      
      if (!token || !user) {
        throw new Error('Invalid login response');
      }
      
      this.setToken(token, user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout and clear stored data
  async logout() {
    try {
      // Try to notify the server, but don't wait or fail if it doesn't work
      await apiService.logout().catch(e => console.log('Logout API call failed:', e));
    } finally {
      this.clearToken();
    }
  }

  // Check authentication status with server
  async checkAuthStatus() {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }
      
      // Try to validate with server
      const userData = await apiService.checkAuthStatus();
      return userData;
    } catch (error) {
      console.error('Auth check error:', error);
      this.clearToken(); // Clear invalid token
      return null;
    }
  }
}

export const authService = new AuthService();