import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useLogout, useMe, useResendVerification } from '@tuaka/api-client'

const SIDEBAR_COLLAPSED_KEY = 'tuaka_portal_sidebar_collapsed'

function cn(...parts: (string | boolean | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect height="9" rx="1" width="7" x="3" y="3" />
      <rect height="5" rx="1" width="7" x="14" y="3" />
      <rect height="9" rx="1" width="7" x="14" y="12" />
      <rect height="5" rx="1" width="7" x="3" y="16" />
    </svg>
  )
}

function IconInvoices({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}

function IconClients({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconProducts({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 11h18" />
      <circle cx="8.5" cy="15.5" r="1.5" />
      <circle cx="15.5" cy="15.5" r="1.5" />
    </svg>
  )
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconSignOut({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

/** Sidebar rail icon: suggests toggling the panel */
function IconSidebar({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect height="18" rx="2" width="18" x="3" y="3" />
      <path d="M9 3v18" />
    </svg>
  )
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { to: '/invoices', label: 'Invoices', Icon: IconInvoices },
  { to: '/clients', label: 'Clients', Icon: IconClients },
  { to: '/products', label: 'Products', Icon: IconProducts },
  { to: '/settings', label: 'Settings', Icon: IconSettings },
] as const

function CollapsedTooltip({
  children,
  label,
  show,
}: {
  children: React.ReactNode
  label: string
  show: boolean
}) {
  if (!show) return <>{children}</>
  return (
    <div className="group/navtip relative flex w-full justify-center">
      {children}
      <span
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/navtip:opacity-100"
        role="tooltip"
      >
        {label}
      </span>
    </div>
  )
}

export function AppLayout() {
  const { mutate: logout } = useLogout()
  const { data: me } = useMe()
  const { mutate: resend, isPending: resending, isSuccess: resent } = useResendVerification()

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  const isUnverified = me?.user && !me.user.email_verified_at

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={cn(
          'flex flex-col border-r border-gray-100 bg-white transition-[width] duration-200 ease-out',
          collapsed ? 'w-[4.25rem]' : 'w-56',
        )}
      >
        <div
          className={cn(
            'flex items-center border-b border-gray-100',
            collapsed ? 'flex-col gap-2 px-2 py-3' : 'justify-between px-3 py-4 pl-4',
          )}
        >
          {!collapsed && (
            <span className="text-lg font-logo text-gray-900">
              Tua<span className="text-brand-400">Ka</span>
            </span>
          )}
          <button
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900',
              collapsed && 'mx-auto',
            )}
            type="button"
            onClick={() => setCollapsed((c) => !c)}
          >
            <IconSidebar className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map(({ to, label, Icon }) => (
            <CollapsedTooltip key={to} label={label} show={collapsed}>
              <NavLink
                aria-label={collapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-lg text-sm transition-colors',
                    collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2',
                    isActive
                      ? 'bg-brand-50 text-brand-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50',
                  )
                }
                to={to}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </CollapsedTooltip>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-2">
          <CollapsedTooltip label="Sign out" show={collapsed}>
            <button
              aria-label={collapsed ? 'Sign out' : undefined}
              className={cn(
                'flex w-full items-center rounded-lg text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700',
                collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2 text-left',
              )}
              type="button"
              onClick={() => logout()}
            >
              <IconSignOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </CollapsedTooltip>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Verification banner */}
        {isUnverified && (
          <div className="flex items-center justify-between gap-4 border-b border-amber-100 bg-amber-50 px-6 py-2.5">
            <p className="text-sm text-amber-800">
              Please verify your email to enable invoice sending.
            </p>
            <button
              className="shrink-0 text-sm font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 disabled:opacity-50"
              disabled={resending || resent}
              type="button"
              onClick={() => resend()}
            >
              {resent ? 'Email sent ✓' : resending ? 'Sending…' : 'Resend email'}
            </button>
          </div>
        )}

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
