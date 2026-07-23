import { useParams } from 'react-router-dom'
import { usePublicInvoice } from '@tuaka/api-client'
import { formatGHS } from '@tuaka/utils'
import { useState } from 'react'
import { PaymentModal } from './PaymentModal'  
import { downloadPublicInvoicePdf } from '@tuaka/api-client' 

export function PublicInvoicePage() {
  const { token } = useParams()
  const { data: invoice, isLoading, isError } = usePublicInvoice(token ?? '')
  const [showPayment, setShowPayment] = useState(false)
  const [paid, setPaid] = useState(false)
  const [downloading, setDownloading] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Invoice not found
          </h1>
          <p className="text-sm text-gray-500">
            This link may have expired or the invoice may have been removed.
          </p>
        </div>
      </div>
    )
  }

  const isPaid    = invoice.status === 'paid'
  const isQuote   = invoice.type === 'quote'
  const docLabel  = isQuote ? 'Quote' : 'Invoice'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-lg font-logo text-gray-900 dark:text-gray-100">
            Tua<span className="text-brand-400">Ka</span>
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Powered by TuaKa
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Paid banner */}
        {isPaid && (
          <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-800">Payment received</p>
              <p className="text-sm text-green-600">
                This {docLabel.toLowerCase()} has been paid.
                {invoice.paid_at && (
                  <> Paid on {new Date(invoice.paid_at).toLocaleDateString('en-GH', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}.</>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden dark:border-gray-700 dark:bg-gray-800">

          {/* Header */}
          <div className="border-b border-gray-100 px-4 py-6 sm:px-6 dark:border-gray-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  {invoice.tenant.name}
                </p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {docLabel} {invoice.number}
                </h1>
              </div>
              <span className={`inline-flex shrink-0 items-center self-start rounded-full px-3 py-1 text-sm font-medium capitalize sm:self-auto ${
                isPaid
                  ? 'bg-green-50 text-green-700'
                  : invoice.status === 'overdue'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Bill to + dates */}
          <div className="grid grid-cols-1 gap-6 border-b border-gray-100 px-4 py-5 md:grid-cols-2 md:px-6 dark:border-gray-700">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Bill to
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{invoice.client.name}</p>
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
                  From
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{invoice.tenant.name}</p>
                {invoice.tenant.address && (
                  <p className="text-sm text-gray-500">{invoice.tenant.address}</p>
                )}
                {invoice.tenant.phone && (
                  <p className="text-sm text-gray-500">{invoice.tenant.phone}</p>
                )}
              </div>
              {invoice.due_date && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Due date
                  </p>
                  <p className={`text-sm font-medium ${
                    !isPaid && new Date(invoice.due_date) < new Date()
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {new Date(invoice.due_date).toLocaleDateString('en-GH', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Line items */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                  <th className="px-6 py-3 font-medium text-gray-500">Description</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-right">Qty</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-right">Unit price</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{item.description}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-right tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-right tabular-nums">
                      {formatGHS(item.unit_price)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-right tabular-nums">
                      {formatGHS(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 px-4 py-5 sm:px-6 dark:border-gray-700">
            <div className="ml-auto w-full max-w-xs space-y-2 sm:w-64">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatGHS(invoice.subtotal)}</span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax ({invoice.tax_rate}%)</span>
                  <span className="tabular-nums">{formatGHS(invoice.tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span>Total due</span>
                <span className="tabular-nums">{formatGHS(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Notes
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Pay button */}
          {!isPaid && !paid && !isQuote && (
                <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col items-center gap-3">
                    <button
                        className="w-full max-w-sm bg-brand-400 hover:bg-brand-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors text-base"
                        onClick={() => setShowPayment(true)}
                    >
                        Pay {formatGHS(invoice.total)} with Mobile Money
                    </button>
                    <button
                        disabled={downloading}
                        className="w-full max-w-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 font-medium py-3 px-6 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={async () => {
                            setDownloading(true)
                            await downloadPublicInvoicePdf(token ?? '')
                            setDownloading(false)
                        }}
                        >
                        {downloading ? (
                            <>
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Generating PDF…
                            </>
                        ) : (
                            <>↓ Download PDF</>
                        )}
                    </button>
                    <p className="text-xs text-gray-400">
                        Supports MTN MoMo, Vodafone Cash, AirtelTigo Money
                    </p>
                    </div>
                </div>
            )}

            {(isPaid || paid) && !isQuote && (
            <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <span>✅</span>
                <span>Payment received</span>
                </div>
            </div>
            )}

            {showPayment && (
            <PaymentModal
                token={token ?? ''}
                amount={invoice.total}
                clientEmail={invoice.client.email}
                onSuccess={() => {
                setPaid(true)
                setShowPayment(false)
                }}
                onClose={() => setShowPayment(false)}
            />
            )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-8">
          This {docLabel.toLowerCase()} was sent by {invoice.tenant.name} via TuaKa.
          If you have questions, contact them directly.
        </p>
      </div>
    </div>
  )
}