import { apiClient } from '@tuaka/api-client'

// On app boot, set the admin token if it exists
const token = localStorage.getItem('tuaka_admin_token')
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Admin requests go to the same base URL but have no X-Tenant header
delete apiClient.defaults.headers.common['X-Tenant']

export { apiClient }