import 'sonner/dist/styles.css'

import { Toaster, toast as sonnerToast } from 'sonner'

export function TuakaToaster() {
  return (
    <Toaster
      closeButton
      position="top-right"
      richColors
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
