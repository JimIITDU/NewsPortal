import { useEffect, useState } from 'react'
import api from '../../api/axios'

const s = {
  page: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  h1: { color: '#1a1a2e', marginBottom: '1.5rem' },
  form: { background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' },
  formTitle: { marginTop: 0, color: '#1a1a2e' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', minHeight: '100px', boxSizing: 'border-box', marginBottom: '1rem' },
  select: { width: '100%', padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', boxSizing: 'border-box' },
  btnRow: { display: 'flex', gap: '1rem', marginTop: '1rem' },
  btn: { padding: '0.6rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  btnGray: { padding: '0.6rem 1.5rem', background: '#888', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  th: { background: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #eee', verticalAlign: 'middle' },
  del: { background: '#c0392b', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', marginLeft: '0.5rem' }
}

const emptyForm = { title: '', content: '', imageUrl: '', categoryId: '' }

export default function ManageNews() {
  const [newsList, setNewsList] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

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
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Error saving news.')
    }
  }

  const handleEdit = (news) => {
    setEditId(news.id)
    setForm({ title: news.title, content: news.content, imageUrl: news.imageUrl || '', categoryId: news.categoryId })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return
    await api.delete(`/news/${id}`)
    fetchNews()
  }

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Manage News</h1>
      <div style={s.form}>
        <h3 style={s.formTitle}>{editId ? 'Edit Article' : 'Add New Article'}</h3>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={s.row}>
            <input style={s.input} name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <select style={s.select} name="categoryId" value={form.categoryId} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <input style={{ ...s.input, marginBottom: '1rem' }} name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} />
          <textarea style={s.textarea} name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
          <div style={s.btnRow}>
            <button style={s.btn} type="submit">{editId ? 'Update' : 'Publish'}</button>
            {editId && <button style={s.btnGray} type="button" onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</button>}
          </div>
        </form>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Title</th>
            <th style={s.th}>Category</th>
            <th style={s.th}>Date</th>
            <th style={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map(n => (
            <tr key={n.id}>
              <td style={s.td}>{n.title}</td>
              <td style={s.td}>{n.category?.name}</td>
              <td style={s.td}>{new Date(n.createdAt).toLocaleDateString()}</td>
              <td style={s.td}>
                <button style={s.btn} onClick={() => handleEdit(n)}>Edit</button>
                <button style={s.del} onClick={() => handleDelete(n.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}