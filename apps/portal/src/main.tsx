import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerApiErrorNotifier } from '@tuaka/api-client'
import { TuakaToaster, toastError } from '@tuaka/ui'
import * as Sentry from '@sentry/react'

import App from './App'
import './index.css'


// ─── Sentry ───────────────────────────────────────────────────────────────
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV ?? 'development',
  enabled: import.meta.env.VITE_APP_ENV === 'production',

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Ignore noise
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Network Error',
    'Request aborted',
    /401/,
    /403/,
  ],
})


registerApiErrorNotifier((message) => toastError(message))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <TuakaToaster />
    </QueryClientProvider>
  // </React.StrictMode>,
)
