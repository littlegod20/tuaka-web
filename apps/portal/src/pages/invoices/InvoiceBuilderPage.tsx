import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  useInvoice,
  useCreateInvoice,
  useUpdateInvoice,
  useClients,
  useProducts,
  type InvoiceItemPayload,
  type InvoicePayload,
} from '@tuaka/api-client'
import { formatGHS, toPs, fromPs } from '@tuaka/utils'
import { Button } from '@tuaka/ui'

interface LineItem {
  id?: string
  product_id?: string
  description: string
  quantity: number
  unit_price_ghs: string  // display string e.g. "90.00"
  unit_price: number      // pesewas
  total: number           // pesewas
}

function emptyLine(): LineItem {
  return { description: '', quantity: 1, unit_price_ghs: '', unit_price: 0, total: 0 }
}

export function InvoiceBuilderPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isEditing = !!id
  const defaultType = (searchParams.get('type') as 'invoice' | 'quote') ?? 'invoice'

  const { data: existing, isLoading: loadingInvoice } = useInvoice(id ?? '')
  const { mutate: createInvoice, isPending: creating } = useCreateInvoice()
  const { mutate: updateInvoice, isPending: updating } = useUpdateInvoice(id ?? '')
  const { data: clientsData } = useClients({ per_page: 100 } as any)
  const { data: productsData } = useProducts({ per_page: 100 } as any)

  const [clientId, setClientId] = useState('')
  const [type, setType] = useState<'invoice' | 'quote'>(defaultType)
  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<LineItem[]>([emptyLine()])
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  // Populate form when editing
  useEffect(() => {
    if (existing) {
      setClientId(existing.client_id)
      setType(existing.type)
      setTaxRate(existing.tax_rate)
      setNotes(existing.notes ?? '')
      setDueDate(existing.due_date ?? '')
      setItems(
        existing.items.map((item) => ({
          id: item.id,
          product_id: item.product_id ?? undefined,
          description: item.description,
          quantity: item.quantity,
          unit_price_ghs: fromPs(item.unit_price),
          unit_price: item.unit_price,
          total: item.total,
        }))
      )
    }
  }, [existing?.id])

  // ─── Line item helpers ────────────────────────────────────────────

  function updateItem(index: number, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item
        const updated = { ...item, ...patch }
        // Recalculate total if price or qty changed
        if ('unit_price_ghs' in patch) {
          updated.unit_price = toPs(patch.unit_price_ghs ?? '')
        }
        updated.total = updated.quantity * updated.unit_price
        return updated
      })
    )
  }

  function addLine() {
    setItems((prev) => [...prev, emptyLine()])
  }

  function removeLine(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function applyProduct(index: number, productId: string) {
    const product = productsData?.data.find((p) => p.id === productId)
    if (!product) return
    updateItem(index, {
      product_id: product.id,
      description: product.name,
      unit_price_ghs: fromPs(product.default_price),
      unit_price: product.default_price,
    })
  }

  // ─── Totals ───────────────────────────────────────────────────────

  const subtotal  = items.reduce((sum, i) => sum + i.total, 0)
  const taxAmount = Math.round(subtotal * (taxRate / 100))
  const total     = subtotal + taxAmount

  // ─── Submit ───────────────────────────────────────────────────────

  function buildPayload(): InvoicePayload {
    return {
      client_id: clientId,
      type,
      tax_rate: taxRate,
      notes: notes || undefined,
      due_date: dueDate || undefined,
      items: items.map((item): InvoiceItemPayload => ({
        id: item.id,
        product_id: item.product_id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    const payload = buildPayload()

    if (isEditing) {
      updateInvoice(payload, {
        onSuccess: (inv) => navigate(`/invoices/${inv.id}`),
        onError: (err: any) => setErrors(err?.response?.data?.errors ?? {}),
      })
    } else {
      createInvoice(payload, {
        onSuccess: (inv) => navigate(`/invoices/${inv.id}`),
        onError: (err: any) => setErrors(err?.response?.data?.errors ?? {}),
      })
    }
  }

  if (isEditing && loadingInvoice) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isPending = creating || updating

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? `Edit ${existing?.number}` : `New ${type}`}
          </h1>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/invoices')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            {isEditing ? 'Save changes' : `Create ${type}`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — line items */}
        <div className="space-y-4 lg:col-span-2">

          {/* Line items card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Line items</h2>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[640px] lg:min-w-0">
            {/* Column headers */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2 text-xs font-medium text-gray-400">
              <span>Description</span>
              <span>Qty</span>
              <span>Unit price</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-50">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-4 py-3 items-start"
                >
                  {/* Description + product picker */}
                  <div className="flex flex-col gap-1.5">
                    {productsData?.data.length ? (
                      <select
                        className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-500 outline-none focus:border-brand-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
                        value={item.product_id ?? ''}
                        onChange={(e) => {
                          if (e.target.value) applyProduct(index, e.target.value)
                          else updateItem(index, { product_id: undefined })
                        }}
                      >
                        <option value="">Select product…</option>
                        {productsData.data.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    ) : null}
                    <input
                      required
                      className={`w-full rounded-md border px-2 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20 dark:bg-gray-900 dark:text-gray-100 ${errors[`items.${index}.description`] ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, { description: e.target.value })}
                    />
                  </div>

                  {/* Quantity */}
                  <input
                    required
                    className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                    min={1}
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, { quantity: parseInt(e.target.value) || 1 })
                    }
                  />

                  {/* Unit price */}
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">₵</span>
                    <input
                      required
                      className="w-full rounded-md border border-gray-200 pl-5 pr-2 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      min={0}
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={item.unit_price_ghs}
                      onChange={(e) => updateItem(index, { unit_price_ghs: e.target.value })}
                    />
                  </div>

                  {/* Total */}
                  <span className="text-right text-sm font-medium text-gray-900 dark:text-gray-100 pt-1.5 tabular-nums">
                    {formatGHS(item.total)}
                  </span>

                  {/* Remove */}
                  <button
                    type="button"
                    className="text-gray-300 hover:text-red-400 transition-colors pt-1.5 disabled:opacity-30"
                    disabled={items.length === 1}
                    onClick={() => removeLine(index)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-50 px-4 py-3">
              <button
                type="button"
                className="text-sm font-medium text-brand-500 transition-colors hover:text-brand-700"
                onClick={addLine}
              >
                + Add line item
              </button>
            </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
                text-gray-900 placeholder-gray-400 outline-none resize-none
                focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20
                dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              placeholder="Payment terms, bank details, thank you note…"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right — details + totals */}
        <div className="space-y-4">

          {/* Details card */}
          <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-4 space-y-4">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Details</h2>

            {/* Type — only on create */}
            {!isEditing && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'invoice' | 'quote')}
                >
                  <option value="invoice">Invoice</option>
                  <option value="quote">Quote</option>
                </select>
              </div>
            )}

            {/* Client */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
              <select
                required
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand-400 dark:bg-gray-900 dark:text-gray-100 ${errors.client_id ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Select client…</option>
                {clientsData?.data.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.client_id && (
                <p className="text-xs text-red-500">{errors.client_id[0]}</p>
              )}
            </div>

            {/* Due date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Due date <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:[color-scheme:dark]"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Tax rate */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax rate (%)</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                max={100}
                min={0}
                placeholder="0"
                type="number"
                value={taxRate || ''}
                onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Totals card */}
          <div className="bg-white rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatGHS(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tax ({taxRate}%)</span>
                <span className="tabular-nums">{formatGHS(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="tabular-nums">{formatGHS(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}