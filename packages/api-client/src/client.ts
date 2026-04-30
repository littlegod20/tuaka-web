import axios from 'axios'

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
  const hostname = window.location.hostname
  const subdomain = hostname.includes('.') ? hostname.split('.')[0] : 'local'

  config.headers['X-Tenant'] = subdomain
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tuaka_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
