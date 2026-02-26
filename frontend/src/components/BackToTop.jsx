import { useState, useEffect } from 'react'

export default function BackToTop({ darkMode = true }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 9999,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: '#c0392b',
        color: '#fff',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(192,57,43,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >↑</button>
  )
}