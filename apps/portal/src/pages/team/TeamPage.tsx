import { useState } from 'react'
import {
  useTeam,
  useInviteMember,
  useRevokeInvite,
  useUpdateRole,
  useRemoveMember,
  useTransferOwnership,
  useMe,
  type TeamMember,
  type PendingInvite,
} from '@tuaka/api-client'
import { Button } from '@tuaka/ui'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

const ROLE_STYLES: Record<string, string> = {
  owner:  'bg-amber-50 text-amber-700',
  admin:  'bg-blue-50 text-blue-700',
  member: 'bg-gray-100 text-gray-600',
}

export function TeamPage() {
  const { data: me } = useMe()
  const { data: team, isLoading } = useTeam()

  const { mutate: inviteMember, isPending: inviting } = useInviteMember()
  const { mutate: revokeInvite, isPending: revoking } = useRevokeInvite()
  const { mutate: updateRole,   isPending: updatingRole } = useUpdateRole()
  const { mutate: removeMember, isPending: removing } = useRemoveMember()
  const { mutate: transferOwnership, isPending: transferring } = useTransferOwnership()

  const [showInvite, setShowInvite]         = useState(false)
  const [inviteEmail, setInviteEmail]       = useState('')
  const [inviteRole, setInviteRole]         = useState<'admin' | 'member'>('member')
  const [inviteError, setInviteError]       = useState('')

  const [confirmRemove, setConfirmRemove]           = useState<TeamMember | null>(null)
  const [confirmTransfer, setConfirmTransfer]       = useState<TeamMember | null>(null)
  const [confirmRevoke, setConfirmRevoke]           = useState<PendingInvite | null>(null)

  const myRole   = me?.user.role ?? 'member'
  const isOwner  = myRole === 'owner'
  const isAdmin  = myRole === 'admin'
  const canManage = isOwner || isAdmin

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteError('')
    inviteMember(
      { email: inviteEmail, role: inviteRole },
      {
        onSuccess: () => {
          setShowInvite(false)
          setInviteEmail('')
          setInviteRole('member')
        },
        onError: (err: any) =>
          setInviteError(err?.response?.data?.message ?? 'Failed to send invite.'),
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Team</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {team?.members.length ?? 0} member{team?.members.length === 1 ? '' : 's'}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setShowInvite(true)}>
            + Invite member
          </Button>
        )}
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Members</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {team?.members.map((member) => {
            const isSelf      = member.id === me?.user.id
            const isThisOwner = member.role === 'owner'

            const canRemoveThis =
              canManage &&
              !isSelf &&
              !isThisOwner &&
              !(isAdmin && member.role === 'admin')

            const canChangeRole = isOwner && !isSelf && !isThisOwner
            const canTransfer   = isOwner && !isSelf

            return (
              <div
                key={member.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-600">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.name}
                      {isSelf && (
                        <span className="ml-1.5 text-xs text-gray-400">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_STYLES[member.role]}`}>
                    {member.role}
                  </span>

                  {canChangeRole && (
                    <select
                      className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 outline-none focus:border-brand-400"
                      value={member.role}
                      onChange={(e) =>
                        updateRole({
                          userId: member.id,
                          role: e.target.value as 'admin' | 'member',
                        })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  )}

                  {canTransfer && (
                    <button
                      className="text-xs text-gray-400 hover:text-amber-600 px-2 py-1 rounded transition-colors"
                      onClick={() => setConfirmTransfer(member)}
                    >
                      Transfer ownership
                    </button>
                  )}

                  {canRemoveThis && (
                    <button
                      className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded transition-colors"
                      onClick={() => setConfirmRemove(member)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending invites */}
      {(team?.pending.length ?? 0) > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">
              Pending invites
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {team?.pending.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {invite.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Invited by {invite.invited_by} · expires{' '}
                    {new Date(invite.expires_at).toLocaleDateString('en-GH', {
                      day: 'numeric', month: 'short',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_STYLES[invite.role]}`}>
                    {invite.role}
                  </span>
                  {canManage && (
                    <button
                      className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded transition-colors"
                      onClick={() => setConfirmRevoke(invite)}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite modal */}
      <Modal
        open={showInvite}
        title="Invite team member"
        onClose={() => { setShowInvite(false); setInviteError('') }}
      >
        <form className="flex flex-col gap-4" onSubmit={handleInvite}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              required
              autoFocus
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
              placeholder="colleague@example.com"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
            >
              {isOwner && <option value="admin">Admin</option>}
              <option value="member">Member</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {inviteRole === 'admin'
                ? 'Can manage invoices, clients, settings and invite members. Cannot access billing.'
                : 'Can create and manage invoices and clients.'}
            </p>
          </div>

          {inviteError && (
            <p className="text-sm text-red-500">{inviteError}</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowInvite(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={inviting}>
              Send invite
            </Button>
          </div>
        </form>
      </Modal>

      {/* Remove confirm */}
      <ConfirmDialog
        open={!!confirmRemove}
        title="Remove member"
        message={`Remove ${confirmRemove?.name} from your workspace? They will lose access immediately.`}
        confirmLabel="Remove"
        loading={removing}
        onConfirm={() =>
          removeMember(confirmRemove!.id, {
            onSuccess: () => setConfirmRemove(null),
          })
        }
        onCancel={() => setConfirmRemove(null)}
      />

      {/* Transfer ownership confirm */}
      <ConfirmDialog
        open={!!confirmTransfer}
        title="Transfer ownership"
        message={`Transfer ownership to ${confirmTransfer?.name}? You will become an Admin. This cannot be undone without their cooperation.`}
        confirmLabel="Transfer"
        loading={transferring}
        onConfirm={() =>
          transferOwnership(confirmTransfer!.id, {
            onSuccess: () => setConfirmTransfer(null),
          })
        }
        onCancel={() => setConfirmTransfer(null)}
      />

      {/* Revoke invite confirm */}
      <ConfirmDialog
        open={!!confirmRevoke}
        title="Revoke invitation"
        message={`Revoke the invitation sent to ${confirmRevoke?.email}? The invite link will stop working.`}
        confirmLabel="Revoke"
        loading={revoking}
        onConfirm={() =>
          revokeInvite(confirmRevoke!.id, {
            onSuccess: () => setConfirmRevoke(null),
          })
        }
        onCancel={() => setConfirmRevoke(null)}
      />
    </div>
  )
}