import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import type { Product, PaginatedResponse } from './types'

// ─── List ─────────────────────────────────────────────────────────────────

interface ProductsParams {
  search?: string
  page?: number
}

export function useProducts(params: ProductsParams = {}) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', params],
    queryFn: () =>
      apiClient.get('/api/v1/products', { params }).then((r) => r.data),
  })
}

// ─── Single ───────────────────────────────────────────────────────────────

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: () =>
      apiClient.get(`/api/v1/products/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}

// ─── Create ───────────────────────────────────────────────────────────────

export interface ProductPayload {
  name: string
  description?: string
  default_price: number // in pesewas
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation<Product, Error, ProductPayload>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/products', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// ─── Update ───────────────────────────────────────────────────────────────

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient()
  return useMutation<Product, Error, Partial<ProductPayload>>({
    mutationFn: (data) =>
      apiClient.patch(`/api/v1/products/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// ─── Delete ───────────────────────────────────────────────────────────────

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      apiClient.delete(`/api/v1/products/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// ─── Bulk delete ──────────────────────────────────────────────────────────

export interface BulkDestroyProductsResponse {
  deleted_count: number
  deleted_ids: string[]
  failed: { id: string; message: string }[]
}

export function useBulkDestroyProducts() {
  const queryClient = useQueryClient()
  return useMutation<BulkDestroyProductsResponse, Error, string[]>({
    mutationFn: (ids) =>
      apiClient
        .post<BulkDestroyProductsResponse>('/api/v1/products/bulk-destroy', {
          ids,
        })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}