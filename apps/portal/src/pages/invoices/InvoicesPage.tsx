import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useInvoices,
  useDeleteInvoice,
  useSendInvoice,
  useMarkPaid,
  type Invoice,
  type InvoicesParams,
} from '@tuaka/api-client'
import { useDebouncedValue, formatGHS } from '@tuaka/utils'
import { Button } from '@tuaka/ui'
import { DataTable, type DataTableColumn } from '@tuaka/ui'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Viewed', value: 'viewed' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
]

const STATUS_STYLES: Record<string, string> = {
  draft:   'bg-gray-100 text-gray-600',
  sent:    'bg-blue-50 text-blue-600',
  viewed:  'bg-purple-50 text-purple-600',
  paid:    'bg-green-50 text-green-600',
  overdue: 'bg-red-50 text-red-600',
}

export function InvoicesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<Invoice | null>(null)

  const debouncedSearch = useDebouncedValue(search, 300)

  const params: InvoicesParams = {
    search: debouncedSearch || undefined,
    status: status || undefined,
    page,
  }

  const { data, isLoading } = useInvoices(params)
  const { mutate: deleteInvoice, isPending: deleting_ } = useDeleteInvoice()
  const { mutate: sendInvoice } = useSendInvoice()
  const { mutate: markPaid } = useMarkPaid()

  function handleDelete() {
    if (!deleting) return
    deleteInvoice(deleting.id, { onSuccess: () => setDeleting(null) })
  }

  const columns: DataTableColumn<Invoice>[] = [
    {
      id: 'number',
      header: 'Number',
      cell: (row) => (
        <button
          className="font-medium text-brand-600 hover:underline"
          onClick={() => navigate(`/invoices/${row.id}`)}
        >
          {row.number}
        </button>
      ),
    },
    {
      id: 'client',
      header: 'Client',
      cell: (row) => (
        <span className="text-gray-700">{row.client?.name ?? '—'}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[row.status] ?? ''}`}>
          {row.status}
        </span>
      ),
    },
    {
      id: 'due_date',
      header: 'Due date',
      cell: (row) => (
        <span className="text-gray-500 text-sm">
          {row.due_date
            ? new Date(row.due_date).toLocaleDateString('en-GH', {
                day: 'numeric', month: 'short', year: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
    {
      id: 'total',
      header: 'Amount',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (row) => (
        <span className="font-medium tabular-nums text-gray-900">
          {formatGHS(row.total)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      className: 'text-right',
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <button
            className="text-gray-400 hover:text-gray-700 px-2 py-1 rounded text-xs transition-colors"
            onClick={() => navigate(`/invoices/${row.id}/edit`)}
          >
            Edit
          </button>
          {(row.status === 'draft' || row.status === 'sent') && (
            <button
              className="text-blue-400 hover:text-blue-600 px-2 py-1 rounded text-xs transition-colors"
              onClick={() => sendInvoice(row.id)}
            >
              Send
            </button>
          )}
          {row.status !== 'paid' && row.status !== 'draft' && (
            <button
              className="text-green-500 hover:text-green-700 px-2 py-1 rounded text-xs transition-colors"
              onClick={() => markPaid(row.id)}
            >
              Mark paid
            </button>
          )}
          {row.status === 'draft' && (
            <button
              className="text-red-400 hover:text-red-600 px-2 py-1 rounded text-xs transition-colors"
              onClick={() => setDeleting(row)}
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      {/* Header — stack title and actions on narrow viewports */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {data?.meta.total ?? 0} total
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-2">
          <Button variant="secondary" onClick={() => navigate('/invoices/new?type=quote')}>
            + New quote
          </Button>
          <Button onClick={() => navigate('/invoices/new')}>
            + New invoice
          </Button>
        </div>
      </div>

      {/* Status tabs — horizontal scroll keeps narrow layout compact */}
      <nav
        aria-label="Filter invoices by status"
        className="mb-4 overflow-x-auto overscroll-x-contain border-b border-gray-100 touch-pan-x"
      >
        <div className="flex w-max gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                status === tab.value
                  ? 'border-brand-400 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setStatus(tab.value)
                setPage(1)
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Search */}
      <div className="mb-4">
        <input
          className="w-full max-w-sm rounded-lg border border-gray-200 px-3 py-2 text-sm
            text-gray-900 placeholder-gray-400 outline-none
            focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
          placeholder="Search by number or client…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        isLoading={isLoading}
        emptyContent={
          <p className="text-gray-400 text-sm">
            {debouncedSearch || status
              ? 'No invoices match your filters.'
              : 'No invoices yet. Create your first one.'}
          </p>
        }
        pagination={
          data
            ? {
                meta: data.meta,
                page,
                onPageChange: setPage,
                itemLabel: 'invoices',
              }
            : undefined
        }
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete invoice"
        message={`Delete invoice ${deleting?.number}? This cannot be undone.`}
        loading={deleting_}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}