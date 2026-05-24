import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import './Leaderboard.css'

export default function Leaderboard() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, total_score')
        .order('total_score', { ascending: false })
        .limit(50)
      setPlayers(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const getMedal = (rank) => {
    if (rank === 1) return '👑'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold'
    if (rank === 2) return 'rank-silver'
    if (rank === 3) return 'rank-bronze'
    return ''
  }

  return (
    <div className="page">
      <div className="container">
        <div className="lb-header">
          <h1>🏆 Liderlar jadvali</h1>
          <p>Eng ko'p ball yig'gan ishtirokchilar</p>
        </div>

        {loading ? (
          <div className="lb-loading"><div className="spinner" /></div>
        ) : (
          <div className="lb-table-wrap">
            {players.length === 0 ? (
              <p className="lb-empty">Hali hech kim ro'yxatdan o'tmagan</p>
            ) : (
              <table className="lb-table">
                <thead>
                  <tr>
                    <th>O'rin</th>
                    <th>Ishtirokchi</th>
                    <th>Ball</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p, i) => {
                    const rank = i + 1
                    const isMe = profile?.id === p.id
                    return (
                      <tr key={p.id} className={`lb-row ${getRankClass(rank)} ${isMe ? 'lb-me' : ''}`}>
                        <td className="lb-rank">
                          <span className={`rank-badge ${getRankClass(rank)}`}>
                            {getMedal(rank)}
                          </span>
                        </td>
                        <td className="lb-name">
                          <div className="lb-avatar">
                            {p.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <span>{p.full_name} {isMe && <span className="lb-you">(Siz)</span>}</span>
                        </td>
                        <td className="lb-score">{p.total_score} ball</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
