import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  const navStyle = {
    background: 'rgba(15,15,15,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #222',
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
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }
  const logoSpanStyle = { color: '#c0392b' }
  const linksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    listStyle: 'none',
  }
  const getLinkStyle = (path) => ({
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: isActive(path) ? '#fff' : '#aaa',
    background: isActive(path) ? '#c0392b' : 'transparent',
    transition: 'all 0.2s',
  })
  const userChipStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: '#1e1e1e',
    borderRadius: '20px',
    border: '1px solid #333',
    fontSize: '0.85rem',
    color: '#ccc',
  }
  const avatarStyle = {
    width: '28px', height: '28px',
    borderRadius: '50%',
    background: '#c0392b',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: '700', color: '#fff',
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
            📰 News<span style={logoSpanStyle}>Portal</span>
          </Link>

          <ul style={linksStyle}>
            <li><Link to="/" style={getLinkStyle('/')}>Home</Link></li>
            {user?.role === 'admin' && (
              <li><Link to="/admin" style={getLinkStyle('/admin')}>⚙️ Admin</Link></li>
            )}
            {user ? (
              <>
                <li>
                  <div style={userChipStyle}>
                    <div style={avatarStyle}>{user.name?.charAt(0).toUpperCase()}</div>
                    {user.name}
                  </div>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{ background: 'transparent', border: '1px solid #444', color: '#aaa', padding: '6px 14px', borderRadius: '6px', fontSize: '0.9rem', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.target.style.borderColor = '#c0392b'; e.target.style.color = '#c0392b' }}
                    onMouseOut={e => { e.target.style.borderColor = '#444'; e.target.style.color = '#aaa' }}
                  >Logout</button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" style={getLinkStyle('/login')}>Login</Link></li>
                <li>
                  <Link to="/register" style={{ background: '#c0392b', color: '#fff', padding: '8px 18px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '600' }}>
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  )
}