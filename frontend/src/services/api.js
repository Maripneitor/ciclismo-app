import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error.response?.data || error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
  getCategories: (eventId) => api.get(`/events/${eventId}/categories`),
  registerToEvent: (registrationData) => api.post('/events/register', registrationData),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getUserEvents: () => api.get('/users/my-events'),
  getUserRegistrations: () => api.get('/users/my-registrations'),
};

export const teamsAPI = {
  getAll: () => api.get('/teams'),
  create: (teamData) => api.post('/teams', teamData),
  update: (id, teamData) => api.put(`/teams/${id}`, teamData),
  delete: (id) => api.delete(`/teams/${id}`),
  join: (inviteCode) => api.post('/teams/join', { inviteCode }),
  getMyTeams: () => api.get('/teams/my-teams'),
};

export const queriesAPI = {
  getStats: () => api.get('/queries/stats'),
  getUserStats: () => api.get('/queries/users-stats'),
  getEventStats: () => api.get('/queries/events-stats'),
  getTopOrganizers: () => api.get('/queries/top-organizadores'),
  getEventDetails: (id) => api.get(`/queries/event-details/${id}`),
};

export default api;