/**
 * Axios Client Configuration
 * Centralized axios instance with interceptors
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "./config";
import { ApiResponse } from "./types";
import { toast } from "sonner";

// Create axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // Handle errors
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "An unexpected error occurred";

    // Log error for debugging
    // Use VITE_DEV global defined by Vite in browser for environment checks
    if (typeof import.meta !== "undefined" && (import.meta as any).env?.MODE === "development") {
      console.error("API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data,
      });
    }

    // Handle 401 Unauthorized - logout user
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      
      toast.error("Session expired. Please login again.");
      return Promise.reject(error);
    }

    // Show toast notification for user-facing errors
    if (error.response?.status && error.response.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found");
    } else if (error.response?.status === 400) {
      toast.error(errorMessage);
    } else if (error.response?.status === 403) {
      toast.error("Access denied. You don't have permission.");
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

