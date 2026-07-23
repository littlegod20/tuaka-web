import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInvoices, useClients } from '@tuaka/api-client'
import { useDebouncedValue, formatGHS } from '@tuaka/utils'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
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

function IconList({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate   = useNavigate()
  const inputRef   = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const debounced  = useDebouncedValue(query, 200)

  const { data: invoices } = useInvoices({
    search: debounced || undefined,
  })

  const { data: clients } = useClients({
    search: debounced || undefined,
  })

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function go(path: string) {
    navigate(path)
    onClose()
  }

  const hasResults =
    (invoices?.data.length ?? 0) > 0 ||
    (clients?.data.length ?? 0) > 0

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-800">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-700">
          <svg className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
            placeholder="Search invoices, clients…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {!query && (
            <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
              Start typing to search invoices and clients
            </div>
          )}

          {query && !hasResults && (
            <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
              No results for "{query}"
            </div>
          )}

          {/* Invoices */}
          {(invoices?.data.length ?? 0) > 0 && (
            <div>
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:bg-gray-900/60 dark:text-gray-500">
                Invoices
              </div>
              {invoices!.data.slice(0, 5).map((inv) => (
                <button
                  key={inv.id}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() => go(`/invoices/${inv.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-brand-600">
                      {inv.number}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {inv.client?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 tabular-nums dark:text-gray-300">
                      {formatGHS(inv.total)}
                    </span>
                    <span className={`rounded-full px-1.5 py-0.5 text-xs capitalize ${
                      inv.status === 'paid'    ? 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300' :
                      inv.status === 'overdue' ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300' :
                      inv.status === 'draft'   ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300' :
                      'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Clients */}
          {(clients?.data.length ?? 0) > 0 && (
            <div>
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:bg-gray-900/60 dark:text-gray-500">
                Clients
              </div>
              {clients!.data.slice(0, 4).map((client) => (
                <button
                  key={client.id}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() => go('/clients')}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600 dark:bg-brand-900/50 dark:text-brand-300">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {client.name}
                    </p>
                    {client.company && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">{client.company}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick actions when no query */}
          {!query && (
            <div>
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:bg-gray-900/60 dark:text-gray-500">
                Quick actions
              </div>
              {[
                { label: 'New invoice',   path: '/invoices/new',            Icon: IconInvoice },
                { label: 'New quote',     path: '/invoices/new?type=quote', Icon: IconQuote },
                { label: 'Add client',    path: '/clients',                 Icon: IconAddClient },
                { label: 'View invoices', path: '/invoices',                Icon: IconList },
              ].map(({ label, path, Icon }) => (
                <button
                  key={path}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() => go(path)}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0 text-brand-600 dark:text-brand-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-gray-100 px-4 py-2 text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
          <span><kbd className="rounded bg-gray-100 px-1 dark:bg-gray-700">↵</kbd> to select</span>
          <span><kbd className="rounded bg-gray-100 px-1 dark:bg-gray-700">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  )
}