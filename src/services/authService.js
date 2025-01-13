import api from './api';
import { getAccessToken, getRefreshToken } from '@/utils/token';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Auth service login error:', error);
      throw error;
    }
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  async logout() {
    const token = getAccessToken();
    const response = await api.post('/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response;
  },

  async getProfile() {
    const token = getAccessToken();
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
};