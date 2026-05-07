import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import apiClient from './client'
import type { SubscriptionInfo, Tenant, User } from './types'

// ─── Login ────────────────────────────────────────────────────────────────

interface LoginPayload {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: User
  tenant: Tenant
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/login', data).then((r) => r.data),
    onSuccess: ({ token }) => {
      localStorage.setItem('tuaka_token', token)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// ─── Register ─────────────────────────────────────────────────────────────

interface RegisterPayload {
  business_name: string
  slug: string
  name: string
  email: string
  password: string
  password_confirmation: string
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/register', data).then((r) => r.data),
    onSuccess: ({ token }) => {
      localStorage.setItem('tuaka_token', token)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// ─── Me ───────────────────────────────────────────────────────────────────

interface MeResponse {
  user: User
  tenant: Tenant
  subscription: SubscriptionInfo | null
  usage: {
    invoices_this_month: number
    invoice_limit: number
    limit_reached: boolean
  },
  onboarding: {
    has_client: boolean
    has_product: boolean
    has_invoice: boolean
    has_sent: boolean
    complete: boolean
  }
}

export function useMe() {
  return useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: () => apiClient.get('/api/v1/me').then((r) => r.data),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min
    enabled: !!localStorage.getItem('tuaka_token'),
  })
}

// ─── Logout ───────────────────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.post('/api/v1/logout'),
    onSuccess: () => {
      localStorage.removeItem('tuaka_token')
      queryClient.clear()
      window.location.href = '/login'
    },
  })
}

// ─── Forgot Password ──────────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation<{ message: string }, Error, { email: string }>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/forgot-password', data).then((r) => r.data),
  })
}

// ─── Reset Password ───────────────────────────────────────────────────────

interface ResetPasswordPayload {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export function useResetPassword() {
  return useMutation<{ message: string }, Error, ResetPasswordPayload>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/reset-password', data).then((r) => r.data),
  })
}

// ─── Verify Email ─────────────────────────────────────────────────────────

export function useVerifyEmail() {
  const queryClient = useQueryClient()
  return useMutation<{ message: string }, Error, { token: string; email: string }>({
    mutationFn: (data) =>
      apiClient
        .get('/api/v1/verify-email', { params: data })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// ─── Resend Verification ──────────────────────────────────────────────────

export function useResendVerification() {
  return useMutation<{ message: string }, Error, void>({
    mutationFn: () =>
      apiClient.post('/api/v1/email/resend').then((r) => r.data),
  })
}