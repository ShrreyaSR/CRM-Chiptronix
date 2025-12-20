/**
 * Auth API
 * Authentication-related API endpoints
 */

import axiosClient from "../client";
import { ApiResponse } from "../types";

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
  role: "super-admin" | "admin" | "technician" | "sales" | "dealer";
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    role: "super-admin" | "admin" | "technician" | "sales" | "dealer";
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
  };
}

export const authApi = {
  /**
   * Login with email/phone and password
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  /**
   * Verify if current token is valid
   */
  verify: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosClient.get<ApiResponse<{ message: string }>>(
      "/auth/verify"
    );
    return response.data;
  },
};
