import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import NewsCard from '../components/NewsCard'

export default function Profile({ darkMode = true }) {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('bookmarks')
  const [bookmarks, setBookmarks] = useState([])
  const [comments, setComments] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  // Edit profile state
  const [form, setForm] = useState({ name: '', currentPassword: '', newPassword: '' })
  const [formMsg, setFormMsg] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  const bg = darkMode ? '#0f0f0f' : '#f4f4f4'
  const cardBg = darkMode ? '#1a1a1a' : '#ffffff'
  const border = darkMode ? '#2a2a2a' : '#e8e8e8'
  const textMain = darkMode ? '#f0f0f0' : '#111'
  const textMuted = darkMode ? '#888' : '#666'

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name }))
  }, [user])

  useEffect(() => {
    setLoadingData(true)
    if (tab === 'bookmarks') {
      api.get('/bookmarks')
        .then(res => setBookmarks(res.data))
        .finally(() => setLoadingData(false))
    } else if (tab === 'comments') {
      api.get('/users/my-comments')
        .then(res => setComments(res.data))
        .finally(() => setLoadingData(false))
    } else {
      setLoadingData(false)
    }
  }, [tab])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormMsg({ type: '', text: '' })
    try {
      const payload = { name: form.name }
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword
        payload.newPassword = form.newPassword
      }
      const res = await api.put('/users/profile', payload)
      updateUser(res.data)
      setFormMsg({ type: 'success', text: '✅ Profile updated successfully!' })
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }))
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' })
    } finally {
      setSaving(false)
    }
  }

  const tabs = ['bookmarks', 'comments', 'settings']

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: darkMode ? '#242424' : '#f8f8f8',
    border: darkMode ? '1px solid #333' : '1px solid #ddd',
    color: textMain, borderRadius: '8px',
    fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
  }

  const labelStyle = {
    display: 'block', fontSize: '0.8rem', fontWeight: '600',
    color: textMuted, marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.5px'
  }

  return (
    <div style={{ minHeight: '100vh', background: bg }}>

      {/* Profile Header */}
      <div style={{
        background: darkMode
          ? 'linear-gradient(135deg, #1a0000 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #fff0f0 0%, #ffffff 100%)',
        borderBottom: `1px solid ${border}`,
        padding: '48px 20px 32px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: '#c0392b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: '900', color: '#fff',
            flexShrink: 0, boxShadow: '0 4px 20px rgba(192,57,43,0.4)',
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem', fontWeight: '900',
              color: textMain, marginBottom: '4px'
            }}>{user?.name}</h1>
            <p style={{ color: textMuted, fontSize: '0.9rem' }}>{user?.email}</p>
            <span style={{
              display: 'inline-block', marginTop: '8px',
              background: user?.role === 'admin' ? '#c0392b' : '#2a2a2a',
              color: '#fff', fontSize: '0.7rem', fontWeight: '700',
              padding: '3px 10px', borderRadius: '20px',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom: `1px solid ${border}`,
        background: cardBg,
        position: 'sticky', top: '64px', zIndex: 100,
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', padding: '0 20px' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '16px 20px', background: 'transparent', border: 'none',
              borderBottom: tab === t ? '3px solid #c0392b' : '3px solid transparent',
              color: tab === t ? '#c0392b' : textMuted,
              fontWeight: tab === t ? '700' : '500',
              fontSize: '0.9rem', cursor: 'pointer',
              textTransform: 'capitalize', transition: 'all 0.2s',
            }}>{t === 'bookmarks' ? '🔖 Bookmarks' : t === 'comments' ? '💬 My Comments' : '⚙️ Settings'}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>

        {/* BOOKMARKS */}
        {tab === 'bookmarks' && (
          loadingData ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : bookmarks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: textMuted }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔖</div>
              <p style={{ marginBottom: '16px' }}>No bookmarks yet.</p>
              <Link to="/" style={{
                background: '#c0392b', color: '#fff',
                padding: '10px 24px', borderRadius: '8px', fontWeight: '600'
              }}>Browse Articles</Link>
            </div>
          ) : (
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                color: textMain, marginBottom: '24px', fontSize: '1.4rem'
              }}>Your Saved Articles ({bookmarks.length})</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {bookmarks.map(b => b.news && (
                  <NewsCard key={b.id} news={b.news} />
                ))}
              </div>
            </div>
          )
        )}

        {/* COMMENTS */}
        {tab === 'comments' && (
          loadingData ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: textMuted }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💭</div>
              <p>You haven't commented on anything yet.</p>
            </div>
          ) : (
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                color: textMain, marginBottom: '24px', fontSize: '1.4rem'
              }}>Your Comments ({comments.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {comments.map(c => (
                  <div key={c.id} style={{
                    background: cardBg, border: `1px solid ${border}`,
                    borderRadius: '12px', padding: '1.2rem',
                  }}>
                    <Link to={`/news/${c.newsId}`} style={{
                      display: 'inline-block', marginBottom: '8px',
                    }}>
                      <span style={{
                        fontSize: '0.8rem', fontWeight: '600',
                        color: '#c0392b', textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {c.news?.category?.name} →
                      </span>
                      <div style={{
                        fontFamily: "'Playfair Display', serif",
                        color: textMain, fontWeight: '700', fontSize: '1rem'
                      }}>{c.news?.title}</div>
                    </Link>
                    <p style={{
                      color: darkMode ? '#ccc' : '#444',
                      fontSize: '0.95rem', lineHeight: '1.6',
                      borderLeft: '3px solid #c0392b',
                      paddingLeft: '12px', margin: '8px 0'
                    }}>{c.content}</p>
                    <span style={{ fontSize: '0.75rem', color: textMuted }}>
                      {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              color: textMain, marginBottom: '24px', fontSize: '1.4rem'
            }}>Edit Profile</h2>

            {formMsg.text && (
              <div style={{
                padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
                background: formMsg.type === 'success' ? 'rgba(39,174,96,0.15)' : 'rgba(192,57,43,0.15)',
                border: formMsg.type === 'success' ? '1px solid rgba(39,174,96,0.4)' : '1px solid rgba(192,57,43,0.4)',
                color: formMsg.type === 'success' ? '#27ae60' : '#e74c3c',
                fontSize: '0.9rem'
              }}>{formMsg.text}</div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '20px' }}>
                <h3 style={{ color: textMain, marginBottom: '16px', fontSize: '1rem', fontWeight: '700' }}>Personal Info</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Display Name</label>
                  <input style={inputStyle} type="text" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div style={{ marginBottom: '0' }}>
                  <label style={labelStyle}>Email Address</label>
                  <input style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                    type="email" value={user?.email} disabled />
                  <p style={{ fontSize: '0.75rem', color: textMuted, marginTop: '4px' }}>Email cannot be changed.</p>
                </div>
              </div>

              <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '24px' }}>
                <h3 style={{ color: textMain, marginBottom: '16px', fontSize: '1rem', fontWeight: '700' }}>Change Password</h3>
                <p style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '16px' }}>Leave blank if you don't want to change your password.</p>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Current Password</label>
                  <input style={inputStyle} type="password" placeholder="••••••••"
                    value={form.currentPassword}
                    onChange={e => setForm({ ...form, currentPassword: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input style={inputStyle} type="password" placeholder="Min. 6 characters"
                    value={form.newPassword}
                    onChange={e => setForm({ ...form, newPassword: e.target.value })} />
                </div>
              </div>

              <button type="submit" disabled={saving} style={{
                background: saving ? '#888' : '#c0392b',
                color: '#fff', border: 'none',
                padding: '12px 32px', borderRadius: '8px',
                fontSize: '1rem', fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}