import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRegister, useMe } from '@tuaka/api-client'
import { Button, Input } from '@tuaka/ui'
import { useForm } from '@/hooks/useForm'

interface RegisterForm {
  business_name: string
  slug: string
  name: string
  email: string
  password: string
  password_confirmation: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { mutate: register, isPending, error } = useRegister()
  const { values, handleChange } = useForm<RegisterForm>({
    business_name: '',
    slug: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  useEffect(() => {
    if (me) navigate('/dashboard', { replace: true })
  }, [me, navigate])

  // Auto-generate slug from business name
  function handleBusinessNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleChange(e)
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50)
    handleChange({ target: { name: 'slug', value: slug } } as any)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    register(values, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    })
  }

  // Parse validation errors from Laravel
  const apiErrors = (error as any)?.response?.data?.errors ?? {}
  const apiMessage = (error as any)?.response?.data?.message ?? null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-logo text-gray-900 dark:text-gray-100">
            Tua<span className="text-brand-400">Ka</span>
          </span>
          <p className="mt-2 text-sm text-gray-500">Create your workspace</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              required
              autoFocus
              label="Business name"
              name="business_name"
              placeholder="Acme Ltd"
              value={values.business_name}
              error={apiErrors.business_name?.[0]}
              onChange={handleBusinessNameChange}
            />
            <Input
              required
              label="Workspace URL"
              name="slug"
              placeholder="acme"
              hint="tuaka.app/acme — letters, numbers, hyphens only"
              value={values.slug}
              error={apiErrors.slug?.[0]}
              onChange={handleChange}
            />
            <Input
              required
              label="Your name"
              name="name"
              placeholder="Kofi Mensah"
              value={values.name}
              error={apiErrors.name?.[0]}
              onChange={handleChange}
            />
            <Input
              required
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={values.email}
              error={apiErrors.email?.[0]}
              onChange={handleChange}
            />
            <Input
              required
              label="Password"
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
              Create workspace
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have a workspace?{' '}
          <Link className="text-brand-500 hover:underline font-medium" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}