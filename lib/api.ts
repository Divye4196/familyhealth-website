import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH =====
export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

// ===== FAMILY MEMBERS =====
export const familyAPI = {
  getAll: () => api.get('/family'),
  getOne: (id: string) => api.get(`/family/${id}`),
  add: (data: any) => api.post('/family', data),
  update: (id: string, data: any) => api.put(`/family/${id}`, data),
  delete: (id: string) => api.delete(`/family/${id}`)
};

// ===== HEALTH RECORDS =====
export const healthAPI = {
  getByMember: (memberId: string, type?: string) =>
    api.get(`/health/${memberId}`, { params: { type } }),
  getLatest: (memberId: string) => api.get(`/health/${memberId}/latest`),
  add: (data: any) => api.post('/health', data),
  delete: (id: string) => api.delete(`/health/${id}`)
};

// ===== MEDICINES =====
export const medicineAPI = {
  getByMember: (memberId: string, active?: boolean) =>
    api.get(`/medicines/${memberId}`, { params: { active } }),
  getToday: () => api.get('/medicines/today/all'),
  add: (data: any) => api.post('/medicines', data),
  update: (id: string, data: any) => api.put(`/medicines/${id}`, data),
  delete: (id: string) => api.delete(`/medicines/${id}`)
};

// ===== DOCTORS =====
export const doctorAPI = {
  getAll: () => api.get('/doctors'),
  getOne: (id: string) => api.get(`/doctors/${id}`),
  add: (data: any) => api.post('/doctors', data),
  update: (id: string, data: any) => api.put(`/doctors/${id}`, data),
  delete: (id: string) => api.delete(`/doctors/${id}`)
};

// ===== APPOINTMENTS =====
export const appointmentAPI = {
  getAll: (status?: string) => api.get('/appointments', { params: { status } }),
  getUpcoming: () => api.get('/appointments/upcoming'),
  add: (data: any) => api.post('/appointments', data),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`)
};

// ===== VACCINATIONS =====
export const vaccinationAPI = {
  getByMember: (memberId: string) => api.get(`/vaccinations/${memberId}`),
  getDue: () => api.get('/vaccinations/due/all'),
  add: (data: any) => api.post('/vaccinations', data),
  update: (id: string, data: any) => api.put(`/vaccinations/${id}`, data),
  delete: (id: string) => api.delete(`/vaccinations/${id}`)
};

// ===== REPORTS =====
export const reportAPI = {
  getAll: () => api.get('/reports/all'),
  getByMember: (memberId: string, type?: string) =>
    api.get(`/reports/${memberId}`, { params: { type } }),
  upload: (formData: FormData) =>
    api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id: string) => api.delete(`/reports/${id}`)
};

// ===== EMERGENCY =====
export const emergencyAPI = {
  getOverview: () => api.get('/emergency/overview'),
  getContacts: () => api.get('/emergency/contacts'),
  addContact: (data: any) => api.post('/emergency/contacts', data),
  deleteContact: (id: string) => api.delete(`/emergency/contacts/${id}`)
};

export default api;