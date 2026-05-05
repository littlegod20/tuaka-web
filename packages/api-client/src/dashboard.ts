import { useQuery } from '@tanstack/react-query'
import apiClient from './client'

export interface DashboardStats {
  total_revenue: number
  outstanding: number
  draft_count: number
  paid_this_month: number
  overdue_count: number
  client_count: number
}

export interface RevenueMonth {
  month: string
  revenue: number
}

export interface DashboardRecentInvoice {
  id: string
  number: string
  status: string
  total: number
  due_date: string | null
  created_at: string
  client: { name: string }
}

export interface DashboardData {
  stats: DashboardStats
  revenue_chart: RevenueMonth[]
  recent_invoices: DashboardRecentInvoice[]
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () =>
      apiClient.get('/api/v1/dashboard').then((r) => r.data),
    staleTime: 1000 * 60 * 2, // 2 min
  })
}