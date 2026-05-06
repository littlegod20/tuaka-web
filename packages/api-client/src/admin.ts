import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'

// ─── Auth ─────────────────────────────────────────────────────────────────

export function useAdminLogin() {
  return useMutation
    <{ token: string; admin: { id: string; name: string; email: string } },
    Error,
    { email: string; password: string }
  >({
    mutationFn: (data) =>
      apiClient.post('/api/v1/admin/login', data).then((r) => r.data),
    onSuccess: ({ token }) => {
      localStorage.setItem('tuaka_admin_token', token)
      // Swap the Authorization header for admin requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
  })
}

export function useAdminLogout() {
  return useMutation({
    mutationFn: () => apiClient.post('/api/v1/admin/logout'),
    onSuccess: () => {
      localStorage.removeItem('tuaka_admin_token')
      window.location.href = '/login'
    },
  })
}

// ─── Dashboard ────────────────────────────────────────────────────────────

export interface AdminStats {
  total_tenants: number
  new_this_month: number
  active_paid: number
  trialing: number
  cancelled: number
  mrr: number
  total_invoices: number
  paid_invoices: number
  total_revenue: number
}

export interface AdminSignupMonth {
  month: string
  count: number
}

export interface AdminRecentTenant {
  id: string
  name: string
  slug: string
  created_at: string
  plan: string
  status: string
}

export interface AdminDashboardData {
  stats: AdminStats
  signup_chart: AdminSignupMonth[]
  recent_tenants: AdminRecentTenant[]
}

export function useAdminDashboard() {
  return useQuery<AdminDashboardData>({
    queryKey: ['admin-dashboard'],
    queryFn: () =>
      apiClient.get('/api/v1/admin/dashboard').then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

// ─── Tenants ──────────────────────────────────────────────────────────────

export interface AdminTenant {
  id: string
  name: string
  slug: string
  currency: string
  created_at: string
  plan: string
  plan_slug: string
  sub_status: string
  trial_ends: string | null
  period_ends: string | null
}

export interface AdminTenantDetail extends AdminTenant {
  member_count: number
  invoice_count: number
  paid_revenue: number
}

export function useAdminTenants(params: { search?: string; status?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ['admin-tenants', params],
    queryFn: () =>
      apiClient.get('/api/v1/admin/tenants', { params }).then((r) => r.data),
  })
}

export function useAdminTenant(id: string) {
  return useQuery<AdminTenantDetail>({
    queryKey: ['admin-tenants', id],
    queryFn: () =>
      apiClient.get(`/api/v1/admin/tenants/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

export function useActivateTenant() {
  const qc = useQueryClient()
  return useMutation
    <{ message: string },
    Error,
    { id: string; plan_slug: string; months?: number }
  >({
    mutationFn: ({ id, ...data }) =>
      apiClient.post(`/api/v1/admin/tenants/${id}/activate`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tenants'] })
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}

export function useDeactivateTenant() {
  const qc = useQueryClient()
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) =>
      apiClient.post(`/api/v1/admin/tenants/${id}/deactivate`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tenants'] })
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}

// ─── Plans ────────────────────────────────────────────────────────────────

export function useAdminPlans() {
  return useQuery({
    queryKey: ['admin-plans'],
    queryFn: () =>
      apiClient.get('/api/v1/admin/plans').then((r) => r.data),
  })
}