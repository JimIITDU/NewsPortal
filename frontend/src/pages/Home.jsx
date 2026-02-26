import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import NewsCard from '../components/NewsCard'

export default function Home({ darkMode = true }) {
  const [news, setNews] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()

  const bg = darkMode ? '#0f0f0f' : '#f4f4f4'
  const textMain = darkMode ? '#fff' : '#111'
  const textMuted = darkMode ? '#888' : '#666'

  useEffect(() => {
  Promise.all([
    api.get('/categories'),
    api.get('/news')
  ]).then(([catRes, newsRes]) => {
    const newsData = newsRes.data
    const catsWithCount = catRes.data.map(c => ({
      ...c,
      count: newsData.filter(n => n.categoryId === c.id).length
    }))
    setCategories(catsWithCount)
  })
}, [])

  useEffect(() => {
    const tag = searchParams.get('tag')
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (categoryId) params.categoryId = categoryId
    if (tag) params.tag = tag
    api.get('/news', { params })
      .then(res => { setNews(res.data); setLoading(false) })
  }, [search, categoryId, searchParams])

  const featured = news[0]
  const rest = news.slice(1)
  const activeTag = searchParams.get('tag')

  return (
    <div style={{ minHeight: '100vh', background: bg }}>

      {/* Hero */}
      <div style={{
        background: darkMode
          ? 'linear-gradient(135deg, #1a0000 0%, #0f0f0f 50%, #001a1a 100%)'
          : 'linear-gradient(135deg, #fff5f5 0%, #f4f4f4 50%, #f0fff4 100%)',
        padding: '60px 20px 40px',
        borderBottom: darkMode ? '1px solid #222' : '1px solid #e8e8e8',
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
            fontWeight: '900', color: textMain, lineHeight: '1.1',
            marginBottom: '16px',
          }}>
            Stay Informed.<br />
            <span style={{ color: '#c0392b' }}>Stay Ahead.</span>
          </h1>
          <p style={{ color: textMuted, fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Breaking news, in-depth analysis, and stories that matter.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>

        {/* Active tag banner */}
        {activeTag && (
          <div style={{
            background: 'rgba(192,57,43,0.1)',
            border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: '8px', padding: '10px 16px',
            marginBottom: '24px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span style={{ color: '#c0392b', fontWeight: '600' }}>
              🏷️ Showing articles tagged: #{activeTag}
            </span>
            <a href="/" style={{ color: textMuted, fontSize: '0.85rem' }}>Clear ✕</a>
          </div>
        )}

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
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
            <button onClick={() => setCategoryId('')} style={{
              padding: '10px 18px', borderRadius: '20px', fontSize: '0.85rem',
              fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: categoryId === '' ? '#c0392b' : darkMode ? '#1e1e1e' : '#e8e8e8',
              color: categoryId === '' ? '#fff' : textMuted,
            }}>All</button>
            {categories.map(c => (
  <button key={c.id} onClick={() => setCategoryId(c.id)} style={{
    padding: '10px 18px', borderRadius: '20px', fontSize: '0.85rem',
    fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    background: categoryId == c.id ? '#c0392b' : darkMode ? '#1e1e1e' : '#e8e8e8',
    color: categoryId == c.id ? '#fff' : textMuted,
  }}>
    {c.name}
    <span style={{
      marginLeft: '6px',
      background: categoryId == c.id ? 'rgba(255,255,255,0.3)' : 'rgba(192,57,43,0.15)',
      color: categoryId == c.id ? '#fff' : '#c0392b',
      padding: '1px 7px', borderRadius: '10px',
      fontSize: '0.75rem', fontWeight: '700'
    }}>{c.count || 0}</span>
  </button>
))}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: textMuted }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No articles found.</p>
          </div>
        ) : (
          <>
            {featured && !search && !categoryId && !activeTag && (
              <div style={{ marginBottom: '48px' }}>
                <h2 className="section-title" style={{ color: textMain }}>Featured Story</h2>
                <NewsCard news={featured} featured />
              </div>
            )}
            <h2 className="section-title" style={{ color: textMain }}>
              {search || categoryId || activeTag ? 'Results' : 'Latest News'}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {(search || categoryId || activeTag ? news : rest).map(n => (
                <NewsCard key={n.id} news={n} darkMode={darkMode} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '80px', borderTop: darkMode ? '1px solid #222' : '1px solid #e0e0e0',
        padding: '40px 20px', textAlign: 'center',
        color: textMuted, fontSize: '0.85rem',
        background: darkMode ? '#0a0a0a' : '#eaeaea'
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.4rem', fontWeight: '900',
          color: textMain, marginBottom: '8px'
        }}>📰 News<span style={{ color: '#c0392b' }}>Portal</span></div>
        <p>© {new Date().getFullYear()} NewsPortal. All rights reserved.</p>
      </footer>
    </div>
  )
}