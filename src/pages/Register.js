import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Parollar mos kelmadi'); return }
    if (password.length < 6) { setError('Parol kamida 6 ta belgidan iborat bo\'lsin'); return }
    setLoading(true)
    const { error } = await register(fullName, email, password)
    if (error) setError(error.message)
    else {
      setSuccess('Ro\'yxatdan o\'tdingiz! Email ni tasdiqlang va kiring.')
      setTimeout(() => navigate('/login'), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">
          <span>📊</span>
          <div>
            <p className="auth-logo-title">InflectionUz</p>
            <p className="auth-logo-sub">Aspiring scholars</p>
          </div>
        </div>
        <h2 className="auth-title">Ro'yxatdan o'ting</h2>
        <p className="auth-desc">Yangi hisob yarating</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Ism Familiya</label>
            <input
              type="text"
              placeholder="Ismoil Karimov"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Parol</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Parolni tasdiqlang</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <p className="auth-error">⚠️ {error}</p>}
          {success && <p className="auth-success">✅ {success}</p>}
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Yaratilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <p className="auth-switch">
          Hisob bormi? <Link to="/login">Kiring</Link>
        </p>
      </div>
    </div>
  )
}
