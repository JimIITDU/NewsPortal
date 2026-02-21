import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const styles = {
  page: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' },
  img: { width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' },
  badge: { background: '#e94560', color: '#fff', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px' },
  title: { fontSize: '2rem', color: '#1a1a2e', margin: '1rem 0 0.5rem' },
  meta: { color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' },
  content: { lineHeight: '1.8', color: '#333', fontSize: '1.05rem' },
  back: { display: 'inline-block', marginTop: '2rem', color: '#e94560', cursor: 'pointer', textDecoration: 'underline' }
}

export default function NewsDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)

  useEffect(() => {
    api.get(`/news/${id}`).then(res => setNews(res.data)).catch(() => navigate('/'))
  }, [id])

  if (!news) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>

  return (
    <div style={styles.page}>
      <img src={news.imageUrl || 'https://picsum.photos/seed/' + news.id + '/800/400'} alt={news.title} style={styles.img} />
      <span style={styles.badge}>{news.category?.name}</span>
      <h1 style={styles.title}>{news.title}</h1>
      <p style={styles.meta}>By {news.author?.name} · {new Date(news.createdAt).toLocaleDateString()}</p>
      <p style={styles.content}>{news.content}</p>
      <span style={styles.back} onClick={() => navigate(-1)}>← Back</span>
    </div>
  )
}