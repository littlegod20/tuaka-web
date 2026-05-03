import { Navigate, Route, Routes } from 'react-router-dom'
import { useMe } from '@tuaka/api-client'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { ClientsPage } from '@/pages/clients/ClientsPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { InvoicesPage } from '@/pages/invoices/InvoicesPage'
import { RegisterPage } from './pages/RegisterPage'

function isAuthenticated() {
  return !!localStorage.getItem('tuaka_token')
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const {data: me, isLoading} = useMe()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!me) return <Navigate replace to="/login" />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
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
