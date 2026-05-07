import { useNavigate } from 'react-router-dom'
import { useMe } from '@tuaka/api-client'

export function OnboardingChecklist() {
  const navigate = useNavigate()
  const { data: me } = useMe()

  const onboarding = me?.onboarding
  if (!onboarding || onboarding.complete) return null

  const steps = [
    {
      key: 'has_client',
      done: onboarding.has_client,
      label: 'Add your first client',
      action: 'Add client',
      path: '/clients',
    },
    {
      key: 'has_invoice',
      done: onboarding.has_invoice,
      label: 'Create your first invoice',
      action: 'Create invoice',
      path: '/invoices/new',
    },
    {
      key: 'has_sent',
      done: onboarding.has_sent,
      label: 'Send an invoice to a client',
      action: 'View invoices',
      path: '/invoices',
    },
  ]

  const doneCount = steps.filter((s) => s.done).length
  const progress  = Math.round((doneCount / steps.length) * 100)

  return (
    <div className="bg-white rounded-xl border border-brand-100 p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Get started with TuaKa
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {doneCount} of {steps.length} steps complete
          </p>
        </div>
        <span className="text-sm font-bold text-brand-500">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
        <div
          className="bg-brand-400 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.key}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              step.done ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                step.done
                  ? 'bg-green-500'
                  : 'border-2 border-gray-300'
              }`}>
                {step.done && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${
                step.done
                  ? 'text-green-700 line-through decoration-green-400'
                  : 'text-gray-700'
              }`}>
                {step.label}
              </span>
            </div>
            {!step.done && (
              <button
                className="text-xs font-medium text-brand-500 hover:text-brand-700 transition-colors"
                onClick={() => navigate(step.path)}
              >
                {step.action} →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}