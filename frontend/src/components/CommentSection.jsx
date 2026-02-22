import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function CommentSection({ newsId, darkMode = true }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const cardBg = darkMode ? '#1a1a1a' : '#ffffff'
  const cardBg2 = darkMode ? '#242424' : '#f8f8f8'
  const border = darkMode ? '#2a2a2a' : '#e8e8e8'
  const border2 = darkMode ? '#333' : '#ddd'
  const textMain = darkMode ? '#f0f0f0' : '#111'
  const textMuted = darkMode ? '#666' : '#888'
  const textContent = darkMode ? '#bbb' : '#333'

  const fetchComments = () => {
    api.get(`/news/${newsId}/comments`)
      .then(res => { setComments(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchComments() }, [newsId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post(`/news/${newsId}/comments`, { content: text })
      setComments(prev => [res.data, ...prev])
      setText('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return
    try {
      await api.delete(`/news/${newsId}/comments/${id}`)
      setComments(prev => prev.filter(c => c.id !== id))
    } catch {
      alert('Could not delete comment.')
    }
  }

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div style={{ borderTop: `1px solid ${border}`, paddingTop: '48px', paddingBottom: '60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.6rem', fontWeight: '700', color: textMain
        }}>💬 Discussion</h2>
        <span style={{
          background: '#c0392b', color: '#fff',
          fontSize: '0.75rem', fontWeight: '700',
          padding: '2px 10px', borderRadius: '20px'
        }}>{comments.length}</span>
      </div>

      {/* Comment Form */}
      {user ? (
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: '12px', padding: '1.25rem', marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: '#c0392b', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '0.9rem', color: '#fff'
            }}>{user.name?.charAt(0).toUpperCase()}</div>
            <form onSubmit={handleSubmit} style={{ flex: 1 }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                style={{
                  width: '100%', background: cardBg2,
                  border: `1px solid ${border2}`, color: textMain,
                  padding: '12px 14px', borderRadius: '8px',
                  fontSize: '0.95rem', resize: 'vertical', outline: 'none',
                  fontFamily: 'Inter, sans-serif', marginBottom: '10px',
                  transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#c0392b'}
                onBlur={e => e.target.style.borderColor = border2}
              />
              {error && (
                <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '8px' }}>
                  ⚠️ {error}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={submitting || !text.trim()} style={{
                  background: submitting || !text.trim() ? (darkMode ? '#444' : '#ccc') : '#c0392b',
                  color: submitting || !text.trim() ? (darkMode ? '#888' : '#999') : '#fff',
                  border: 'none', padding: '8px 20px', borderRadius: '6px',
                  fontSize: '0.9rem', fontWeight: '600',
                  cursor: submitting || !text.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}>{submitting ? 'Posting...' : 'Post Comment'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: '12px', padding: '1.5rem',
          textAlign: 'center', marginBottom: '28px'
        }}>
          <p style={{ color: textMuted, marginBottom: '12px' }}>
            Join the conversation — sign in to comment
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link to="/login" style={{
              background: '#c0392b', color: '#fff',
              padding: '8px 20px', borderRadius: '6px',
              fontSize: '0.9rem', fontWeight: '600'
            }}>Sign In</Link>
            <Link to="/register" style={{
              background: 'transparent', color: textMuted,
              padding: '8px 20px', borderRadius: '6px',
              fontSize: '0.9rem', fontWeight: '600',
              border: `1px solid ${border2}`
            }}>Register</Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: textMuted }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💭</div>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {comments.map(comment => (
            <div key={comment.id} style={{
              background: cardBg, border: `1px solid ${border}`,
              borderRadius: '12px', padding: '1.25rem',
              transition: 'border-color 0.2s'
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = border2}
              onMouseOut={e => e.currentTarget.style.borderColor = border}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: `hsl(${comment.user?.name?.charCodeAt(0) * 10}, 55%, 40%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '0.85rem', color: '#fff', flexShrink: 0
                  }}>{comment.user?.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: textMain }}>
                      {comment.user?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: textMuted }}>
                      {timeAgo(comment.createdAt)}
                    </div>
                  </div>
                </div>
                {(user?.id === comment.userId || user?.role === 'admin') && (
                  <button onClick={() => handleDelete(comment.id)} style={{
                    background: 'transparent', border: 'none',
                    color: textMuted, fontSize: '0.8rem', cursor: 'pointer',
                    padding: '4px 8px', borderRadius: '4px', transition: 'color 0.2s'
                  }}
                    onMouseOver={e => e.target.style.color = '#e74c3c'}
                    onMouseOut={e => e.target.style.color = textMuted}
                  >🗑️ Delete</button>
                )}
              </div>
              <p style={{
                color: textContent, fontSize: '0.95rem',
                lineHeight: '1.7', paddingLeft: '44px'
              }}>{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}