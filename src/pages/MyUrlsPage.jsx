import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getMyUrls, shortenUrl, deleteUrl, toggleActive } from '../api/endpoints'
import dayjs from 'dayjs'
import { Link, useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// ─── Icons ───────────────────────────────────────────────────────────────────
const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 12a5 5 0 100-10 5 5 0 000 10zM11 11l4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
const PlusIcon  = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 2v10M2 7h10" strokeLinecap="round"/></svg>
const LinkIcon  = () => <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1"/></svg>
const CopyIcon  = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="8" height="8" rx="1"/><path d="M4 10H3a1 1 0 01-1-1V3a1 1 0 011-1h6a1 1 0 011 1v1"/></svg>
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
const ChartIcon = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 10l4-4 3 3 5-6M1 12h12" strokeLinecap="round" strokeLinejoin="round"/></svg>
const ExternalIcon = () => <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2h4v4M10 2L4 8" strokeLinecap="round" strokeLinejoin="round"/></svg>
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11.5 3.5L11 11a1 1 0 01-1 1H4a1 1 0 01-1-1L2.5 3.5M5.5 6v4M8.5 6v4" strokeLinecap="round" strokeLinejoin="round"/></svg>
const DotsIcon  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="8" cy="13" r="1.2"/></svg>
const DownloadIcon = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 2v7M4 6l3 3 3-3M2 12h10" strokeLinecap="round" strokeLinejoin="round"/></svg>
const QrIcon    = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="4" height="4" rx="0.5"/><rect x="8" y="2" width="4" height="4" rx="0.5"/><rect x="2" y="8" width="4" height="4" rx="0.5"/><path d="M8 8h1v1H8zM11 8h1v1h-1zM9 9h2v1H9zM8 11h1v1H8zM11 11h1v1h-1zM10 10h1v1h-1z"/></svg>
const PowerIcon = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 2v4M3.5 4.5a5 5 0 100 5" strokeLinecap="round" strokeLinejoin="round"/></svg>

// ─── Status pill ─────────────────────────────────────────────────────────────
function StatusPill({ url }) {
  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()
  if (isExpired)   return <span style={pill('#fef3c7','#92400e')}>Expired</span>
  if (!url.active) return <span style={pill('#fee2e2','#991b1b')}>Disabled</span>
  return                  <span style={pill('#dcfce7','#166534')}>Active</span>
}
const pill = (bg, color) => ({
  display: 'inline-flex', alignItems: 'center',
  padding: '2px 8px', borderRadius: 20,
  background: bg, color, fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
})

// ─── Dropdown menu ───────────────────────────────────────────────────────────
function DropdownMenu({ url, onToggle, onDelete, onQr, navigate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const item = (onClick, icon, label, danger = false) => (
    <button
      onClick={() => { setOpen(false); onClick() }}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        width: '100%', padding: '8px 14px', background: 'none', border: 'none',
        textAlign: 'left', cursor: 'pointer', fontSize: 13,
        color: danger ? '#ef4444' : 'var(--text-primary)',
        borderRadius: 6,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? '#fef2f2' : 'var(--bg-subtle)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {icon}{label}
    </button>
  )

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? 'var(--bg-subtle)' : 'none',
          border: '1px solid ' + (open ? 'var(--border)' : 'transparent'),
          borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent' }}}
      >
        <DotsIcon />
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 36, zIndex: 100,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: 180, padding: '4px',
          animation: 'fadeIn 0.12s ease',
        }}>
          {item(() => navigate(`/analytics?url=${url.shortUrl}`), <ChartIcon />, 'View Stats')}
          {item(() => onQr(url), <QrIcon />, 'View QR Code')}
          <a
            href={`${BASE_URL}/api/url/qr/${url.shortUrl}?format=png&size=500`}
            download
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 14px', fontSize: 13, color: 'var(--text-primary)',
              textDecoration: 'none', borderRadius: 6,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          ><DownloadIcon />Download PNG</a>
          <a
            href={`${BASE_URL}/api/url/qr/${url.shortUrl}?format=svg&size=500`}
            download
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 14px', fontSize: 13, color: 'var(--text-primary)',
              textDecoration: 'none', borderRadius: 6,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          ><DownloadIcon />Download SVG</a>
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          {item(() => onToggle(url), <PowerIcon />, url.active ? 'Disable link' : 'Enable link')}
          {item(() => onDelete(url), <TrashIcon />, 'Delete link', true)}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyUrlsPage() {
  const navigate = useNavigate()
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedQr, setSelectedQr] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showUtm, setShowUtm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    getMyUrls()
      .then(res => setUrls(res.data || []))
      .catch(() => toast.error('Failed to load URLs'))
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (data) => {
    setCreating(true)
    try {
      let finalUrl = data.originalUrl
      if (showUtm && (data.utmSource || data.utmMedium || data.utmCampaign)) {
        try {
          const u = new URL(finalUrl)
          if (data.utmSource)   u.searchParams.set('utm_source',   data.utmSource)
          if (data.utmMedium)   u.searchParams.set('utm_medium',   data.utmMedium)
          if (data.utmCampaign) u.searchParams.set('utm_campaign', data.utmCampaign)
          finalUrl = u.toString()
        } catch {}
      }
      const res = await shortenUrl(finalUrl)
      setUrls(prev => [res.data, ...prev])
      toast.success('Link shortened!')
      reset(); setShowUtm(false); setShowModal(false)
    } catch {
      toast.error('Failed to shorten URL.')
    } finally { setCreating(false) }
  }

  const handleCopy = (id) => {
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (url) => {
    try {
      await deleteUrl(url.shortUrl)
      setUrls(prev => prev.filter(u => u.id !== url.id))
      toast.success('Link deleted')
    } catch { toast.error('Failed to delete link') }
    finally { setConfirmDelete(null) }
  }

  const handleToggle = async (url) => {
    try {
      const res = await toggleActive(url.shortUrl)
      setUrls(prev => prev.map(u => u.id === url.id ? res.data : u))
      toast.success(res.data.active ? 'Link enabled' : 'Link disabled')
    } catch { toast.error('Failed to toggle link status') }
  }

  const filtered = urls.filter(u =>
    u.originalUrl?.toLowerCase().includes(search.toLowerCase()) ||
    u.shortUrl?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page page-enter">
      {/* ── Header ── */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Links</h1>
          <p className="page-desc">{urls.length} total link{urls.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusIcon /> Shorten a link
        </button>
      </div>

      {/* ── Search ── */}
      {urls.length > 0 && (
        <div style={{ position: 'relative', marginBottom: 20, maxWidth: 380 }}>
          <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }}>
            <SearchIcon />
          </div>
          <input
            className="input"
            style={{ paddingLeft: 34, height: 36 }}
            placeholder="Search links…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* ── List ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div className="spinner spinner-lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card empty">
          <div className="empty-icon"><LinkIcon /></div>
          <div className="empty-title">{search ? 'No links found' : 'No links yet'}</div>
          {!search && (
            <div className="empty-desc">
              <button className="btn btn-primary btn-sm mt-4" onClick={() => setShowModal(true)}>
                <PlusIcon /> Create your first link
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map((url) => {
            const shortFull = `${BASE_URL}/${url.shortUrl}`
            const isCopied = copiedId === url.id
            return (
              <div
                key={url.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 20px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  transition: 'box-shadow 0.18s, border-color 0.18s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'
                  e.currentTarget.style.borderColor = 'var(--blue-300, #93c5fd)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                {/* ── QR (small, clickable) ── */}
                <div
                  onClick={() => setSelectedQr(url)}
                  title="View QR Code"
                  style={{
                    flexShrink: 0, padding: 5,
                    background: '#fff',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    cursor: 'zoom-in',
                    transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <img
                    src={`${BASE_URL}/api/url/qr/${url.shortUrl}?format=svg`}
                    alt="QR"
                    style={{ width: 40, height: 40, display: 'block' }}
                  />
                </div>

                {/* ── Main Content ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Line 1: short URL */}
                  <a
                    href={shortFull}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 15, fontWeight: 700,
                      color: 'var(--blue-600, #2563eb)',
                      textDecoration: 'none', marginBottom: 3,
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    localhost:8080/{url.shortUrl}
                    <ExternalIcon />
                  </a>

                  {/* Line 2: destination */}
                  <div style={{
                    fontSize: 12.5, color: 'var(--text-tertiary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: '100%', marginBottom: 8,
                  }}>
                    {url.originalUrl}
                  </div>

                  {/* Line 3: meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <StatusPill url={url} />
                    <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ChartIcon />
                      {url.clickCount} click{url.clickCount !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>
                      {dayjs(url.createdDate).format('MMM D, YYYY')}
                    </span>
                  </div>
                </div>

                {/* ── Actions ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <CopyToClipboard text={shortFull} onCopy={() => handleCopy(url.id)}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ gap: 6, minWidth: 80, justifyContent: 'center' }}
                    >
                      {isCopied ? <CheckIcon /> : <CopyIcon />}
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </CopyToClipboard>

                  <DropdownMenu
                    url={url}
                    onToggle={handleToggle}
                    onDelete={setConfirmDelete}
                    onQr={setSelectedQr}
                    navigate={navigate}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Create modal ── */}
      {showModal && (
        <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2 className="modal-title">Create new link</h2>
            <p className="modal-desc">Paste your long URL to shorten and track it.</p>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field">
                <label className="field-label">Destination URL</label>
                <input
                  className={`input${errors.originalUrl ? ' is-error' : ''}`}
                  placeholder="https://example.com/long-page"
                  {...register('originalUrl', {
                    required: 'URL is required',
                    pattern: { value: /^https?:\/\/.+/, message: 'Must start with http:// or https://' },
                  })}
                />
                {errors.originalUrl && <span className="field-error">{errors.originalUrl.message}</span>}
              </div>

              <div>
                <button type="button" className="btn btn-ghost btn-sm"
                  style={{ padding: '4px 8px', marginLeft: '-8px', color: 'var(--accent)' }}
                  onClick={() => setShowUtm(!showUtm)}>
                  <PlusIcon /> {showUtm ? 'Hide UTM parameters' : 'Add UTM parameters'}
                </button>
                {showUtm && (
                  <div style={{ padding: 16, background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[['utmSource','UTM Source','e.g. google'],['utmMedium','UTM Medium','e.g. cpc'],['utmCampaign','UTM Campaign','e.g. spring_sale']].map(([name,label,ph]) => (
                      <div className="field" key={name}>
                        <label className="field-label" style={{ fontSize: 11 }}>{label}</label>
                        <input className="input" style={{ padding: '6px 10px', fontSize: 12 }} placeholder={ph} {...register(name)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? <span className="spinner" /> : 'Shorten link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QR Modal ── */}
      {selectedQr && (
        <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setSelectedQr(null)}>
          <div className="modal" style={{ width: 400, alignItems: 'center', textAlign: 'center' }}>
            <h2 className="modal-title">QR Code</h2>
            <p className="modal-desc" style={{ marginBottom: 20, fontSize: 12, wordBreak: 'break-all' }}>
              {selectedQr.originalUrl}
            </p>
            <div style={{ padding: 16, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, display: 'inline-block', marginBottom: 20 }}>
              <img
                src={`${BASE_URL}/api/url/qr/${selectedQr.shortUrl}?format=svg&size=300`}
                alt="QR Code"
                style={{ width: 280, height: 280, display: 'block' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <a href={`${BASE_URL}/api/url/qr/${selectedQr.shortUrl}?format=png&size=500`} download
                className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <DownloadIcon /> PNG
              </a>
              <a href={`${BASE_URL}/api/url/qr/${selectedQr.shortUrl}?format=svg&size=500`} download
                className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                <DownloadIcon /> SVG
              </a>
            </div>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
              onClick={() => setSelectedQr(null)}>Close</button>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {confirmDelete && (
        <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="modal" style={{ width: 420 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
                <TrashIcon />
              </div>
              <div>
                <h2 className="modal-title" style={{ marginBottom: 2 }}>Delete link?</h2>
                <p className="modal-desc" style={{ margin: 0 }}>This action cannot be undone.</p>
              </div>
            </div>
            <div style={{ padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 10, marginBottom: 20, fontSize: 13, wordBreak: 'break-all' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                localhost:8080/{confirmDelete.shortUrl}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{confirmDelete.originalUrl}</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444' }}
                onClick={() => handleDelete(confirmDelete)}>
                <TrashIcon /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
