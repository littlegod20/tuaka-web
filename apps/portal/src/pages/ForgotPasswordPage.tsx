import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForgotPassword } from '@tuaka/api-client'
import { Button, Input } from '@tuaka/ui'
import { useForm } from '../hooks/useForm'

export function ForgotPasswordPage() {
  const { mutate: sendLink, isPending } = useForgotPassword()
  const { values, handleChange } = useForm({ email: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendLink(values, { onSuccess: () => setSent(true) })
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Check your email</h1>
          <p className="text-sm text-gray-500 mb-6">
            If <span className="font-medium text-gray-700 dark:text-gray-300">{values.email}</span> is
            registered, you'll receive a reset link shortly.
          </p>
          <Link className="text-sm text-brand-500 hover:underline" to="/login">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-logo text-gray-900 dark:text-gray-100">
            Tua<span className="text-brand-400">Ka</span>
          </span>
          <p className="mt-2 text-sm text-gray-500">Reset your password</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6">
          <p className="text-sm text-gray-500 mb-4">
            Enter your email and we'll send you a link to reset your password.
          </p>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              required
              autoFocus
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
            />
            <Button className="w-full" loading={isPending} type="submit">
              Send reset link
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link className="text-brand-500 hover:underline" to="/login">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}