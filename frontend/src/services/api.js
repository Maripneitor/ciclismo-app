// frontend/src/services/api.js - MEJORADO
import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000/api' 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject({
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      code: error.code
    });
  }
);

// Servicios de Eventos
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  getCategories: (eventId) => api.get(`/events/${eventId}/categories`),
  registerToEvent: (registrationData) => api.post('/registrations', registrationData),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`)
};

// Servicios de Inscripciones
export const registrationsAPI = {
  getAll: () => api.get('/registrations'),
  getMyRegistrations: () => api.get('/registrations/my-registrations'),
  registerForEvent: (data) => api.post('/registrations', data),
  getTallas: () => api.get('/registrations/tallas'),
  getCategorias: (eventoId) => api.get(`/registrations/categorias/${eventoId}`),
  cancelRegistration: (id) => api.delete(`/registrations/${id}`),
  delete: (id) => api.delete(`/registrations/${id}`)
};

// Servicios de Equipos
export const teamsAPI = {
    getAll: () => api.get('/teams'),
    getMyTeams: () => api.get('/teams/my-teams'),
    create: (teamData) => api.post('/teams', teamData),
    join: (inviteData) => api.post('/teams/join', inviteData),
    getById: (id) => api.get(`/teams/${id}`),
    getInviteInfo: (id) => api.get(`/teams/${id}/invite`),
    leave: (teamId) => api.delete(`/teams/${teamId}/leave`),
    delete: (teamId) => api.delete(`/teams/${teamId}`)
};

export const cyclistDataAPI = {
    update: (data) => api.put('/users/cyclist-data', data),
    get: () => api.get('/users/cyclist-data')
};

// Servicios de Autenticación
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/users/profile', profileData)
};

// Servicios de Usuarios
export const usersAPI = {
  getAll: () => api.get('/users'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getMyEvents: () => api.get('/users/my-events'),
  getMyRegistrations: () => api.get('/users/my-registrations')
};

// Servicios de Consultas/Queries
export const queriesAPI = {
  getStats: () => api.get('/queries/stats'),
  getUsersStats: () => api.get('/queries/users-stats'),
  getEventsStats: () => api.get('/queries/events-stats'),
  getTopOrganizers: () => api.get('/queries/top-organizadores'),
  getEventDetails: (eventId) => api.get(`/queries/event-details/${eventId}`)
};

// Servicios para Home/Stats
export const homeAPI = {
  getHomeStats: () => api.get('/queries/stats'),
  getFeaturedEvents: () => api.get('/events?featured=true&limit=3')
};

export default api;