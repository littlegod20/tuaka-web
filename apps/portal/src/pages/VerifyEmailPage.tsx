import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useVerifyEmail } from '@tuaka/api-client'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  const { mutate: verify, isPending, isSuccess, isError } = useVerifyEmail()

  // Auto-verify on mount
  useEffect(() => {
    if (token && email) {
      verify({ token, email })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!token || !email) {
    return <Result type="invalid" />
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Verifying your email…</p>
        </div>
      </div>
    )
  }

  if (isSuccess) return <Result type="success" />
  if (isError) return <Result type="expired" />

  return null
}

function Result({ type }: { type: 'success' | 'expired' | 'invalid' }) {
  const config = {
    success: {
      emoji: '✅',
      title: 'Email verified',
      body: 'Your email address has been verified. You can now send invoices.',
      link: '/dashboard',
      linkLabel: 'Go to dashboard',
    },
    expired: {
      emoji: '⏱️',
      title: 'Link expired',
      body: 'This verification link has expired or is invalid. Request a new one from your dashboard.',
      link: '/dashboard',
      linkLabel: 'Go to dashboard',
    },
    invalid: {
      emoji: '⚠️',
      title: 'Invalid link',
      body: 'This verification link is missing required information.',
      link: '/dashboard',
      linkLabel: 'Go to dashboard',
    },
  }[type]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-4">{config.emoji}</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{config.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{config.body}</p>
        <Link
          className="inline-block bg-brand-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
          to={config.link}
        >
          {config.linkLabel}
        </Link>
      </div>
    </div>
  )
}