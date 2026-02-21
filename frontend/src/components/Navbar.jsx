import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  const navStyle = {
    background: darkMode ? 'rgba(15,15,15,0.97)' : 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(10px)',
    borderBottom: darkMode ? '1px solid #222' : '1px solid #e0e0e0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '0 20px',
  }
  const innerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  }
  const logoStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem',
    fontWeight: '900',
    color: darkMode ? '#fff' : '#111',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  }
  const linksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    listStyle: 'none',
    margin: 0, padding: 0,
  }

  const getLinkStyle = (path) => ({
    padding: '7px 14px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: isActive(path)
      ? '#fff'
      : darkMode ? '#aaa' : '#555',
    background: isActive(path) ? '#c0392b' : 'transparent',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'inline-block',
  })

  const userChipStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: darkMode ? '#1e1e1e' : '#f5f5f5',
    borderRadius: '20px',
    border: darkMode ? '1px solid #333' : '1px solid #ddd',
    fontSize: '0.85rem',
    color: darkMode ? '#ccc' : '#444',
  }

  const avatarStyle = {
    width: '28px', height: '28px',
    borderRadius: '50%',
    background: '#c0392b',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: '700', color: '#fff',
  }

  const toggleStyle = {
    background: darkMode ? '#2a2a2a' : '#f0f0f0',
    border: darkMode ? '1px solid #444' : '1px solid #ddd',
    borderRadius: '20px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: darkMode ? '#ccc' : '#555',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  }

  return (
    <>
      {/* Breaking News Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-content">
          <span className="ticker-label">🔴 Breaking</span>
          <span className="ticker-item">Global markets reach record highs amid economic optimism</span>
          <span className="ticker-item">Scientists announce major breakthrough in renewable energy</span>
          <span className="ticker-item">World leaders gather for climate summit in Geneva</span>
          <span className="ticker-item">Tech giant unveils next-generation AI assistant</span>
          <span className="ticker-item">Championship finals set for this weekend — all eyes on the match</span>
        </div>
      </div>

      <nav style={navStyle}>
        <div style={innerStyle}>
          <Link to="/" style={logoStyle}>
            📰 News<span style={{ color: '#c0392b' }}>Portal</span>
          </Link>

          <ul style={linksStyle}>
            <li><Link to="/" style={getLinkStyle('/')}>Home</Link></li>
            {user?.role === 'admin' && (
              <li><Link to="/admin" style={getLinkStyle('/admin')}>⚙️ Admin</Link></li>
            )}

            {/* Dark/Light toggle */}
            <li>
              <button style={toggleStyle} onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </li>

            {user ? (
              <>
                <li><div style={userChipStyle}>
                  <div style={avatarStyle}>{user.name?.charAt(0).toUpperCase()}</div>
                  {user.name}
                </div></li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'transparent',
                      border: darkMode ? '1px solid #444' : '1px solid #ccc',
                      color: darkMode ? '#aaa' : '#666',
                      padding: '6px 14px', borderRadius: '6px',
                      fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b' }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = darkMode ? '#444' : '#ccc'
                      e.currentTarget.style.color = darkMode ? '#aaa' : '#666'
                    }}
                  >Logout</button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" style={getLinkStyle('/login')}>Login</Link></li>
                <li>
                  <Link
                    to="/register"
                    style={{
                      ...getLinkStyle('/register'),
                      background: isActive('/register') ? '#96281b' : '#c0392b',
                      color: '#fff',
                      padding: '8px 18px',
                      fontWeight: '600',
                    }}
                  >Get Started</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  )
}