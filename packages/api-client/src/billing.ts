import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import type { Plan, SubscriptionInfo } from './types'

// ─── Plans ────────────────────────────────────────────────────────────────

export function usePlans() {
  return useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: () => apiClient.get('/api/v1/billing/plans').then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  })
}

// ─── Current subscription ─────────────────────────────────────────────────

export function useCurrentSubscription() {
  return useQuery<SubscriptionInfo>({
    queryKey: ['subscription'],
    queryFn: () => apiClient.get('/api/v1/billing/current').then((r) => r.data),
  })
}

// ─── Subscribe ────────────────────────────────────────────────────────────

export function useSubscribe() {
  return useMutation
    <{ authorization_url: string; reference: string }, Error, { plan_slug: string; email: string }>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/billing/subscribe', data).then((r) => r.data),
  })
}

// ─── Verify payment ───────────────────────────────────────────────────────

export function useVerifyBillingPayment() {
  const qc = useQueryClient()
  return useMutation<{ message: string }, Error, { reference: string }>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/billing/verify', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription'] })
      qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// ─── Cancel ───────────────────────────────────────────────────────────────

export function useCancelSubscription() {
  const qc = useQueryClient()
  return useMutation<{ message: string; period_ends_at: string }, Error, void>({
    mutationFn: () =>
      apiClient.post('/api/v1/billing/cancel').then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription'] })
      qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}