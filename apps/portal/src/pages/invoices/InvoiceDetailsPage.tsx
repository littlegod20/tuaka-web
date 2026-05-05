import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useInvoice,
  useSendInvoice,
  useMarkPaid,
  useDeleteInvoice,
  useConvertQuote,
} from '@tuaka/api-client'
import { formatGHS } from '@tuaka/utils'
import { Button } from '@tuaka/ui'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

const STATUS_STYLES: Record<string, string> = {
  draft:   'bg-gray-100 text-gray-600',
  sent:    'bg-blue-50 text-blue-600',
  viewed:  'bg-purple-50 text-purple-600',
  paid:    'bg-green-50 text-green-700',
  overdue: 'bg-red-50 text-red-600',
}

const ACTIVITY_LABELS: Record<string, string> = {
  created:   'Invoice created',
  sent:      'Sent to client',
  viewed:    'Viewed by client',
  paid:      'Marked as paid',
  converted: 'Converted from quote',
  reminder:  'Reminder sent',
}

export function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: invoice, isLoading } = useInvoice(id ?? '')
  const { mutate: sendInvoice, isPending: sending } = useSendInvoice()
  const { mutate: markPaid, isPending: markingPaid } = useMarkPaid()
  const { mutate: deleteInvoice, isPending: deleting } = useDeleteInvoice()
  const { mutate: convertQuote, isPending: converting } = useConvertQuote()

  const [confirmSend, setConfirmSend] = useState(false)
  const [confirmPaid, setConfirmPaid] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmConvert, setConfirmConvert] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400">Invoice not found.</p>
        <button
          className="mt-4 text-sm text-brand-500 hover:underline"
          onClick={() => navigate('/invoices')}
        >
          Back to invoices
        </button>
      </div>
    )
  }

  const canEdit    = invoice.status === 'draft'
  const canSend    = invoice.status === 'draft' || invoice.status === 'sent'
  const canPay     = invoice.status !== 'paid' && invoice.status !== 'draft'
  const canDelete  = invoice.status === 'draft'
  const canConvert = invoice.type === 'quote'

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button
            className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 transition-colors"
            onClick={() => navigate('/invoices')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Invoices
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">{invoice.number}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[invoice.status]}`}>
              {invoice.status}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Created {new Date(invoice.created_at).toLocaleDateString('en-GH', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap justify-end">
          {canEdit && (
            <Button
              variant="secondary"
              onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
            >
              Edit
            </Button>
          )}
          {canConvert && (
            <Button
              variant="secondary"
              loading={converting}
              onClick={() => setConfirmConvert(true)}
            >
              Convert to invoice
            </Button>
          )}
          {canPay && (
            <Button
              variant="secondary"
              loading={markingPaid}
              onClick={() => setConfirmPaid(true)}
            >
              Mark as paid
            </Button>
          )}
          {canSend && (
            <Button loading={sending} onClick={() => setConfirmSend(true)}>
              {invoice.status === 'sent' ? 'Resend' : 'Send'}
            </Button>
          )}
          {canDelete && (
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Left — invoice body */}
        <div className="col-span-2 space-y-4">

          {/* Client + dates */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Bill to
                </p>
                <p className="font-semibold text-gray-900">{invoice.client.name}</p>
                {invoice.client.company && (
                  <p className="text-sm text-gray-500">{invoice.client.company}</p>
                )}
                {invoice.client.email && (
                  <p className="text-sm text-gray-500">{invoice.client.email}</p>
                )}
                {invoice.client.phone && (
                  <p className="text-sm text-gray-500">{invoice.client.phone}</p>
                )}
                {invoice.client.address && (
                  <p className="text-sm text-gray-500 mt-1">{invoice.client.address}</p>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Invoice number
                  </p>
                  <p className="text-sm font-medium text-gray-900">{invoice.number}</p>
                </div>
                {invoice.due_date && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Due date
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(invoice.due_date).toLocaleDateString('en-GH', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {invoice.sent_at && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Sent
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(invoice.sent_at).toLocaleDateString('en-GH', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {invoice.paid_at && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Paid
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {new Date(invoice.paid_at).toLocaleDateString('en-GH', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Description</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">Qty</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">Unit price</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-gray-900">{item.description}</td>
                    <td className="px-4 py-3 text-gray-600 text-right tabular-nums">{item.quantity}</td>
                    <td className="px-4 py-3 text-gray-600 text-right tabular-nums">{formatGHS(item.unit_price)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-right tabular-nums">{formatGHS(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-gray-100 px-4 py-4">
              <div className="ml-auto w-64 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatGHS(invoice.subtotal)}</span>
                </div>
                {invoice.tax_rate > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax ({invoice.tax_rate}%)</span>
                    <span className="tabular-nums">{formatGHS(invoice.tax_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="tabular-nums">{formatGHS(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Notes
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Right — activity log */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Activity</h2>

            {!invoice.activities?.length ? (
              <p className="text-xs text-gray-400">No activity yet.</p>
            ) : (
              <ol className="relative border-l border-gray-100 space-y-4 ml-2">
                {invoice.activities.map((activity) => (
                  <li key={activity.id} className="ml-4">
                    <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-brand-100 border-2 border-brand-300" />
                    <p className="text-xs font-medium text-gray-700">
                      {ACTIVITY_LABELS[activity.type] ?? activity.type}
                    </p>
                    {activity.type === 'sent' &&
                        typeof activity.meta?.to === 'string' &&
                        activity.meta.to.trim() !== '' && (
                            <p className="text-xs text-gray-400 mt-0.5">
                            to {activity.meta.to}
                            </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(activity.created_at).toLocaleDateString('en-GH', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={confirmSend}
        title={invoice.status === 'sent' ? 'Resend invoice' : 'Send invoice'}
        message={`This will email ${invoice.number} to ${invoice.client.email ?? invoice.client.name}. Continue?`}
        confirmLabel={invoice.status === 'sent' ? 'Resend' : 'Send'}
        loading={sending}
        onConfirm={() =>
          sendInvoice(invoice.id, { onSuccess: () => setConfirmSend(false) })
        }
        onCancel={() => setConfirmSend(false)}
      />

      <ConfirmDialog
        open={confirmPaid}
        title="Mark as paid"
        message={`Mark ${invoice.number} as paid? This will record the payment date as today.`}
        confirmLabel="Mark paid"
        loading={markingPaid}
        onConfirm={() =>
          markPaid(invoice.id, { onSuccess: () => setConfirmPaid(false) })
        }
        onCancel={() => setConfirmPaid(false)}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete invoice"
        message={`Permanently delete ${invoice.number}? This cannot be undone.`}
        loading={deleting}
        onConfirm={() =>
          deleteInvoice(invoice.id, {
            onSuccess: () => navigate('/invoices'),
          })
        }
        onCancel={() => setConfirmDelete(false)}
      />

      <ConfirmDialog
        open={confirmConvert}
        title="Convert to invoice"
        message={`Convert ${invoice.number} to an invoice? This will assign a new invoice number and reset the status to draft.`}
        confirmLabel="Convert"
        loading={converting}
        onConfirm={() =>
          convertQuote(invoice.id, { onSuccess: () => setConfirmConvert(false) })
        }
        onCancel={() => setConfirmConvert(false)}
      />
    </div>
  )
}