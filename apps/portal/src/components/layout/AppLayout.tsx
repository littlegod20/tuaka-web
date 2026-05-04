import { NavLink, Outlet } from 'react-router-dom'

import { useLogout, useMe, useResendVerification } from '@tuaka/api-client'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/clients', label: 'Clients' },
  { to: '/settings', label: 'Settings' },
]

export function AppLayout() {
  const { mutate: logout } = useLogout()
  const { data: me } = useMe()
  const { mutate: resend, isPending: resending, isSuccess: resent } = useResendVerification()

  const isUnverified = me?.user && !me.user.email_verified_at

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 border-r border-gray-100 bg-white flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-logo text-gray-900">
            Tua<span className="text-brand-400">Ka</span>
          </span>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
              key={to}
              to={to}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            className="w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 text-left rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => logout()}
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Verification banner */}
        {isUnverified && (
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 flex items-center justify-between gap-4">
            <p className="text-sm text-amber-800">
              Please verify your email to enable invoice sending.
            </p>
            <button
              className="text-sm font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2 disabled:opacity-50 shrink-0"
              disabled={resending || resent}
              onClick={() => resend()}
            >
              {resent ? 'Email sent ✓' : resending ? 'Sending…' : 'Resend email'}
            </button>
          </div>
        )}

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
    </div>
  )
}
