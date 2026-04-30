import React from 'react'

type Variant = 'active' | 'trial' | 'grace' | 'cancelled' | 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue'

const styles: Record<Variant, string> = {
  active:    'bg-green-100  text-green-800',
  trial:     'bg-purple-100 text-purple-800',
  grace:     'bg-amber-100  text-amber-800',
  cancelled: 'bg-gray-100   text-gray-600',
  draft:     'bg-gray-100   text-gray-600',
  sent:      'bg-blue-100   text-blue-800',
  viewed:    'bg-purple-100 text-purple-800',
  paid:      'bg-green-100  text-green-800',
  overdue:   'bg-red-100    text-red-800',
}

interface BadgeProps {
  variant: Variant
  label?: string
}

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {label ?? variant}
    </span>
  )
}
