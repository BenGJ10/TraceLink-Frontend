import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyUrls, getTotalClicks } from '../api/endpoints'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import dayjs from 'dayjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// ─── SVGs ───
const LinkIcon = () => <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 10h6M7 13a3 3 0 110-6h1M13 7a3 3 0 110 6h-1" strokeLinecap="round" strokeLinejoin="round"/></svg>
const ChartIcon = () => <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 15l4-6 3 4 3-7 4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 17h14" strokeLinecap="round"/></svg>
const UpIcon = () => <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 16V4M5 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v12M2 8h12" strokeLinecap="round"/></svg>
const ArrowRight = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h8M8 4l3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
const EmptyChartIcon = () => <svg width="32" height="32" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="16" height="14" rx="2"/><path d="M6 14V9m4 5V6m4 8V11" strokeLinecap="round" strokeLinejoin="round"/></svg>

export default function DashboardPage() {
  const { user } = useAuth()
  const [urls, setUrls] = useState([])
  const [clickData, setClickData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [urlRes, clickRes] = await Promise.all([
          getMyUrls(),
          getTotalClicks(
            dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
            dayjs().format('YYYY-MM-DD')
          ),
        ])
        setUrls(urlRes.data || [])
        const entries = Object.entries(clickRes.data || {}).sort(([a], [b]) => a.localeCompare(b))
        setClickData(entries)
      } catch {
        // silent — urls may not exist yet
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const totalClicks = urls.reduce((s, u) => s + (u.clickCount || 0), 0)
  const topUrl = urls.length ? [...urls].sort((a, b) => b.clickCount - a.clickCount)[0] : null

  const chartLabels = clickData.map(([date]) => dayjs(date).format('MMM D'))
  const chartValues = clickData.map(([, count]) => count)

  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Clicks',
      data: chartValues,
      borderColor: '#2563eb', // blue-600
      backgroundColor: 'rgba(37,99,235,0.06)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#2563eb',
      pointBorderWidth: 2,
      fill: true,
      tension: 0.3,
    }],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#9ca3af',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 6,
        displayColors: false,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280', font: { size: 12 } }, border: { display: false } },
      y: { grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280', font: { size: 12 }, precision: 0 }, border: { display: false } },
    },
    interaction: { mode: 'index', intersect: false },
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    )
  }

  return (
    <div className="page page-enter">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">
            Good {dayjs().hour() < 12 ? 'morning' : 'afternoon'}, {user?.username} 👋
          </h1>
          <p className="page-desc">Here's an overview of your link performance</p>
        </div>
        <Link to="/my-urls" className="btn btn-primary">
          <PlusIcon />
          Shorten a link
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ color: 'var(--blue-600)', marginBottom: 12 }}><LinkIcon /></div>
          <div className="stat-value">{urls.length}</div>
          <div className="stat-label" style={{ marginTop: 8, marginBottom: 0 }}>Total links</div>
        </div>

        <div className="stat-card">
          <div style={{ color: 'var(--green-600)', marginBottom: 12 }}><ChartIcon /></div>
          <div className="stat-value">{totalClicks.toLocaleString()}</div>
          <div className="stat-label" style={{ marginTop: 8, marginBottom: 0 }}>Total clicks</div>
        </div>

        <div className="stat-card">
          <div style={{ color: 'var(--blue-600)', marginBottom: 12 }}><UpIcon /></div>
          <div className="stat-value">
            {clickData.length > 0 ? clickData[clickData.length - 1][1] : 0}
          </div>
          <div className="stat-label" style={{ marginTop: 8, marginBottom: 0 }}>Clicks today</div>
        </div>

        <div className="stat-card">
          <div style={{ color: 'var(--amber-600)', marginBottom: 12 }}><UpIcon /></div>
          <div className="stat-value">{topUrl ? topUrl.clickCount : '—'}</div>
          <div className="stat-label" style={{ marginTop: 8, marginBottom: 0 }}>Best link clicks</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Click chart */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Clicks over time</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Last 7 days</div>
            </div>
            <Link to="/analytics" className="btn btn-ghost btn-sm">
              Full report
              <ArrowRight />
            </Link>
          </div>
          <div style={{ flex: 1, minHeight: 280 }}>
            {chartValues.length > 0 && chartValues.some(v => v > 0) ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="empty" style={{ height: '100%', padding: 0 }}>
                <div className="empty-icon"><EmptyChartIcon /></div>
                <div className="empty-title">No click data yet</div>
                <div className="empty-desc">Clicks will appear here once your links are visited</div>
              </div>
            )}
          </div>
        </div>

        {/* Recent links */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between mb-4">
            <div style={{ fontWeight: 700, fontSize: 16 }}>Recent links</div>
            <Link to="/my-urls" className="btn btn-ghost btn-sm">
              View all <ArrowRight />
            </Link>
          </div>
          <div style={{ flex: 1 }}>
            {urls.length === 0 ? (
              <div className="empty" style={{ height: '100%', padding: 0 }}>
                <div className="empty-title">No links yet</div>
                <div className="empty-desc" style={{ marginBottom: 16 }}>Create your first link to get started</div>
                <Link to="/my-urls" className="btn btn-primary btn-sm">Create Link</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {urls.slice(0, 5).map((u) => (
                  <div key={u.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--r-md)',
                  }}>
                    <div style={{ overflow: 'hidden', flex: 1, paddingRight: 12 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>
                        /{u.shortUrl}
                      </div>
                      <div className="truncate" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {u.originalUrl}
                      </div>
                    </div>
                    <span className="badge badge-blue" style={{ flexShrink: 0 }}>
                      {u.clickCount} clicks
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
