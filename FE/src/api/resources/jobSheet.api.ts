/**
 * Job Sheet API
 * All job sheet-related API endpoints
 */

import axiosClient from "../client";
import { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import { JobSheetDto } from "../../dtos";

export interface JobSheetQueryParams extends QueryParams {
  status?: string;
  client?: number;
  assignedTo?: number;
  fromDate?: string;
  toDate?: string;
  completedFromDate?: string;
  completedToDate?: string;
}

export const jobSheetApi = {
  /**
   * Get all job sheets with advanced filtering, sorting, and pagination
   */
  getAll: (params?: JobSheetQueryParams) =>
    axiosClient.get<PaginatedResponse<JobSheetDto>>("/jobsheets", { params }),

  /**
   * Get job sheet by ID
   */
  getById: (id: number) =>
    axiosClient.get<ApiResponse<JobSheetDto>>(`/jobsheets/${id}`),

  /**
   * Create a new job sheet
   */
  create: (data: Partial<JobSheetDto>) =>
    axiosClient.post<ApiResponse<JobSheetDto>>("/jobsheets", data),

  /**
   * Update an existing job sheet
   */
  update: (id: number, data: Partial<JobSheetDto>) =>
    axiosClient.put<ApiResponse<JobSheetDto>>(`/jobsheets/${id}`, data),

  /**
   * Delete a job sheet
   */
  delete: (id: number) =>
    axiosClient.delete<ApiResponse>(`/jobsheets/${id}`),
};

