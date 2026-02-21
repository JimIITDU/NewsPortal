import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function NewsDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [related, setRelated] = useState([])

  useEffect(() => {
    api.get(`/news/${id}`)
      .then(res => {
        setNews(res.data)
        return api.get('/news', { params: { categoryId: res.data.categoryId } })
      })
      .then(res => setRelated(res.data.filter(n => n.id != id).slice(0, 3)))
      .catch(() => navigate('/'))
    window.scrollTo(0, 0)
  }, [id])

  if (!news) return <div className="loading-spinner"><div className="spinner" /></div>

  const imgUrl = news.imageUrl || `https://picsum.photos/seed/${news.id}/1200/600`

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '480px', overflow: 'hidden' }}>
        <img src={imgUrl} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0.5) 50%, rgba(15,15,15,0.2) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 20px 40px',
          maxWidth: '900px', margin: '0 auto',
        }}>
        </div>
      </div>

      {/* Article */}
      <div className="container" style={{ maxWidth: '800px', padding: '0 20px' }}>
        <div style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
          <span className="badge" style={{ marginBottom: '16px' }}>{news.category?.name}</span>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: '900', color: '#fff',
            lineHeight: '1.2', marginBottom: '20px',
          }}>{news.title}</h1>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            paddingBottom: '24px', borderBottom: '1px solid #222',
            marginBottom: '32px', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: '#c0392b', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: '700', fontSize: '1rem', color: '#fff',
              }}>{news.author?.name?.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ddd' }}>{news.author?.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {new Date(news.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '1.1rem', lineHeight: '1.9', color: '#ccc',
            marginBottom: '48px', whiteSpace: 'pre-wrap',
          }}>{news.content}</div>

          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent', border: '1px solid #333', color: '#aaa',
              padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem',
              marginBottom: '60px', display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >← Back</button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ borderTop: '1px solid #222', paddingTop: '48px', paddingBottom: '60px' }}>
            <h2 className="section-title">Related Articles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {related.map(n => (
                <Link to={`/news/${n.id}`} key={n.id} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1rem' }}>
                    <img
                      src={n.imageUrl || `https://picsum.photos/seed/${n.id}/400/200`}
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                    />
                    <span className="badge badge-outline" style={{ marginBottom: '8px', fontSize: '0.65rem' }}>{n.category?.name}</span>
                    <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.95rem', color: '#eee', lineHeight: '1.4' }}>{n.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}