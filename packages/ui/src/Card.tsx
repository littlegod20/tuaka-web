import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 ${onClick ? 'cursor-pointer transition-colors hover:border-gray-200 dark:hover:border-gray-600' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
