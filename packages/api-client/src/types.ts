export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue'
export type InvoiceType = 'invoice' | 'quote'
export type UserRole = 'owner' | 'admin' | 'member'

export interface Tenant {
  id: string
  name: string
  slug: string
  currency: string
  timezone: string
  logo_url: string | null
  invoice_prefix: string
  address: string | null
  phone: string | null
  website: string | null
}

export interface User {
  id: string
  tenant_id: string
  email: string
  role: UserRole
  name: string
  email_verified_at: string | null
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  company: string | null
  created_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id: string | null
  description: string
  quantity: number
  unit_price: number  // pesewas
  total: number       // pesewas
  sort_order: number
}

export interface Invoice {
  id: string
  type: InvoiceType
  status: InvoiceStatus
  number: string
  client_id: string
  client: Client
  items: InvoiceItem[]
  subtotal: number    // pesewas
  tax_rate: number    // percentage e.g. 15
  tax_amount: number  // pesewas
  total: number       // pesewas
  notes: string | null
  due_date: string | null
  sent_at: string | null
  viewed_at: string | null
  paid_at: string | null
  created_at: string
  activities: InvoiceActivity[]
}

export interface InvoiceActivity {
  id: string
  invoice_id: string
  type: string
  meta: Record<string, unknown> | null
  created_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface Product {
  id: string
  name: string
  description: string | null
  default_price: number // in pesewas
  created_at: string
}