import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout }    from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { InvoicesPage }  from '@/pages/invoices/InvoicesPage'
import { ClientsPage }   from '@/pages/clients/ClientsPage'
import { LoginPage }     from '@/pages/LoginPage'

function isAuthenticated() {
  return !!localStorage.getItem('tuaka_token')
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
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index           element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="invoices"  element={<InvoicesPage />} />
        <Route path="clients"   element={<ClientsPage />} />
      </Route>
    </Routes>
  )
}
