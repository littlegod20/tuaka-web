import { useNavigate } from 'react-router-dom'
import {
  useDashboard,
  useMe,
  type DashboardRecentInvoice,
} from '@tuaka/api-client'
import { formatGHS } from '@tuaka/utils'
import { OnboardingChecklist } from '@/components/ui/OnboardingChecklist'

const STATUS_STYLES: Record<string, string> = {
  draft:   'bg-gray-100 text-gray-600',
  sent:    'bg-blue-50 text-blue-600',
  viewed:  'bg-purple-50 text-purple-600',
  paid:    'bg-green-50 text-green-700',
  overdue: 'bg-red-50 text-red-600',
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { data, isLoading } = useDashboard()

  const firstName = me?.user.name.split(' ')[0] ?? 'there'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const stats = data?.stats
  const chart = data?.revenue_chart ?? []
  const recent = data?.recent_invoices ?? []

  const maxRevenue = Math.max(...chart.map((m) => m.revenue), 1)

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Good {getTimeOfDay()}, {firstName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/clients')}
          >
            + New client
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-brand-400 rounded-lg hover:bg-brand-600 transition-colors"
            onClick={() => navigate('/invoices/new')}
          >
            + New invoice
          </button>
        </div>
      </div>

      <OnboardingChecklist />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total revenue"
          value={formatGHS(stats?.total_revenue ?? 0)}
          icon="💰"
          sub="All time"
        />
        <StatCard
          label="Outstanding"
          value={formatGHS(stats?.outstanding ?? 0)}
          icon="⏳"
          sub={`${stats?.overdue_count ?? 0} overdue`}
          subColor={stats?.overdue_count ? 'text-red-500' : 'text-gray-400'}
        />
        <StatCard
          label="Paid this month"
          value={formatGHS(stats?.paid_this_month ?? 0)}
          icon="✅"
          sub={new Date().toLocaleString('en-GH', { month: 'long' })}
        />
        <StatCard
          label="Clients"
          value={String(stats?.client_count ?? 0)}
          icon="👥"
          sub={`${stats?.draft_count ?? 0} draft invoice${stats?.draft_count === 1 ? '' : 's'}`}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Revenue chart */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Revenue — last 6 months
          </h2>

          {chart.every((m) => m.revenue === 0) ? (
            <div className="flex items-center justify-center h-36 text-gray-300 text-sm">
              No paid invoices yet
            </div>
          ) : (
            <div className="flex items-end gap-3 h-36">
              {chart.map((month) => {
                const heightPct = maxRevenue > 0
                  ? (month.revenue / maxRevenue) * 100
                  : 0
                return (
                  <div
                    key={month.month}
                    className="flex-1 flex flex-col items-center gap-1.5"
                  >
                    <span className="text-xs text-gray-500 tabular-nums">
                      {month.revenue > 0 ? formatGHS(month.revenue) : ''}
                    </span>
                    <div className="w-full flex items-end" style={{ height: '80px' }}>
                      <div
                        className="w-full bg-brand-400 rounded-t-md transition-all duration-500 min-h-[3px]"
                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 text-center leading-tight">
                      {month.month.split(' ')[0]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Quick actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'New invoice',  icon: '🧾', path: '/invoices/new' },
              { label: 'New quote',    icon: '📋', path: '/invoices/new?type=quote' },
              { label: 'Add client',   icon: '👤', path: '/clients' },
              { label: 'Add product',  icon: '📦', path: '/products' },
              { label: 'All invoices', icon: '📂', path: '/invoices' },
              { label: 'Settings',     icon: '⚙️',  path: '/settings' },
            ].map((action) => (
              <button
                key={action.path}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left"
                onClick={() => navigate(action.path)}
              >
                <span className="text-base">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            Recent invoices
          </h2>
          <button
            className="text-xs text-brand-500 hover:underline font-medium"
            onClick={() => navigate('/invoices')}
          >
            View all
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No invoices yet.</p>
            <button
              className="mt-3 text-sm text-brand-500 hover:underline font-medium"
              onClick={() => navigate('/invoices/new')}
            >
              Create your first invoice
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-50">
                <th className="px-5 py-3 font-medium text-gray-400">Invoice</th>
                <th className="px-5 py-3 font-medium text-gray-400">Client</th>
                <th className="px-5 py-3 font-medium text-gray-400">Status</th>
                <th className="px-5 py-3 font-medium text-gray-400">Due</th>
                <th className="px-5 py-3 font-medium text-gray-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recent.map((inv) => (
                <RecentInvoiceRow
                  key={inv.id}
                  invoice={inv}
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Subcomponents ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  sub,
  subColor = 'text-gray-400',
}: {
  label: string
  value: string
  icon: string
  sub?: string
  subColor?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
      {sub && (
        <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>
      )}
    </div>
  )
}

function RecentInvoiceRow({
  invoice,
  onClick,
}: {
  invoice: DashboardRecentInvoice
  onClick: () => void
}) {
  return (
    <tr
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-5 py-3 font-medium text-brand-600">
        {invoice.number}
      </td>
      <td className="px-5 py-3 text-gray-700">
        {invoice.client?.name ?? '—'}
      </td>
      <td className="px-5 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[invoice.status] ?? ''}`}>
          {invoice.status}
        </span>
      </td>
      <td className="px-5 py-3 text-gray-500">
        {invoice.due_date
          ? new Date(invoice.due_date).toLocaleDateString('en-GH', {
              day: 'numeric', month: 'short',
            })
          : '—'}
      </td>
      <td className="px-5 py-3 text-right font-medium text-gray-900 tabular-nums">
        {formatGHS(invoice.total)}
      </td>
    </tr>
  )
}

// ─── Utils ────────────────────────────────────────────────────────────────

function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}