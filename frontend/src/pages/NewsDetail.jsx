import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import CommentSection from '../components/CommentSection'
import BookmarkButton from '../components/BookmarkButton'
import LikeButton from '../components/LikeButton'
import TagList from '../components/TagList'

export default function NewsDetail({ darkMode = true }) {
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
  const textMuted = darkMode ? '#666' : '#888'
  const textMain = darkMode ? '#fff' : '#111'
  const border = darkMode ? '#222' : '#e8e8e8'
  const contentColor = darkMode ? '#ccc' : '#333'
  const cardBg = darkMode ? '#1a1a1a' : '#fff'
  const shareUrl = window.location.href
  const shareTitle = news.title

const handleShare = (platform) => {
  const urls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
  }
  window.open(urls[platform], '_blank', 'width=600,height=400')
}

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f0f0f' : '#f4f4f4' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '480px', overflow: 'hidden' }}>
        <img src={imgUrl} alt={news.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: darkMode
            ? 'linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0.4) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(244,244,244,1) 0%, rgba(244,244,244,0.3) 60%, transparent 100%)',
        }} />
      </div>

      <div className="container" style={{ maxWidth: '800px', padding: '0 20px' }}>
        <div style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
          <span className="badge" style={{ marginBottom: '16px' }}>{news.category?.name}</span>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: '900', color: textMain,
            lineHeight: '1.2', marginBottom: '20px',
          }}>{news.title}</h1>

          {/* Meta row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '20px', borderBottom: `1px solid ${border}`,
            marginBottom: '16px', flexWrap: 'wrap', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: '#c0392b', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: '700', fontSize: '1rem', color: '#fff',
              }}>{news.author?.name?.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: darkMode ? '#ddd' : '#222' }}>
                  {news.author?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: textMuted }}>
                  {new Date(news.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#c0392b', fontWeight: '600', marginTop: '2px' }}>
                ⏱️ {Math.max(1, Math.ceil(news.content?.split(' ').length / 200))} min read
              </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '6px 12px', borderRadius: '8px',
                background: darkMode ? '#1e1e1e' : '#f0f0f0',
                border: darkMode ? '1px solid #333' : '1px solid #ddd',
                fontSize: '0.85rem', color: textMuted,
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>👁️ {news.views || 0}</span>
              <LikeButton newsId={id} darkMode={darkMode} />
              <BookmarkButton newsId={id} darkMode={darkMode} />
            </div>
            {/* Share Buttons */}
<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
  <span style={{ fontSize: '0.8rem', color: textMuted, marginRight: '4px' }}>Share:</span>
  {[
    { platform: 'twitter', label: '𝕏', color: '#000' },
    { platform: 'facebook', label: 'f', color: '#1877f2' },
    { platform: 'whatsapp', label: '✉', color: '#25d366' },
  ].map(({ platform, label, color }) => (
    <button
      key={platform}
      onClick={() => handleShare(platform)}
      style={{
        width: '32px', height: '32px',
        borderRadius: '50%', border: 'none',
        background: color, color: '#fff',
        fontSize: '0.85rem', fontWeight: '700',
        cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.2s, opacity 0.2s',
      }}
      onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
      onMouseOut={e => e.currentTarget.style.opacity = '1'}
    >{label}</button>
  ))}
</div>
          </div>

          {/* Tags */}
          <TagList tags={news.tags} darkMode={darkMode} />

          {/* Content */}
          <div style={{
            fontSize: '1.1rem', lineHeight: '1.9',
            color: contentColor, marginBottom: '48px',
            whiteSpace: 'pre-wrap', marginTop: '16px'
          }}>{news.content}</div>

          <button onClick={() => navigate(-1)} style={{
            background: 'transparent',
            border: darkMode ? '1px solid #333' : '1px solid #ccc',
            color: darkMode ? '#aaa' : '#666',
            padding: '10px 20px', borderRadius: '8px',
            fontSize: '0.9rem', marginBottom: '60px',
            display: 'flex', alignItems: 'center', gap: '6px',
            cursor: 'pointer',
          }}>← Back</button>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '48px', marginBottom: '0' }}>
            <h2 className="section-title" style={{color: textMain}}>Related Articles</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px', marginBottom: '48px'
            }}>
              {related.map(n => (
                <Link to={`/news/${n.id}`} key={n.id} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1rem', background: cardBg }}>
                    <img
                      src={n.imageUrl || `https://picsum.photos/seed/${n.id}/400/200`}
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                    />
                    <span className="badge badge-outline" style={{ marginBottom: '8px', fontSize: '0.65rem' }}>
                      {n.category?.name}
                    </span>
                    <h4 style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: '0.95rem', color: darkMode ? '#eee' : '#111', lineHeight: '1.4'
                    }}>{n.title}</h4>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.75rem', color: textMuted }}>
                      <span>👁️ {n.views || 0}</span>
                      <span>❤️ {n.likeCount || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <CommentSection newsId={id} darkMode={darkMode} />
      </div>
    </div>
  )
}