import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import type { Client, PaginatedResponse } from './types'

// ─── List ─────────────────────────────────────────────────────────────────

interface ClientsParams {
  search?: string
  page?: number
}

export function useClients(params: ClientsParams = {}) {
  return useQuery<PaginatedResponse<Client>>({
    queryKey: ['clients', params],
    queryFn: () =>
      apiClient
        .get('/api/v1/clients', { params })
        .then((r) => r.data),
  })
}

// ─── Single ───────────────────────────────────────────────────────────────

export function useClient(id: string) {
  return useQuery<Client>({
    queryKey: ['clients', id],
    queryFn: () => apiClient.get(`/api/v1/clients/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

// ─── Create ───────────────────────────────────────────────────────────────

export interface ClientPayload {
  name: string
  email?: string
  phone?: string
  address?: string
  company?: string
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation<Client, Error, ClientPayload>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/clients', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

// ─── Update ───────────────────────────────────────────────────────────────

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient()
  return useMutation<Client, Error, Partial<ClientPayload>>({
    mutationFn: (data) =>
      apiClient.patch(`/api/v1/clients/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

// ─── Delete ───────────────────────────────────────────────────────────────

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      apiClient.delete(`/api/v1/clients/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

// ─── Bulk delete ──────────────────────────────────────────────────────────

export interface BulkDestroyClientsResponse {
  deleted_count: number
  deleted_ids: string[]
  failed: { id: string; message: string }[]
}

export function useBulkDestroyClients() {
  const queryClient = useQueryClient()
  return useMutation<BulkDestroyClientsResponse, Error, string[]>({
    mutationFn: (ids) =>
      apiClient
        .post<BulkDestroyClientsResponse>('/api/v1/clients/bulk-destroy', {
          ids,
        })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}