import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  usePlans,
  useCurrentSubscription,
  useSubscribe,
  useVerifyBillingPayment,
  useCancelSubscription,
  useMe,
  type Plan,
} from '@tuaka/api-client'
import { formatGHS } from '@tuaka/utils'
import { Button } from '@tuaka/ui'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

export function BillingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const callbackRef = searchParams.get('reference')

  const { data: me } = useMe()
  const { data: plans, isLoading: loadingPlans } = usePlans()
  const { data: subscription, isLoading: loadingSub } = useCurrentSubscription()
  const { mutate: subscribe, isPending: subscribing } = useSubscribe()
  const { mutate: verifyPayment, isPending: verifying } = useVerifyBillingPayment()
  const { mutate: cancelSub, isPending: cancelling } = useCancelSubscription()

  const [confirmCancel, setConfirmCancel] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  // Handle Paystack callback redirect
  if (callbackRef && !verifying) {
    verifyPayment(
      { reference: callbackRef },
      {
        onSuccess: () => navigate('/billing', { replace: true }),
        onError: () => navigate('/billing', { replace: true }),
      },
    )
  }

  function handleSubscribe(plan: Plan) {
    if (!me?.user.email) return
    setSelectedPlan(plan)
    subscribe(
      { plan_slug: plan.slug, email: me.user.email },
      {
        onSuccess: (data) => {
          window.location.href = data.authorization_url
        },
        onError: () => setSelectedPlan(null),
      },
    )
  }

  const isLoading = loadingPlans || loadingSub

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentPlanSlug = subscription?.plan?.slug ?? 'free'
  const isTrialing      = subscription?.is_trialing
  const trialEndsAt     = subscription?.trial_ends_at
  const periodEndsAt    = subscription?.period_ends_at

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Billing & Plans</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your TuaKa subscription
        </p>
      </div>

      {/* Current plan banner */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Current plan
            </p>
            <p className="text-lg font-bold text-gray-900">
              {subscription?.plan?.name ?? 'Free'}
              {isTrialing && (
                <span className="ml-2 text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Trial
                </span>
              )}
            </p>
            {isTrialing && trialEndsAt && (
              <p className="text-sm text-amber-600 mt-1">
                Trial ends {new Date(trialEndsAt).toLocaleDateString('en-GH', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            )}
            {!isTrialing && periodEndsAt && subscription?.status === 'active' && (
              <p className="text-sm text-gray-500 mt-1">
                Renews {new Date(periodEndsAt).toLocaleDateString('en-GH', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            )}
            {subscription?.status === 'cancelled' && periodEndsAt && (
              <p className="text-sm text-red-500 mt-1">
                Cancelled — access until {new Date(periodEndsAt).toLocaleDateString('en-GH', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            )}
          </div>
          {subscription?.is_active && !subscription?.cancelled_at && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel plan
            </Button>
          )}
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-3 gap-4">
        {plans?.map((plan) => {
          const isCurrent  = plan.slug === currentPlanSlug
          const isPopular  = plan.slug === 'starter'
          const isPending  = subscribing && selectedPlan?.id === plan.id

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl border-2 p-5 flex flex-col ${
                isPopular
                  ? 'border-brand-400 shadow-md'
                  : isCurrent
                  ? 'border-green-200'
                  : 'border-gray-100'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                <div className="mt-2">
                  {plan.price_monthly === 0 ? (
                    <span className="text-2xl font-bold text-gray-900">Free</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatGHS(plan.price_monthly)}
                      </span>
                      <span className="text-sm text-gray-400">/month</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {(Array.isArray(plan.features)
                  ? plan.features
                  : Object.values(
                      (plan.features ?? {}) as Record<string, string>,
                    )
                ).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full text-center py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg">
                  Current plan ✓
                </div>
              ) : plan.price_monthly === 0 ? (
                <div className="w-full text-center py-2 text-sm text-gray-400">
                  Default fallback
                </div>
              ) : (
                <Button
                  className="w-full"
                  loading={isPending}
                  variant={isPopular ? 'primary' : 'secondary'}
                  onClick={() => handleSubscribe(plan)}
                >
                  {isTrialing ? 'Subscribe now' : 'Upgrade'}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel subscription"
        message="Are you sure you want to cancel? You'll keep access until the end of your billing period, then move to the free plan."
        confirmLabel="Yes, cancel"
        loading={cancelling}
        onConfirm={() =>
          cancelSub(undefined, { onSuccess: () => setConfirmCancel(false) })
        }
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  )
}