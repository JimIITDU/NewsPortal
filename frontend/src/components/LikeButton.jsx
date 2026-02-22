import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function LikeButton({ newsId, darkMode = true }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pop, setPop] = useState(false)

  useEffect(() => {
    api.get(`/likes/${newsId}/status`)
      .then(res => {
        setLiked(res.data.liked)
        setCount(res.data.count)
      }).catch(() => {})
  }, [newsId])

  const handleToggle = async () => {
    if (!user) return navigate('/login')
    setLoading(true)
    try {
      const res = await api.post(`/likes/${newsId}/toggle`)
      setLiked(res.data.liked)
      setCount(res.data.count)
      if (res.data.liked) {
        setPop(true)
        setTimeout(() => setPop(false), 600)
      }
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
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 16px', borderRadius: '8px',
        background: liked
          ? 'rgba(231,76,60,0.15)'
          : darkMode ? '#1e1e1e' : '#f0f0f0',
        border: liked
          ? '1px solid rgba(231,76,60,0.5)'
          : darkMode ? '1px solid #333' : '1px solid #ddd',
        color: liked ? '#e74c3c' : darkMode ? '#aaa' : '#666',
        fontSize: '0.85rem', fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        transform: pop ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      <span style={{ fontSize: '1rem', transition: 'transform 0.2s' }}>
        {liked ? '❤️' : '🤍'}
      </span>
      {count > 0 && <span>{count}</span>}
      {count === 0 && <span>Like</span>}
    </button>
  )
}