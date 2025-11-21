// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://hrms-backend-q8zb.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  logout: () => api.post("/auth/logout"),
};

export const employeeAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/employees");
      console.log("Employees API Response:", response.data);

      // Handle different response structures
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.employees)) {
        return response.data.employees;
      }

      console.warn("Unexpected employees response structure:", response.data);
      return [];
    } catch (error) {
      console.error("Employees API Error:", error);
      throw error;
    }
  },
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  assignToTeam: (employeeId, teamId) =>
    api.post(`/employees/${employeeId}/teams/${teamId}`),
  removeFromTeam: (employeeId, teamId) =>
    api.delete(`/employees/${employeeId}/teams/${teamId}`),
};

export const teamAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/teams");
      console.log("Teams API Response:", response.data);

      // Handle different response structures
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data && Array.isArray(response.data.teams)) {
        return response.data.teams;
      }

      console.warn("Unexpected teams response structure:", response.data);
      return [];
    } catch (error) {
      console.error("Teams API Error:", error);
      throw error;
    }
  },
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post("/teams", data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  getMembers: (id) => api.get(`/teams/${id}/members`),
};
/*
// ADD THIS: Audit API endpoints
export const auditAPI = {
  getLogs: (params) => api.get("/audit/logs", { params }),
  getStats: (params) => api.get("/audit/stats", { params }),
};
*/

//

// In frontend/src/services/api.js - auditAPI section
export const auditAPI = {
  getLogs: async (params) => {
    try {
      console.log("🔍 Fetching audit logs with params:", params);
      const response = await api.get("/audit/logs", { params });
      console.log("📄 Audit logs response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Audit logs API error:", error);
      throw error;
    }
  },
  getStats: async (params) => {
    try {
      console.log("📊 Fetching audit stats with params:", params);
      const response = await api.get("/audit/stats", { params });
      console.log("📈 Audit stats response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Audit stats API error:", error);
      throw error;
    }
  },
};

export default api;
