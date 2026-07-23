import { useNavigate } from 'react-router-dom'
import {
  useDashboard,
  useMe,
  type DashboardRecentInvoice,
} from '@tuaka/api-client'
import { formatGHS } from '@tuaka/utils'
import { OnboardingChecklist } from '@/components/ui/OnboardingChecklist'

const STATUS_STYLES: Record<string, string> = {
  draft:
    'bg-brand-900/[0.06] text-brand-900/55 dark:bg-gray-700 dark:text-gray-300',
  sent:
    'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400',
  viewed:
    'bg-brand-100/40 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400',
  paid:
    'bg-brand-50 text-[#178A56] dark:bg-brand-950/40 dark:text-brand-400',
  overdue:
    'bg-[#FBE7E9] text-[#D6455A] dark:bg-red-950/60 dark:text-red-300',
}

function IconRevenue({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconOutstanding({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function IconPaid({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function IconClients({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconInvoice({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function IconQuote({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M9 12h6M9 16h6M9 8h2" />
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function IconAddClient({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  )
}

function IconProduct({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <rect height="13" rx="2" width="18" x="3" y="7" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  )
}

function IconList({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Good {getTimeOfDay()}, {firstName}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
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
          icon={IconRevenue}
          sub="All time"
        />
        <StatCard
          label="Outstanding"
          value={formatGHS(stats?.outstanding ?? 0)}
          icon={IconOutstanding}
          sub={`${stats?.overdue_count ?? 0} overdue`}
          subColor={stats?.overdue_count ? 'text-red-500' : 'text-gray-400'}
        />
        <StatCard
          label="Paid this month"
          value={formatGHS(stats?.paid_this_month ?? 0)}
          icon={IconPaid}
          sub={new Date().toLocaleString('en-GH', { month: 'long' })}
        />
        <StatCard
          label="Clients"
          value={String(stats?.client_count ?? 0)}
          icon={IconClients}
          sub={`${stats?.draft_count ?? 0} draft invoice${stats?.draft_count === 1 ? '' : 's'}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Revenue chart */}
        <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-5 xl:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
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
        <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Quick actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'New invoice',  Icon: IconInvoice,   path: '/invoices/new' },
              { label: 'New quote',    Icon: IconQuote,     path: '/invoices/new?type=quote' },
              { label: 'Add client',   Icon: IconAddClient, path: '/clients' },
              { label: 'Add product',  Icon: IconProduct,   path: '/products' },
              { label: 'All invoices', Icon: IconList,      path: '/invoices' },
              { label: 'Settings',     Icon: IconSettings,  path: '/settings' },
            ].map(({ label, Icon, path }) => (
              <button
                key={path}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                onClick={() => navigate(path)}
              >
                <Icon className="h-[17px] w-[17px] shrink-0 text-brand-600 dark:text-brand-400" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
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
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Subcomponents ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  subColor = 'text-gray-400',
}: {
  label: string
  value: string
  icon: (props: { className?: string }) => React.ReactElement
  sub?: string
  subColor?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{value}</p>
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
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-5 py-3 font-medium text-brand-600 dark:text-brand-400">
        {invoice.number}
      </td>
      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
        {invoice.client?.name ?? '—'}
      </td>
      <td className="px-5 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[invoice.status] ?? ''}`}>
          {invoice.status}
        </span>
      </td>
      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
        {invoice.due_date
          ? new Date(invoice.due_date).toLocaleDateString('en-GH', {
              day: 'numeric', month: 'short',
            })
          : '—'}
      </td>
      <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-gray-100 tabular-nums">
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