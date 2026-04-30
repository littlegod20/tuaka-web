import { Outlet, NavLink } from 'react-router-dom'
import { useLogout } from '@tuaka/api-client'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/invoices',  label: 'Invoices'  },
  { to: '/clients',   label: 'Clients'   },
  { to: '/settings',  label: 'Settings'  },
]

export function AppLayout() {
  const { mutate: logout } = useLogout()

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 border-r border-gray-100 bg-white flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-semibold text-gray-900">
            Tua<span className="text-brand-400">Ka</span>
          </span>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => logout()}
            className="w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 text-left rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
