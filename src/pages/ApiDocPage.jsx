import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogoIcon } from '../components/Logo'

const NAV = () => (
  <nav className="landing-nav">
    <div className="container flex items-center justify-between" style={{ width: '100%' }}>
      <Link to="/" className="wordmark">
        <div className="wordmark-icon">
          <LogoIcon size={30} />
        </div>
        TraceLink
      </Link>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/blog" className="btn btn-ghost btn-sm">Blog</Link>
        <Link to="/support" className="btn btn-ghost btn-sm">Support</Link>
      </div>
    </div>
  </nav>
)

const METHOD = ({ m }) => {
  const colors = { GET: ['#dcfce7','#166534'], POST: ['#dbeafe','#1d4ed8'], DELETE: ['#fee2e2','#991b1b'], PATCH: ['#fef3c7','#92400e'] }
  const [bg, fg] = colors[m] || ['#f1f5f9','#334155']
  return <span style={{ padding: '2px 8px', borderRadius: 6, background: bg, color: fg, fontSize: 11, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.04em' }}>{m}</span>
}

const CodeBlock = ({ code }) => (
  <pre style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: 10, padding: '16px 20px', fontSize: 13, lineHeight: 1.6, overflowX: 'auto', margin: '12px 0 0' }}>
    <code>{code}</code>
  </pre>
)

const Section = ({ id, title, children }) => (
  <section id={id} style={{ marginBottom: 56, scrollMarginTop: 80 }}>
    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #e2e8f0' }}>{title}</h2>
    {children}
  </section>
)

const Endpoint = ({ method, path, desc, request, response }) => (
  <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
    <div style={{ padding: '16px 20px', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 12 }}>
      <METHOD m={method} />
      <code style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{path}</code>
    </div>
    <div style={{ padding: '16px 20px' }}>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: request || response ? 16 : 0 }}>{desc}</p>
      {request && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Request Body</div>
          <CodeBlock code={request} />
        </div>
      )}
      {response && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Response</div>
          <CodeBlock code={response} />
        </div>
      )}
    </div>
  </div>
)

const SECTIONS = ['overview','authentication','auth-endpoints','url-endpoints','redirect','analytics','qr']

