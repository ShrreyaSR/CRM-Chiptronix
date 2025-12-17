/**
 * Tray API
 * All tray-related API endpoints
 */

import axiosClient from "../client";
import { ApiResponse, QueryParams } from "../types";
import { TrayDto } from "../../dtos";

export const trayApi = {
  /**
   * Get all trays with optional sorting
   */
  getAll: (params?: QueryParams) =>
    axiosClient.get<ApiResponse<TrayDto[]>>("/trays", { params }),

  /**
   * Get tray by ID
   */
  getById: (id: number) =>
    axiosClient.get<ApiResponse<TrayDto>>(`/trays/${id}`),

  /**
   * Create a new tray
   */
  create: (data: Partial<TrayDto>) =>
    axiosClient.post<ApiResponse<TrayDto>>("/trays", data),

  /**
   * Update an existing tray
   */
  update: (id: number, data: Partial<TrayDto>) =>
    axiosClient.patch<ApiResponse<TrayDto>>(`/trays/${id}`, data),

  /**
   * Delete a tray
   */
  delete: (id: number) =>
    axiosClient.delete<ApiResponse>(`/trays/${id}`),

  /**
   * Bulk create trays
   */
  bulkAdd: (data: { totalCount: number }) =>
    axiosClient.post<ApiResponse>("/trays/bulk", data),
};

