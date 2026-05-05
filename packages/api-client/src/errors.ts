import axios from 'axios'

let notifier: ((message: string) => void) | undefined

export function registerApiErrorNotifier(fn: typeof notifier) {
  notifier = fn
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[] | string> }
      | undefined

    if (data && typeof data.message === 'string' && data.message.length > 0) {
      return data.message
    }

    if (data?.errors && typeof data.errors === 'object') {
      for (const v of Object.values(data.errors)) {
        if (Array.isArray(v) && v[0] && typeof v[0] === 'string') {
          return v[0]
        }
        if (typeof v === 'string') {
          return v
        }
      }
    }

    const status = error.response?.status
    if (status === 404) {
      return 'Resource not found'
    }
    if (status === 403) {
      return 'You do not have permission to do that'
    }
    if (status === 405) {
      return 'This action is not available'
    }
    if (status === 409) {
      return data && typeof data.message === 'string' && data.message.length > 0
        ? data.message
        : 'This action could not be completed'
    }
    return error.message || 'Request failed'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong'
}

function shouldShowToastForError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return true
  }
  const s = error.response?.status
  if (s === 401) {
    return false
  }
  if (s === 422) {
    return false
  }
  return true
}

export function notifyGlobalApiError(error: unknown): void {
  if (!notifier) {
    return
  }
  if (!shouldShowToastForError(error)) {
    return
  }
  notifier(getApiErrorMessage(error))
}
