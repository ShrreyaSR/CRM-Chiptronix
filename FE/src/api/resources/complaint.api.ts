/**
 * Complaint API
 * All complaint-related API endpoints
 */

import axiosClient from "../client";
import { ApiResponse, QueryParams } from "../types";
import { ComplaintDto } from "../../dtos";

export const complaintApi = {
  /**
   * Get all complaint types with optional filters
   */
  getAll: (params?: QueryParams) =>
    axiosClient.get<ApiResponse<ComplaintDto[]>>("/complaints", { params }),

  /**
   * Get complaint by ID
   */
  getById: (id: number) =>
    axiosClient.get<ApiResponse<ComplaintDto>>(`/complaints/${id}`),

  /**
   * Create a new complaint type
   */
  create: (data: Partial<ComplaintDto>) =>
    axiosClient.post<ApiResponse<ComplaintDto>>("/complaints", data),

  /**
   * Update an existing complaint type
   */
  update: (id: number, data: Partial<ComplaintDto>) =>
    axiosClient.put<ApiResponse<ComplaintDto>>(`/complaints/${id}`, data),

  /**
   * Delete a complaint type
   */
  delete: (id: number) =>
    axiosClient.delete<ApiResponse>(`/complaints/${id}`),
};

