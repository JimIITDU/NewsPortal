import { Link } from 'react-router-dom'

const styles = {
  page: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  h1: { color: '#1a1a2e', marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textDecoration: 'none', color: '#1a1a2e', textAlign: 'center', transition: 'transform 0.2s' },
  icon: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  label: { fontSize: '1.1rem', fontWeight: '600' }
}

export default function Dashboard() {
  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Admin Dashboard</h1>
      <div style={styles.grid}>
        <Link to="/admin/news" style={styles.card}>
          <div style={styles.icon}>📰</div>
          <div style={styles.label}>Manage News</div>
        </Link>
        <Link to="/admin/categories" style={styles.card}>
          <div style={styles.icon}>🗂️</div>
          <div style={styles.label}>Manage Categories</div>
        </Link>
      </div>
    </div>
  )
}