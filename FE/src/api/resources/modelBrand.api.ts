/**
 * Model Brand API
 * All model/brand-related API endpoints
 */

import axiosClient from "../client";
import { ApiResponse, QueryParams } from "../types";
import { BrandDto } from "../../dtos";

export const modelBrandApi = {
  /**
   * Get all model/brand combinations with optional filters
   */
  getAll: (params?: QueryParams) =>
    axiosClient.get<ApiResponse<BrandDto[]>>("/model-brands", { params }),

  /**
   * Get model/brand by ID
   */
  getById: (id: number) =>
    axiosClient.get<ApiResponse<BrandDto>>(`/model-brands/${id}`),

  /**
   * Create a new model/brand combination
   */
  create: (data: Partial<BrandDto>) =>
    axiosClient.post<ApiResponse<BrandDto>>("/model-brands", data),

  /**
   * Update an existing model/brand
   */
  update: (id: number, data: Partial<BrandDto>) =>
    axiosClient.put<ApiResponse<BrandDto>>(`/model-brands/${id}`, data),

  /**
   * Delete a model/brand
   */
  delete: (id: number) =>
    axiosClient.delete<ApiResponse>(`/model-brands/${id}`),
};

