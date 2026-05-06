import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  is_active: boolean
  invited_at: string | null
  created_at: string
}

export interface PendingInvite {
  id: string
  email: string
  role: string
  invited_by: string
  expires_at: string
  is_pending: true
}

export interface TeamData {
  members: TeamMember[]
  pending: PendingInvite[]
}

export interface InviteDetails {
  email: string
  role: string
  tenant_name: string
  expires_at: string
}

// ─── Team list ────────────────────────────────────────────────────────────

export function useTeam() {
  return useQuery<TeamData>({
    queryKey: ['team'],
    queryFn: () => apiClient.get('/api/v1/team').then((r) => r.data),
  })
}

// ─── Invite ───────────────────────────────────────────────────────────────

export function useInviteMember() {
  const qc = useQueryClient()
  return useMutation
    <{ message: string },
    Error,
    { email: string; role: 'admin' | 'member' }
  >({
    mutationFn: (data) =>
      apiClient.post('/api/v1/team/invite', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  })
}

// ─── Revoke invite ────────────────────────────────────────────────────────

export function useRevokeInvite() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      apiClient.delete(`/api/v1/team/invite/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  })
}

// ─── Update role ──────────────────────────────────────────────────────────

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation
    <{ message: string },
    Error,
    { userId: string; role: 'admin' | 'member' }
  >({
    mutationFn: ({ userId, role }) =>
      apiClient.patch(`/api/v1/team/${userId}/role`, { role }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  })
}

// ─── Remove member ────────────────────────────────────────────────────────

export function useRemoveMember() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (userId) =>
      apiClient.delete(`/api/v1/team/${userId}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  })
}

// ─── Transfer ownership ───────────────────────────────────────────────────

export function useTransferOwnership() {
  const qc = useQueryClient()
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (userId) =>
      apiClient.post('/api/v1/team/transfer', { user_id: userId }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['team'] })
      qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// ─── Get invite details (public) ─────────────────────────────────────────

export function useInviteDetails(token: string) {
  return useQuery<InviteDetails>({
    queryKey: ['invite', token],
    queryFn: () =>
      apiClient.get(`/api/v1/invite/${token}`).then((r) => r.data),
    enabled: !!token,
    retry: false,
  })
}

// ─── Accept invite (public) ───────────────────────────────────────────────

export function useAcceptInvite(token: string) {
  return useMutation
    <{ message: string; token: string },
    Error,
    { name: string; password: string }
  >({
    mutationFn: (data) =>
      apiClient
        .post(`/api/v1/invite/${token}/accept`, data)
        .then((r) => r.data),
  })
}