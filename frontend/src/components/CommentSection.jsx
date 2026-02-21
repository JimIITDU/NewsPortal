import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function CommentSection({ newsId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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
    <div style={{
      borderTop: '1px solid #222',
      paddingTop: '48px',
      paddingBottom: '60px',
      marginTop: '16px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.6rem', fontWeight: '700', color: '#fff'
        }}>
          💬 Discussion
        </h2>
        <span style={{
          background: '#c0392b', color: '#fff',
          fontSize: '0.75rem', fontWeight: '700',
          padding: '2px 10px', borderRadius: '20px'
        }}>{comments.length}</span>
      </div>

      {/* Comment Form */}
      {user ? (
        <div style={{
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: '12px', padding: '1.25rem',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            {/* Avatar */}
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
                  width: '100%', background: '#242424',
                  border: '1px solid #333', color: '#e8e8e8',
                  padding: '12px 14px', borderRadius: '8px',
                  fontSize: '0.95rem', resize: 'vertical',
                  outline: 'none', fontFamily: 'Inter, sans-serif',
                  marginBottom: '10px', transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#c0392b'}
                onBlur={e => e.target.style.borderColor = '#333'}
              />
              {error && (
                <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '8px' }}>
                  ⚠️ {error}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  style={{
                    background: submitting || !text.trim() ? '#444' : '#c0392b',
                    color: '#fff', border: 'none',
                    padding: '8px 20px', borderRadius: '6px',
                    fontSize: '0.9rem', fontWeight: '600',
                    cursor: submitting || !text.trim() ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: '12px', padding: '1.5rem',
          textAlign: 'center', marginBottom: '32px'
        }}>
          <p style={{ color: '#888', marginBottom: '12px' }}>
            Join the conversation — sign in to comment
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link to="/login" style={{
              background: '#c0392b', color: '#fff',
              padding: '8px 20px', borderRadius: '6px',
              fontSize: '0.9rem', fontWeight: '600'
            }}>Sign In</Link>
            <Link to="/register" style={{
              background: 'transparent', color: '#aaa',
              padding: '8px 20px', borderRadius: '6px',
              fontSize: '0.9rem', fontWeight: '600',
              border: '1px solid #333'
            }}>Register</Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💭</div>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {comments.map(comment => (
            <div key={comment.id} style={{
              background: '#1a1a1a', border: '1px solid #242424',
              borderRadius: '12px', padding: '1.25rem',
              transition: 'border-color 0.2s'
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#333'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#242424'}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: `hsl(${comment.user?.name?.charCodeAt(0) * 10}, 60%, 35%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '0.85rem', color: '#fff', flexShrink: 0
                  }}>{comment.user?.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ddd' }}>
                      {comment.user?.name}
                      {user?.role === 'admin' && (
                        <span style={{
                          marginLeft: '8px', background: '#c0392b',
                          color: '#fff', fontSize: '0.6rem',
                          padding: '1px 6px', borderRadius: '10px', fontWeight: '700'
                        }}>ADMIN</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#555' }}>
                      {timeAgo(comment.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Delete button — visible to comment owner or admin */}
                {(user?.id === comment.userId || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    style={{
                      background: 'transparent', border: 'none',
                      color: '#555', fontSize: '0.8rem', cursor: 'pointer',
                      padding: '4px 8px', borderRadius: '4px',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={e => e.target.style.color = '#e74c3c'}
                    onMouseOut={e => e.target.style.color = '#555'}
                  >🗑️ Delete</button>
                )}
              </div>

              <p style={{
                color: '#bbb', fontSize: '0.95rem',
                lineHeight: '1.7', paddingLeft: '44px'
              }}>{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}