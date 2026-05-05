export type DebouncedFunction<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void
}

/**
 * Returns a function that invokes `fn` only after `waitMs` have elapsed since the last call.
 * Useful for resize handlers, auto-save, etc. Includes `cancel()` to clear a pending call.
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number,
): DebouncedFunction<TArgs> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: TArgs) => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = undefined
      fn(...args)
    }, waitMs)
  }

  debounced.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = undefined
  }

  return debounced
}
