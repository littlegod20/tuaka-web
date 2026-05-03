import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLogin, useMe } from '@tuaka/api-client'
import { Button, Input } from '@tuaka/ui'
import { useForm } from '@/hooks/useForm'

interface LoginForm {
  email: string
  password: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { mutate: login, isPending, error } = useLogin()
  const { values, handleChange } = useForm<LoginForm>({ email: '', password: '' })

  
  // Already logged in → go to dashboard
  useEffect(() => {
    if (me) navigate('/dashboard', { replace: true })
  }, [me, navigate])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login(values, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    })
  }

  const apiError = error
    ? (error as any)?.response?.data?.message ?? 'Login failed.'
    : null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-logo text-gray-900">
            Tua<span className="text-brand-400">Ka</span>
          </span>
          <p className="mt-2 text-sm text-gray-500">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
            <Input
              required
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
            />

            {apiError && (
              <p className="text-sm text-red-500 text-center">{apiError}</p>
            )}

            <Button className="w-full mt-2" loading={isPending} type="submit">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          No account?{' '}
          <Link className="text-brand-500 hover:underline font-medium" to="/register">
            Create your workspace
          </Link>
        </p>
      </div>
    </div>
  )
}