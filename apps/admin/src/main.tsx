import React from 'react'

import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerApiErrorNotifier } from '@tuaka/api-client'
import { TuakaToaster, toastError } from '@tuaka/ui'

import App from './App'
import './index.css'

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
