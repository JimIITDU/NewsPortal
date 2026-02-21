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
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly />}>
          <Route index element={<Dashboard />} />
          <Route path="news" element={<ManageNews />} />
          <Route path="categories" element={<ManageCategories />} />
        </Route>
      </Routes>
    </>
  )
}