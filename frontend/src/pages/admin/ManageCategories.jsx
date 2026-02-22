import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function ManageCategories({ darkMode = true }) {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')

  const bg = darkMode ? '#0f0f0f' : '#f4f4f4'
  const cardBg = darkMode ? '#1a1a1a' : '#ffffff'
  const border = darkMode ? '#2a2a2a' : '#e8e8e8'
  const textMain = darkMode ? '#f0f0f0' : '#111'
  const textMuted = darkMode ? '#888' : '#666'
  const inputBg = darkMode ? '#242424' : '#f8f8f8'
  const inputBorder = darkMode ? '#333' : '#ddd'

  const inputStyle = {
    flex: 1, padding: '10px 14px', boxSizing: 'border-box',
    background: inputBg, border: `1px solid ${inputBorder}`,
    color: textMain, borderRadius: '8px', fontSize: '0.95rem',
    outline: 'none', fontFamily: 'Inter, sans-serif',
  }

  const fetchCategories = () => api.get('/categories').then(res => setCategories(res.data))
  useEffect(() => { fetchCategories() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setError('')
    try {
      await api.post('/categories', { name })
      setName('')
      fetchCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding category.')
    }
  }

  const handleUpdate = async (id) => {
    if (!editName.trim()) return
    try {
      await api.put(`/categories/${id}`, { name: editName })
      setEditId(null)
      fetchCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating category.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Articles in this category may be affected.')) return
    try {
      await api.delete(`/categories/${id}`)
      fetchCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting category.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '32px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', fontWeight: '900',
          color: textMain, marginBottom: '8px'
        }}>Manage Categories</h1>
        <p style={{ color: textMuted, marginBottom: '28px' }}>
          {categories.length} categories total
        </p>

        {error && (
          <div style={{
            background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)',
            color: '#e74c3c', padding: '10px 14px', borderRadius: '8px',
            marginBottom: '16px', fontSize: '0.9rem'
          }}>⚠️ {error}</div>
        )}

        {/* Add form */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: '12px', padding: '1.5rem', marginBottom: '24px'
        }}>
          <h3 style={{ color: textMain, marginBottom: '14px', fontWeight: '700', fontSize: '1rem' }}>
            ➕ Add New Category
          </h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px' }}>
            <input
              style={inputStyle}
              placeholder="Category name (e.g. Science)"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <button type="submit" style={{
              background: '#c0392b', color: '#fff', border: 'none',
              padding: '10px 24px', borderRadius: '8px',
              fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>Add</button>
          </form>
        </div>

        {/* Categories list */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
          {categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: textMuted }}>
              No categories yet.
            </div>
          ) : (
            categories.map((c, i) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 20px',
                borderTop: i === 0 ? 'none' : `1px solid ${border}`,
                transition: 'background 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.background = darkMode ? '#242424' : '#f8f8f8'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Color dot */}
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                  background: ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad'][i % 5]
                }} />

                {editId === c.id ? (
                  <>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      autoFocus
                    />
                    <button onClick={() => handleUpdate(c.id)} style={{
                      background: 'rgba(39,174,96,0.15)', color: '#27ae60',
                      border: 'none', padding: '6px 14px', borderRadius: '6px',
                      fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer'
                    }}>Save</button>
                    <button onClick={() => setEditId(null)} style={{
                      background: darkMode ? '#2a2a2a' : '#e8e8e8',
                      color: textMuted, border: 'none',
                      padding: '6px 14px', borderRadius: '6px',
                      fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer'
                    }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, color: textMain, fontWeight: '600', fontSize: '0.95rem' }}>
                      {c.name}
                    </span>
                    <button onClick={() => { setEditId(c.id); setEditName(c.name) }} style={{
                      background: 'rgba(41,128,185,0.15)', color: '#2980b9',
                      border: 'none', padding: '6px 14px', borderRadius: '6px',
                      fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer'
                    }}>Edit</button>
                    <button onClick={() => handleDelete(c.id)} style={{
                      background: 'rgba(192,57,43,0.15)', color: '#c0392b',
                      border: 'none', padding: '6px 14px', borderRadius: '6px',
                      fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer'
                    }}>Delete</button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}