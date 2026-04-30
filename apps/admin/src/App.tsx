import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/components/layout/AdminLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PlansPage } from '@/pages/plans/PlansPage'
import { TenantsPage } from '@/pages/tenants/TenantsPage'

function isAuthenticated() {
  return !!localStorage.getItem('tuaka_admin_token')
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) return <Navigate replace to="/login" />
  return <>{children}</>
}

export default function App() {
  return (
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
      </Route>
    </Routes>
  )
}
