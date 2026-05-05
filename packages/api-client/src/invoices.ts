import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import type { Invoice, InvoiceItem, PaginatedResponse } from './types'

// ─── Types ────────────────────────────────────────────────────────────────

export interface InvoiceItemPayload {
  id?: string
  product_id?: string
  description: string
  quantity: number
  unit_price: number  // pesewas
}

export interface InvoicePayload {
  client_id: string
  type?: 'invoice' | 'quote'
  tax_rate?: number
  notes?: string
  due_date?: string
  items: InvoiceItemPayload[]
}

export interface InvoicesParams {
  status?: string
  type?: string
  search?: string
  page?: number
}

// ─── List ─────────────────────────────────────────────────────────────────

export function useInvoices(params: InvoicesParams = {}) {
  return useQuery<PaginatedResponse<Invoice>>({
    queryKey: ['invoices', params],
    queryFn: () =>
      apiClient.get('/api/v1/invoices', { params }).then((r) => r.data),
  })
}

// ─── Single ───────────────────────────────────────────────────────────────

export function useInvoice(id: string) {
  return useQuery<Invoice>({
    queryKey: ['invoices', id],
    queryFn: () =>
      apiClient.get(`/api/v1/invoices/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

// ─── Create ───────────────────────────────────────────────────────────────

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation<Invoice, Error, InvoicePayload>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/invoices', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })
}

// ─── Update ───────────────────────────────────────────────────────────────

export function useUpdateInvoice(id: string) {
  const qc = useQueryClient()
  return useMutation<Invoice, Error, Partial<InvoicePayload>>({
    mutationFn: (data) =>
      apiClient.patch(`/api/v1/invoices/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['invoices', id] })
    },
  })
}

// ─── Delete ───────────────────────────────────────────────────────────────

export function useDeleteInvoice() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      apiClient.delete(`/api/v1/invoices/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })
}

// ─── Send ─────────────────────────────────────────────────────────────────

export function useSendInvoice() {
  const qc = useQueryClient()
  return useMutation<{ message: string; invoice: Invoice }, Error, string>({
    mutationFn: (id) =>
      apiClient.post(`/api/v1/invoices/${id}/send`).then((r) => r.data),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['invoices', id] })
    },
  })
}

// ─── Mark paid ────────────────────────────────────────────────────────────

export function useMarkPaid() {
  const qc = useQueryClient()
  return useMutation<{ message: string; invoice: Invoice }, Error, string>({
    mutationFn: (id) =>
      apiClient.post(`/api/v1/invoices/${id}/mark-paid`).then((r) => r.data),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['invoices'] })
      qc.invalidateQueries({ queryKey: ['invoices', id] })
    },
  })
}

// ─── Convert quote → invoice ──────────────────────────────────────────────

export function useConvertQuote() {
  const qc = useQueryClient()
  return useMutation<{ message: string; invoice: Invoice }, Error, string>({
    mutationFn: (id) =>
      apiClient.post(`/api/v1/invoices/${id}/convert`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  })
}


// ─── Public view (token-based, no auth) ──────────────────────────────────

export interface PublicInvoice extends Invoice {
  tenant: {
    id: string
    name: string
    slug: string
    currency: string
    invoice_prefix: string
    address: string | null
    phone: string | null
    website: string | null
  }
}

export function usePublicInvoice(token: string) {
  return useQuery<PublicInvoice>({
    queryKey: ['public-invoice', token],
    queryFn: () =>
      apiClient.get(`api/inv/${token}`).then((r) => r.data),
    enabled: !!token,
    retry: false,
  })
}