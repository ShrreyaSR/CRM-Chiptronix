/**
 * Vendor API
 * All vendor-related API endpoints
 */

import axiosClient from "../client";
import { ApiResponse, QueryParams } from "../types";
import { VendorDto } from "../../dtos";

export const vendorApi = {
  /**
   * Get all vendors with optional filters
   */
  getAll: (params?: QueryParams) =>
    axiosClient.get<ApiResponse<VendorDto[]>>("/vendor", { params }),

  /**
   * Get vendor by ID
   */
  getById: (id: number) =>
    axiosClient.get<ApiResponse<VendorDto>>(`/vendor/${id}`),

  /**
   * Create a new vendor
   */
  create: (data: Partial<VendorDto>) =>
    axiosClient.post<ApiResponse<VendorDto>>("/vendor", data),

  /**
   * Update an existing vendor
   */
  update: (id: number, data: Partial<VendorDto>) =>
    axiosClient.put<ApiResponse<VendorDto>>(`/vendor/${id}`, data),

  /**
   * Delete a vendor
   */
  delete: (id: number) =>
    axiosClient.delete<ApiResponse>(`/vendor/${id}`),
};

