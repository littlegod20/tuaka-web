import React from 'react'

type Variant =
  | 'active'
  | 'trial'
  | 'grace'
  | 'cancelled'
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'paid'
  | 'overdue'

const styles: Record<Variant, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300',
  trial: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
  grace: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
  cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300',
  viewed: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300',
}

interface BadgeProps {
  variant: Variant
  label?: string
}

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}
    >
      {label ?? variant}
    </span>
  )
}
