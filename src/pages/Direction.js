import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import './Direction.css'

const DIRECTION_INFO = {
  iqtisodiyot: { title: 'Iqtisodiyot', icon: '💼', color: '#1A5276' },
  moliya: { title: 'Moliya', icon: '📈', color: '#0D5F3C' },
  tibbiyot: { title: 'Tibbiyot', icon: '🩺', color: '#5B2C6F' },
}

export default function Direction({ direction }) {
  const { user, refreshProfile } = useAuth()
  const info = DIRECTION_INFO[direction]

  const [step, setStep] = useState('start')
  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [error, setError] = useState('')
  const [completedTopics, setCompletedTopics] = useState([])

  useEffect(() => {
    const fetchCompleted = async () => {
      if (!user) return
      const { data } = await supabase
        .from('score_history')
        .select('topic')
        .eq('user_id', user.id)
        .eq('direction', direction)
      setCompletedTopics((data || []).map(d => d.topic))
    }
    fetchCompleted()
  }, [user, direction])

  const fetchTopicAndQuestions = async () => {
    setStep('loading')
    setError('')
    try {
      const { data: topics, error: topicErr } = await supabase
        .from('topics')
        .select('*')
        .eq('direction', direction)
        .eq('is_active', true)

      if (topicErr || !topics || topics.length === 0) {
        setError('Bu yo\'nalishda hali mavzu qo\'shilmagan. Admin tez orada qo\'shadi!')
        setStep('start')
        return
      }

      // Yechilmagan topiclarni filtrlash
      const availableTopics = topics.filter(t => !completedTopics.includes(t.title))

      if (availableTopics.length === 0) {
        setError('Barcha mavzularni yechdingiz! Admin yangi mavzu qo\'shishini kuting.')
        setStep('start')
        return
      }

      const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)]

      const { data: qs, error: qErr } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', randomTopic.id)

      if (qErr || !qs || qs.length === 0) {
        setError('Bu mavzuda savollar yo\'q. Admin tez orada qo\'shadi!')
        setStep('start')
        return
      }

      setTopic(randomTopic)
      const shuffled = qs.sort(() => Math.random() - 0.5).slice(0, 5)
      setQuestions(shuffled)
      setStep('topic')
    } catch (e) {
      setError('Xatolik yuz berdi. Qayta urinib ko\'ring.')
      setStep('start')
    }
  }

  const startQuiz = () => {
    setCurrent(0)
    setScore(0)
    setAnswers([])
    setSelected(null)
    setStep('quiz')
  }

  const handleAnswer = async (idx) => {
    if (selected !== null) return
    setSelected(idx)
    const isCorrect = idx === questions[current].correct_answer
    const newAnswers = [...answers, { selected: idx, correct: questions[current].correct_answer, isCorrect }]
    setAnswers(newAnswers)

    setTimeout(async () => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1)
        setSelected(null)
      } else {
        const finalScore = newAnswers.filter(a => a.isCorrect).length
        setScore(finalScore)
        setStep('result')
        if (user) {
          await supabase.from('score_history').insert({
            user_id: user.id,
            direction,
            topic: topic.title,
            score: finalScore,
            max_score: questions.length
          })
          setCompletedTopics([...completedTopics, topic.title])
          refreshProfile()
        }
      }
    }, 1000)
  }

  if (step === 'start') return (
    <div className="page">
      <div className="container dir-page">
        <div className="dir-hero" style={{ '--dir-color': info.color }}>
          <span className="dir-hero-icon">{info.icon}</span>
          <h1>{info.title}</h1>
          <p>Mavzuni o'qib, savolga javob bering va ball yig'ing!</p>
          <button className="btn btn-primary" onClick={fetchTopicAndQuestions}>
            Boshlash →
          </button>
          {error && <p className="dir-error">⚠️ {error}</p>}
        </div>
      </div>
    </div>
  )

  if (step === 'loading') return (
    <div className="page">
      <div className="container dir-page">
        <div className="dir-loading">
          <div className="spinner" />
          <p>Mavzu yuklanmoqda...</p>
        </div>
      </div>
    </div>
  )

  if (step === 'topic') return (
    <div className="page">
      <div className="container dir-page">
        <div className="topic-card">
          <div className="topic-badge">{info.icon} {info.title}</div>
          <h2 className="topic-title">{topic.title}</h2>
          <p className="topic-text">{topic.content}</p>
          <button className="btn btn-primary" onClick={startQuiz}>
            Savollarni boshlash →
          </button>
        </div>
      </div>
    </div>
  )

  if (step === 'quiz') {
    const q = questions[current]
    const opts = [q.option_a, q.option_b, q.option_c, q.option_d]
    return (
      <div className="page">
        <div className="container dir-page">
          <div className="quiz-card">
            <div className="quiz-header">
              <span className="quiz-topic">{topic.title}</span>
              <span className="quiz-counter">{current + 1} / {questions.length}</span>
            </div>
            <div className="quiz-progress">
              <div className="quiz-progress-bar" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>
            <p className="quiz-question">{q.question}</p>
            <div className="quiz-options">
              {opts.map((opt, i) => {
                let cls = 'quiz-option'
                if (selected !== null) {
                  if (i === q.correct_answer) cls += ' correct'
                  else if (i === selected && i !== q.correct_answer) cls += ' wrong'
                }
                return (
                  <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={selected !== null}>
                    <span className="opt-letter">{['A', 'B', 'C', 'D'][i]}</span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result') return (
    <div className="page">
      <div className="container dir-page">
        <div className="result-card">
          <div className="result-emoji">{score === questions.length ? '🏆' : score >= 3 ? '🎯' : '📚'}</div>
          <h2>Natija</h2>
          <div className="result-score">
            <span className="result-num">{score}</span>
            <span className="result-max"> / {questions.length}</span>
          </div>
          <p className="result-msg">
            {score === questions.length ? 'Ajoyib! Barcha savollar to\'g\'ri!' :
             score >= 3 ? 'Yaxshi natija! Davom eting!' :
             'Ko\'proq o\'rganing va qayta urinib ko\'ring!'}
          </p>
          <div className="result-btns">
            <button className="btn btn-primary" onClick={fetchTopicAndQuestions}>Yangi mavzu</button>
            <button className="btn btn-outline" onClick={() => setStep('start')}>Orqaga</button>
          </div>
        </div>
      </div>
    </div>
  )
}
