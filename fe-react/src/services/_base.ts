import axios from 'axios';
import { baseURL, StorageKeys } from '../config';
import { refreshToken } from './auth';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const store: string = localStorage.getItem(StorageKeys.access)!;
    const token = JSON.parse(store);

    if (token) {
      Object.assign(config.headers, {
        Authorization: `Bearer ${token}`,
        'Content-Type': config.headers['Content-Type'] ?? 'application/json',
      });
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response.data?.message;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      errorMessage === 'Please authenticate'
    ) {
      originalRequest._retry = true;
      await refreshToken();
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
