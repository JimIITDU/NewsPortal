import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewsDetail from './pages/NewsDetail'
import Dashboard from './pages/admin/Dashboard'
import ManageNews from './pages/admin/ManageNews'
import ManageCategories from './pages/admin/ManageCategories'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    if (darkMode) {
      document.body.style.background = '#0f0f0f'
      document.body.style.color = '#e8e8e8'
      document.documentElement.style.setProperty('--dark', '#0f0f0f')
      document.documentElement.style.setProperty('--dark2', '#1a1a1a')
      document.documentElement.style.setProperty('--dark3', '#242424')
      document.documentElement.style.setProperty('--dark4', '#2e2e2e')
      document.documentElement.style.setProperty('--text', '#e8e8e8')
      document.documentElement.style.setProperty('--text-muted', '#999')
      document.documentElement.style.setProperty('--text-dim', '#666')
      document.documentElement.style.setProperty('--border', '#333')
      document.documentElement.style.setProperty('--card-bg', '#1e1e1e')
    } else {
      document.body.style.background = '#f4f4f4'
      document.body.style.color = '#111111'
      document.documentElement.style.setProperty('--dark', '#ffffff')
      document.documentElement.style.setProperty('--dark2', '#f8f8f8')
      document.documentElement.style.setProperty('--dark3', '#f0f0f0')
      document.documentElement.style.setProperty('--dark4', '#e8e8e8')
      document.documentElement.style.setProperty('--text', '#111111')
      document.documentElement.style.setProperty('--text-muted', '#555555')
      document.documentElement.style.setProperty('--text-dim', '#888888')
      document.documentElement.style.setProperty('--border', '#e0e0e0')
      document.documentElement.style.setProperty('--card-bg', '#ffffff')
    }
  }, [darkMode])

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f0f0f' : '#f4f4f4' }}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/register" element={<Register darkMode={darkMode} />} />
        <Route path="/news/:id" element={<NewsDetail darkMode={darkMode} />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly />}>
          <Route index element={<Dashboard darkMode={darkMode} />} />
          <Route path="news" element={<ManageNews darkMode={darkMode} />} />
          <Route path="categories" element={<ManageCategories darkMode={darkMode} />} />
        </Route>
      </Routes>
    </div>
  )
}