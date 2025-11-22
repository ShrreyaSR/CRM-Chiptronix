import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080", 
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

const client = {
  getAll: (params?: any) => axiosClient.get("/clients", { params }),
  getById: (id: number) => axiosClient.get(`/clients/${id}`),
  create: (data: any) => axiosClient.post("/clients", data),
  update: (id: number, data: any) => axiosClient.put(`/clients/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/clients/${id}`),
};

const technician = {
  getAll: (params?: any) => axiosClient.get("/technicians", { params }),
  getById: (id: number) => axiosClient.get(`/technicians/${id}`),
  create: (data: any) => axiosClient.post("/technicians", data),
  update: (id: number, data: any) => axiosClient.put(`/technicians/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/technicians/${id}`),
};

const jobSheet = {
  getAll: (params?: any) => axiosClient.get("/jobsheets", { params }),
  getById: (id: number) => axiosClient.get(`/jobsheets/${id}`),
  create: (data: any) => axiosClient.post("/jobsheets", data),
  update: (id: number, data: any) => axiosClient.put(`/jobsheets/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/jobsheets/${id}`),
};

const model = {
//   getAllBrands: () => axiosClient.get("/model-brands"),
//   createBrand: (data: any) => axiosClient.post("/model-brands", data),
//   updateBrand: (id: number, data: any) => axiosClient.put(`/model-brands/${id}`, data),
//   deleteBrand: (id: number) => axiosClient.delete(`/model-brands/${id}`),

  getAllModels: (params?: any) => axiosClient.get("/model-brands", { params }),
  createModel: (data: any) => axiosClient.post("/model-brands", data),
  updateModel: (id: number, data: any) => axiosClient.put(`/model-brands/${id}`, data),
  deleteModel: (id: number) => axiosClient.delete(`/model-brands/${id}`),
};

const tray = {
  getAll: (params?: any) => axiosClient.get("/trays", { params }),
  create: (data: any) => axiosClient.post("/trays", data),
  update: (id: number, data: any) => axiosClient.patch(`/trays/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/trays/${id}`),
  bulkAdd: (data: any) => axiosClient.post("/trays/bulk", data)
};

const complaint = {
  getAll: (params?: any) => axiosClient.get("/complaints", { params }),
  create: (data: any) => axiosClient.post("/complaints", data),
  update: (id: number, data: any) => axiosClient.put(`/complaints/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/complaints/${id}`),
};

export const crmApi = {
  client,
  technician,
  jobSheet,
  model,
  tray,
  complaint,
};

export default crmApi;
