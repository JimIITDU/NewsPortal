import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function BookmarkButton({ newsId, darkMode = true }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      api.get(`/bookmarks/${newsId}/check`)
        .then(res => setBookmarked(res.data.bookmarked))
        .catch(() => {})
    }
  }, [newsId, user])

  const handleToggle = async () => {
    if (!user) return navigate('/login')
    setLoading(true)
    try {
      const res = await api.post(`/bookmarks/${newsId}/toggle`)
      setBookmarked(res.data.bookmarked)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={bookmarked ? 'Remove bookmark' : 'Save article'}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 16px', borderRadius: '8px',
        background: bookmarked
          ? 'rgba(192,57,43,0.15)'
          : darkMode ? '#1e1e1e' : '#f0f0f0',
        border: bookmarked
          ? '1px solid rgba(192,57,43,0.5)'
          : darkMode ? '1px solid #333' : '1px solid #ddd',
        color: bookmarked ? '#c0392b' : darkMode ? '#aaa' : '#666',
        fontSize: '0.85rem', fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {bookmarked ? '🔖 Saved' : '🔖 Save'}
    </button>
  )
}