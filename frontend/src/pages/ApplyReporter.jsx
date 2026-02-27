import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function ApplyReporter({ darkMode = true }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    bio: '', experience: '', portfolioUrl: '', topics: ''
  })
  const [existing, setExisting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const bg = darkMode ? '#0f0f0f' : '#f4f4f4'
  const cardBg = darkMode ? '#1a1a1a' : '#ffffff'
  const border = darkMode ? '#2a2a2a' : '#e8e8e8'
  const textMain = darkMode ? '#f0f0f0' : '#111'
  const textMuted = darkMode ? '#888' : '#666'
  const inputBg = darkMode ? '#242424' : '#f8f8f8'
  const inputBorder = darkMode ? '#333' : '#ddd'

  const inputStyle = {
    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
    background: inputBg, border: `1px solid ${inputBorder}`,
    color: textMain, borderRadius: '8px', fontSize: '0.95rem',
    outline: 'none', fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s'
  }
  const labelStyle = {
    display: 'block', fontSize: '0.78rem', fontWeight: '700',
    color: textMuted, marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.5px'
  }

  useEffect(() => {
    if (user?.role === 'reporter') {
      navigate('/reporter')
      return
    }
    api.get('/reporter-applications/my-application')
      .then(res => { setExisting(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await api.post('/reporter-applications/apply', form)
      setSuccess('✅ Application submitted! The admin will review it shortly.')
      api.get('/reporter-applications/my-application').then(res => setExisting(res.data))
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting application.')
    } finally {
      setSubmitting(false)
    }
  }

  const statusConfig = {
    pending: { color: '#f39c12', bg: 'rgba(243,156,18,0.15)', icon: '⏳', label: 'Pending Review' },
    approved: { color: '#27ae60', bg: 'rgba(39,174,96,0.15)', icon: '✅', label: 'Approved' },
    rejected: { color: '#e74c3c', bg: 'rgba(231,76,60,0.15)', icon: '❌', label: 'Rejected' }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '40px 20px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✍️</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.2rem', fontWeight: '900',
            color: textMain, marginBottom: '8px'
          }}>Become a Reporter</h1>
          <p style={{ color: textMuted, fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            Join our team of journalists and share your stories with the world.
            Fill out the form below and our admin will review your application.
          </p>
        </div>

        {/* Existing application status */}
        {existing && (
          <div style={{
            background: statusConfig[existing.status]?.bg,
            border: `1px solid ${statusConfig[existing.status]?.color}`,
            borderRadius: '12px', padding: '1.5rem', marginBottom: '28px'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: existing.adminNote ? '12px' : '0'
            }}>
              <span style={{ fontSize: '1.5rem' }}>
                {statusConfig[existing.status]?.icon}
              </span>
              <div>
                <div style={{
                  fontWeight: '700', fontSize: '1rem',
                  color: statusConfig[existing.status]?.color
                }}>Application {statusConfig[existing.status]?.label}</div>
                <div style={{ fontSize: '0.8rem', color: textMuted }}>
                  Submitted {new Date(existing.createdAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </div>
              </div>
            </div>
            {existing.adminNote && (
              <div style={{
                marginTop: '12px', padding: '10px 14px',
                background: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                borderRadius: '8px', fontSize: '0.9rem', color: textMain
              }}>
                <strong>Admin note:</strong> {existing.adminNote}
              </div>
            )}
            {existing.status === 'rejected' && (
              <p style={{ marginTop: '12px', fontSize: '0.85rem', color: textMuted }}>
                You can submit a new application below.
              </p>
            )}
          </div>
        )}

        {/* Show form if no pending application */}
        {(!existing || existing.status === 'rejected') && (
          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: '16px', padding: '2rem'
          }}>
            {error && (
              <div style={{
                background: 'rgba(192,57,43,0.15)',
                border: '1px solid rgba(192,57,43,0.4)',
                color: '#e74c3c', padding: '10px 14px',
                borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem'
              }}>⚠️ {error}</div>
            )}
            {success && (
              <div style={{
                background: 'rgba(39,174,96,0.15)',
                border: '1px solid rgba(39,174,96,0.4)',
                color: '#27ae60', padding: '10px 14px',
                borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem'
              }}>{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>About You / Bio *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  placeholder="Tell us about yourself..."
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  required
                  onFocus={e => e.target.style.borderColor = '#c0392b'}
                  onBlur={e => e.target.style.borderColor = inputBorder}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Writing Experience *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  placeholder="Describe your writing or journalism experience..."
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })}
                  required
                  onFocus={e => e.target.style.borderColor = '#c0392b'}
                  onBlur={e => e.target.style.borderColor = inputBorder}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Topics You Cover *</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Politics, Technology, Sports, Business"
                  value={form.topics}
                  onChange={e => setForm({ ...form, topics: e.target.value })}
                  required
                  onFocus={e => e.target.style.borderColor = '#c0392b'}
                  onBlur={e => e.target.style.borderColor = inputBorder}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Portfolio URL (optional)</label>
                <input
                  style={inputStyle}
                  placeholder="https://your-portfolio.com"
                  value={form.portfolioUrl}
                  onChange={e => setForm({ ...form, portfolioUrl: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#c0392b'}
                  onBlur={e => e.target.style.borderColor = inputBorder}
                />
              </div>

              <button type="submit" disabled={submitting} style={{
                width: '100%', background: submitting ? '#888' : '#c0392b',
                color: '#fff', border: 'none', padding: '14px',
                borderRadius: '8px', fontSize: '1rem', fontWeight: '700',
                cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
              }}>{submitting ? 'Submitting...' : '🚀 Submit Application'}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}