import { useMutation } from '@tanstack/react-query'
import apiClient from './client'

interface LoginPayload  { email: string; password: string }
interface LoginResponse { token: string; user: { id: string; email: string; role: string } }

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (data) =>
      apiClient.post('/api/v1/login', data).then((r) => r.data),
    onSuccess: ({ token }) => {
      localStorage.setItem('tuaka_token', token)
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: () => apiClient.post('/api/v1/logout'),
    onSuccess: () => {
      localStorage.removeItem('tuaka_token')
      window.location.href = '/login'
    },
  })
}
