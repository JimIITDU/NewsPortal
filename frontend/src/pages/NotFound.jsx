import { Link } from 'react-router-dom'

export default function NotFound({ darkMode = true }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 112px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: darkMode ? '#0f0f0f' : '#f4f4f4',
      textAlign: 'center', padding: '2rem'
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '16px' }}>📰</div>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '3rem', fontWeight: '900',
        color: '#c0392b', marginBottom: '8px'
      }}>404</h1>
      <p style={{
        color: darkMode ? '#888' : '#666',
        fontSize: '1.1rem', marginBottom: '24px'
      }}>This page doesn't exist or has been removed.</p>
      <Link to="/" style={{
        background: '#c0392b', color: '#fff',
        padding: '12px 28px', borderRadius: '8px',
        fontWeight: '700', fontSize: '1rem'
      }}>← Back to Home</Link>
    </div>
  )
}