import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './News.css'

const BADGE_COLORS = {
  'Olimpiada': '#1A5276',
  'Kurs': '#0D5F3C',
  'Tibbiyot': '#5B2C6F',
  'Platforma': '#0D3A5C',
  'Konferentsiya': '#7D6608',
  'Stipendiya': '#1A3A5C',
  'Yangilik': '#1A3A5C',
}

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
      setNews(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="page">
      <div className="container">
        <div className="news-header">
          <h1>📰 Yangiliklar</h1>
          <p>So'nggi yangiliklar va e'lonlar</p>
        </div>

        {loading ? (
          <div className="news-loading"><div className="spinner" /></div>
        ) : (
          <div className="news-grid">
            {news.map(item => (
              <div key={item.id} className="news-card">
                <div className="news-img-wrap">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.title} className="news-img" />
                    : <div className="news-img-placeholder">📰</div>
                  }
                  <span
                    className="news-badge"
                    style={{ background: BADGE_COLORS[item.badge] || '#1A3A5C' }}
                  >
                    {item.badge}
                  </span>
                </div>
                <div className="news-body">
                  <p className="news-date">{formatDate(item.created_at)}</p>
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-desc">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
