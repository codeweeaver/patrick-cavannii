const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Custom API Fetch Helper
 * @param {string} endpoint - The resource path (e.g., '/products')
 * @param {object} options - Custom fetch options (method, body, headers)
 */
export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await window.fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Something went wrong with the request');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // json-server returns an empty object or null for 204 No Content (DELETE)
    return response.status === 204 ? {} : await response.json();
  } catch (error) {
    console.error(`API Error:`, error);
    return Promise.reject(error);
  }
}

// Convenience methods
apiClient.get = (endpoint, customConfig) => apiClient(endpoint, { ...customConfig, method: 'GET' });
apiClient.post = (endpoint, body, customConfig) =>
  apiClient(endpoint, { ...customConfig, method: 'POST', body });
apiClient.patch = (endpoint, body, customConfig) =>
  apiClient(endpoint, { ...customConfig, method: 'PATCH', body });
apiClient.delete = (endpoint, customConfig) =>
  apiClient(endpoint, { ...customConfig, method: 'DELETE' });
