import React, { useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  /** Show an eye toggle to reveal / hide password (pairs with type="password"). */
  passwordToggle?: boolean
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  )
}

export function Input({
  label,
  error,
  hint,
  className = '',
  passwordToggle = false,
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const resolvedType = passwordToggle ? (showPassword ? 'text' : 'password') : type

  const inputClasses = `
    w-full rounded-lg border px-3 py-2 text-sm text-gray-900
    placeholder-gray-400 outline-none transition-colors
    focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20
    ${error ? 'border-red-400' : 'border-gray-200'}
    ${passwordToggle ? 'pr-10' : ''}
    ${className}
  `

  const inputEl = (
    <input className={inputClasses} type={resolvedType} {...props} />
  )

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700" htmlFor={props.id}>
          {label}
        </label>
      )}
      {passwordToggle ? (
        <div className="relative">
          {inputEl}
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onMouseDown={(e) => {
              /* keep focus on the input */
              e.preventDefault()
            }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      ) : (
        inputEl
      )}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
