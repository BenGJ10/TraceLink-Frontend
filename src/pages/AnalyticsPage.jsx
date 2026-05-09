import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getMyUrls, getUrlAnalytics, getTotalClicks, getAdvancedAnalytics } from '../api/endpoints'
import toast from 'react-hot-toast'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Filler, Tooltip, Legend, Title,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend, BarChart as RechartsBarChart, Bar as RechartsBar, XAxis, YAxis, CartesianGrid } from 'recharts'
import dayjs from 'dayjs'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Filler, Tooltip, Legend, Title
)

const TODAY = dayjs().format('YYYY-MM-DD')
const WEEK_AGO = dayjs().subtract(7, 'day').format('YYYY-MM-DD')

// ─── SVGs ───
const ChartIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 10l4-4 3 3 5-6M1 12h12" strokeLinecap="round" strokeLinejoin="round"/></svg>
const CalendarIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="10" height="9" rx="1"/><path d="M4 2v2M10 2v2M2 6h10" strokeLinecap="round" strokeLinejoin="round"/></svg>
const RefreshIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5.5A6 6 0 0111.5 2l2 2M13 8.5A6 6 0 012.5 12l-2-2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 1v3h-3M.5 13v-3h3" strokeLinecap="round" strokeLinejoin="round"/></svg>
const EmptyChartIcon = () => <svg width="32" height="32" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="16" height="14" rx="2"/><path d="M6 14V9m4 5V6m4 8V11" strokeLinecap="round" strokeLinejoin="round"/></svg>
const BarChartSvg = () => <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="10" width="4" height="7" rx="1"/><rect x="8" y="5" width="4" height="12" rx="1"/><rect x="13" y="8" width="4" height="9" rx="1"/></svg>
const LinkSvg = () => <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 10h6M7 13a3 3 0 110-6h1M13 7a3 3 0 110 6h-1" strokeLinecap="round" strokeLinejoin="round"/></svg>
const CalendarSvg = () => <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M6 2v4M14 2v4M3 8h14" strokeLinecap="round" strokeLinejoin="round"/></svg>

