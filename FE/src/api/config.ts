/**
 * API Configuration
 * Centralized configuration for API client
 */

export const API_CONFIG = {
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
} as const;

