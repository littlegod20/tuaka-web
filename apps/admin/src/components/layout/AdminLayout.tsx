import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAdminLogout } from '@tuaka/api-client'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

const SIDEBAR_COLLAPSED_KEY = 'tuaka_admin_sidebar_collapsed'

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

function IconWorkspaces({ className }: { className?: string }) {
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

function IconPlans({ className }: { className?: string }) {
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
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <circle cx="8" cy="16" r="1" />
      <circle cx="12" cy="16" r="1" />
      <circle cx="16" cy="16" r="1" />
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

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { to: '/tenants', label: 'Workspaces', Icon: IconWorkspaces },
  { to: '/plans', label: 'Plans', Icon: IconPlans },
] as const

function mobileNavLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[0.65rem] font-medium leading-tight transition-colors',
    isActive ? 'bg-brand-50 font-medium text-brand-600' : 'text-gray-600',
  )
}

export function AdminLayout() {
  const { mutate: logout, isPending: isLoggingOut } = useAdminLogout()
  const [showSignOutModal, setShowSignOutModal] = useState(false)
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

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={cn(
          'hidden flex-col border-r border-gray-100 bg-white transition-[width] duration-200 ease-out lg:flex',
          collapsed ? 'w-[4.25rem]' : 'w-56',
        )}
      >
        <div
          className={cn(
            'flex items-center border-b border-gray-100',
            collapsed ? 'flex-col gap-2 px-2 py-3' : 'justify-between gap-2 px-3 py-4 pl-4',
          )}
        >
          {!collapsed && (
            <span className="inline-block min-w-0 text-lg font-logo text-gray-900">
              Tua<span className="text-brand-400">Ka</span>
              <sup className="ml-0.5 align-super font-sans text-[0.55rem] font-semibold leading-none text-brand-600">
                <span className="rounded bg-brand-100 px-1 py-px">Admin</span>
              </sup>
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
                      ? 'bg-brand-50 font-medium text-brand-600'
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
              onClick={() => setShowSignOutModal(true)}
            >
              <IconSignOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </CollapsedTooltip>
        </div>
      </aside>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 lg:p-6">
        <div className="outlet-scroll-area min-h-0 flex-1 overflow-y-auto pb-[max(6.5rem,env(safe-area-inset-bottom)+5.5rem)] lg:pb-0">
          <div className="outlet-page-shell">
            <Outlet />
          </div>
        </div>
      </main>

      <div className="lg:hidden" data-mobile-nav-root>
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-[max(0.35rem,env(safe-area-inset-bottom))]"
          aria-label="Primary"
        >
          <div className="pointer-events-auto mx-3 mb-3 flex h-[3.25rem] items-stretch justify-between gap-0.5 rounded-2xl border border-gray-200 bg-white/95 px-1 py-1 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                aria-label={label}
                className={mobileNavLinkClass}
                to={to}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="max-w-[4.25rem] truncate text-center">{label}</span>
              </NavLink>
            ))}
            <button
              aria-label="Sign out"
              className="flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[0.65rem] font-medium leading-tight text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              type="button"
              onClick={() => setShowSignOutModal(true)}
            >
              <IconSignOut className="h-5 w-5 shrink-0" />
              <span className="max-w-[4.25rem] truncate text-center">Sign out</span>
            </button>
          </div>
        </nav>
      </div>

      <ConfirmDialog
        confirmLabel="Sign out"
        loading={isLoggingOut}
        message="You will be signed out of your account on this device."
        open={showSignOutModal}
        title="Sign out?"
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={() => logout()}
      />
    </div>
  )
}
