import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

/**
 * Axios request interceptor to automatically add the
 * Authorization header to every request.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Allow requests to bypass the auth logic by setting `includeAuth: false`
    if (config.includeAuth === false) {
      return config;
    }

    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Could not parse user from storage', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
