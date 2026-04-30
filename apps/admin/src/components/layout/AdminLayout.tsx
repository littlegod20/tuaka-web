import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tenants', label: 'Tenants' },
  { to: '/plans', label: 'Plans' },
]

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 border-r border-gray-100 bg-white flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-logo text-gray-900">
            Tua<span className="text-brand-400">Ka</span>
          </span>
          <span className="ml-2 text-xs text-gray-400">Admin</span>
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
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
