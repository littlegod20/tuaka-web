import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white border border-gray-100 rounded-xl p-5 ${onClick ? 'cursor-pointer hover:border-gray-200 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
