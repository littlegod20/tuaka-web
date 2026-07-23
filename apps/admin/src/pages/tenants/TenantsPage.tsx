import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useAdminTenants,
  useActivateTenant,
  useDeactivateTenant,
  useAdminPlans,
  type AdminTenant,
} from '@tuaka/api-client'
import { useDebouncedValue } from '@tuaka/utils'
import { Button, DataTable, type DataTableColumn } from '@tuaka/ui'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

const SUB_STYLES: Record<string, string> = {
  active:
    'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300',
  trialing:
    'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  cancelled:
    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300',
  free:
    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300',
}

const STATUS_TABS = [
  { label: 'All',       value: '' },
  { label: 'Active',    value: 'active' },
  { label: 'Trialing',  value: 'trialing' },
  { label: 'Cancelled', value: 'cancelled' },
]

export function TenantsPage() {
  const navigate  = useNavigate()
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('')
  const [page, setPage]       = useState(1)
  const debouncedSearch       = useDebouncedValue(search, 300)

  const [activating, setActivating]   = useState<AdminTenant | null>(null)
  const [deactivating, setDeactivating] = useState<AdminTenant | null>(null)
  const [planSlug, setPlanSlug]       = useState('starter')
  const [months, setMonths]           = useState(1)

  const { data, isLoading }           = useAdminTenants({ search: debouncedSearch, status, page })
  const { data: plans }               = useAdminPlans()
  const { mutate: activate, isPending: activating_ } = useActivateTenant()
  const { mutate: deactivate, isPending: deactivating_ } = useDeactivateTenant()

  const columns: DataTableColumn<AdminTenant>[] = [
    {
      id: 'workspace',
      header: 'Workspace',
      cell: (tenant) => (
        <div className="flex flex-col items-start gap-0.5">
          <button
            className="text-left font-medium text-brand-600 hover:underline"
            type="button"
            onClick={() => navigate(`/tenants/${tenant.id}`)}
          >
            {tenant.name}
          </button>
          <span className="text-xs text-gray-400">{tenant.slug}</span>
        </div>
      ),
    },
    {
      id: 'plan',
      header: 'Plan',
      cell: (tenant) => <span className="text-gray-600 dark:text-gray-400">{tenant.plan}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (tenant) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${SUB_STYLES[tenant.sub_status] ?? ''}`}
        >
          {tenant.sub_status}
        </span>
      ),
    },
    {
      id: 'joined',
      header: 'Joined',
      cell: (tenant) => (
        <span className="text-gray-500">
          {new Date(tenant.created_at).toLocaleDateString('en-GH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      headerClassName: 'w-[1%]',
      className: 'text-right',
      cell: (tenant) => (
        <div className="flex justify-end gap-1">
          <button
            className="rounded px-2 py-1 text-xs text-green-500 transition-colors hover:text-green-700"
            type="button"
            onClick={() => {
              setActivating(tenant)
              setPlanSlug('starter')
              setMonths(1)
            }}
          >
            Activate
          </button>
          <button
            className="rounded px-2 py-1 text-xs text-red-400 transition-colors hover:text-red-600"
            type="button"
            onClick={() => setDeactivating(tenant)}
          >
            Deactivate
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Workspaces</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.meta.total ?? 0} total</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-100 dark:border-gray-700">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              status === tab.value
                ? 'border-brand-400 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            type="button"
            onClick={() => { setStatus(tab.value); setPage(1) }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
            text-gray-900 placeholder-gray-400 outline-none
            focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20
            dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          placeholder="Search by name or slug…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      <DataTable<AdminTenant>
        columns={columns}
        emptyContent={
          <p className="text-sm text-gray-400">
            {debouncedSearch || status
              ? 'No workspaces match your filters.'
              : 'No workspaces found.'}
          </p>
        }
        isLoading={isLoading}
        pagination={
          data
            ? {
                meta: data.meta,
                page,
                onPageChange: setPage,
                itemLabel: 'workspaces',
              }
            : undefined
        }
        rows={data?.data ?? []}
      />

      {/* Activate modal */}
      <Modal open={!!activating} title={`Activate — ${activating?.name}`} onClose={() => setActivating(null)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan</label>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              value={planSlug}
              onChange={(e) => setPlanSlug(e.target.value)}
            >
              {plans?.filter((p: any) => p.slug !== 'free').map((p: any) => (
                <option key={p.id} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (months)</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              min={1} max={24} type="number"
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setActivating(null)}>Cancel</Button>
            <Button
              loading={activating_}
              onClick={() =>
                activate(
                  { id: activating!.id, plan_slug: planSlug, months },
                  { onSuccess: () => setActivating(null) },
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
        open={!!deactivating}
        title="Deactivate workspace"
        message={`Move ${deactivating?.name} to the free plan? They will lose paid features immediately.`}
        confirmLabel="Deactivate"
        loading={deactivating_}
        onConfirm={() => deactivate(deactivating!.id, { onSuccess: () => setDeactivating(null) })}
        onCancel={() => setDeactivating(null)}
      />
    </div>
  )
}