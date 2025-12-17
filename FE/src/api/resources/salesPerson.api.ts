/**
 * Sales Person API
 * All sales person-related API endpoints
 */

import axiosClient from "../client";
import { ApiResponse, QueryParams } from "../types";
import { SalesPersonDto } from "../../dtos";

export const salesPersonApi = {
  /**
   * Get all sales persons with optional filters
   */
  getAll: (params?: QueryParams) =>
    axiosClient.get<ApiResponse<SalesPersonDto[]>>("/sales-person", { params }),

  /**
   * Get sales person by ID
   */
  getById: (id: number) =>
    axiosClient.get<ApiResponse<SalesPersonDto>>(`/sales-person/${id}`),

  /**
   * Create a new sales person
   */
  create: (data: Partial<SalesPersonDto>) =>
    axiosClient.post<ApiResponse<SalesPersonDto>>("/sales-person", data),

  /**
   * Update an existing sales person
   */
  update: (id: number, data: Partial<SalesPersonDto>) =>
    axiosClient.put<ApiResponse<SalesPersonDto>>(`/sales-person/${id}`, data),

  /**
   * Delete a sales person
   */
  delete: (id: number) =>
    axiosClient.delete<ApiResponse>(`/sales-person/${id}`),
};

