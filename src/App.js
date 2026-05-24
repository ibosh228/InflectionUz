import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Direction from './pages/Direction'
import Leaderboard from './pages/Leaderboard'
import News from './pages/News'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import './index.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #1A3A5C', borderTopColor: '#7AABCF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

        <Route path="/dashboard" element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />
        <Route path="/iqtisodiyot" element={<PrivateRoute><Navbar /><Direction direction="iqtisodiyot" /></PrivateRoute>} />
        <Route path="/moliya" element={<PrivateRoute><Navbar /><Direction direction="moliya" /></PrivateRoute>} />
        <Route path="/tibbiyot" element={<PrivateRoute><Navbar /><Direction direction="tibbiyot" /></PrivateRoute>} />
        <Route path="/liderlar" element={<PrivateRoute><Navbar /><Leaderboard /></PrivateRoute>} />
        <Route path="/yangiliklar" element={<PrivateRoute><Navbar /><News /></PrivateRoute>} />
        <Route path="/profil" element={<PrivateRoute><Navbar /><Profile /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Navbar /><Admin /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
