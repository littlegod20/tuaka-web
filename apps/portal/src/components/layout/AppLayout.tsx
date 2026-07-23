import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useLogout, useMe, useResendVerification } from '@tuaka/api-client'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { CommandPalette } from '../ui/CommandPalette'

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


function IconBilling({ className }: { className?: string }) {
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

function IconTeam({ className }: { className?: string }) {
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
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
    </svg>
  )
}

function IconMore({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
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


export function AppLayout() {
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const { data: me } = useMe()
  const { mutate: resend, isPending: resending, isSuccess: resent } = useResendVerification()
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
    } catch {
      return false
    }
  })

  const myRole = me?.user.role ?? 'member'

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
    { to: '/invoices', label: 'Invoices', Icon: IconInvoices },
    { to: '/clients', label: 'Clients', Icon: IconClients },
    { to: '/products', label: 'Products', Icon: IconProducts },
    { to: '/settings', label: 'Settings', Icon: IconSettings },
    ...(myRole === 'owner' || myRole === 'admin'
      ? [{ to: '/team', label: 'Team', Icon: IconTeam }]
      : []),
    ...(myRole === 'owner'
      ? [{ to: '/billing', label: 'Billing', Icon: IconBilling }]
      : []),
  ] as const

  const primaryBottomNavItems = [
    { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
    { to: '/invoices', label: 'Invoices', Icon: IconInvoices },
    { to: '/clients', label: 'Clients', Icon: IconClients },
    { to: '/products', label: 'Products', Icon: IconProducts },
  ] as const

  const moreNavLinks = [
    { to: '/settings', label: 'Settings', Icon: IconSettings },
    ...(myRole === 'owner' || myRole === 'admin'
      ? [{ to: '/team', label: 'Team', Icon: IconTeam }]
      : []),
    ...(myRole === 'owner'
      ? [{ to: '/billing', label: 'Billing', Icon: IconBilling }]
      : []),
  ] as const

  const navigate = useNavigate()

  const trialEndsAt   = me?.subscription?.trial_ends_at
  const isTrialing    = me?.subscription?.is_trialing
  const daysLeft      = trialEndsAt
    ? Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000)
    : null
  const showTrialWarn = isTrialing && daysLeft !== null && daysLeft <= 3

  const usage        = me?.usage
  const limitReached = usage?.limit_reached
  const isFreeTier   = !me?.subscription || me?.subscription?.status === 'cancelled'

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    setMoreMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!moreMenuOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMoreMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [moreMenuOpen])

  const isUnverified = me?.user && !me.user.email_verified_at

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[0.65rem] font-medium leading-tight transition-colors',
      isActive
        ? 'bg-brand-50 font-medium text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
        : 'text-gray-600 dark:text-gray-400',
    )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <aside
        className={cn(
          'hidden flex-col border-r border-gray-100 bg-white transition-[width] duration-200 ease-out dark:border-gray-800 dark:bg-gray-900 lg:flex',
          collapsed ? 'w-[4.25rem]' : 'w-56',
        )}
      >
        <div
          className={cn(
            'flex items-center border-b border-gray-100 dark:border-gray-800',
            collapsed ? 'flex-col gap-2 px-2 py-3' : 'justify-between px-3 py-4 pl-4',
          )}
        >
          {!collapsed && (
            <span className="text-lg font-logo text-gray-900 dark:text-gray-100">
              Tua<span className="text-brand-400">Ka</span>
            </span>
          )}
          <button
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
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
                      ? 'bg-brand-50 font-medium text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800',
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

        <div className="border-t border-gray-100 p-2 dark:border-gray-800">
          <CollapsedTooltip label="Sign out" show={collapsed}>
            <button
              aria-label={collapsed ? 'Sign out' : undefined}
              className={cn(
                'flex w-full items-center rounded-lg text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
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

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Verification banner */}
        {isUnverified && (
          <div className="flex flex-col gap-2 border-b border-amber-100 bg-amber-50 px-4 py-2.5 dark:border-amber-900/40 dark:bg-amber-950/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Please verify your email to enable invoice sending.
            </p>
            <button
              className="shrink-0 self-start text-sm font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 disabled:opacity-50 dark:text-amber-300 dark:hover:text-amber-100 sm:self-auto"
              disabled={resending || resent}
              type="button"
              onClick={() => resend()}
            >
              {resent ? 'Email sent ✓' : resending ? 'Sending…' : 'Resend email'}
            </button>
          </div>
        )}
        {showTrialWarn && (
          <div className="flex flex-col gap-2 border-b border-blue-100 bg-blue-50 px-4 py-2.5 dark:border-blue-900/40 dark:bg-blue-950/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your free trial ends in <strong>{daysLeft} day{daysLeft === 1 ? '' : 's'}</strong>.
            </p>
            <button
              className="shrink-0 self-start text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100 sm:self-auto"
              onClick={() => navigate('/billing')}
            >
              Upgrade now
            </button>
          </div>
        )}

        {limitReached && isFreeTier && (
          <div className="flex flex-col gap-2 border-b border-red-100 bg-red-50 px-4 py-2.5 dark:border-red-900/40 dark:bg-red-950/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-6">
            <p className="text-sm text-red-800 dark:text-red-200">
              You've used all <strong>{usage?.invoice_limit}</strong> free invoices
              this month.
            </p>
            <button
              className="shrink-0 self-start text-sm font-medium text-red-700 underline underline-offset-2 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100 sm:self-auto"
              onClick={() => navigate('/billing')}
            >
              Upgrade to continue
            </button>
          </div>
        )}

        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <button
            aria-label="Open search"
            className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 lg:hidden"
            type="button"
            onClick={() => setPaletteOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <div className="hidden shrink-0 justify-end px-9 pb-2 pt-6 lg:flex">
            <button
              className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400 transition-colors hover:border-gray-300 dark:border-gray-600 dark:text-gray-500 dark:hover:border-gray-500"
              type="button"
              onClick={() => setPaletteOpen(true)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="flex-1 text-left">Search</span>
              <kbd className="rounded bg-gray-100 px-1 text-xs dark:bg-gray-700 dark:text-gray-400">⌘K</kbd>
            </button>
          </div>
          <div className="outlet-scroll-area min-h-0 flex-1 overflow-y-auto px-4 pb-[max(6.5rem,env(safe-area-inset-bottom)+5.5rem)] pt-4 lg:px-6 lg:pb-6 lg:pt-0">
            <div className="outlet-page-shell">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden" data-mobile-nav-root>
        {moreMenuOpen && (
          <>
            <button
              aria-label="Close menu"
              className="fixed inset-0 z-[45] bg-black/40"
              type="button"
              onClick={() => setMoreMenuOpen(false)}
            />
            <div
              className="fixed left-3 right-3 z-50 max-h-[min(70vh,22rem)] overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800"
              style={{
                bottom: 'max(5.75rem, calc(4.75rem + env(safe-area-inset-bottom, 0px)))',
              }}
            >
              <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                More
              </p>
              <div className="space-y-1">
                {moreNavLinks.map(({ to, label, Icon }) => (
                  <NavLink
                    key={to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                        isActive
                          ? 'bg-brand-50 font-medium text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50',
                      )
                    }
                    to={to}
                    onClick={() => setMoreMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {label}
                  </NavLink>
                ))}
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false)
                    setShowSignOutModal(true)
                  }}
                >
                  <IconSignOut className="h-5 w-5 shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}

        <nav
          className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-[max(0.35rem,env(safe-area-inset-bottom))]"
          aria-label="Primary"
        >
          <div className="pointer-events-auto mx-3 mb-3 flex h-[3.25rem] items-stretch justify-between gap-0.5 rounded-2xl border border-gray-200 bg-white/95 px-1 py-1 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-white/90 dark:border-gray-700 dark:bg-gray-900/95 supports-[backdrop-filter]:dark:bg-gray-900/90">
            {primaryBottomNavItems.map(({ to, label, Icon }) => (
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
              aria-expanded={moreMenuOpen}
              aria-label="More"
              className={cn(
                'flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[0.65rem] font-medium leading-tight transition-colors',
                moreMenuOpen ? 'text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400',
              )}
              type="button"
              onClick={() => setMoreMenuOpen((o) => !o)}
            >
              <IconMore className="h-5 w-5 shrink-0" />
              <span className="max-w-[4.25rem] truncate text-center">More</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Command palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />

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
