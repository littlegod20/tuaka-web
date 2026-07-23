import { useEffect, useState } from 'react'
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useBulkDestroyProducts,
  type Product,
  type ProductPayload,
} from '@tuaka/api-client'
import { useDebouncedValue, formatGHS } from '@tuaka/utils'
import { Button, DataTable, type DataTableColumn } from '@tuaka/ui'
import { ProductForm } from '../../components/products/ProductForm'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Modal } from '../../components/ui/Modal'

function IconEdit({ className }: { className?: string }) {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}

function IconTrash({ className }: { className?: string }) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}

const SEARCH_DEBOUNCE_MS = 350

export function ProductsPage() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    setSelectedIds([])
  }, [debouncedSearch])

  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  const { data, isLoading } = useProducts({ search: debouncedSearch, page })
  const { mutate: createProduct, isPending: creating_ } = useCreateProduct()
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct(editing?.id ?? '')
  const { mutateAsync: deleteProductAsync, isPending: deleting_ } = useDeleteProduct()
  const { mutateAsync: bulkDestroyProducts, isPending: bulkDestroying_ } =
    useBulkDestroyProducts()

  function handleCreate(values: ProductPayload) {
    setFormErrors({})
    createProduct(values, {
      onSuccess: () => setCreating(false),
      onError: (err: any) => setFormErrors(err?.response?.data?.errors ?? {}),
    })
  }

  function handleUpdate(values: ProductPayload) {
    setFormErrors({})
    updateProduct(values, {
      onSuccess: () => setEditing(null),
      onError: (err: any) => setFormErrors(err?.response?.data?.errors ?? {}),
    })
  }

  function handleDelete() {
    if (!deleting) return
    const id = deleting.id
    deleteProductAsync(id).then(() => {
      setDeleting(null)
      setSelectedIds((ids) => ids.filter((x) => x !== id))
    })
  }

  async function handleBulkDelete() {
    if (!bulkDeletingIds?.length) return
    try {
      const result = await bulkDestroyProducts(bulkDeletingIds)
      setBulkDeletingIds(null)
      setSelectedIds([])
      if (result.failed.length > 0) {
        window.alert(
          `Deleted ${result.deleted_count} product(s). ${result.failed.length} could not be removed (for example, products used on invoices).`,
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  function productOnPage(id: string) {
    return data?.data.find((p) => p.id === id)
  }

  const columns: DataTableColumn<Product>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (row) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">{row.name}</span>
      ),
    },
    {
      id: 'description',
      header: 'Description',
      cell: (row) => (
        <span className="text-gray-500 line-clamp-1">
          {row.description ?? '—'}
        </span>
      ),
    },
    {
      id: 'price',
      header: 'Default price',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (row) => (
        <span className="font-medium text-gray-900 dark:text-gray-100 tabular-nums">
          {formatGHS(row.default_price)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      headerClassName: 'w-[1%]',
      className: 'text-right',
      cell: (product) => (
        <div className="inline-flex items-center gap-1">
          <button
            aria-label={`Edit ${product.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            type="button"
            onClick={() => { setFormErrors({}); setEditing(product) }}
          >
            <IconEdit className="h-4 w-4" />
          </button>
          <button
            aria-label={`Delete ${product.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
            type="button"
            onClick={() => setDeleting(product)}
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Products & Services</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {data?.meta.total ?? 0} total
          </p>
        </div>
        <Button onClick={() => { setFormErrors({}); setCreating(true) }}>
          + Add product
        </Button>
      </div>

      <div className="mb-4 shrink-0">
        <input
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          placeholder="Search products…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <DataTable<Product>
        bulkActions={[
          {
            key: 'edit',
            label: 'Edit',
            variant: 'secondary',
            icon: <IconEdit className="h-4 w-4" />,
            disabled:
              selectedIds.length !== 1 || !productOnPage(selectedIds[0] ?? ''),
            onClick: (ids) => {
              const p = productOnPage(ids[0]!)
              if (p) {
                setFormErrors({})
                setEditing(p)
                setSelectedIds([])
              }
            },
          },
          {
            key: 'delete',
            label: 'Delete',
            variant: 'danger',
            icon: <IconTrash className="h-4 w-4" />,
            onClick: (ids) => setBulkDeletingIds(ids),
          },
        ]}
        columns={columns}
        emptyContent={
          <p className="text-sm text-gray-400">
            {debouncedSearch.trim()
              ? 'No products match your search.'
              : 'No products yet. Add your first one.'}
          </p>
        }
        isLoading={isLoading}
        pagination={
          data
            ? {
                meta: data.meta,
                page,
                onPageChange: setPage,
                itemLabel: 'products',
              }
            : undefined
        }
        rows={data?.data ?? []}
        selection={{
          selectedIds,
          onSelectionChange: setSelectedIds,
        }}
      />

      <Modal open={creating} title="Add product" onClose={() => setCreating(false)}>
        <ProductForm
          loading={creating_}
          errors={formErrors}
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      <Modal open={!!editing} title="Edit product" onClose={() => setEditing(null)}>
        {editing && (
          <ProductForm
            initial={editing}
            loading={updating}
            errors={formErrors}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete product"
        message={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
        loading={deleting_}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />

      <ConfirmDialog
        open={!!bulkDeletingIds?.length}
        title="Delete products"
        message={`Delete ${bulkDeletingIds?.length ?? 0} product(s)? This cannot be undone.`}
        loading={bulkDestroying_}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeletingIds(null)}
      />
    </div>
  )
}
