import { useNavigate } from 'react-router-dom'

export default function TagList({ tags, darkMode = true }) {
  const navigate = useNavigate()
  if (!tags) return null

  const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
  if (tagArray.length === 0) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '16px 0' }}>
      {tagArray.map(tag => (
        <button
          key={tag}
          onClick={() => navigate(`/?tag=${tag}`)}
          style={{
            background: darkMode ? '#1e1e1e' : '#f0f0f0',
            border: darkMode ? '1px solid #333' : '1px solid #ddd',
            color: darkMode ? '#aaa' : '#555',
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '0.8rem', fontWeight: '500',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = '#c0392b'
            e.currentTarget.style.color = '#c0392b'
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = darkMode ? '#333' : '#ddd'
            e.currentTarget.style.color = darkMode ? '#aaa' : '#555'
          }}
        >#{tag}</button>
      ))}
    </div>
  )
}