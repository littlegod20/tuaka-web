import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import type { Tenant } from './types'

export interface TenantUpdatePayload {
  name?: string
  invoice_prefix?: string
  currency?: string
  timezone?: string
  address?: string
  phone?: string
  website?: string
}

export function useTenant() {
  return useQuery<Tenant>({
    queryKey: ['tenant'],
    queryFn: () => apiClient.get('/api/v1/tenant').then((r) => r.data),
  })
}

export function useUpdateTenant() {
  const queryClient = useQueryClient()
  return useMutation<Tenant, Error, TenantUpdatePayload>({
    mutationFn: (data) =>
      apiClient.put('/api/v1/tenant', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}