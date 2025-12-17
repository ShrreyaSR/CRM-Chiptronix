/**
 * Health Check API
 * Server health and status endpoints
 */

import axiosClient from "../client";
import { ApiResponse } from "../types";

export interface HealthResponse {
  status: string;
  timestamp: string;
  environment: string;
}

export const healthApi = {
  /**
   * Check server health status
   */
  check: () =>
    axiosClient.get<HealthResponse>("/health"),
};

