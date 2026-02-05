    import axios from 'axios';

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Create an Axios instance
    const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    });

    /**
     * Request Interceptor
     * Automatically injects the token and handles prefix logic
     */
    apiClient.interceptors.request.use(
    (config) => {
        // 1. Check if auth is required for this request (default: true)
        if (config.includeAuth === false) return config;

        const tokenStr = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (tokenStr) {
        try {
            const token = JSON.parse(tokenStr);
            if (token) {
            /**
             * 2. Support for dynamic prefixes.
             * Defaults to 'Token' (based on your previous server error),
             * but allows 'Bearer' if specified in the request config.
             */
            const prefix = config.authPrefix || 'Token';
            config.headers.Authorization = `${prefix} ${token}`;
            }
        } catch (e) {
            console.error('Error parsing token from storage', e);
        }
        }
        return config;
    },
    (error) => Promise.reject(error),
    );

    /**
     * Response Interceptor
     * Standardizes error handling (extracting 'detail' or 'message')
     */
    apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extract meaningful error messages from common backend formats
        const errorData = error.response?.data;
        const message = errorData?.detail || errorData?.message || error.message || 'An error occurred';

        // Attach the cleaned message to the error object
        error.message = message;

        if (error.response?.status === 401) {
        console.warn('Unauthorized! Token may be invalid or expired.');
        }

        return Promise.reject(error);
    },
    );

    /**
     * Custom wrapper to match your existing helper signatures
     */
    const api = {
    get: (url, params, config = {}) => apiClient.get(url, { params, ...config }),

    post: (url, data, config = {}) => apiClient.post(url, data, config),

    put: (url, data, config = {}) => apiClient.put(url, data, config),

    patch: (url, data, config = {}) => apiClient.patch(url, data, config),

    delete: (url, config = {}) => apiClient.delete(url, config),
    };

    export default api;
