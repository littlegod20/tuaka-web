import axios from 'axios'

import { notifyGlobalApiError } from './errors'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tuaka_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // extract subdomain: acme.tuaka.app → 'acme'
  // locally: localhost → 'local' (handled by Laravel .env DEV_TENANT)
  const hostname = window.location.hostname;
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1'
  
  if (isLocalDev) {
    // Local dev — use subdomain or 'local'
    const subdomain = hostname.includes('.') ? hostname.split('.')[0] : 'local'
    config.headers['X-Tenant'] = subdomain
  } else {
    // Production — use stored tenant slug from login
    const tenantSlug = localStorage.getItem('tuaka_tenant_slug')
    if (tenantSlug) {
      config.headers['X-Tenant'] = tenantSlug
    }
  }

  return config

})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tuaka_token')
    }
    notifyGlobalApiError(error)
    return Promise.reject(error)
  },
)

export default apiClient
