// src/lib/auth/auth-service.ts
import api from '../api/axios';
import { LoginResponse, RegisterData, UserData } from './types';

class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem(this.tokenKey, response.data.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<void> {
    try {
      const response = await api.post<LoginResponse>('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem(this.tokenKey, response.data.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): UserData | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();