import axios from 'axios';

// **CORRECCIÓN: Usar la URL correcta para desarrollo**
const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000/api' 
  : '/api';

console.log('🔧 Configuración API:', {
  mode: import.meta.env.MODE,
  baseURL: API_BASE_URL
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🚀 Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });

    if (error.response?.status === 401) {
      console.log('🔐 Token inválido, limpiando localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Manejar error de conexión
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      console.error('💥 Error de conexión: El servidor backend no está disponible');
      return Promise.reject({
        message: 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose en el puerto 5000.',
        code: 'CONNECTION_ERROR'
      });
    }

    return Promise.reject(error.response?.data || error);
  }
);

// Servicios de Autenticación
export const authAPI = {
  login: (credentials) => {
    console.log('🔐 Login attempt:', credentials);
    return api.post('/auth/login', credentials);
  },
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Servicios de Eventos
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
  getCategories: (eventId) => api.get(`/events/${eventId}/categories`),
  registerToEvent: (registrationData) => api.post('/events/register', registrationData),
  getOrganizerEvents: () => api.get('/events/organizer/mine'),
};

// Servicios de Usuarios
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getUserEvents: () => api.get('/users/my-events'),
  getUserRegistrations: () => api.get('/users/my-registrations'),
  getUserResults: () => api.get('/users/my-results'),
};

// Servicios de Equipos
export const teamsAPI = {
  getAll: () => api.get('/teams'),
  create: (teamData) => api.post('/teams', teamData),
  update: (id, teamData) => api.put(`/teams/${id}`, teamData),
  delete: (id) => api.delete(`/teams/${id}`),
  join: (inviteCode) => api.post('/teams/join', { inviteCode }),
  getMyTeams: () => api.get('/teams/my-teams'),
  getById: (id) => api.get(`/teams/${id}`),
};

// Servicios de Inscripciones
export const registrationsAPI = {
  getAll: () => api.get('/registrations'),
  getTallas: () => api.get('/registrations/tallas'),
  delete: (id) => api.delete(`/registrations/${id}`),
};

// Servicios de Consultas
export const queriesAPI = {
  getStats: () => api.get('/queries/stats'),
  getUserStats: () => api.get('/queries/users-stats'),
  getEventStats: () => api.get('/queries/events-stats'),
  getTopOrganizers: () => api.get('/queries/top-organizadores'),
  getEventDetails: (id) => api.get(`/queries/event-details/${id}`),
};

export default api;