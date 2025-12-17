/**
 * API Response Types
 * Standard response format from backend
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  total?: number;
  items?: T[];
  page?: number;
  limit?: number;
  totalPages?: number;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  search?: string;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
  [key: string]: any;
}

