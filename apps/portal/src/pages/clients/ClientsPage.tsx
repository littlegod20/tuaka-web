import { useEffect, useState } from 'react'
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  useBulkDestroyClients,
  type Client,
  type ClientPayload,
} from '@tuaka/api-client'
import { useDebouncedValue } from '@tuaka/utils'
import { Button, DataTable } from '@tuaka/ui'
import { ClientForm } from '../../components/clients/ClientForm'
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

export function ClientsPage() {
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

  // Modal state
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [deleting, setDeleting] = useState<Client | null>(null)
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null)

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  const { data, isLoading } = useClients({ search: debouncedSearch, page })
  const { mutate: createClient, isPending: creating_ } = useCreateClient()
  const { mutate: updateClient, isPending: updating } = useUpdateClient(editing?.id ?? '')
  const { mutateAsync: deleteClientAsync, isPending: deleting_ } = useDeleteClient()
  const { mutateAsync: bulkDestroyClients, isPending: bulkDestroying_ } =
    useBulkDestroyClients()

  function handleCreate(values: ClientPayload) {
    setFormErrors({})
    createClient(values, {
      onSuccess: () => setCreating(false),
      onError: (err: any) => setFormErrors(err?.response?.data?.errors ?? {}),
    })
  }

  function handleUpdate(values: ClientPayload) {
    setFormErrors({})
    updateClient(values, {
      onSuccess: () => setEditing(null),
      onError: (err: any) => setFormErrors(err?.response?.data?.errors ?? {}),
    })
  }

  function handleDelete() {
    if (!deleting) return
    const id = deleting.id
    deleteClientAsync(id).then(() => {
      setDeleting(null)
      setSelectedIds((ids) => ids.filter((x) => x !== id))
    })
  }

  async function handleBulkDelete() {
    if (!bulkDeletingIds?.length) return
    try {
      const result = await bulkDestroyClients(bulkDeletingIds)
      setBulkDeletingIds(null)
      setSelectedIds([])
      if (result.failed.length > 0) {
        window.alert(
          `Deleted ${result.deleted_count} client(s). ${result.failed.length} could not be removed (for example, clients with invoices).`,
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  function clientOnPage(id: string) {
    return data?.data.find((c) => c.id === id)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
        </div>
        <Button onClick={() => { setFormErrors({}); setCreating(true) }}>
          + Add client
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 shrink-0">
        <input
          className="w-full max-w-sm rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
          placeholder="Search clients…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <DataTable<Client>
        bulkActions={[
          {
            key: 'edit',
            label: 'Edit',
            variant: 'secondary',
            icon: <IconEdit className="h-4 w-4" />,
            disabled:
              selectedIds.length !== 1 || !clientOnPage(selectedIds[0] ?? ''),
            onClick: (ids) => {
              const c = clientOnPage(ids[0]!)
              if (c) {
                setFormErrors({})
                setEditing(c)
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
        columns={[
          {
            id: 'name',
            header: 'Name',
            cell: (c) => <span className="font-medium text-gray-900">{c.name}</span>,
          },
          {
            id: 'company',
            header: 'Company',
            cell: (c) => <span className="text-gray-500">{c.company ?? '—'}</span>,
          },
          {
            id: 'email',
            header: 'Email',
            cell: (c) => <span className="text-gray-500">{c.email ?? '—'}</span>,
          },
          {
            id: 'phone',
            header: 'Phone',
            cell: (c) => <span className="text-gray-500">{c.phone ?? '—'}</span>,
          },
          {
            id: 'actions',
            header: '',
            headerClassName: 'w-[1%]',
            className: 'text-right',
            cell: (client) => (
              <div className="inline-flex items-center gap-1">
                <button
                  aria-label={`Edit ${client.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  type="button"
                  onClick={() => { setFormErrors({}); setEditing(client) }}
                >
                  <IconEdit className="h-4 w-4" />
                </button>
                <button
                  aria-label={`Delete ${client.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  type="button"
                  onClick={() => setDeleting(client)}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
        emptyContent={
          <p className="text-sm text-gray-400">
            {debouncedSearch.trim()
              ? 'No clients match your search.'
              : 'No clients yet. Add your first one.'}
          </p>
        }
        isLoading={isLoading}
        pagination={
          data
            ? {
                meta: data.meta,
                page,
                onPageChange: setPage,
                itemLabel: 'clients',
              }
            : undefined
        }
        rows={data?.data ?? []}
        selection={{
          selectedIds,
          onSelectionChange: setSelectedIds,
        }}
      />

      {/* Create modal */}
      <Modal
        open={creating}
        title="Add client"
        onClose={() => setCreating(false)}
      >
        <ClientForm
          loading={creating_}
          errors={formErrors}
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editing}
        title="Edit client"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <ClientForm
            initial={editing}
            loading={updating}
            errors={formErrors}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete confirmation (single row) */}
      <ConfirmDialog
        open={!!deleting}
        title="Delete client"
        message={`Are you sure you want to delete ${deleting?.name}? This cannot be undone.`}
        loading={deleting_}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />

      {/* Bulk delete */}
      <ConfirmDialog
        open={!!bulkDeletingIds?.length}
        title="Delete clients"
        message={`Delete ${bulkDeletingIds?.length ?? 0} client(s)? This cannot be undone.`}
        loading={bulkDestroying_}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeletingIds(null)}
      />
    </div>
  )
}
