/**
 * CRM API - Centralized API Collection
 * 
 * This is the main entry point for all API calls.
 * Import from here: import { crmApi } from '@/api'
 * 
 * Structure:
 * - client: Axios instance with interceptors
 * - config: API configuration
 * - types: TypeScript types for API responses
 * - resources: Individual API modules organized by resource
 */

// Export client and config
export { default as axiosClient } from "./client";
export { API_CONFIG } from "./config";
export type { ApiResponse, PaginatedResponse, QueryParams } from "./types";

// Import all API resources
import { clientApi } from "./resources/client.api";
import { technicianApi } from "./resources/technician.api";
import { jobSheetApi } from "./resources/jobSheet.api";
import { trayApi } from "./resources/tray.api";
import { modelBrandApi } from "./resources/modelBrand.api";
import { complaintApi } from "./resources/complaint.api";
import { vendorApi } from "./resources/vendor.api";
import { salesPersonApi } from "./resources/salesPerson.api";
import { healthApi } from "./resources/health.api";
import { authApi } from "./resources/auth.api";

// Export all API resources
export { clientApi } from "./resources/client.api";
export { technicianApi } from "./resources/technician.api";
export { jobSheetApi } from "./resources/jobSheet.api";
export { trayApi } from "./resources/tray.api";
export { modelBrandApi } from "./resources/modelBrand.api";
export { complaintApi } from "./resources/complaint.api";
export { vendorApi } from "./resources/vendor.api";
export { salesPersonApi } from "./resources/salesPerson.api";
export { healthApi } from "./resources/health.api";

// Export job sheet query params type
export type { JobSheetQueryParams } from "./resources/jobSheet.api";

/**
 * Main API Object
 * Provides backward compatibility with existing code
 * 
 * @example
 * import { crmApi } from '@/api';
 * 
 * // Get all clients
 * const response = await crmApi.client.getAll();
 * 
 * // Create a job sheet
 * await crmApi.jobSheet.create(data);
 */
export const crmApi = {
  client: clientApi,
  technician: technicianApi,
  jobSheet: jobSheetApi,
  tray: trayApi,
  model: modelBrandApi,
  complaint: complaintApi,
  vendor: vendorApi,
  salesPerson: salesPersonApi,
  health: healthApi,
  auth: authApi,
};

// Default export for convenience
export default crmApi;

