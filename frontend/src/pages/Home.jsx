import { useEffect, useState } from 'react'
import api from '../api/axios'
import NewsCard from '../components/NewsCard'

export default function Home() {
  const [news, setNews] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (categoryId) params.categoryId = categoryId
    api.get('/news', { params }).then(res => {
      setNews(res.data)
      setLoading(false)
    })
  }, [search, categoryId])

  const featured = news[0]
  const rest = news.slice(1)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0000 0%, #0f0f0f 50%, #001a1a 100%)',
        padding: '60px 20px 40px',
        borderBottom: '1px solid #222',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: '#c0392b',
            color: '#fff', fontSize: '0.7rem', fontWeight: '700',
            padding: '4px 14px', borderRadius: '20px',
            letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px',
          }}>🔴 Live Coverage</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '900', color: '#fff', lineHeight: '1.1',
            marginBottom: '16px',
          }}>
            Stay Informed.<br />
            <span style={{ color: '#c0392b' }}>Stay Ahead.</span>
          </h1>
          <p style={{ color: '#888', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Breaking news, in-depth analysis, and stories that matter — all in one place.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        {/* Search & Filter */}
        <div style={{
          display: 'flex', gap: '12px', marginBottom: '40px',
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '220px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>🔍</span>
            <input
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCategoryId('')}
              style={{
                padding: '10px 18px', borderRadius: '20px', fontSize: '0.85rem',
                fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: categoryId === '' ? '#c0392b' : '#1e1e1e',
                color: categoryId === '' ? '#fff' : '#aaa',
              }}
            >All</button>
            {categories.map(c => (
              <button key={c.id}
                onClick={() => setCategoryId(c.id)}
                style={{
                  padding: '10px 18px', borderRadius: '20px', fontSize: '0.85rem',
                  fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: categoryId == c.id ? '#c0392b' : '#1e1e1e',
                  color: categoryId == c.id ? '#fff' : '#aaa',
                }}
              >{c.name}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No articles found.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && !search && !categoryId && (
              <div style={{ marginBottom: '48px' }}>
                <h2 className="section-title">Featured Story</h2>
                <NewsCard news={featured} featured />
              </div>
            )}

            {/* Grid */}
            <h2 className="section-title">
              {search || categoryId ? 'Search Results' : 'Latest News'}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {(search || categoryId ? news : rest).map(n => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '80px', borderTop: '1px solid #222',
        padding: '40px 20px', textAlign: 'center', color: '#555',
        fontSize: '0.85rem',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.4rem', fontWeight: '900', color: '#fff', marginBottom: '8px',
        }}>📰 News<span style={{ color: '#c0392b' }}>Portal</span></div>
        <p>© {new Date().getFullYear()} NewsPortal. All rights reserved.</p>
      </footer>
    </div>
  )
}