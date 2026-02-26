import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({ adminOnly = false, reporterOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />
  if (reporterOnly && user.role !== 'reporter' && user.role !== 'admin') return <Navigate to="/" />

  return <Outlet />
}