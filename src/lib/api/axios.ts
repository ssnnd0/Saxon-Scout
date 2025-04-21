// src/lib/api/axios.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { APIResponse, ErrorResponse } from './types';

const MAX_REQUESTS_PER_MINUTE = 60;
let requestCount = 0;
let lastReset = Date.now();

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const now = Date.now();
    if (now - lastReset > 60000) {
      requestCount = 0;
      lastReset = now;
    }

    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    requestCount++;

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return {
      data: response.data,
      status: response.status,
      success: true,
    } as APIResponse<typeof response.data>;
  },
  (error: AxiosError) => {
    const errorResponse: ErrorResponse = {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      error: error.response?.data || error.message,
    };
    console.error('API Error:', errorResponse);
    return Promise.reject(errorResponse);
  }
);

export default api;