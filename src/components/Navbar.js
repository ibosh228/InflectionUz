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
  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-logo" onClick={closeMenu}>
           <img src="/logo.png" alt="StemX" style={{height:'40px', borderRadius:'4px'}} />
          <div>
            <span className="logo-text">StemXuz</span>
            <span className="logo-sub">Aspiring scholars</span>
          </div>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/iqtisodiyot" className={`nav-link ${isActive('/iqtisodiyot') ? 'active' : ''}`} onClick={closeMenu}>
            💼 Iqtisodiyot
          </Link>
          <Link to="/moliya" className={`nav-link ${isActive('/moliya') ? 'active' : ''}`} onClick={closeMenu}>
            📈 Moliya
          </Link>
          <Link to="/tibbiyot" className={`nav-link ${isActive('/tibbiyot') ? 'active' : ''}`} onClick={closeMenu}>
            🩺 Tibbiyot
          </Link>
          <Link to="/yangiliklar" className={`nav-link ${isActive('/yangiliklar') ? 'active' : ''}`} onClick={closeMenu}>
            📰 Yangiliklar
          </Link>
          <Link to="/liderlar" className={`nav-link ${isActive('/liderlar') ? 'active' : ''}`} onClick={closeMenu}>
            🏆 Liderlar
          </Link>
          <button onClick={() => { handleLogout(); closeMenu() }} className="nav-link logout-mobile">
            ⇠ Chiqish
          </button>
        </div>

        <div className="navbar-right desktop-only">
          <Link to="/liderlar" className="score-badge">
            🏅 {profile?.total_score || 0} BALL
          </Link>
          <Link to="/profil" className="avatar">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </Link>
          <button onClick={handleLogout} className="logout-btn" title="Chiqish">⇠</button>
        </div>

        <div className="navbar-right-mobile">
          <Link to="/liderlar" className="score-badge">
            🏅 {profile?.total_score || 0} BALL
          </Link>
          <Link to="/profil" className="avatar">
            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
          </Link>
        </div>

        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}