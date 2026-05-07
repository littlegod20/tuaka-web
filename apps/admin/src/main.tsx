import './lib/adminApiClient'
import React from 'react'

import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerApiErrorNotifier } from '@tuaka/api-client'
import { TuakaToaster, toastError } from '@tuaka/ui'
import * as Sentry from '@sentry/react'
import App from './App'
import './index.css'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV ?? 'development',
  enabled: import.meta.env.VITE_APP_ENV === 'production',
  tracesSampleRate: 0.2,
  ignoreErrors: ['Network Error', 'Request aborted', /401/, /403/],
})


registerApiErrorNotifier((message) => toastError(message))

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <TuakaToaster />
    </QueryClientProvider>
  </React.StrictMode>,
)
