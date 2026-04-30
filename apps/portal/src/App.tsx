import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { ClientsPage } from '@/pages/clients/ClientsPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { InvoicesPage } from '@/pages/invoices/InvoicesPage'

function isAuthenticated() {
  return !!localStorage.getItem('tuaka_token')
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
            <AppLayout />
          </ProtectedRoute>
        }
        path="/"
      >
        <Route index element={<Navigate replace to="/dashboard" />} />
        <Route element={<DashboardPage />} path="dashboard" />
        <Route element={<InvoicesPage />} path="invoices" />
        <Route element={<ClientsPage />} path="clients" />
      </Route>
    </Routes>
  )
}
