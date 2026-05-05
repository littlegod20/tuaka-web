import { useEffect, useState } from 'react'

/**
 * Debounces a React state value. The returned value updates `delayMs` after `value` stops changing.
 * Typical use: wire an input to `value` and pass the debounced result to search queries or filters.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
