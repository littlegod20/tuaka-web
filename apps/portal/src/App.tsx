import { Navigate, Route, Routes } from 'react-router-dom'
import { useMe } from '@tuaka/api-client'
import { AppLayout } from '@/components/layout/AppLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { ClientsPage } from '@/pages/clients/ClientsPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { InvoicesPage } from '@/pages/invoices/InvoicesPage'
import { RegisterPage } from './pages/RegisterPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ProductsPage } from './pages/products/ProductsPage'
import { InvoiceBuilderPage } from './pages/invoices/InvoiceBuilderPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { InvoiceDetailPage } from './pages/invoices/InvoiceDetailsPage'
import { PublicInvoicePage } from './pages/public/PublicInvoicePage'
import { BillingCallbackPage } from './pages/billing/BillingCallbackPage'
import { BillingPage } from './pages/billing/BillingPage'
import { AcceptInvitePage } from './pages/invite/AcceptInvitePage'
import { TeamPage } from './pages/team/TeamPage'
import * as Sentry from '@sentry/react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const {data: me, isLoading} = useMe()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-gray-950">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!me) return <Navigate replace to="/login" />
  return <>{children}</>
}

export default function App() {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Something went wrong
            </h1>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              We've been notified and are looking into it.
            </p>
            <button
              className="px-4 py-2 bg-brand-400 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
              onClick={resetError}
            >
              Try again
            </button>
          </div>
        </div>
      )}
    >
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<ForgotPasswordPage />} path="/forgot-password" />
      <Route element={<ResetPasswordPage />} path="/reset-password" />
      <Route element={<VerifyEmailPage />} path="/verify-email" />
      <Route element={<PublicInvoicePage />} path="/inv/:token" />
      <Route element={<BillingCallbackPage />} path="/billing/callback" />
      <Route element={<AcceptInvitePage />} path="/invite/accept" />
      
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
        >
        <Route element={<DashboardPage />} path="dashboard" />
        <Route element={<InvoicesPage />} path="invoices" />
        <Route element={<ClientsPage />} path="clients" />
        <Route element={<ProductsPage />} path="products" />
        <Route element={<SettingsPage />} path="settings" />
        <Route element={<InvoiceBuilderPage />} path="invoices/new" />
        <Route element={<InvoiceBuilderPage />} path="invoices/:id/edit" />
        <Route element={<InvoiceDetailPage />} path="invoices/:id" />
        <Route element={<BillingPage />} path="billing" />
        <Route element={<TeamPage />} path="team" />
      </Route>
    </Routes>
    </Sentry.ErrorBoundary>
  )
}
