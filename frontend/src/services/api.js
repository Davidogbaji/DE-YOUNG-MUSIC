import { API_BASE_URL } from '../config';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, delete Content-Type to let the browser set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error?.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the store server. The server may be waking up or temporarily offline.');
    }
    throw err;
  }
}

export const api = {
  // Public
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/products${qs}`);
  },

  getProduct: (idOrSlug) => request(`/api/products/${idOrSlug}`),
  getCategories: () => request('/api/categories'),
  getSettings: () => request('/api/settings'),
  createOrder: (orderData) => request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  getOrder: (orderNumber) => request(`/api/orders/${orderNumber}`),

  // Auth
  login: (email, password) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  getMe: () => request('/api/auth/me'),

  changePassword: (currentPassword, newPassword) => request('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  }),

  // Admin Products
  createProduct: (data) => request('/api/products', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateProduct: (id, data) => request(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  updateStock: (id, stock) => request(`/api/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ stock })
  }),

  deleteProduct: (id) => request(`/api/products/${id}`, {
    method: 'DELETE'
  }),

  resetDemoProducts: () => request('/api/products/reset-demo', {
    method: 'POST'
  }),

  // Admin Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/orders${qs}`);
  },

  updateOrderStatus: (id, status) => request(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // Admin Settings
  updateSettings: (settings) => request('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  }),

  // Upload image file
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/api/upload', {
      method: 'POST',
      body: formData
    });
  }
};
