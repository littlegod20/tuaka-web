import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from './client'

export interface InitiatePaymentPayload {
  phone: string
  network: 'mtn' | 'vodafone' | 'tigo'
  email: string
}

export interface InitiatePaymentResponse {
  message: string
  reference: string
  status: string
  display_text: string | null
}

export interface PaymentStatusResponse {
  status: 'pending' | 'completed' | 'failed'
  paid: boolean
}

export function useInitiatePayment(token: string) {
  return useMutation<InitiatePaymentResponse, Error, InitiatePaymentPayload>({
    mutationFn: (data) =>
      apiClient.post(`/api/inv/${token}/pay`, data).then((r) => r.data),
  })
}

export function usePaymentStatus(
  token: string,
  reference: string,
  enabled: boolean,
) {
  return useQuery<PaymentStatusResponse>({
    queryKey: ['payment-status', reference],
    queryFn: () =>
      apiClient
        .get(`/api/inv/${token}/payment-status/${reference}`)
        .then((r) => r.data),
    enabled: enabled && !!reference,
    refetchInterval: (query) => {
      // Poll every 3 seconds while pending, stop when resolved
      const data = query.state.data
      if (data?.status === 'pending') return 3000
      return false
    },
  })
}