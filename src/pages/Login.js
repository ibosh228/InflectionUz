import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await login(email, password)
    if (error) setError(error.message === 'Invalid login credentials' ? 'Email yoki parol noto\'g\'ri' : error.message)
    else navigate('/dashboard')
    setLoading(false)
  }
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">
          <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'36px',height:'36px',background:'linear-gradient(135deg,#1a6fd4,#0a3d8f)',borderRadius:'8px',marginRight:'8px',fontSize:'20px',fontWeight:'900',color:'white',letterSpacing:'-1px'}}>X</span>
          <div>
            <p className="auth-logo-title">StemXuz</p>
            <p className="auth-logo-sub">Aspiring scholars</p>
          </div>
        </div>
        <h2 className="auth-title">Xush kelibsiz!</h2>
        <p className="auth-desc">Hisobingizga kiring</p>
        <form onSubmit={handleSubmit} className="auth-form">
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
          {error && <p className="auth-error">⚠️ {error}</p>}
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>
        <p className="auth-switch">
          Hisob yo'qmi? <Link to="/register">Ro'yxatdan o'ting</Link>
        </p>
      </div>
    </div>
  )
}