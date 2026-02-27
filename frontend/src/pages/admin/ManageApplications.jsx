import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function ManageApplications({ darkMode = true }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [reviewing, setReviewing] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [processing, setProcessing] = useState(false)

  const bg = darkMode ? '#0f0f0f' : '#f4f4f4'
  const cardBg = darkMode ? '#1a1a1a' : '#ffffff'
  const border = darkMode ? '#2a2a2a' : '#e8e8e8'
  const textMain = darkMode ? '#f0f0f0' : '#111'
  const textMuted = darkMode ? '#888' : '#666'
  const inputBg = darkMode ? '#242424' : '#f8f8f8'
  const inputBorder = darkMode ? '#333' : '#ddd'

  const fetchApplications = () => {
    api.get('/reporter-applications/admin/all')
      .then(res => { setApplications(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchApplications() }, [])

  const handleReview = async (id, status) => {
    setProcessing(true)
    try {
      await api.put(`/reporter-applications/admin/${id}/review`, {
        status, adminNote
      })
      setReviewing(null)
      setAdminNote('')
      fetchApplications()
    } catch (err) {
      alert(err.response?.data?.message || 'Error reviewing application.')
    } finally {
      setProcessing(false)
    }
  }

  const statusConfig = {
    pending: { color: '#f39c12', bg: 'rgba(243,156,18,0.15)', label: '⏳ Pending' },
    approved: { color: '#27ae60', bg: 'rgba(39,174,96,0.15)', label: '✅ Approved' },
    rejected: { color: '#e74c3c', bg: 'rgba(231,76,60,0.15)', label: '❌ Rejected' }
  }

  const filtered = applications.filter(a => a.status === filter)

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '32px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem', fontWeight: '900',
            color: textMain, marginBottom: '6px'
          }}>Reporter Applications</h1>
          <p style={{ color: textMuted }}>
            {applications.filter(a => a.status === 'pending').length} pending ·{' '}
            {applications.filter(a => a.status === 'approved').length} approved ·{' '}
            {applications.filter(a => a.status === 'rejected').length} rejected
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: 'flex', gap: '4px',
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: '10px', padding: '4px',
          marginBottom: '24px', width: 'fit-content'
        }}>
          {['pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none',
              background: filter === s ? '#c0392b' : 'transparent',
              color: filter === s ? '#fff' : textMuted,
              fontWeight: '600', fontSize: '0.85rem',
              cursor: 'pointer', transition: 'all 0.2s',
              textTransform: 'capitalize'
            }}>{statusConfig[s].label}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: '12px', padding: '3rem', textAlign: 'center',
            color: textMuted
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
            <p>No {filter} applications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(app => (
              <div key={app.id} style={{
                background: cardBg, border: `1px solid ${border}`,
                borderRadius: '12px', padding: '1.5rem'
              }}>
                {/* Applicant header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '16px',
                  flexWrap: 'wrap', gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: '#c0392b', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: '700', color: '#fff', flexShrink: 0
                    }}>{app.applicant?.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: '700', color: textMain, fontSize: '1rem' }}>
                        {app.applicant?.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: textMuted }}>
                        {app.applicant?.email}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '2px' }}>
                        Applied {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    background: statusConfig[app.status].bg,
                    color: statusConfig[app.status].color,
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '0.8rem', fontWeight: '700'
                  }}>{statusConfig[app.status].label}</span>
                </div>

                {/* Application details */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '16px', marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Bio</div>
                    <p style={{ color: textMain, fontSize: '0.9rem', lineHeight: '1.6' }}>{app.bio}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Experience</div>
                    <p style={{ color: textMain, fontSize: '0.9rem', lineHeight: '1.6' }}>{app.experience}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Topics: </span>
                    <span style={{ fontSize: '0.9rem', color: '#c0392b', fontWeight: '600' }}>{app.topics}</span>
                  </div>
                  {app.portfolioUrl && (
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Portfolio: </span>
                      <a href={app.portfolioUrl} target="_blank" rel="noreferrer"
                        style={{ fontSize: '0.9rem', color: '#2980b9' }}>
                        View Portfolio →
                      </a>
                    </div>
                  )}
                </div>

                {/* Admin note if exists */}
                {app.adminNote && (
                  <div style={{
                    background: darkMode ? '#242424' : '#f8f8f8',
                    border: `1px solid ${border}`,
                    borderRadius: '8px', padding: '10px 14px',
                    marginBottom: '16px', fontSize: '0.85rem', color: textMuted
                  }}>
                    <strong>Admin note:</strong> {app.adminNote}
                  </div>
                )}

                {/* Review panel */}
                {app.status === 'pending' && (
                  reviewing === app.id ? (
                    <div style={{
                      background: darkMode ? '#242424' : '#f8f8f8',
                      border: `1px solid ${border}`,
                      borderRadius: '10px', padding: '1rem', marginTop: '12px'
                    }}>
                      <textarea
                        placeholder="Add a note (optional — required for rejection)"
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                        style={{
                          width: '100%', padding: '10px',
                          background: inputBg, border: `1px solid ${inputBorder}`,
                          color: textMain, borderRadius: '8px',
                          fontSize: '0.9rem', resize: 'vertical',
                          minHeight: '80px', fontFamily: 'Inter, sans-serif',
                          marginBottom: '12px', boxSizing: 'border-box', outline: 'none'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleReview(app.id, 'approved')}
                          disabled={processing}
                          style={{
                            background: '#27ae60', color: '#fff', border: 'none',
                            padding: '8px 20px', borderRadius: '8px',
                            fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem'
                          }}>✅ Approve</button>
                        <button
                          onClick={() => handleReview(app.id, 'rejected')}
                          disabled={processing}
                          style={{
                            background: '#e74c3c', color: '#fff', border: 'none',
                            padding: '8px 20px', borderRadius: '8px',
                            fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem'
                          }}>❌ Reject</button>
                        <button
                          onClick={() => { setReviewing(null); setAdminNote('') }}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${border}`,
                            color: textMuted, padding: '8px 20px',
                            borderRadius: '8px', fontWeight: '600',
                            cursor: 'pointer', fontSize: '0.9rem'
                          }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReviewing(app.id)}
                      style={{
                        background: 'rgba(192,57,43,0.15)', color: '#c0392b',
                        border: '1px solid rgba(192,57,43,0.3)',
                        padding: '8px 20px', borderRadius: '8px',
                        fontWeight: '600', cursor: 'pointer',
                        fontSize: '0.9rem', marginTop: '4px'
                      }}>Review Application</button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}