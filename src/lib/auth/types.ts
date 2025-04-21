// src/lib/auth/types.ts
export interface UserData {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}