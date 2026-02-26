import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function ReporterDashboard({ darkMode = true }) {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const bg = darkMode ? '#0f0f0f' : '#f4f4f4'
  const cardBg = darkMode ? '#1a1a1a' : '#ffffff'
  const border = darkMode ? '#2a2a2a' : '#e8e8e8'
  const textMain = darkMode ? '#f0f0f0' : '#111'
  const textMuted = darkMode ? '#888' : '#666'
  const inputBg = darkMode ? '#242424' : '#f8f8f8'
  const inputBorder = darkMode ? '#333' : '#ddd'

  const emptyForm = { title: '', content: '', imageUrl: '', categoryId: '', tags: '' }
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tab, setTab] = useState('articles')

  const inputStyle = {
    width: '100%', padding: '10px 14px', boxSizing: 'border-box',
    background: inputBg, border: `1px solid ${inputBorder}`,
    color: textMain, borderRadius: '8px', fontSize: '0.95rem',
    outline: 'none', fontFamily: 'Inter, sans-serif',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.78rem', fontWeight: '700',
    color: textMuted, marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.5px'
  }

  const fetchArticles = () => {
    api.get('/news/my-articles')
      .then(res => { setArticles(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchArticles()
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      if (editId) {
        await api.put(`/news/${editId}`, form)
        setSuccess('✅ Article updated successfully!')
        setEditId(null)
      } else {
        await api.post('/news', form)
        setSuccess('✅ Article published successfully!')
      }
      setForm(emptyForm)
      fetchArticles()
      setTab('articles')
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Error saving article.')
    }
  }

  const handleEdit = (article) => {
    setEditId(article.id)
    setForm({
      title: article.title,
      content: article.content,
      imageUrl: article.imageUrl || '',
      categoryId: article.categoryId,
      tags: article.tags || ''
    })
    setTab('write')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return
    try {
      await api.delete(`/news/${id}`)
      fetchArticles()
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '32px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          background: darkMode
            ? 'linear-gradient(135deg, #1a0000, #1a1a1a)'
            : 'linear-gradient(135deg, #fff0f0, #ffffff)',
          border: `1px solid ${border}`,
          borderRadius: '16px', padding: '2rem',
          marginBottom: '32px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: '#c0392b', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', color: '#fff'
            }}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.6rem', fontWeight: '900', color: textMain, marginBottom: '4px'
              }}>Reporter Dashboard</h1>
              <p style={{ color: textMuted, fontSize: '0.9rem' }}>
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              background: cardBg, border: `1px solid ${border}`,
              borderRadius: '10px', padding: '12px 20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#c0392b' }}>
                {articles.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: textMuted, fontWeight: '600' }}>
                Articles
              </div>
            </div>
            <div style={{
              background: cardBg, border: `1px solid ${border}`,
              borderRadius: '10px', padding: '12px 20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#8e44ad' }}>
                {articles.reduce((sum, a) => sum + (a.views || 0), 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: textMuted, fontWeight: '600' }}>
                Total Views
              </div>
            </div>
            <div style={{
              background: cardBg, border: `1px solid ${border}`,
              borderRadius: '10px', padding: '12px 20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#e74c3c' }}>
                {articles.reduce((sum, a) => sum + (a.likeCount || 0), 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: textMuted, fontWeight: '600' }}>
                Total Likes
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px',
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: '10px', padding: '4px',
          marginBottom: '24px', width: 'fit-content'
        }}>
          {[
            { id: 'articles', label: '📰 My Articles' },
            { id: 'write', label: editId ? '✏️ Edit Article' : '✍️ Write Article' }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '10px 20px', borderRadius: '8px', border: 'none',
              background: tab === t.id ? '#c0392b' : 'transparent',
              color: tab === t.id ? '#fff' : textMuted,
              fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
              transition: 'all 0.2s'
            }}>{t.label}</button>
          ))}
        </div>

        {/* MY ARTICLES TAB */}
        {tab === 'articles' && (
          <div>
            {loading ? (
              <div className="loading-spinner"><div className="spinner" /></div>
            ) : articles.length === 0 ? (
              <div style={{
                background: cardBg, border: `1px solid ${border}`,
                borderRadius: '12px', padding: '4rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✍️</div>
                <p style={{ color: textMuted, marginBottom: '16px' }}>
                  You haven't written any articles yet.
                </p>
                <button onClick={() => setTab('write')} style={{
                  background: '#c0392b', color: '#fff', border: 'none',
                  padding: '10px 24px', borderRadius: '8px',
                  fontWeight: '600', cursor: 'pointer'
                }}>Write Your First Article</button>
              </div>
            ) : (
              <div style={{
                background: cardBg, border: `1px solid ${border}`,
                borderRadius: '12px', overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: darkMode ? '#242424' : '#f5f5f5' }}>
                      {['Title', 'Category', 'Views', 'Likes', 'Date', 'Actions'].map(h => (
                        <th key={h} style={{
                          textAlign: 'left', padding: '14px 16px',
                          fontSize: '0.75rem', fontWeight: '700',
                          color: textMuted, textTransform: 'uppercase', letterSpacing: '0.5px'
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map(a => (
                      <tr key={a.id} style={{ borderTop: `1px solid ${border}` }}>
                        <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                          <Link to={`/news/${a.id}`} style={{
                            color: textMain, fontWeight: '600',
                            fontSize: '0.9rem', textDecoration: 'none',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', display: 'block'
                          }}>{a.title}</Link>
                          {a.tags && (
                            <div style={{ marginTop: '4px' }}>
                              {a.tags.split(',').slice(0, 2).map(t => (
                                <span key={t} style={{
                                  fontSize: '0.65rem', color: '#c0392b',
                                  background: 'rgba(192,57,43,0.1)',
                                  padding: '1px 6px', borderRadius: '10px', marginRight: '4px'
                                }}>#{t.trim()}</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', color: textMuted, fontSize: '0.85rem' }}>
                          {a.category?.name}
                        </td>
                        <td style={{ padding: '12px 16px', color: textMuted, fontSize: '0.85rem' }}>
                          👁️ {a.views || 0}
                        </td>
                        <td style={{ padding: '12px 16px', color: textMuted, fontSize: '0.85rem' }}>
                          ❤️ {a.likeCount || 0}
                        </td>
                        <td style={{ padding: '12px 16px', color: textMuted, fontSize: '0.85rem' }}>
                          {new Date(a.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEdit(a)} style={{
                              background: 'rgba(41,128,185,0.15)', color: '#2980b9',
                              border: 'none', padding: '5px 12px', borderRadius: '6px',
                              fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
                            }}>Edit</button>
                            <button onClick={() => handleDelete(a.id)} style={{
                              background: 'rgba(192,57,43,0.15)', color: '#c0392b',
                              border: 'none', padding: '5px 12px', borderRadius: '6px',
                              fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
                            }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* WRITE ARTICLE TAB */}
        {tab === 'write' && (
          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: '12px', padding: '2rem'
          }}>
            <h3 style={{ color: textMain, marginBottom: '20px', fontWeight: '700', fontSize: '1.1rem' }}>
              {editId ? '✏️ Edit Article' : '✍️ Write New Article'}
            </h3>

            {error && (
              <div style={{
                background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)',
                color: '#e74c3c', padding: '10px 14px', borderRadius: '8px',
                marginBottom: '16px', fontSize: '0.9rem'
              }}>⚠️ {error}</div>
            )}
            {success && (
              <div style={{
                background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.4)',
                color: '#27ae60', padding: '10px 14px', borderRadius: '8px',
                marginBottom: '16px', fontSize: '0.9rem'
              }}>{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} name="title" placeholder="Article title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select style={inputStyle} name="categoryId" value={form.categoryId}
                    onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Image URL (optional)</label>
                <input style={inputStyle} name="imageUrl" placeholder="https://..."
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input style={inputStyle} name="tags" placeholder="politics, economy, world"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Content *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '200px', resize: 'vertical' }}
                  name="content" placeholder="Write your article here..."
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })} required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{
                  background: '#c0392b', color: '#fff', border: 'none',
                  padding: '12px 32px', borderRadius: '8px',
                  fontSize: '1rem', fontWeight: '700', cursor: 'pointer'
                }}>{editId ? '💾 Update Article' : '🚀 Publish Article'}</button>
                {editId && (
                  <button type="button" onClick={() => {
                    setEditId(null)
                    setForm(emptyForm)
                    setTab('articles')
                  }} style={{
                    background: darkMode ? '#2a2a2a' : '#e8e8e8',
                    color: textMuted, border: 'none',
                    padding: '12px 28px', borderRadius: '8px',
                    fontSize: '1rem', fontWeight: '700', cursor: 'pointer'
                  }}>Cancel</button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}