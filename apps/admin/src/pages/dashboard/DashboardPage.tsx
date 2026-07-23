import { useAdminDashboard } from '@tuaka/api-client'
import { formatGHS } from '@tuaka/utils'
import { useNavigate } from 'react-router-dom'

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

export function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useAdminDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const stats = data?.stats
  const chart = data?.signup_chart ?? []
  const maxCount = Math.max(...chart.map((m) => m.count), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total workspaces" value={String(stats?.total_tenants ?? 0)} icon="🏢" sub={`+${stats?.new_this_month ?? 0} this month`} />
        <StatCard label="Active paid" value={String(stats?.active_paid ?? 0)} icon="💳" sub={`${stats?.trialing ?? 0} trialing`} />
        <StatCard label="MRR" value={formatGHS(stats?.mrr ?? 0)} icon="📈" sub="Monthly recurring" />
        <StatCard label="Platform revenue" value={formatGHS(stats?.total_revenue ?? 0)} icon="💰" sub={`${stats?.paid_invoices ?? 0} paid invoices`} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Signups chart */}
        <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-5 xl:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            New workspaces — last 6 months
          </h2>
          {chart.every((m) => m.count === 0) ? (
            <div className="flex items-center justify-center h-36 text-gray-300 text-sm">
              No signups yet
            </div>
          ) : (
            <div className="flex items-end gap-3 h-36">
              {chart.map((month) => {
                const heightPct = (month.count / maxCount) * 100
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-xs text-gray-500">
                      {month.count > 0 ? month.count : ''}
                    </span>
                    <div className="w-full flex items-end" style={{ height: '80px' }}>
                      <div
                        className="w-full bg-brand-400 rounded-t-md transition-all duration-500 min-h-[3px]"
                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {month.month.split(' ')[0]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Subscription breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Subscriptions
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Active paid', value: stats?.active_paid ?? 0, color: 'bg-green-400' },
              { label: 'Trialing',    value: stats?.trialing ?? 0,    color: 'bg-blue-400' },
              { label: 'Cancelled',   value: stats?.cancelled ?? 0,   color: 'bg-gray-300' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{item.value}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`${item.color} h-1.5 rounded-full transition-all`}
                    style={{
                      width: `${stats?.total_tenants
                        ? (item.value / stats.total_tenants) * 100
                        : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent tenants */}
      <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent workspaces</h2>
          <button
            className="text-xs text-brand-400 hover:underline font-medium"
            onClick={() => navigate('/tenants')}
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left border-b border-gray-50 dark:border-gray-700">
                <th className="px-5 py-3 font-medium text-gray-400">Workspace</th>
                <th className="px-5 py-3 font-medium text-gray-400">Plan</th>
                <th className="px-5 py-3 font-medium text-gray-400">Status</th>
                <th className="px-5 py-3 font-medium text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {data?.recent_tenants.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() => navigate(`/tenants/${tenant.id}`)}
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{tenant.name}</p>
                    <p className="text-xs text-gray-400">{tenant.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{tenant.plan}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${SUB_STYLES[tenant.status] ?? ''}`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(tenant.created_at).toLocaleDateString('en-GH', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, sub }: { label: string; value: string; icon: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}