import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
  if (!user) return <Navigate to="/login" />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />

  return <Outlet />
}