import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

export default function Profile() {
  const { profile } = useAuth()
  const [certs, setCerts] = useState([])
  const [confCount, setConfCount] = useState(0)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    const fetchData = async () => {
      const [certsRes, confRes, histRes] = await Promise.all([
        supabase.from('certificates').select('*, conferences(title, date)').eq('user_id', profile.id),
        supabase.from('conference_participants').select('id', { count: 'exact' }).eq('user_id', profile.id),
        supabase.from('score_history').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(10)
      ])
      setCerts(certsRes.data || [])
      setConfCount(confRes.count || 0)
      setHistory(histRes.data || [])
      setLoading(false)
    }
    fetchData()
  }, [profile])

  const getLevel = (score) => {
    if (score >= 100) return { label: 'Ekspert', color: '#FFD700', icon: '🏆' }
    if (score >= 50) return { label: 'Ilg\'or', color: '#7AABCF', icon: '⭐' }
    if (score >= 20) return { label: 'O\'rta', color: '#4CAF82', icon: '📈' }
    return { label: 'Boshlang\'ich', color: '#B3CFE5', icon: '🌱' }
  }

  if (!profile) return null
  const level = getLevel(profile.total_score || 0)

  return (
    <div className="page">
      <div className="container">
        <div className="profile-grid">

          {/* Left: Profile card */}
          <div className="profile-left">
            <div className="profile-card">
              <div className="profile-avatar">
                {profile.full_name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="profile-name">{profile.full_name}</h2>
              <p className="profile-email">{profile.email}</p>
              <div className="profile-level" style={{ color: level.color }}>
                {level.icon} {level.label}
              </div>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-num">{profile.total_score || 0}</span>
                  <span className="stat-label">Jami ball</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{certs.length}</span>
                  <span className="stat-label">Sertifikat</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{confCount}</span>
                  <span className="stat-label">Konferentsiya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Status details */}
          <div className="profile-right">

            {/* Certificates */}
            <div className="profile-section">
              <h3>🎓 Sertifikatlar</h3>
              {loading ? <p className="p-loading">Yuklanmoqda...</p> :
               certs.length === 0 ? (
                <div className="empty-box">
                  <p>Hali sertifikat yo'q</p>
                  <span>Konferentsiyalarda faol qatnashing!</span>
                </div>
               ) : (
                <div className="certs-list">
                  {certs.map(c => (
                    <div key={c.id} className="cert-item">
                      <span className="cert-icon">🎓</span>
                      <div>
                        <p className="cert-title">{c.title}</p>
                        <p className="cert-conf">{c.conferences?.title} — {c.conferences?.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
               )}
            </div>

            {/* Score history */}
            <div className="profile-section">
              <h3>📊 So'nggi natijalar</h3>
              {loading ? <p className="p-loading">Yuklanmoqda...</p> :
               history.length === 0 ? (
                <div className="empty-box">
                  <p>Hali savollar yechilmagan</p>
                  <span>Yo'nalishlardan birini boshlang!</span>
                </div>
               ) : (
                <div className="history-list">
                  {history.map(h => (
                    <div key={h.id} className="history-item">
                      <div>
                        <p className="hist-topic">{h.topic}</p>
                        <p className="hist-dir">{h.direction}</p>
                      </div>
                      <span className={`hist-score ${h.score === h.max_score ? 'perfect' : ''}`}>
                        {h.score}/{h.max_score}
                      </span>
                    </div>
                  ))}
                </div>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
