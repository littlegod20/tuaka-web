import React from 'react'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-brand-400 text-white hover:bg-brand-600 border-transparent',
  secondary:
    'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/90 dark:border-gray-600',
  danger: 'bg-red-500 text-white hover:bg-red-600 border-transparent',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg border
        font-medium transition-colors focus:outline-none focus:ring-2
        focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-white
        dark:focus:ring-offset-gray-900 disabled:opacity-50
        disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path className="opacity-75" d="M4 12a8 8 0 018-8v8z" fill="currentColor" />
        </svg>
      )}
      {children}
    </button>
  )
}
