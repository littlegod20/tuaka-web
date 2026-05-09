import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useAdminTenant,
  useActivateTenant,
  useDeactivateTenant,
  useAdminPlans,
} from '@tuaka/api-client'
import { formatGHS } from '@tuaka/utils'
import { Button } from '@tuaka/ui'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

const SUB_STYLES: Record<string, string> = {
  active:    'bg-green-50 text-green-700',
  trialing:  'bg-blue-50 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-500',
  free:      'bg-gray-100 text-gray-500',
}

export function TenantDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: tenant, isLoading } = useAdminTenant(id ?? '')
  const { data: plans } = useAdminPlans()
  const { mutate: activate, isPending: activating } = useActivateTenant()
  const { mutate: deactivate, isPending: deactivating } = useDeactivateTenant()

  const [showActivate, setShowActivate]     = useState(false)
  const [showDeactivate, setShowDeactivate] = useState(false)
  const [planSlug, setPlanSlug]             = useState('starter')
  const [months, setMonths]                 = useState(1)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400">Workspace not found.</p>
        <button
          className="mt-4 text-sm text-amber-500 hover:underline"
          onClick={() => navigate('/tenants')}
        >
          Back to workspaces
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <button
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 transition-colors"
        onClick={() => navigate('/tenants')}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Workspaces
      </button>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">{tenant.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${SUB_STYLES[tenant.sub_status]}`}>
              {tenant.sub_status}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{tenant.slug} · {tenant.currency}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setPlanSlug('starter'); setMonths(1); setShowActivate(true) }}
          >
            Activate plan
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeactivate(true)}
          >
            Deactivate
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Members</p>
          <p className="text-2xl font-bold text-gray-900">{tenant.member_count}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Invoices</p>
          <p className="text-2xl font-bold text-gray-900">{tenant.invoice_count}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Revenue processed</p>
          <p className="text-2xl font-bold text-gray-900">{formatGHS(tenant.paid_revenue)}</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Subscription details</h2>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Plan</p>
            <p className="font-medium text-gray-900">{tenant.plan}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Status</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${SUB_STYLES[tenant.sub_status]}`}>
              {tenant.sub_status}
            </span>
          </div>
          {tenant.trial_ends && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Trial ends</p>
              <p className="text-gray-700">
                {new Date(tenant.trial_ends).toLocaleDateString('en-GH', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          )}
          {tenant.period_ends && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Period ends</p>
              <p className="text-gray-700">
                {new Date(tenant.period_ends).toLocaleDateString('en-GH', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Joined</p>
            <p className="text-gray-700">
              {new Date(tenant.created_at).toLocaleDateString('en-GH', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Activate modal */}
      <Modal
        open={showActivate}
        title="Activate subscription"
        onClose={() => setShowActivate(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
              value={planSlug}
              onChange={(e) => setPlanSlug(e.target.value)}
            >
              {plans?.filter((p: any) => p.slug !== 'free').map((p: any) => (
                <option key={p.id} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (months)
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
              min={1}
              max={24}
              type="number"
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowActivate(false)}>
              Cancel
            </Button>
            <Button
              loading={activating}
              onClick={() =>
                activate(
                  { id: tenant.id, plan_slug: planSlug, months },
                  { onSuccess: () => setShowActivate(false) },
                )
              }
            >
              Activate
            </Button>
          </div>
        </div>
      </Modal>

      {/* Deactivate confirm */}
      <ConfirmDialog
        open={showDeactivate}
        title="Deactivate workspace"
        message={`Move ${tenant.name} to the free plan? They will lose paid features immediately.`}
        confirmLabel="Deactivate"
        loading={deactivating}
        onConfirm={() =>
          deactivate(tenant.id, { onSuccess: () => setShowDeactivate(false) })
        }
        onCancel={() => setShowDeactivate(false)}
      />
    </div>
  )
}