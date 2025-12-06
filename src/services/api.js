const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080'

const buildHeaders = (token, extra = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extra
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText
    throw new Error(message)
  }

  return data
}

const request = async (path, { method = 'GET', body, token } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined
  })
  return handleResponse(response)
}

export const authApi = {
  login: (email, password) => request('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  }),
  signup: (name, email, password) => request('/api/auth/signup', {
    method: 'POST',
    body: { name, email, password }
  }),
  me: (token) => request('/api/auth/me', { token })
}

export const productApi = {
  list: () => request('/api/products'),
  create: (token, payload) => request('/api/products', {
    method: 'POST',
    body: payload,
    token
  }),
  update: (token, id, payload) => request(`/api/products/${id}`, {
    method: 'PUT',
    body: payload,
    token
  }),
  remove: (token, id) => request(`/api/products/${id}`, {
    method: 'DELETE',
    token
  })
}

export const orderApi = {
  list: (token) => request('/api/orders', { token }),
  create: (token, payload) => request('/api/orders', {
    method: 'POST',
    body: payload,
    token
  }),
  adminList: (token) => request('/api/orders/admin', { token }),
  updateStatus: (token, id, status) => request(`/api/orders/${id}/status`, {
    method: 'PUT',
    body: { status },
    token
  })
}

export const categoryApi = {
  list: () => request('/api/categories'),
  create: (token, payload) => request('/api/categories', {
    method: 'POST',
    body: payload,
    token
  }),
  remove: (token, id) => request(`/api/categories/${id}`, {
    method: 'DELETE',
    token
  })
}

export const cartApi = {
  get: (token) => request('/api/cart', { token }),
  save: (token, items) => request('/api/cart', {
    method: 'PUT',
    body: { items },
    token
  }),
  clear: (token) => request('/api/cart', {
    method: 'DELETE',
    token
  })
}

export const userApi = {
  list: (token) => request('/api/users', { token }),
  updateRole: (token, id, role) => request(`/api/users/${id}/role`, {
    method: 'PUT',
    body: { role },
    token
  }),
  remove: (token, id) => request(`/api/users/${id}`, {
    method: 'DELETE',
    token
  })
}

export const healthApi = {
  check: () => request('/api/health')
}
