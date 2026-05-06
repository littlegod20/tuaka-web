import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminLogin } from '@tuaka/api-client'
import { Button, Input } from '@tuaka/ui'
import { useForm } from '@/hooks/useForm'

export function LoginPage() {
  const navigate = useNavigate()
  const { mutate: login, isPending } = useAdminLogin()
  const { values, handleChange } = useForm({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    login(values, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
      onError: (err: any) =>
        setError(err?.response?.data?.message ?? 'Login failed.'),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-logo text-gray-900">
            Tua<span className="text-brand-400">Ka</span>
          </span>
          <p className="mt-1 text-sm text-gray-500">Admin panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              required
              autoFocus
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
            />
            <Input
              required
              label="Password"
              name="password"
              passwordToggle
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
            />
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button className="w-full mt-1" loading={isPending} type="submit">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}