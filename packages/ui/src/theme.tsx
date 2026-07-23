import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export const THEME_STORAGE_KEY = 'tuaka_theme'

export type ThemePreference = 'light' | 'dark' | 'system'

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    /* ignore */
  }
  return 'system'
}

export function prefersDarkScheme(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function resolveDark(preference: ThemePreference): boolean {
  if (preference === 'dark') return true
  if (preference === 'light') return false
  return prefersDarkScheme()
}

export function applyDarkClass(isDark: boolean) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (isDark) root.classList.add('dark')
  else root.classList.remove('dark')
}

type ThemeContextValue = {
  preference: ThemePreference
  setPreference: (p: ThemePreference) => void
  /** Whether `dark` class is currently applied */
  resolvedDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredPreference(),
  )
  const [systemDark, setSystemDark] = useState(() => prefersDarkScheme())

  const resolvedDark = useMemo(() => {
    if (preference === 'dark') return true
    if (preference === 'light') return false
    return systemDark
  }, [preference, systemDark])

  useLayoutEffect(() => {
    applyDarkClass(resolvedDark)
  }, [resolvedDark])

  useEffect(() => {
    if (preference !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    function onChange() {
      setSystemDark(mq.matches)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [preference])

  const setPreference = useCallback((p: ThemePreference) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, p)
    } catch {
      /* ignore */
    }
    if (p === 'system') setSystemDark(prefersDarkScheme())
    applyDarkClass(resolveDark(p))
    setPreferenceState(p)
  }, [])

  const value = useMemo(
    () => ({ preference, setPreference, resolvedDark }),
    [preference, setPreference, resolvedDark],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
