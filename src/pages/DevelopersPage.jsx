import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Link } from 'react-router-dom'
import { getApiKeys, createApiKey, revokeApiKey } from '../api/endpoints'
import dayjs from 'dayjs'

const KeyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
const CopyIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
const CodeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
const BookIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>

export default function DevelopersPage() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRawKey, setNewRawKey] = useState(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedSnippet, setCopiedSnippet] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    getApiKeys()
      .then(res => setKeys(res.data))
      .catch(() => toast.error('Failed to load API keys'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (data) => {
    try {
      const res = await createApiKey({ name: data.name })
      setNewRawKey(res.data.rawKey)
      setKeys(prev => [res.data.keyDetails, ...prev])
      setShowCreateModal(false)
      reset()
    } catch (err) {
      toast.error('Failed to generate API key')
    }
  }

  const handleRevoke = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this API key? Any integrations using it will immediately break.")) return;
    try {
      await revokeApiKey(id)
      setKeys(prev => prev.filter(k => k.id !== id))
      toast.success('API key revoked')
    } catch {
      toast.error('Failed to revoke key')
    }
  }

  const handleCopyKey = (text) => {
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleCopySnippet = (snippet) => {
    setCopiedSnippet(snippet)
    setTimeout(() => setCopiedSnippet(null), 2000)
  }

  const SNIPPETS = [
    {
      id: 'curl',
      label: 'cURL',
      code: `curl -X POST https://api.tracelink.app/api/urls/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"originalUrl": "https://example.com"}'`
    },
    {
      id: 'node',
      label: 'Node.js (Fetch)',
      code: `const response = await fetch('https://api.tracelink.app/api/urls/shorten', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ originalUrl: 'https://example.com' })
});

const data = await response.json();
console.log(data.shortUrl);`
    },
    {
      id: 'python',
      label: 'Python (Requests)',
      code: `import requests

url = "https://api.tracelink.app/api/urls/shorten"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "originalUrl": "https://example.com"
}

response = requests.post(url, json=data, headers=headers)
print(response.json()["shortUrl"])`
    }
  ]

  const [activeTab, setActiveTab] = useState('node')

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div className="spinner spinner-lg" />
      </div>
    )
  }

  return (
    <div className="page page-enter">
      <div className="page-header" style={{ marginBottom: 40 }}>
        <h1 className="page-title">Developers</h1>
        <p className="page-desc">Integrate TraceLink directly into your application using our REST API.</p>
      </div>

      {/* ── API Keys Section ── */}
      <div style={{ display: 'flex', gap: 48, borderBottom: '1px solid var(--border)', paddingBottom: 40, marginBottom: 40 }}>
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, background: 'var(--amber-50)', color: 'var(--amber-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyIcon />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>API Keys</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Manage your secret API keys. Use these keys to authenticate your API requests. Keep them secure and never expose them in client-side code.
          </p>
        </div>

        <div style={{ flex: 1 }}>
          {newRawKey && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 24, borderRadius: 'var(--r-lg)', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, color: '#065f46', marginBottom: 8 }}>Your new API key is ready</div>
              <p style={{ fontSize: 13, color: '#047857', marginBottom: 16 }}>
                <strong>Important:</strong> This key will only be shown once. Store it securely in your environment variables.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <code style={{ flex: 1, background: '#fff', border: '1px solid #6ee7b7', padding: '10px 16px', borderRadius: 8, fontSize: 14, color: '#064e3b', fontWeight: 600 }}>
                  {newRawKey}
                </code>
                <CopyToClipboard text={newRawKey} onCopy={handleCopyKey}>
                  <button className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>
                    {copiedKey ? <CheckIcon /> : <CopyIcon />} {copiedKey ? 'Copied' : 'Copy Key'}
                  </button>
                </CopyToClipboard>
              </div>
              <button className="btn btn-ghost btn-sm mt-4" onClick={() => setNewRawKey(null)}>I have saved this key</button>
            </div>
          )}

          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h4 style={{ fontWeight: 600 }}>Standard Keys</h4>
              <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>Generate New Key</button>
            </div>

            {keys.length === 0 ? (
              <div className="empty" style={{ padding: 24 }}>
                <div className="empty-title">No API keys</div>
                <div className="empty-desc">You don't have any active API keys yet.</div>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                    <th style={{ padding: '0 0 12px 0', fontWeight: 600 }}>NAME</th>
                    <th style={{ padding: '0 0 12px 0', fontWeight: 600 }}>KEY</th>
                    <th style={{ padding: '0 0 12px 0', fontWeight: 600 }}>CREATED</th>
                    <th style={{ padding: '0 0 12px 0', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map(k => (
                    <tr key={k.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 0', fontWeight: 500, color: 'var(--text-primary)' }}>{k.name}</td>
                      <td style={{ padding: '16px 0' }}>
                        <code style={{ background: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: 6, color: 'var(--text-secondary)' }}>
                          {k.maskedKey}
                        </code>
                      </td>
                      <td style={{ padding: '16px 0', color: 'var(--text-tertiary)' }}>{dayjs(k.createdAt).format('MMM D, YYYY')}</td>
                      <td style={{ padding: '16px 0', textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => handleRevoke(k.id)}>
                          <TrashIcon /> Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Start Section ── */}
      <div style={{ display: 'flex', gap: 48 }}>
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, background: 'var(--blue-50)', color: 'var(--blue-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CodeIcon />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Quick Start</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Use the TraceLink API to create short URLs, retrieve analytics, and manage your links programmatically. Check out the snippets to get started immediately.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link to="/api-docs" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <BookIcon /> View Full API Reference
            </Link>
          </div>
        </div>

        <div className="card" style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', padding: '0 16px' }}>
            {SNIPPETS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                style={{
                  padding: '16px 16px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: activeTab === s.id ? 600 : 500,
                  color: activeTab === s.id ? 'var(--blue-600)' : 'var(--text-secondary)',
                  borderBottom: `2px solid ${activeTab === s.id ? 'var(--blue-600)' : 'transparent'}`,
                  marginBottom: -1,
                  transition: 'color 0.1s'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ padding: 24, position: 'relative' }}>
            {SNIPPETS.map(s => s.id === activeTab && (
              <div key={s.id} style={{ position: 'relative' }}>
                <pre style={{ margin: 0, padding: 20, background: '#0f172a', color: '#e2e8f0', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', overflowX: 'auto', lineHeight: 1.5 }}>
                  <code>{s.code}</code>
                </pre>
                <CopyToClipboard text={s.code} onCopy={() => handleCopySnippet(s.id)}>
                  <button style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                    {copiedSnippet === s.id ? <CheckIcon /> : <CopyIcon />} {copiedSnippet === s.id ? 'Copied' : 'Copy'}
                  </button>
                </CopyToClipboard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Create Key Modal ── */}
      {showCreateModal && (
        <div className="overlay" onMouseDown={e => e.target === e.currentTarget && setShowCreateModal(false)}>
          <div className="modal" style={{ width: 400 }}>
            <h2 className="modal-title">Create API Key</h2>
            <p className="modal-desc" style={{ marginBottom: 24 }}>Enter a memorable name for your new API key so you can identify its purpose later.</p>
            <form onSubmit={handleSubmit(handleCreate)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field">
                <label className="field-label">Key Name</label>
                <input
                  className={`input${errors.name ? ' is-error' : ''}`}
                  placeholder="e.g., Slack Bot, Backend Server"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <span className="field-error">{errors.name.message}</span>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => { setShowCreateModal(false); reset() }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Key</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
