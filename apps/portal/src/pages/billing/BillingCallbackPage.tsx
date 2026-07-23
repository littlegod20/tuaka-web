import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVerifyBillingPayment } from '@tuaka/api-client'

export function BillingCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference') ?? ''

  const { mutate: verifyPayment } = useVerifyBillingPayment()

  useEffect(() => {
    if (!reference) {
      navigate('/billing')
      return
    }

    verifyPayment(
      { reference },
      {
        onSuccess: () => navigate('/billing?success=true'),
        onError: () => navigate('/billing?error=true'),
      },
    )
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Confirming your payment…</p>
      </div>
    </div>
  )
}