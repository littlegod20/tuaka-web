import { useEffect, useRef, type ReactNode } from 'react'

import { Button } from './Button'

export type PaginationMeta = {
  current_page: number
  last_page: number
  /** Defaults to 20 if omitted (match Laravel paginator when absent). */
  per_page?: number
  total: number
}

export type DataTableColumn<T> = {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
  headerClassName?: string
}

export type BulkAction = {
  /** Stable key for React list */
  key: string
  label: string
  icon?: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  /** All selected row ids (may span pages; table only receives one page of `rows`) */
  onClick: (selectedIds: string[]) => void
  disabled?: boolean
}

export type DataTableSelection = {
  selectedIds: readonly string[]
  onSelectionChange: (ids: string[]) => void
}

export type DataTableProps<T extends { id: string }> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  /** Defaults to `row.id` */
  getRowId?: (row: T) => string

  /** Merged onto the root card */
  className?: string
  /**
   * Tailwind classes for max-height on the scrollable table wrapper (defaults to a viewport-based cap).
   * The table area grows with content up to this max, then scrolls.
   */
  tableMaxHeightClassName?: string

  isLoading?: boolean
  emptyContent?: ReactNode

  pagination?: {
    meta: PaginationMeta
    page: number
    onPageChange: (page: number) => void
    /** Plural label for the total line, e.g. "clients" → "Showing 1–20 of 45 clients" */
    itemLabel?: string
  }

  selection?: DataTableSelection
  /** Shown in the bar when `selection` is set and at least one row is selected */
  bulkActions?: BulkAction[]
  /** When true (default), shows “Clear selection” in the bulk bar */
  showClearSelection?: boolean
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  getRowId = (row) => row.id,
  className,
  tableMaxHeightClassName = 'max-h-[calc(100dvh-14rem)]',
  isLoading,
  emptyContent,
  pagination,
  selection,
  bulkActions = [],
  showClearSelection = true,
}: DataTableProps<T>) {
  const selectedIds = selection?.selectedIds ?? []
  const onSelectionChange = selection?.onSelectionChange

  const pageIds = rows.map(getRowId)
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id))
  const someOnPageSelected = pageIds.some((id) => selectedIds.includes(id))

  const headerCheckboxRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const el = headerCheckboxRef.current
    if (el) {
      el.indeterminate = someOnPageSelected && !allOnPageSelected
    }
  }, [someOnPageSelected, allOnPageSelected])

  function toggleSelectAllOnPage() {
    if (!onSelectionChange) return
    if (allOnPageSelected) {
      onSelectionChange(selectedIds.filter((id) => !pageIds.includes(id)))
    } else {
      onSelectionChange([...new Set([...selectedIds, ...pageIds])])
    }
  }

  function toggleRow(id: string) {
    if (!onSelectionChange) return
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((x) => x !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  function clearSelection() {
    onSelectionChange?.([])
  }

  const selectedCount = selectedIds.length
  const showBulkBar =
    Boolean(selection) && bulkActions.length > 0 && selectedCount > 0

  let showingFrom = 0
  let showingTo = 0
  if (pagination && rows.length > 0) {
    const perPage = pagination.meta.per_page ?? 20
    showingFrom = (pagination.page - 1) * perPage + 1
    showingTo = showingFrom + rows.length - 1
  }

  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white ${className ?? ''}`}
    >
      {showBulkBar && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-brand-100 bg-brand-50/80 px-4 py-3">
          <p className="text-sm font-medium text-brand-900">
            {selectedCount} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions.map((action) => (
              <Button
                key={action.key}
                size="sm"
                variant={action.variant ?? 'secondary'}
                disabled={action.disabled}
                type="button"
                onClick={() => action.onClick([...selectedIds])}
              >
                {action.icon ? (
                  <span className="inline-flex items-center gap-1.5">
                    {action.icon}
                    {action.label}
                  </span>
                ) : (
                  action.label
                )}
              </Button>
            ))}
            {showClearSelection && (
              <button
                className="text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
                type="button"
                onClick={clearSelection}
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
        </div>
      ) : rows.length === 0 ? (
        <div className="py-16 text-center">{emptyContent}</div>
      ) : (
        <div
          className={`overflow-x-auto overflow-y-auto overscroll-contain ${tableMaxHeightClassName}`}
        >
          <table className="w-full text-sm">
            <thead className="text-left">
              <tr>
                {selection && (
                  <th className="sticky top-0 z-[1] w-10 border-b border-gray-100 bg-white px-3 py-3">
                    <input
                      ref={headerCheckboxRef}
                      aria-label="Select all on this page"
                      checked={allOnPageSelected}
                      className="h-4 w-4 rounded border-gray-300 accent-brand-400 focus:ring-offset-0"
                      type="checkbox"
                      onChange={toggleSelectAllOnPage}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className={`sticky top-0 z-[1] border-b border-gray-100 bg-white px-4 py-3 font-medium text-gray-500 ${col.headerClassName ?? ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {rows.map((row) => {
                const id = getRowId(row)
                const checked = selectedIds.includes(id)
                return (
                  <tr
                    key={id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {selection && (
                      <td className="px-3 py-3">
                        <input
                          aria-label={`Select row ${id}`}
                          checked={checked}
                          className="h-4 w-4 rounded border-gray-300 accent-brand-400 focus:ring-offset-0"
                          type="checkbox"
                          onChange={() => toggleRow(id)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={`px-4 py-3 ${col.className ?? ''}`}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {pagination && !isLoading && rows.length > 0 && (
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm">
          <p className="min-w-0 flex-1 text-gray-600">
            Showing{' '}
            <span className="font-medium text-gray-900">
              {showingFrom.toLocaleString()}–{showingTo.toLocaleString()}
            </span>{' '}
            of{' '}
            <span className="font-medium text-gray-900">
              {pagination.meta.total.toLocaleString()}
            </span>{' '}
            {pagination.itemLabel ?? 'rows'}
          </p>
          <div className="ml-auto flex shrink-0 gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={pagination.page <= 1}
              type="button"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={pagination.page >= pagination.meta.last_page}
              type="button"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
