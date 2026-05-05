import { useState, useEffect } from 'react'
import {
  useInitiatePayment,
  usePaymentStatus,
  type InitiatePaymentPayload,
} from '@tuaka/api-client'
import { formatGHS } from '@tuaka/utils'

interface PaymentModalProps {
  token: string
  amount: number
  clientEmail: string | null
  onSuccess: () => void
  onClose: () => void
}

type Step = 'form' | 'pending' | 'success' | 'failed'

const NETWORKS = [
  { value: 'mtn',      label: 'MTN Mobile Money',   color: 'bg-yellow-400' },
  { value: 'vodafone', label: 'Vodafone Cash',       color: 'bg-red-500' },
  { value: 'tigo',     label: 'AirtelTigo Money',    color: 'bg-blue-500' },
] as const

export function PaymentModal({
  token,
  amount,
  clientEmail,
  onSuccess,
  onClose,
}: PaymentModalProps) {
  const [step, setStep] = useState<Step>('form')
  const [reference, setReference] = useState('')
  const [displayText, setDisplayText] = useState<string | null>(null)

  const [phone, setPhone] = useState('')
  const [network, setNetwork] = useState<'mtn' | 'vodafone' | 'tigo'>('mtn')
  const [email, setEmail] = useState(clientEmail ?? '')

  const { mutate: initiatePayment, isPending: initiating } = useInitiatePayment(token)

  const { data: statusData } = usePaymentStatus(
    token,
    reference,
    step === 'pending',
  )

  // React to polling result
  useEffect(() => {
    if (!statusData) return
    if (statusData.status === 'completed') {
      setStep('success')
      onSuccess()
    }
    if (statusData.status === 'failed') {
      setStep('failed')
    }
  }, [statusData])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    initiatePayment(
      { phone, network, email },
      {
        onSuccess: (data) => {
          setReference(data.reference)
          setDisplayText(data.display_text)
          setStep('pending')
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message ?? 'Payment failed to start.')
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Pay {formatGHS(amount)}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">

          {/* ── Form step ── */}
          {step === 'form' && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Network selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile network
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {NETWORKS.map((n) => (
                    <button
                      key={n.value}
                      type="button"
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-colors ${
                        network === n.value
                          ? 'border-brand-100 bg-brand-50 text-brand-600'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                      onClick={() => setNetwork(n.value)}
                    >
                      <span className={`w-6 h-6 rounded-full ${n.color}`} />
                      {n.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    +233
                  </span>
                  <input
                    required
                    autoFocus
                    className="w-full rounded-lg border border-gray-200 pl-12 pr-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    placeholder="24 000 0000"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email for receipt
                </label>
                <input
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={initiating}
                className="w-full bg-brand-400 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {initiating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Initiating…
                  </>
                ) : (
                  <>Pay {formatGHS(amount)}</>
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                You will receive a prompt on your phone to approve the payment.
              </p>
            </form>
          )}

          {/* ── Pending step ── */}
          {step === 'pending' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  Waiting for approval
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {displayText ?? 'Check your phone and approve the payment prompt.'}
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-xs text-amber-700 font-medium">
                  Do not close this page
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  We're waiting for your confirmation on {phone}
                </p>
              </div>
              <button
                className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2"
                onClick={() => setStep('failed')}
              >
                Cancel payment
              </button>
            </div>
          )}

          {/* ── Success step ── */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="text-6xl">✅</div>
              <div>
                <p className="font-semibold text-gray-900 text-xl">
                  Payment successful!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatGHS(amount)} received. A receipt has been sent to {email}.
                </p>
              </div>
              <button
                className="w-full bg-brand-400 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-colors"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          )}

          {/* ── Failed step ── */}
          {step === 'failed' && (
            <div className="text-center py-4 space-y-4">
              <div className="text-6xl">❌</div>
              <div>
                <p className="font-semibold text-gray-900 text-xl">
                  Payment failed
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  The payment was not completed. You can try again.
                </p>
              </div>
              <button
                className="w-full bg-brand-400 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-colors"
                onClick={() => setStep('form')}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}