export default function AnalyticsPage() {
  const [searchParams] = useSearchParams()
  const preselected = searchParams.get('url') || ''

  const [urls, setUrls] = useState([])
  const [selectedShortUrl, setSelectedShortUrl] = useState(preselected)
  const [startDate, setStartDate] = useState(WEEK_AGO)
  const [endDate, setEndDate] = useState(TODAY)

  const [urlClickData, setUrlClickData] = useState([])
  const [globalClickData, setGlobalClickData] = useState([])
  const [advancedData, setAdvancedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [urlsLoading, setUrlsLoading] = useState(true)

  // Load user's URLs for selector
  useEffect(() => {
    getMyUrls()
      .then(res => {
        const data = res.data || []
        setUrls(data)
        if (!preselected && data.length > 0) setSelectedShortUrl(data[0].shortUrl)
      })
      .catch(() => {})
      .finally(() => setUrlsLoading(false))
  }, [])

  // Fetch analytics when params change
  const fetchAnalytics = async () => {
    if (!startDate || !endDate) return
    setLoading(true)
    try {
      const startISO = `${startDate}T00:00:00`
      const endISO   = `${endDate}T23:59:59`

      const [globalRes, urlRes, advancedRes] = await Promise.all([
        getTotalClicks(startDate, endDate),
        selectedShortUrl
          ? getUrlAnalytics(selectedShortUrl, startISO, endISO)
          : Promise.resolve({ data: {} }),
        selectedShortUrl
          ? getAdvancedAnalytics(selectedShortUrl).catch(() => ({ data: null }))
          : Promise.resolve({ data: null }),
      ])

      const globalEntries = Object.entries(globalRes.data || {}).sort(([a], [b]) => a.localeCompare(b))
      setGlobalClickData(globalEntries)
      
      setAdvancedData(advancedRes.data)

      const urlEntries = (urlRes.data || []).map(e => [e.clickDate, e.count])
        .sort(([a], [b]) => a.localeCompare(b))
      setUrlClickData(urlEntries)
    } catch {
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (!urlsLoading) fetchAnalytics() }, [selectedShortUrl, startDate, endDate, urlsLoading])

  // Chart configs
  const globalLabels = globalClickData.map(([d]) => dayjs(d).format('MMM D'))
  const globalValues = globalClickData.map(([, c]) => c)

  const urlLabels = urlClickData.map(([d]) => dayjs(d).format('MMM D'))
  const urlValues = urlClickData.map(([, c]) => c)

  const baseChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#111827', titleColor: '#9ca3af', bodyColor: '#fff', padding: 12, cornerRadius: 6, displayColors: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280', font: { size: 12 } }, border: { display: false } },
      y: { grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280', font: { size: 12 }, precision: 0 }, border: { display: false } },
    },
  }

  const lineChartOptions = { ...baseChartOptions, interaction: { mode: 'index', intersect: false } }
  const barChartOptions = { ...baseChartOptions }

  return (
    <div className="page page-enter">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-desc">Track clicks and performance across your links</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Link selector */}
          <div className="field" style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label className="field-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ChartIcon /> Link
              </span>
            </label>
            <select
              className="input"
              value={selectedShortUrl}
              onChange={e => setSelectedShortUrl(e.target.value)}
              disabled={urlsLoading}
            >
              {urls.length === 0 && <option value="">No links yet</option>}
              {urls.map(u => (
                <option key={u.id} value={u.shortUrl}>/{u.shortUrl}</option>
              ))}
            </select>
          </div>

          {/* Start date */}
          <div className="field" style={{ flex: '1 1 160px' }}>
            <label className="field-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CalendarIcon /> Start date
              </span>
            </label>
            <input
              type="date"
              className="input"
              value={startDate}
              max={endDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          {/* End date */}
          <div className="field" style={{ flex: '1 1 160px' }}>
            <label className="field-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CalendarIcon /> End date
              </span>
            </label>
            <input
              type="date"
              className="input"
              value={endDate}
              min={startDate}
              max={TODAY}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>

          <button className="btn btn-secondary" onClick={fetchAnalytics} disabled={loading} style={{ height: 37 }}>
            <RefreshIcon />
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <div style={{ color: 'var(--blue-600)', marginBottom: 12 }}><BarChartSvg /></div>
          <div className="stat-value">{globalValues.reduce((s, v) => s + Number(v), 0).toLocaleString()}</div>
          <div className="stat-label" style={{ marginTop: 8, marginBottom: 0 }}>Total clicks in range</div>
        </div>
        <div className="stat-card">
          <div style={{ color: 'var(--blue-600)', marginBottom: 12 }}><LinkSvg /></div>
          <div className="stat-value">{urlValues.reduce((s, v) => s + Number(v), 0).toLocaleString()}</div>
          <div className="stat-label" style={{ marginTop: 8, marginBottom: 0 }}>Clicks for selected link</div>
        </div>
        <div className="stat-card">
          <div style={{ color: 'var(--blue-600)', marginBottom: 12 }}><CalendarSvg /></div>
          <div className="stat-value">
            {globalValues.length > 0 ? Math.max(...globalValues.map(Number)).toLocaleString() : 0}
          </div>
          <div className="stat-label" style={{ marginTop: 8, marginBottom: 0 }}>Peak clicks (single day)</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Global chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>All links – clicks per day</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            {dayjs(startDate).format('MMM D')} – {dayjs(endDate).format('MMM D, YYYY')}
          </div>
          <div style={{ height: 260 }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div className="spinner" />
              </div>
            ) : globalValues.length > 0 && globalValues.some(v => v > 0) ? (
              <Bar
                data={{
                  labels: globalLabels,
                  datasets: [{
                    label: 'Clicks',
                    data: globalValues,
                    backgroundColor: 'rgba(37,99,235,0.12)', // blue-600 translucent
                    borderColor: '#2563eb', // blue-600
                    borderWidth: 2,
                    borderRadius: 4,
                  }],
                }}
                options={barChartOptions}
              />
            ) : (
              <div className="empty" style={{ height: '100%', padding: 0 }}>
                <div className="empty-icon"><EmptyChartIcon /></div>
                <div className="empty-title">No data in range</div>
              </div>
            )}
          </div>
        </div>

        {/* Per-URL chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            /{selectedShortUrl || '…'} – clicks per day
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            {dayjs(startDate).format('MMM D')} – {dayjs(endDate).format('MMM D, YYYY')}
          </div>
          <div style={{ height: 260 }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div className="spinner" />
              </div>
            ) : urlValues.length > 0 && urlValues.some(v => v > 0) ? (
              <Line
                data={{
                  labels: urlLabels,
                  datasets: [{
                    label: 'Clicks',
                    data: urlValues,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37,99,235,0.06)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#2563eb',
                    pointBorderWidth: 2,
                    fill: true,
                    tension: 0.3,
                  }],
                }}
                options={lineChartOptions}
              />
            ) : (
              <div className="empty" style={{ height: '100%', padding: 0 }}>
                <div className="empty-icon"><EmptyChartIcon /></div>
                <div className="empty-title">No data for this link</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      {advancedData && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
            
            {/* Device Breakdown */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Device Breakdown</div>
              <div style={{ height: 260 }}>
                {Object.keys(advancedData.devices || {}).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={Object.entries(advancedData.devices).map(([name, value]) => ({ name, value }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <RechartsBar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty" style={{ height: '100%', padding: 0 }}><div className="empty-icon"><EmptyChartIcon /></div></div>
                )}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Traffic Sources</div>
              <div style={{ height: 260 }}>
                {Object.keys(advancedData.sources || {}).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(advancedData.sources).map(([name, value]) => ({ name, value }))}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value"
                      >
                        {Object.keys(advancedData.sources).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <RechartsLegend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty" style={{ height: '100%', padding: 0 }}><div className="empty-icon"><EmptyChartIcon /></div></div>
                )}
              </div>
            </div>
            
          </div>

          {/* Geo Distribution Table */}
          {Object.keys(advancedData.countries || {}).length > 0 && (
            <div className="table-container" style={{ marginBottom: 24 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 15, background: 'var(--bg-surface)' }}>
                Geographic Insights
              </div>
              <table style={{ background: 'var(--bg-surface)' }}>
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Clicks</th>
                    <th style={{ width: 180 }}>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(advancedData.countries)
                    .sort(([, a], [, b]) => b - a)
                    .map(([country, count]) => {
                      const total = Object.values(advancedData.countries).reduce((a, b) => a + b, 0)
                      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0
                      return (
                        <tr key={country}>
                          <td style={{ fontWeight: 500 }}>{country === 'Unknown' ? 'Unknown Region' : country}</td>
                          <td><span className="badge badge-gray">{count.toLocaleString()}</span></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 80, height: 6, background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: 'var(--blue-600)', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Data table */}
      {urlClickData.length > 0 && urlClickData.some(([, c]) => c > 0) && (
        <div className="table-container">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 15, background: 'var(--bg-surface)' }}>
            Click breakdown — /{selectedShortUrl}
          </div>
          <table style={{ background: 'var(--bg-surface)' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Clicks</th>
                <th style={{ width: 180 }}>Share</th>
              </tr>
            </thead>
            <tbody>
              {urlClickData.map(([date, count]) => {
                const total = urlValues.reduce((s, v) => s + Number(v), 0)
                const pct = total > 0 ? ((Number(count) / total) * 100).toFixed(1) : 0
                if (Number(count) === 0) return null
                return (
                  <tr key={date}>
                    <td style={{ fontWeight: 500 }}>{dayjs(date).format('ddd, MMM D YYYY')}</td>
                    <td>
                      <span className="badge badge-blue">{Number(count).toLocaleString()}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 80, height: 6,
                          background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${pct}%`, height: '100%',
                            background: 'var(--blue-600)',
                            borderRadius: 3,
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
