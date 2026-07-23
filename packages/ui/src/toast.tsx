import 'sonner/dist/styles.css'

import { Toaster, toast as sonnerToast } from 'sonner'

import { useTheme } from './theme'

export function TuakaToaster() {
  const { resolvedDark } = useTheme()
  return (
    <Toaster
      closeButton
      position="top-right"
      richColors
      theme={resolvedDark ? 'dark' : 'light'}
      toastOptions={{
        classNames: {
          toast: 'font-sans',
        },
      }}
    />
  )
}

export function toastError(message: string) {
  sonnerToast.error(message)
}

export function toastSuccess(message: string) {
  sonnerToast.success(message)
}
