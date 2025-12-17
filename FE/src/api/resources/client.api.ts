/**
 * Client API
 * All client-related API endpoints
 */

import axiosClient from "../client";
import { ApiResponse, QueryParams } from "../types";
import { ClientDto } from "../../dtos";

export const clientApi = {
  /**
   * Get all clients with optional filters
   */
  getAll: (params?: QueryParams) =>
    axiosClient.get<ApiResponse<ClientDto[]>>("/clients", { params }),

  /**
   * Get client by ID
   */
  getById: (id: number) =>
    axiosClient.get<ApiResponse<ClientDto>>(`/clients/${id}`),

  /**
   * Create a new client
   */
  create: (data: Partial<ClientDto>) =>
    axiosClient.post<ApiResponse<ClientDto>>("/clients", data),

  /**
   * Update an existing client
   */
  update: (id: number, data: Partial<ClientDto>) =>
    axiosClient.put<ApiResponse<ClientDto>>(`/clients/${id}`, data),

  /**
   * Delete a client
   */
  delete: (id: number) =>
    axiosClient.delete<ApiResponse>(`/clients/${id}`),
};

