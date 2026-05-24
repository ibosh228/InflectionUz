import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

export default function Admin() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('topics')
  const [users, setUsers] = useState([])
  const [confs, setConfs] = useState([])
  const [newsList, setNewsList] = useState([])
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  // Topic form
  const [topicDirection, setTopicDirection] = useState('iqtisodiyot')
  const [topicTitle, setTopicTitle] = useState('')
  const [topicContent, setTopicContent] = useState('')

  // Question form
  const [selTopicId, setSelTopicId] = useState('')
  const [qText, setQText] = useState('')
  const [qA, setQA] = useState('')
  const [qB, setQB] = useState('')
  const [qC, setQC] = useState('')
  const [qD, setQD] = useState('')
  const [qCorrect, setQCorrect] = useState('0')
  const [topicQuestions, setTopicQuestions] = useState([])

  // Conference form
  const [confTitle, setConfTitle] = useState('')
  const [confDesc, setConfDesc] = useState('')
  const [confDate, setConfDate] = useState('')

  // Certificate form
  const [certUserId, setCertUserId] = useState('')
  const [certConfId, setCertConfId] = useState('')
  const [certTitle, setCertTitle] = useState('')
  const [partUserId, setPartUserId] = useState('')
  const [partConfId, setPartConfId] = useState('')

  // News form
  const [newsTitle, setNewsTitle] = useState('')
  const [newsContent, setNewsContent] = useState('')
  const [newsImg, setNewsImg] = useState('')
  const [newsBadge, setNewsBadge] = useState('Yangilik')

  useEffect(() => {
    if (profile && !profile.is_admin) navigate('/dashboard')
  }, [profile, navigate])

  useEffect(() => {
    const fetchAll = async () => {
      const [u, c, n, t] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, total_score'),
        supabase.from('conferences').select('*').order('date', { ascending: false }),
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('topics').select('*').order('created_at', { ascending: false }),
      ])
      setUsers(u.data || [])
      setConfs(c.data || [])
      setNewsList(n.data || [])
      setTopics(t.data || [])
      setLoading(false)
    }
    fetchAll()
  }, [])

  useEffect(() => {
    if (selTopicId) {
      supabase.from('questions').select('*').eq('topic_id', selTopicId).then(({ data }) => {
        setTopicQuestions(data || [])
      })
    }
  }, [selTopicId])

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const addTopic = async () => {
    if (!topicTitle || !topicContent) return
    const { data, error } = await supabase.from('topics').insert({
      direction: topicDirection, title: topicTitle, content: topicContent
    }).select()
    if (!error) {
      showMsg('✅ Mavzu qo\'shildi!')
      setTopicTitle(''); setTopicContent('')
      setTopics([data[0], ...topics])
    }
  }

  const deleteTopic = async (id) => {
    await supabase.from('topics').delete().eq('id', id)
    setTopics(topics.filter(t => t.id !== id))
    showMsg('✅ Mavzu o\'chirildi!')
  }

  const toggleTopic = async (id, current) => {
    await supabase.from('topics').update({ is_active: !current }).eq('id', id)
    setTopics(topics.map(t => t.id === id ? { ...t, is_active: !current } : t))
  }

  const addQuestion = async () => {
    if (!selTopicId || !qText || !qA || !qB || !qC || !qD) return
    const { error } = await supabase.from('questions').insert({
      topic_id: selTopicId,
      question: qText,
      option_a: qA, option_b: qB, option_c: qC, option_d: qD,
      correct_answer: parseInt(qCorrect)
    })
    if (!error) {
      showMsg('✅ Savol qo\'shildi!')
      setQText(''); setQA(''); setQB(''); setQC(''); setQD(''); setQCorrect('0')
      const { data } = await supabase.from('questions').select('*').eq('topic_id', selTopicId)
      setTopicQuestions(data || [])
    }
  }

  const deleteQuestion = async (id) => {
    await supabase.from('questions').delete().eq('id', id)
    setTopicQuestions(topicQuestions.filter(q => q.id !== id))
    showMsg('✅ Savol o\'chirildi!')
  }

  const addConf = async () => {
    if (!confTitle || !confDate) return
    const { data, error } = await supabase.from('conferences').insert({
      title: confTitle, description: confDesc, date: confDate
    }).select()
    if (!error) {
      showMsg('✅ Konferentsiya qo\'shildi!')
      setConfTitle(''); setConfDesc(''); setConfDate('')
      setConfs([data[0], ...confs])
    }
  }

  const addParticipant = async () => {
    if (!partUserId || !partConfId) return
    const { error } = await supabase.from('conference_participants').insert({
      user_id: partUserId, conference_id: partConfId
    })
    if (!error) showMsg('✅ Qatnashchi qo\'shildi!')
    else showMsg('⚠️ Bu foydalanuvchi allaqachon qo\'shilgan')
  }

  const addCert = async () => {
    if (!certUserId || !certConfId || !certTitle) return
    const { error } = await supabase.from('certificates').insert({
      user_id: certUserId, conference_id: certConfId, title: certTitle
    })
    if (!error) { showMsg('✅ Sertifikat berildi!'); setCertTitle('') }
    else showMsg('⚠️ Xatolik: ' + error.message)
  }

  const addNews = async () => {
    if (!newsTitle || !newsContent) return
    const { data, error } = await supabase.from('news').insert({
      title: newsTitle, content: newsContent, image_url: newsImg || null, badge: newsBadge
    }).select()
    if (!error) {
      showMsg('✅ Yangilik qo\'shildi!')
      setNewsTitle(''); setNewsContent(''); setNewsImg(''); setNewsBadge('Yangilik')
      setNewsList([data[0], ...newsList])
    }
  }

  const deleteNews = async (id) => {
    await supabase.from('news').delete().eq('id', id)
    setNewsList(newsList.filter(n => n.id !== id))
  }

  if (!profile?.is_admin) return null

  return (
    <div className="page">
      <div className="container">
        <h1 className="admin-title">⚙️ Admin Panel</h1>
        {msg && <div className="admin-msg">{msg}</div>}

        <div className="admin-tabs">
          {[
            ['topics', '📚 Mavzular'],
            ['questions', '❓ Savollar'],
            ['conf', '🏛️ Konferentsiya'],
            ['cert', '🎓 Sertifikat'],
            ['news', '📰 Yangilik'],
            ['users', '👥 Foydalanuvchilar']
          ].map(([k, v]) => (
            <button key={k} className={`tab-btn ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{v}</button>
          ))}
        </div>

        {loading ? <p className="p-loading">Yuklanmoqda...</p> : (
          <>
            {/* Topics tab */}
            {tab === 'topics' && (
              <div className="admin-section">
                <h3>Yangi mavzu qo'shish</h3>
                <div className="admin-form">
                  <select value={topicDirection} onChange={e => setTopicDirection(e.target.value)}>
                    <option value="iqtisodiyot">💼 Iqtisodiyot</option>
                    <option value="moliya">📈 Moliya</option>
                    <option value="tibbiyot">🩺 Tibbiyot</option>
                  </select>
                  <input placeholder="Mavzu nomi (masalan: Inflyatsiya nima?)" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} />
                  <textarea placeholder="Mavzu matni — foydalanuvchi buni o'qiydi..." rows={5} value={topicContent} onChange={e => setTopicContent(e.target.value)} />
                  <button className="btn btn-primary" onClick={addTopic}>Mavzu qo'shish</button>
                </div>

                <h3 style={{ marginTop: 32 }}>Mavjud mavzular</h3>
                <div className="admin-list">
                  {topics.map(t => (
                    <div key={t.id} className="admin-item">
                      <span>
                        {t.direction === 'iqtisodiyot' ? '💼' : t.direction === 'moliya' ? '📈' : '🩺'} <strong>{t.title}</strong>
                        <span className={`topic-status ${t.is_active ? 'active' : 'inactive'}`}>
                          {t.is_active ? ' ✅ Faol' : ' ⛔ Nofaol'}
                        </span>
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="toggle-btn" onClick={() => toggleTopic(t.id, t.is_active)}>
                          {t.is_active ? '⛔' : '✅'}
                        </button>
                        <button className="del-btn" onClick={() => deleteTopic(t.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions tab */}
            {tab === 'questions' && (
              <div className="admin-section">
                <h3>Mavzu tanlang</h3>
                <div className="admin-form">
                  <select value={selTopicId} onChange={e => setSelTopicId(e.target.value)}>
                    <option value="">Mavzu tanlang...</option>
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.direction} — {t.title}</option>
                    ))}
                  </select>
                </div>

                {selTopicId && (
                  <>
                    <h3>Yangi savol qo'shish</h3>
                    <div className="admin-form">
                      <input placeholder="Savol matni" value={qText} onChange={e => setQText(e.target.value)} />
                      <input placeholder="A variant" value={qA} onChange={e => setQA(e.target.value)} />
                      <input placeholder="B variant" value={qB} onChange={e => setQB(e.target.value)} />
                      <input placeholder="C variant" value={qC} onChange={e => setQC(e.target.value)} />
                      <input placeholder="D variant" value={qD} onChange={e => setQD(e.target.value)} />
                      <select value={qCorrect} onChange={e => setQCorrect(e.target.value)}>
                        <option value="0">To'g'ri javob: A</option>
                        <option value="1">To'g'ri javob: B</option>
                        <option value="2">To'g'ri javob: C</option>
                        <option value="3">To'g'ri javob: D</option>
                      </select>
                      <button className="btn btn-primary" onClick={addQuestion}>Savol qo'shish</button>
                    </div>

                    <h3 style={{ marginTop: 32 }}>Mavjud savollar ({topicQuestions.length} ta)</h3>
                    <div className="admin-list">
                      {topicQuestions.map((q, i) => (
                        <div key={q.id} className="admin-item">
                          <span><strong>{i + 1}.</strong> {q.question}</span>
                          <button className="del-btn" onClick={() => deleteQuestion(q.id)}>🗑️</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Conferences tab */}
            {tab === 'conf' && (
              <div className="admin-section">
                <h3>Yangi konferentsiya qo'shish</h3>
                <div className="admin-form">
                  <input placeholder="Konferentsiya nomi" value={confTitle} onChange={e => setConfTitle(e.target.value)} />
                  <input placeholder="Tavsif (ixtiyoriy)" value={confDesc} onChange={e => setConfDesc(e.target.value)} />
                  <input type="date" value={confDate} onChange={e => setConfDate(e.target.value)} />
                  <button className="btn btn-primary" onClick={addConf}>Qo'shish</button>
                </div>
                <h3 style={{ marginTop: 32 }}>Mavjud konferentsiyalar</h3>
                <div className="admin-list">
                  {confs.map(c => (
                    <div key={c.id} className="admin-item">
                      <span>🏛️ <strong>{c.title}</strong> — {c.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates tab */}
            {tab === 'cert' && (
              <div className="admin-section">
                <h3>Qatnashchi qo'shish</h3>
                <div className="admin-form">
                  <select value={partUserId} onChange={e => setPartUserId(e.target.value)}>
                    <option value="">Foydalanuvchi tanlang</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                  </select>
                  <select value={partConfId} onChange={e => setPartConfId(e.target.value)}>
                    <option value="">Konferentsiya tanlang</option>
                    {confs.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                  <button className="btn btn-primary" onClick={addParticipant}>Qatnashchi qo'shish</button>
                </div>
                <h3 style={{ marginTop: 32 }}>Sertifikat berish</h3>
                <div className="admin-form">
                  <select value={certUserId} onChange={e => setCertUserId(e.target.value)}>
                    <option value="">Foydalanuvchi tanlang</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                  </select>
                  <select value={certConfId} onChange={e => setCertConfId(e.target.value)}>
                    <option value="">Konferentsiya tanlang</option>
                    {confs.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                  <input placeholder="Sertifikat nomi (masalan: Faol ishtirokchi)" value={certTitle} onChange={e => setCertTitle(e.target.value)} />
                  <button className="btn btn-primary" onClick={addCert}>Sertifikat berish</button>
                </div>
              </div>
            )}

            {/* News tab */}
            {tab === 'news' && (
              <div className="admin-section">
                <h3>Yangilik qo'shish</h3>
                <div className="admin-form">
                  <input placeholder="Sarlavha" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} />
                  <textarea placeholder="Matn" rows={4} value={newsContent} onChange={e => setNewsContent(e.target.value)} />
                  <input placeholder="Rasm URL (ixtiyoriy)" value={newsImg} onChange={e => setNewsImg(e.target.value)} />
                  <input placeholder="Badge (masalan: Konferentsiya)" value={newsBadge} onChange={e => setNewsBadge(e.target.value)} />
                  <button className="btn btn-primary" onClick={addNews}>Qo'shish</button>
                </div>
                <h3 style={{ marginTop: 32 }}>Mavjud yangiliklar</h3>
                <div className="admin-list">
                  {newsList.map(n => (
                    <div key={n.id} className="admin-item">
                      <span>📰 <strong>{n.title}</strong></span>
                      <button className="del-btn" onClick={() => deleteNews(n.id)}>🗑️</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users tab */}
            {tab === 'users' && (
              <div className="admin-section">
                <h3>Barcha foydalanuvchilar ({users.length})</h3>
                <div className="admin-list">
                  {users.map(u => (
                    <div key={u.id} className="admin-item">
                      <span>👤 <strong>{u.full_name}</strong> — {u.email}</span>
                      <span className="user-score">{u.total_score} ball</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
