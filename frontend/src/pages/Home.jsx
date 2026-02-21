import { useEffect, useState } from 'react'
import api from '../api/axios'
import NewsCard from '../components/NewsCard'

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  h1: { color: '#1a1a2e', fontSize: '2rem' },
  filters: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  input: { flex: 1, padding: '0.6rem 1rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', minWidth: '200px' },
  select: { padding: '0.6rem 1rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  empty: { textAlign: 'center', color: '#888', padding: '3rem' }
}

export default function Home() {
  const [news, setNews] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    const params = {}
    if (search) params.search = search
    if (categoryId) params.categoryId = categoryId
    api.get('/news', { params }).then(res => setNews(res.data))
  }, [search, categoryId])

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Latest News</h1>
      </div>
      <div style={styles.filters}>
        <input style={styles.input} placeholder="Search news..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={styles.select} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {news.length === 0
        ? <p style={styles.empty}>No news articles found.</p>
        : <div style={styles.grid}>{news.map(n => <NewsCard key={n.id} news={n} />)}</div>
      }
    </div>
  )
}