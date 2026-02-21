import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login({ darkMode = true }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 112px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      background: darkMode
        ? 'radial-gradient(ellipse at center, #1a0a0a 0%, #0f0f0f 70%)'
        : 'radial-gradient(ellipse at center, #fff0f0 0%, #f4f4f4 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: '2rem', fontWeight: '900',
            color: darkMode ? '#fff' : '#111',
            marginBottom: '8px'
          }}>
            📰 News<span style={{ color: '#c0392b' }}>Portal</span>
          </div>
          <p style={{ color: darkMode ? '#aaa' : '#666', fontSize: '1rem' }}>
            Welcome back. Sign in to continue.
          </p>
        </div>

        <div style={{
          background: darkMode ? '#1a1a1a' : '#ffffff',
          border: darkMode ? '1px solid #2a2a2a' : '1px solid #e8e8e8',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: darkMode
            ? '0 20px 60px rgba(0,0,0,0.5)'
            : '0 20px 60px rgba(0,0,0,0.08)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(192,57,43,0.15)',
              border: '1px solid rgba(192,57,43,0.4)',
              color: '#e74c3c', padding: '12px 16px',
              borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem',
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '0.85rem', fontWeight: '600',
                color: darkMode ? '#999' : '#555',
                marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: darkMode ? '#242424' : '#f8f8f8',
                  border: darkMode ? '1px solid #333' : '1px solid #ddd',
                  color: darkMode ? '#e8e8e8' : '#111',
                  borderRadius: '8px', fontSize: '0.95rem',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '0.85rem', fontWeight: '600',
                color: darkMode ? '#999' : '#555',
                marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: darkMode ? '#242424' : '#f8f8f8',
                  border: darkMode ? '1px solid #333' : '1px solid #ddd',
                  color: darkMode ? '#e8e8e8' : '#111',
                  borderRadius: '8px', fontSize: '0.95rem',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#888' : '#c0392b',
                color: '#fff', border: 'none',
                borderRadius: '8px', fontSize: '1rem',
                fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px', transition: 'background 0.2s',
              }}
            >{loading ? 'Signing in...' : 'Sign In →'}</button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: '20px',
            color: darkMode ? '#666' : '#888', fontSize: '0.9rem'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#c0392b', fontWeight: '600' }}>
              Register free
            </Link>
          </p>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '16px',
          color: darkMode ? '#555' : '#999', fontSize: '0.8rem'
        }}>
          Admin demo: admin@newsportal.com / admin123
        </p>
      </div>
    </div>
  )
}