export default function ApiDocPage() {
  const [active, setActive] = useState('overview')

  const scrollTo = (id) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <NAV />

      <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0, marginRight: 56, position: 'sticky', top: 80, alignSelf: 'flex-start', height: 'fit-content' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Contents</div>
          {[
            ['overview', 'Overview'],
            ['authentication', 'Authentication'],
            ['auth-endpoints', 'Auth'],
            ['url-endpoints', 'URL Management'],
            ['redirect', 'Redirect'],
            ['analytics', 'Analytics'],
            ['qr', 'QR Generation'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14,
                fontWeight: active === id ? 700 : 400,
                color: active === id ? '#2563eb' : '#64748b',
                background: active === id ? '#eff6ff' : 'transparent',
                marginBottom: 2, transition: 'all 0.15s',
              }}
            >{label}</button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 48 }}>
            <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 12 }}>API Reference</h1>
            <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.7 }}>
              The TraceLink REST API gives you programmatic access to URL shortening, analytics, and QR code generation. All endpoints accept and return JSON.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              {[['Base URL','https://api.yourdomain.com'],['API Version','v1'],['Auth','JWT Bearer']].map(([k,v]) => (
                <div key={k} style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{k}: </span>
                  <code style={{ color: '#2563eb', fontSize: 12 }}>{v}</code>
                </div>
              ))}
            </div>
          </div>

          <Section id="overview" title="Overview">
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, marginBottom: 16 }}>
              All API routes are prefixed with <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: 4, fontSize: 13 }}>/api</code>. Public endpoints (login, register, redirect) require no credentials. All other endpoints require a valid JWT token in the Authorization header.
            </p>
            <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px', fontSize: 14, color: '#92400e' }}>
              <strong>Rate limiting:</strong> The geo-location enrichment service (ip-api.com) is limited to 45 requests/minute on the free tier. For production workloads, consider a local GeoIP database.
            </div>
          </Section>

          <Section id="authentication" title="Authentication">
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, marginBottom: 16 }}>
              TraceLink uses stateless JWT authentication. After a successful login, you receive a <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: 4, fontSize: 13 }}>token</code> valid for 48 hours. Pass it as a Bearer token in every authenticated request.
            </p>
            <CodeBlock code={`// Include in all authenticated requests
Authorization: Bearer <your_jwt_token>

// Token expiry: 48 hours (172800000ms)
// Algorithm: HS256`} />
          </Section>

          <Section id="auth-endpoints" title="Auth Endpoints">
            <Endpoint method="POST" path="/api/auth/public/register"
              desc="Create a new TraceLink account."
              request={`{
  "username": "jane_doe",
  "password": "securepassword123"
}`}
              response={`{
  "message": "User registered successfully"
}`} />
            <Endpoint method="POST" path="/api/auth/public/login"
              desc="Authenticate and receive a JWT token."
              request={`{
  "username": "jane_doe",
  "password": "securepassword123"
}`}
              response={`{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "jane_doe"
}`} />
          </Section>

          <Section id="url-endpoints" title="URL Management">
            <Endpoint method="POST" path="/api/urls/shorten"
              desc="Create a new short URL. Requires authentication."
              request={`{
  "originalUrl": "https://example.com/very/long/path?with=params"
}`}
              response={`{
  "id": 42,
  "shortUrl": "MwA67kiB",
  "originalUrl": "https://example.com/very/long/path?with=params",
  "clickCount": 0,
  "isActive": true,
  "expiresAt": null,
  "createdDate": "2026-05-01T10:00:00",
  "username": "jane_doe"
}`} />
            <Endpoint method="GET" path="/api/urls/myurls"
              desc="Retrieve all URLs belonging to the authenticated user. Returns an array of URL objects." />
            <Endpoint method="PATCH" path="/api/urls/{shortUrl}/toggle-active"
              desc="Toggle the active state of a link. Disabled links return 410 Gone on redirect. Owner-only." />
            <Endpoint method="DELETE" path="/api/urls/{shortUrl}"
              desc="Permanently delete a short URL and all associated click events. Owner-only. Returns 204 on success." />
          </Section>

          <Section id="redirect" title="Redirect">
            <Endpoint method="GET" path="/{shortUrl}"
              desc="Redirect to the original URL. Tracks the click event asynchronously (browser, OS, device, geo). Returns 302 Found, 404 if not found, or 410 Gone if the link is disabled or expired." />
            <Endpoint method="GET" path="/q/{shortUrl}"
              desc="QR-specific redirect endpoint. Identical behaviour to the above but records source as QR in analytics." />
          </Section>

          <Section id="analytics" title="Analytics">
            <Endpoint method="GET" path="/api/analytics/daily/{shortUrl}?startDate=&endDate="
              desc="Get daily click counts for a specific short URL within a date range."
              request={`// Query parameters
startDate: 2026-05-01T00:00:00   // ISO 8601
endDate:   2026-05-07T23:59:59`}
              response={`[
  { "clickDate": "2026-05-01", "count": 14 },
  { "clickDate": "2026-05-02", "count": 9 }
]`} />
            <Endpoint method="GET" path="/api/analytics/total?startDate=&endDate="
              desc="Get total daily click counts across all links for the authenticated user."
              response={`{
  "2026-05-01": 34,
  "2026-05-02": 21
}`} />
            <Endpoint method="GET" path="/api/analytics/{shortUrl}"
              desc="Get enriched analytics summary: devices, traffic sources, and geographic breakdown."
              response={`{
  "totalClicks": 58,
  "devices": { "Desktop": 34, "Mobile": 22, "Tablet": 2 },
  "sources": { "LINK": 40, "QR": 18 },
  "countries": { "India": 30, "United States": 18, "Germany": 10 }
}`} />
          </Section>

          <Section id="qr" title="QR Code Generation">
            <Endpoint method="GET" path="/api/url/qr/{shortUrl}?format=png&size=300"
              desc="Generate and download a QR code for any short URL. Public endpoint — no authentication required."
              request={`// Query parameters
format: png | svg      (default: png)
size:   integer pixels (default: 300, max: 1000)`} />
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 16, lineHeight: 1.7 }}>
              QR codes are dynamically generated on each request — no storage required. Embed the URL directly in an <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: 4, fontSize: 13 }}>&lt;img&gt;</code> tag or use it as a download link.
            </p>
            <CodeBlock code={`// Embed in HTML
<img src="https://api.yourdomain.com/api/url/qr/MwA67kiB?format=svg&size=200" />

// Direct download link (PNG, 500px)
https://api.yourdomain.com/api/url/qr/MwA67kiB?format=png&size=500`} />
          </Section>
        </main>
      </div>
    </div>
  )
}
