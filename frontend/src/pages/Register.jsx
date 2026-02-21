import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const styles = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)', background: '#f4f4f4' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  h2: { color: '#1a1a2e', marginBottom: '1.5rem', textAlign: 'center' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.75rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' },
  link: { display: 'block', textAlign: 'center', marginTop: '1rem', color: '#e94560' }
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.h2}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={styles.btn} type="submit">Register</button>
        </form>
        <Link to="/login" style={styles.link}>Already have an account? Login</Link>
      </div>
    </div>
  )
}