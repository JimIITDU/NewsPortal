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
          <img src={imgUrl} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <p style={{ color: '#bbb', fontSize: '0.85rem' }}>
              By {news.author?.name} · {new Date(news.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: '#c0392b', color: '#fff',
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
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
            fontSize: '1.1rem', fontWeight: '700', color: '#f0f0f0',
            lineHeight: '1.4', marginBottom: '10px', flex: 1,
          }}>{news.title}</h3>
          <p style={{ color: '#777', fontSize: '0.8rem' }}>
            By {news.author?.name} · {new Date(news.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <div style={{
            marginTop: '12px', paddingTop: '12px',
            borderTop: '1px solid #2a2a2a',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ color: '#c0392b', fontSize: '0.85rem', fontWeight: '600' }}>Read more →</span>
          </div>
        </div>
      </div>
    </Link>
  )
}