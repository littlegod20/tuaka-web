import { useNavigate, useSearchParams } from 'react-router-dom'
import { useInviteDetails, useAcceptInvite } from '@tuaka/api-client'
import { Button, Input } from '@tuaka/ui'
import { useForm } from '../../hooks/useForm'
import { useState } from 'react'

export function AcceptInvitePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const { data: invite, isLoading, isError, error } = useInviteDetails(token)
  const { mutate: acceptInvite, isPending } = useAcceptInvite(token)
  const { values, handleChange } = useForm({ name: '', password: '' })

  const [formError, setFormError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    acceptInvite(values, {
      onSuccess: (data) => {
        localStorage.setItem('tuaka_token', data.token)
        navigate('/dashboard', { replace: true })
      },
      onError: (err: any) =>
        setFormError(err?.response?.data?.message ?? 'Failed to accept invite.'),
    })
  }

  if (!token) {
    return <InviteError message="Invalid invitation link." />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError) {
    const msg = (error as any)?.response?.data?.message ?? 'Invalid or expired invitation.'
    return <InviteError message={msg} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-logo text-gray-900 dark:text-gray-100">
            Tua<span className="text-brand-600">Ka</span>
          </span>
          <p className="mt-2 text-sm text-gray-500">
            You've been invited to join
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
            {invite?.tenant_name}
          </p>
          <span className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
            invite?.role === 'admin'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {invite?.role}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6">
          <p className="text-sm text-gray-500 mb-4">
            Set up your account to accept the invitation.
          </p>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              required
              autoFocus
              label="Your name"
              name="name"
              placeholder="Kofi Mensah"
              value={values.name}
              onChange={handleChange}
            />
            <Input
              required
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              value={values.password}
              onChange={handleChange}
            />
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Joining as <span className="font-medium text-gray-700 dark:text-gray-300">{invite?.email}</span>
              </p>
            </div>

            {formError && (
              <p className="text-sm text-red-500">{formError}</p>
            )}

            <Button className="w-full mt-1" loading={isPending} type="submit">
              Accept & join workspace
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function InviteError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">🔗</div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Invalid invitation
        </h1>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  )
}