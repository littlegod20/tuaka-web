import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/components/layout/AdminLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PlansPage } from '@/pages/plans/PlansPage'
import { TenantsPage } from '@/pages/tenants/TenantsPage'
import { TenantDetailPage } from './pages/tenants/TenantDetailPage'
import * as Sentry from '@sentry/react'


function isAuthenticated() {
  return !!localStorage.getItem('tuaka_admin_token')
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) return <Navigate replace to="/login" />
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
            <p className="text-sm text-gray-500 mb-6">
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
        <Route element={<LoginPage />} path="/login" />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
          path="/"
        >
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route element={<DashboardPage />} path="dashboard" />
          <Route element={<TenantsPage />} path="tenants" />
          <Route element={<PlansPage />} path="plans" />
          <Route element={<TenantDetailPage />} path="tenants/:id" />
        </Route>
      </Routes>
    </Sentry.ErrorBoundary>
  )
}
