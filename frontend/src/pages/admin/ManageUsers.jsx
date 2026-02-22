import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function ManageUsers({ darkMode = true }) {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const bg = darkMode ? '#0f0f0f' : '#f4f4f4'
  const cardBg = darkMode ? '#1a1a1a' : '#ffffff'
  const border = darkMode ? '#2a2a2a' : '#e8e8e8'
  const textMain = darkMode ? '#f0f0f0' : '#111'
  const textMuted = darkMode ? '#888' : '#666'

  const fetchUsers = () => {
    api.get('/admin/users')
      .then(res => { setUsers(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleToggleRole = async (id) => {
    if (!confirm('Toggle this user\'s role?')) return
    try {
      await api.put(`/admin/users/${id}/role`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating role.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return
    try {
      await api.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user.')
    }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const inputStyle = {
    padding: '10px 16px',
    background: darkMode ? '#242424' : '#f8f8f8',
    border: darkMode ? '1px solid #333' : '1px solid #ddd',
    color: textMain, borderRadius: '8px', fontSize: '0.95rem',
    outline: 'none', fontFamily: 'Inter, sans-serif',
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '32px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem', fontWeight: '900',
            color: textMain, marginBottom: '6px'
          }}>Manage Users</h1>
          <p style={{ color: textMuted }}>
            {users.length} total users · {users.filter(u => u.role === 'admin').length} admins
          </p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px', position: 'relative', maxWidth: '400px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>🔍</span>
          <input
            style={{ ...inputStyle, paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : (
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: darkMode ? '#242424' : '#f5f5f5' }}>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '14px 16px',
                      fontSize: '0.75rem', fontWeight: '700',
                      color: textMuted, textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} style={{ borderTop: `1px solid ${border}` }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: u.id === currentUser?.id ? '#27ae60' : '#c0392b',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.85rem', fontWeight: '700', color: '#fff', flexShrink: 0
                        }}>{u.name?.charAt(0).toUpperCase()}</div>
                        <div>
                          <div style={{ color: textMain, fontWeight: '600', fontSize: '0.9rem' }}>
                            {u.name}
                            {u.id === currentUser?.id && (
                              <span style={{
                                marginLeft: '8px', fontSize: '0.65rem',
                                background: '#27ae60', color: '#fff',
                                padding: '1px 6px', borderRadius: '10px'
                              }}>You</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: textMuted, fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: u.role === 'admin' ? 'rgba(192,57,43,0.15)' : darkMode ? '#2a2a2a' : '#f0f0f0',
                        color: u.role === 'admin' ? '#c0392b' : textMuted,
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: '700'
                      }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: textMuted, fontSize: '0.85rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {u.id !== currentUser?.id ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleToggleRole(u.id)}
                            style={{
                              padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem',
                              fontWeight: '600', cursor: 'pointer', border: 'none',
                              background: u.role === 'admin' ? 'rgba(39,174,96,0.15)' : 'rgba(192,57,43,0.15)',
                              color: u.role === 'admin' ? '#27ae60' : '#c0392b',
                            }}
                          >{u.role === 'admin' ? '→ User' : '→ Admin'}</button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            style={{
                              padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem',
                              fontWeight: '600', cursor: 'pointer', border: 'none',
                              background: 'rgba(192,57,43,0.1)', color: '#c0392b',
                            }}
                          >Delete</button>
                        </div>
                      ) : (
                        <span style={{ color: textMuted, fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: textMuted }}>
                No users found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}