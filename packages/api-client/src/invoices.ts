import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import apiClient from './client'
import type { Invoice, PaginatedResponse } from './types'

export function useInvoices(params?: { status?: string; page?: number }) {
  return useQuery<PaginatedResponse<Invoice>>({
    queryKey: ['invoices', params],
    queryFn: () => apiClient.get('/api/v1/invoices', { params }).then((r) => r.data),
  })
}

export function useInvoice(id: string) {
  return useQuery<Invoice>({
    queryKey: ['invoices', id],
    queryFn: () => apiClient.get(`/api/v1/invoices/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Invoice>) =>
      apiClient.post('/api/v1/invoices', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })
}

export function useSendInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/api/v1/invoices/${id}/send`).then((r) => r.data),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['invoices', id] })
    },
  })
}

export function useMarkPaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post(`/api/v1/invoices/${id}/mark-paid`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })
}
