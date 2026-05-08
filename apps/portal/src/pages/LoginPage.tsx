import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLogin, useMe } from '@tuaka/api-client'
import { Button, Input } from '@tuaka/ui'
import { useForm } from '@/hooks/useForm'

interface LoginForm {
  slug: string
  email: string
  password: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { mutate: login, isPending, error } = useLogin()
  const { values, handleChange } = useForm<LoginForm>({ slug: '', email: '', password: '' })

  
  // Already logged in → go to dashboard
  useEffect(() => {
    if (me) navigate('/dashboard', { replace: true })
  }, [me, navigate])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Store slug first so the interceptor picks it up
    localStorage.setItem('tuaka_tenant_slug', values.slug)
    login(
      { email: values.email, password: values.password },
      {
        onSuccess: () => navigate('/dashboard', { replace: true }),
        onError: () => {
          // Clear slug on failure
          localStorage.removeItem('tuaka_tenant_slug')
        },
      },
    )
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
            label="Workspace URL"
            name="slug"
            placeholder="your-workspace-slug"
            hint="The slug you used when registering"
            value={values.slug}
            onChange={handleChange}
          />
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
            <div className="flex flex-col gap-1">
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
              <div className="flex justify-end">
                <Link
                  className="text-sm text-brand-500 hover:underline font-medium"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

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