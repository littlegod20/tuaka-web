export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue'
export type InvoiceType = 'invoice' | 'quote'
export type UserRole = 'owner' | 'admin' | 'member'

export interface Tenant {
  id: string
  name: string
  slug: string
  currency: string
  logo_url: string | null
  invoice_prefix: string
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

export interface Invoice {
  id: string
  type: InvoiceType
  status: InvoiceStatus
  number: string
  client: Client
  subtotal: number
  tax_amount: number
  total: number
  due_date: string
  sent_at: string | null
  viewed_at: string | null
  paid_at: string | null
  created_at: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
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
