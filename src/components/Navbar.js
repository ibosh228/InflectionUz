import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">📊</span>
          <div>
            <span className="logo-text">StemXuz</span>
            <span className="logo-sub">Aspiring scholars</span>
          </div>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/iqtisodiyot" className={`nav-link ${isActive('/iqtisodiyot') ? 'active' : ''}`}>
            💼 Iqtisodiyot
          </Link>
          <Link to="/moliya" className={`nav-link ${isActive('/moliya') ? 'active' : ''}`}>
            📈 Moliya
          </Link>
          <Link to="/tibbiyot" className={`nav-link ${isActive('/tibbiyot') ? 'active' : ''}`}>
            🩺 Tibbiyot
          </Link>
          <Link to="/yangiliklar" className={`nav-link ${isActive('/yangiliklar') ? 'active' : ''}`}>
            📰 Yangiliklar
          </Link>
        </div>

        <div className="navbar-right">
          <Link to="/liderlar" className="score-badge">
            🏅 {profile?.total_score || 0} BALL
          </Link>
          <Link to="/profil" className="avatar">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </Link>
          <button onClick={handleLogout} className="logout-btn" title="Chiqish">⇠</button>
        </div>

        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>
    </nav>
  )
}
