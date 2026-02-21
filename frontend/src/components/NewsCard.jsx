import { Link } from 'react-router-dom'

const styles = {
  card: { background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', transition: 'transform 0.2s' },
  img: { width: '100%', height: '180px', objectFit: 'cover' },
  body: { padding: '1rem' },
  badge: { background: '#e94560', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' },
  title: { margin: '0.5rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#1a1a2e' },
  meta: { fontSize: '0.8rem', color: '#888' },
  link: { display: 'inline-block', marginTop: '0.75rem', color: '#e94560', textDecoration: 'none', fontWeight: '500' }
}

export default function NewsCard({ news }) {
  return (
    <div style={styles.card}>
      <img src={news.imageUrl || 'https://picsum.photos/seed/' + news.id + '/800/400'} alt={news.title} style={styles.img} />
      <div style={styles.body}>
        <span style={styles.badge}>{news.category?.name}</span>
        <h3 style={styles.title}>{news.title}</h3>
        <p style={styles.meta}>By {news.author?.name} · {new Date(news.createdAt).toLocaleDateString()}</p>
        <Link to={`/news/${news.id}`} style={styles.link}>Read more →</Link>
      </div>
    </div>
  )
}