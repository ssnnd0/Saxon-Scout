// src/lib/api/types.ts
export interface APIResponse<T> {
  data: T;
  status: number;
  success: boolean;
}

export interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  error: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TeamData {
  id: number;
  name: string;
  number: number;
  location: string;
}

export interface ScoutingData {
  id: number;
  teamNumber: number;
  matchNumber: number;
  score: number;
  notes: string;
  timestamp: string;
}

export interface SeasonData {
  id: number;
  year: number;
  name: string;
  active: boolean;
}