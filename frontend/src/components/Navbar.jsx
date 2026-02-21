import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const styles = {
  nav: { background: '#1a1a2e', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' },
  logo: { color: '#e94560', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' },
  links: { display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>📰 NewsPortal</Link>
      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        {user?.role === 'admin' && <li><Link to="/admin" style={styles.link}>Admin</Link></li>}
        {user ? (
          <>
            <li style={{ color: '#aaa', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>Hi, {user.name}</li>
            <li><button style={styles.btn} onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" style={styles.link}>Login</Link></li>
            <li><Link to="/register" style={styles.link}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}