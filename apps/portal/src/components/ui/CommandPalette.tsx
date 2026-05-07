import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInvoices, useClients } from '@tuaka/api-client'
import { useDebouncedValue, formatGHS } from '@tuaka/utils'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
            placeholder="Search invoices, clients…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {!query && (
            <div className="py-8 text-center text-sm text-gray-400">
              Start typing to search invoices and clients
            </div>
          )}

          {query && !hasResults && (
            <div className="py-8 text-center text-sm text-gray-400">
              No results for "{query}"
            </div>
          )}

          {/* Invoices */}
          {(invoices?.data.length ?? 0) > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                Invoices
              </div>
              {invoices!.data.slice(0, 5).map((inv) => (
                <button
                  key={inv.id}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => go(`/invoices/${inv.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-brand-600">
                      {inv.number}
                    </span>
                    <span className="text-sm text-gray-500">
                      {inv.client?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 tabular-nums">
                      {formatGHS(inv.total)}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${
                      inv.status === 'paid'    ? 'bg-green-50 text-green-700' :
                      inv.status === 'overdue' ? 'bg-red-50 text-red-600' :
                      inv.status === 'draft'   ? 'bg-gray-100 text-gray-500' :
                      'bg-blue-50 text-blue-600'
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
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                Clients
              </div>
              {clients!.data.slice(0, 4).map((client) => (
                <button
                  key={client.id}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => go('/clients')}
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-600 shrink-0">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {client.name}
                    </p>
                    {client.company && (
                      <p className="text-xs text-gray-400">{client.company}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick actions when no query */}
          {!query && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                Quick actions
              </div>
              {[
                { label: 'New invoice',  path: '/invoices/new',           icon: '🧾' },
                { label: 'New quote',    path: '/invoices/new?type=quote', icon: '📋' },
                { label: 'Add client',   path: '/clients',                 icon: '👤' },
                { label: 'View invoices',path: '/invoices',                icon: '📂' },
              ].map((action) => (
                <button
                  key={action.path}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => go(action.path)}
                >
                  <span className="text-base">{action.icon}</span>
                  <span className="text-sm text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
          <span><kbd className="bg-gray-100 px-1 rounded">↵</kbd> to select</span>
          <span><kbd className="bg-gray-100 px-1 rounded">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  )
}