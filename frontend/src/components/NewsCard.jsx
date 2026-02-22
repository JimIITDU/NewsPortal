import { Link } from 'react-router-dom'

export default function NewsCard({ news, featured = false }) {
  const imgUrl = news.imageUrl || `https://picsum.photos/seed/${news.id}/800/450`

  if (featured) {
    return (
      <Link to={`/news/${news.id}`} style={{ textDecoration: 'none' }}>
        <div style={{
          position: 'relative', borderRadius: '16px', overflow: 'hidden',
          height: '480px', cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <img src={imgUrl} alt={news.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
            <span className="badge" style={{ marginBottom: '10px' }}>{news.category?.name}</span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.9rem', fontWeight: '900', color: '#fff',
              lineHeight: '1.2', marginBottom: '12px',
            }}>{news.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ color: '#bbb', fontSize: '0.85rem' }}>
                By {news.author?.name} · {new Date(news.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#aaa' }}>
                <span>👁️ {news.views || 0}</span>
                <span>❤️ {news.likeCount || 0}</span>
              </div>
            </div>
          </div>
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: '#c0392b', color: '#fff',
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '0.7rem', fontWeight: '700',
            letterSpacing: '1px', textTransform: 'uppercase',
          }}>Featured</div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/news/${news.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
          <img src={imgUrl} alt={news.title} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <span className="badge">{news.category?.name}</span>
          </div>
        </div>
        <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.05rem', fontWeight: '700',
            color: 'var(--text)', lineHeight: '1.4',
            marginBottom: '10px', flex: 1,
          }}>{news.title}</h3>

          {/* Tags preview */}
          {news.tags && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {news.tags.split(',').slice(0, 2).map(t => (
                <span key={t} style={{
                  fontSize: '0.7rem', color: '#c0392b',
                  background: 'rgba(192,57,43,0.1)',
                  padding: '2px 8px', borderRadius: '10px',
                }}>#{t.trim()}</span>
              ))}
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px', paddingTop: '12px',
            borderTop: '1px solid var(--border)',
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              {new Date(news.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>👁️ {news.views || 0}</span>
              <span>❤️ {news.likeCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}