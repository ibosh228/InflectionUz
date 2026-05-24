import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { profile } = useAuth()

  const directions = [
    { key: 'iqtisodiyot', icon: '💼', title: 'Iqtisodiyot', desc: 'GDP, inflyatsiya, bozor iqtisodiyoti', color: '#1A5276' },
    { key: 'moliya', icon: '📈', title: 'Moliya', desc: 'Investitsiya, byudjet, foiz stavkasi', color: '#0D5F3C' },
    { key: 'tibbiyot', icon: '🩺', title: 'Tibbiyot', desc: 'Anatomiya, immunitet, kasalliklar', color: '#5B2C6F' },
  ]

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <div className="hero-section">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-dot" /> STEMXUZ TIZIMI
            </div>
            <h1 className="hero-title">
              Xush kelibsiz,<br />
              <span className="hero-name">{profile?.full_name?.split(' ')[0] || 'Foydalanuvchi'}!</span>
            </h1>
            <p className="hero-desc">
              Koinotdek cheksiz bilimlarga qadam qo'ying. <strong>Moliya, Iqtisodiyot va Tibbiyot</strong> yo'nalishlaridagi sirlarni kashf etish orqali o'z salohiyatingizni yuksaltiring.
            </p>
            <div className="hero-btns">
              <Link to="/liderlar" className="btn btn-primary">🏆 Liderlar jadvali</Link>
              <Link to="/profil" className="btn btn-outline">👤 Profilim</Link>
            </div>
          </div>
          <div className="hero-right">
            <div className="score-card">
              <div className="score-icon">🏅</div>
              <div className="score-num">{profile?.total_score || 0}</div>
              <div className="score-label">JAMI BALLAR</div>
            </div>
          </div>
        </div>

        {/* Directions */}
        <div className="section-header">
          <h2>O'quv bo'limlari</h2>
          <p>O'zingizga ma'qul yo'nalishni tanlang va bilimingizni sinab ko'ring</p>
        </div>

        <div className="directions-grid">
          {directions.map(d => (
            <Link to={`/${d.key}`} key={d.key} className="direction-card" style={{ '--card-color': d.color }}>
              <div className="dir-icon">{d.icon}</div>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
              <div className="dir-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
