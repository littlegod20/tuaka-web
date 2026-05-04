import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useResetPassword } from '@tuaka/api-client'
import { Button, Input } from '@tuaka/ui'
import { useForm } from '../hooks/useForm'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  const { mutate: resetPassword, isPending } = useResetPassword()
  const { values, handleChange } = useForm({
    password: '',
    password_confirmation: '',
  })

  const [done, setDone] = useState(false)
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})
  const [apiMessage, setApiMessage] = useState('')

  // Bad link — token or email missing
  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Invalid link</h1>
          <p className="text-sm text-gray-500 mb-6">
            This reset link is missing required information.
          </p>
          <Link className="text-sm text-brand-500 hover:underline" to="/forgot-password">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiErrors({})
    setApiMessage('')

    resetPassword(
      { email, token, ...values },
      {
        onSuccess: () => setDone(true),
        onError: (err: any) => {
          setApiErrors(err?.response?.data?.errors ?? {})
          setApiMessage(err?.response?.data?.message ?? 'Something went wrong.')
        },
      },
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Password updated</h1>
          <p className="text-sm text-gray-500 mb-6">
            Your password has been reset. You can now sign in with your new password.
          </p>
          <Link
            className="inline-block bg-brand-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
            to="/login"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-logo text-gray-900">
            Tua<span className="text-brand-400">Ka</span>
          </span>
          <p className="mt-2 text-sm text-gray-500">Choose a new password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              required
              autoFocus
              label="New password"
              name="password"
              passwordToggle
              type="password"
              placeholder="Min. 8 characters"
              value={values.password}
              error={apiErrors.password?.[0]}
              onChange={handleChange}
            />
            <Input
              required
              label="Confirm password"
              name="password_confirmation"
              passwordToggle
              type="password"
              placeholder="••••••••"
              value={values.password_confirmation}
              onChange={handleChange}
            />

            {apiMessage && !Object.keys(apiErrors).length && (
              <p className="text-sm text-red-500 text-center">{apiMessage}</p>
            )}

            <Button className="w-full mt-2" loading={isPending} type="submit">
              Reset password
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link className="text-brand-500 hover:underline" to="/forgot-password">
            Request a new link
          </Link>
        </p>
      </div>
    </div>
  )
}