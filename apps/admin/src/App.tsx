import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout }    from '@/components/layout/AdminLayout'
import { DashboardPage }  from '@/pages/dashboard/DashboardPage'
import { TenantsPage }    from '@/pages/tenants/TenantsPage'
import { PlansPage }      from '@/pages/plans/PlansPage'
import { LoginPage }      from '@/pages/LoginPage'

function isAuthenticated() {
  return !!localStorage.getItem('tuaka_admin_token')
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index            element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tenants"   element={<TenantsPage />} />
        <Route path="plans"     element={<PlansPage />} />
      </Route>
    </Routes>
  )
}
