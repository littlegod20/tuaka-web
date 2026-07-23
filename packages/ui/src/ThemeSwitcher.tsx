import { type ThemePreference, useTheme } from './theme'

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

export function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { preference, setPreference } = useTheme()

  return (
    <div
      aria-label="Color theme"
      className={`inline-flex w-full rounded-lg border border-gray-200 p-0.5 dark:border-gray-600 ${className}`}
      role="group"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={preference === opt.value}
          className={`flex-1 rounded-md px-2 py-1.5 text-center text-xs font-medium transition-colors ${
            preference === opt.value
              ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-500'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setPreference(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
