import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = { title: '', content: '', imageUrl: '', categoryId: '', tags: '' }

export default function ManageNews({ darkMode = true }) {
  const [newsList, setNewsList] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const bg = darkMode ? '#0f0f0f' : '#f4f4f4'
  const cardBg = darkMode ? '#1a1a1a' : '#ffffff'
  const border = darkMode ? '#2a2a2a' : '#e8e8e8'
  const textMain = darkMode ? '#f0f0f0' : '#111'
  const textMuted = darkMode ? '#888' : '#666'
  const inputBg = darkMode ? '#242424' : '#f8f8f8'
  const inputBorder = darkMode ? '#333' : '#ddd'

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

  const fetchNews = () => api.get('/news').then(res => setNewsList(res.data))

  useEffect(() => {
    fetchNews()
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editId) {
        await api.put(`/news/${editId}`, form)
        setEditId(null)
      } else {
        await api.post('/news', form)
      }
      setForm(emptyForm)
      fetchNews()
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Error saving.')
    }
  }

  const handleEdit = (news) => {
    setEditId(news.id)
    setForm({
      title: news.title, content: news.content,
      imageUrl: news.imageUrl || '', categoryId: news.categoryId,
      tags: news.tags || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return
    await api.delete(`/news/${id}`)
    fetchNews()
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '32px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', fontWeight: '900',
          color: textMain, marginBottom: '28px'
        }}>Manage Articles</h1>

        {/* Form */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: '12px', padding: '1.75rem', marginBottom: '32px'
        }}>
          <h3 style={{ color: textMain, marginBottom: '20px', fontWeight: '700', fontSize: '1.1rem' }}>
            {editId ? '✏️ Edit Article' : '➕ New Article'}
          </h3>
          {error && (
            <div style={{
              background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)',
              color: '#e74c3c', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem'
            }}>⚠️ {error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} name="title" placeholder="Article title"
                  value={form.title} onChange={handleChange} required />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} name="categoryId" value={form.categoryId} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Image URL (optional)</label>
              <input style={inputStyle} name="imageUrl" placeholder="https://..."
                value={form.imageUrl} onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Tags (comma separated)</label>
              <input style={inputStyle} name="tags" placeholder="politics, economy, world"
                value={form.tags} onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Content</label>
              <textarea
                style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
                name="content" placeholder="Write your article..."
                value={form.content} onChange={handleChange} required
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" style={{
                background: '#c0392b', color: '#fff', border: 'none',
                padding: '10px 28px', borderRadius: '8px',
                fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer'
              }}>{editId ? 'Update' : 'Publish'}</button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm(emptyForm) }} style={{
                  background: darkMode ? '#2a2a2a' : '#e8e8e8',
                  color: textMuted, border: 'none',
                  padding: '10px 28px', borderRadius: '8px',
                  fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer'
                }}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: darkMode ? '#242424' : '#f5f5f5' }}>
                {['Title', 'Category', 'Views', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '14px 16px',
                    fontSize: '0.75rem', fontWeight: '700',
                    color: textMuted, textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {newsList.map(n => (
                <tr key={n.id} style={{ borderTop: `1px solid ${border}` }}>
                  <td style={{ padding: '12px 16px', color: textMain, fontSize: '0.9rem', fontWeight: '500', maxWidth: '260px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                    {n.tags && (
                      <div style={{ marginTop: '4px' }}>
                        {n.tags.split(',').slice(0, 2).map(t => (
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
                    {n.category?.name}
                  </td>
                  <td style={{ padding: '12px 16px', color: textMuted, fontSize: '0.85rem' }}>
                    👁️ {n.views || 0}
                  </td>
                  <td style={{ padding: '12px 16px', color: textMuted, fontSize: '0.85rem' }}>
                    {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(n)} style={{
                        background: 'rgba(41,128,185,0.15)', color: '#2980b9',
                        border: 'none', padding: '5px 12px', borderRadius: '6px',
                        fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
                      }}>Edit</button>
                      <button onClick={() => handleDelete(n.id)} style={{
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
          {newsList.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: textMuted }}>
              No articles yet. Create your first one above!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}