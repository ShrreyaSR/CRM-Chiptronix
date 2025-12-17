/**
 * Technician API
 * All technician-related API endpoints
 */

import axiosClient from "../client";
import { ApiResponse, QueryParams } from "../types";
import { TechnicianDto } from "../../dtos";

export const technicianApi = {
  /**
   * Get all technicians with optional filters
   */
  getAll: (params?: QueryParams) =>
    axiosClient.get<ApiResponse<TechnicianDto[]>>("/technicians", { params }),

  /**
   * Get technician by ID
   */
  getById: (id: number) =>
    axiosClient.get<ApiResponse<TechnicianDto>>(`/technicians/${id}`),

  /**
   * Create a new technician
   */
  create: (data: Partial<TechnicianDto>) =>
    axiosClient.post<ApiResponse<TechnicianDto>>("/technicians", data),

  /**
   * Update an existing technician
   */
  update: (id: number, data: Partial<TechnicianDto>) =>
    axiosClient.put<ApiResponse<TechnicianDto>>(`/technicians/${id}`, data),

  /**
   * Delete a technician
   */
  delete: (id: number) =>
    axiosClient.delete<ApiResponse>(`/technicians/${id}`),
};

