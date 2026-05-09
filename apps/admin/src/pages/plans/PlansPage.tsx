import { useAdminPlans } from '@tuaka/api-client'
import { formatGHS } from '@tuaka/utils'

export function PlansPage() {
  const { data: plans, isLoading } = useAdminPlans()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Plans</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Current plan configuration. Edit via PlanSeeder.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan: any) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-3">
              {plan.price_monthly === 0 ? 'Free' : formatGHS(plan.price_monthly)}
              {plan.price_monthly > 0 && (
                <span className="text-sm font-normal text-gray-400">/mo</span>
              )}
            </p>
            <div className="text-xs text-gray-500 mb-3">
              {plan.invoice_limit === -1
                ? 'Unlimited invoices'
                : `${plan.invoice_limit} invoices/month`}
            </div>
            <ul className="space-y-1.5">
              {plan.features?.map((f: string, i: number) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-brand-400 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}