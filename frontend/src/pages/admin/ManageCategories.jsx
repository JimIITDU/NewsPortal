import { useEffect, useState } from 'react'
import api from '../../api/axios'

const s = {
  page: { maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' },
  h1: { color: '#1a1a2e', marginBottom: '1.5rem' },
  form: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  input: { flex: 1, padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' },
  btn: { padding: '0.6rem 1.5rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  th: { background: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #eee' },
  del: { background: '#c0392b', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }
}

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')

  const fetchCategories = () => api.get('/categories').then(res => setCategories(res.data))
  useEffect(() => { fetchCategories() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await api.post('/categories', { name })
    setName('')
    fetchCategories()
  }

  const handleUpdate = async (id) => {
    await api.put(`/categories/${id}`, { name: editName })
    setEditId(null)
    fetchCategories()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    await api.delete(`/categories/${id}`)
    fetchCategories()
  }

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Manage Categories</h1>
      <form style={s.form} onSubmit={handleAdd}>
        <input style={s.input} placeholder="New category name" value={name} onChange={e => setName(e.target.value)} />
        <button style={s.btn} type="submit">Add</button>
      </form>
      <table style={s.table}>
        <thead><tr><th style={s.th}>Name</th><th style={s.th}>Actions</th></tr></thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td style={s.td}>
                {editId === c.id
                  ? <input value={editName} onChange={e => setEditName(e.target.value)} style={{ ...s.input, marginBottom: 0 }} />
                  : c.name}
              </td>
              <td style={{ ...s.td, display: 'flex', gap: '0.5rem' }}>
                {editId === c.id
                  ? <><button style={s.btn} onClick={() => handleUpdate(c.id)}>Save</button><button style={s.del} onClick={() => setEditId(null)}>Cancel</button></>
                  : <><button style={s.btn} onClick={() => { setEditId(c.id); setEditName(c.name) }}>Edit</button><button style={s.del} onClick={() => handleDelete(c.id)}>Delete</button></>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}