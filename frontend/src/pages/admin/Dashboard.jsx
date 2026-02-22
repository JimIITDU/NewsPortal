import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function Dashboard({ darkMode = true }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const bg = darkMode ? '#0f0f0f' : '#f4f4f4'
  const cardBg = darkMode ? '#1a1a1a' : '#ffffff'
  const border = darkMode ? '#2a2a2a' : '#e8e8e8'
  const textMain = darkMode ? '#f0f0f0' : '#111'
  const textMuted = darkMode ? '#888' : '#666'

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => { setStats(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>

  const statCards = [
    { label: 'Total Articles', value: stats?.totalNews, icon: '📰', color: '#c0392b' },
    { label: 'Total Users', value: stats?.totalUsers, icon: '👥', color: '#2980b9' },
    { label: 'Comments', value: stats?.totalComments, icon: '💬', color: '#27ae60' },
    { label: 'Total Likes', value: stats?.totalLikes, icon: '❤️', color: '#e74c3c' },
    { label: 'Total Views', value: stats?.totalViews, icon: '👁️', color: '#8e44ad' },
    { label: 'Bookmarks', value: stats?.totalBookmarks, icon: '🔖', color: '#f39c12' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '32px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem', fontWeight: '900', color: textMain,
            marginBottom: '6px'
          }}>Admin Dashboard</h1>
          <p style={{ color: textMuted }}>Welcome back. Here's what's happening on NewsPortal.</p>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px', marginBottom: '40px'
        }}>
          {statCards.map((s, i) => (
            <div key={i} style={{
              background: cardBg, border: `1px solid ${border}`,
              borderRadius: '12px', padding: '1.25rem',
              borderLeft: `4px solid ${s.color}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>
                {s.value?.toLocaleString() ?? 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: textMuted, marginTop: '4px', fontWeight: '600' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>

          {/* Top Articles */}
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ color: textMain, marginBottom: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔥 Most Viewed Articles
            </h3>
            {stats?.topArticles?.length === 0 ? (
              <p style={{ color: textMuted, fontSize: '0.9rem' }}>No articles yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats?.topArticles?.map((a, i) => (
                  <Link to={`/news/${a.id}`} key={a.id} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px', borderRadius: '8px',
                      background: darkMode ? '#242424' : '#f8f8f8',
                      transition: 'background 0.2s',
                    }}
                      onMouseOver={e => e.currentTarget.style.background = darkMode ? '#2e2e2e' : '#f0f0f0'}
                      onMouseOut={e => e.currentTarget.style.background = darkMode ? '#242424' : '#f8f8f8'}
                    >
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: i === 0 ? '#f39c12' : i === 1 ? '#bdc3c7' : i === 2 ? '#cd7f32' : darkMode ? '#333' : '#ddd',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: '800',
                        color: i < 3 ? '#fff' : textMuted, flexShrink: 0
                      }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          color: textMain, fontSize: '0.85rem', fontWeight: '600',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>{a.title}</div>
                        <div style={{ color: textMuted, fontSize: '0.75rem' }}>{a.category?.name}</div>
                      </div>
                      <div style={{
                        fontSize: '0.8rem', color: '#8e44ad',
                        fontWeight: '700', flexShrink: 0
                      }}>👁️ {a.views}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* News per Category */}
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ color: textMain, marginBottom: '16px', fontWeight: '700' }}>
              🗂️ Articles per Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats?.newsPerCategory?.map((c, i) => {
                const max = Math.max(...(stats?.newsPerCategory?.map(x => x.count) || [1]))
                const pct = max > 0 ? (c.count / max) * 100 : 0
                const colors = ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad']
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', color: textMain, fontWeight: '500' }}>{c.name}</span>
                      <span style={{ fontSize: '0.85rem', color: textMuted, fontWeight: '700' }}>{c.count}</span>
                    </div>
                    <div style={{ background: darkMode ? '#2a2a2a' : '#e8e8e8', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`, height: '100%',
                        background: colors[i % colors.length],
                        borderRadius: '4px', transition: 'width 0.8s ease'
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: textMain, fontWeight: '700' }}>👥 Recent Users</h3>
            <Link to="/admin/users" style={{ color: '#c0392b', fontSize: '0.85rem', fontWeight: '600' }}>
              View All →
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Joined'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '8px 12px',
                      fontSize: '0.75rem', fontWeight: '700',
                      color: textMuted, textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: `1px solid ${border}`
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recentUsers?.map(u => (
                  <tr key={u.id}>
                    <td style={{ padding: '10px 12px', borderBottom: `1px solid ${border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: '#c0392b', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#fff'
                        }}>{u.name?.charAt(0).toUpperCase()}</div>
                        <span style={{ color: textMain, fontSize: '0.9rem', fontWeight: '500' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', color: textMuted, fontSize: '0.85rem', borderBottom: `1px solid ${border}` }}>{u.email}</td>
                    <td style={{ padding: '10px 12px', borderBottom: `1px solid ${border}` }}>
                      <span style={{
                        background: u.role === 'admin' ? 'rgba(192,57,43,0.15)' : darkMode ? '#2a2a2a' : '#f0f0f0',
                        color: u.role === 'admin' ? '#c0392b' : textMuted,
                        padding: '2px 10px', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: '700'
                      }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: textMuted, fontSize: '0.85rem', borderBottom: `1px solid ${border}` }}>
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { to: '/admin/news', icon: '📰', label: 'Manage Articles', desc: 'Create, edit, delete news' },
            { to: '/admin/categories', icon: '🗂️', label: 'Manage Categories', desc: 'Organize your content' },
            { to: '/admin/users', icon: '👥', label: 'Manage Users', desc: 'View and moderate users' },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
              <div style={{
                background: cardBg, border: `1px solid ${border}`,
                borderRadius: '12px', padding: '1.25rem',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{link.icon}</div>
                <div style={{ fontWeight: '700', color: textMain, marginBottom: '4px' }}>{link.label}</div>
                <div style={{ fontSize: '0.8rem', color: textMuted }}>{link.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}