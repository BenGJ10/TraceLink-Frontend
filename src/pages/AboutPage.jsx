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
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/blog" className="btn btn-ghost btn-sm">Blog</Link>
        <Link to="/" className="btn btn-ghost btn-sm">← Home</Link>
      </div>
    </div>
  </nav>
)

const PILLARS = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    title: 'Built for Speed',
    body: 'Every redirect resolves in under 50ms. Our lean Spring Boot architecture keeps the critical redirect path dependency-free — no added latency, ever.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>,
    title: 'Deep Observability',
    body: 'Go beyond click counts. TraceLink captures device type, browser, operating system, and geographic origin for every link interaction — automatically.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
    title: 'Security First',
    body: 'JWT-based stateless authentication, hashed IP storage for privacy compliance, and owner-scoped access control on every endpoint.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
    title: 'QR Natively',
    body: 'Every short link comes with an auto-generated QR code — watermarked, downloadable in PNG or SVG, and independently trackable in your analytics pipeline.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    title: 'Real-Time Analytics',
    body: 'Live charts for clicks over time, device breakdown, traffic sources (Link vs QR), and geographic distribution — all visualised the moment data arrives.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    title: 'Link State Control',
    body: 'Disable or re-enable any link instantly without deleting it. Set expiry timestamps to auto-retire temporary campaigns — all from the dashboard.',
  },
]

export default function AboutPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <NAV />

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 24px 72px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', padding: '5px 14px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28 }}>
          About TraceLink
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 24, color: '#0f172a' }}>
          Every link tells a story.<br />We help you read it.
        </h1>
        <p style={{ fontSize: 19, color: '#64748b', lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
          TraceLink is a full-stack link management platform designed to give teams complete visibility into how their links perform — in real time, across every channel and device.
        </p>
      </section>

      {/* Mission */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '72px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Our Mission</p>
            <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20, color: '#0f172a', lineHeight: 1.2 }}>
              Make intelligent linking effortless.
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.8, marginBottom: 16 }}>
              We believe the link is the most fundamental unit of the web. Yet for most teams, it remains an afterthought — created once, shared, and forgotten.
            </p>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.8 }}>
              TraceLink changes that. Every link you create becomes a live data point: who clicked it, from where, on what device, and through which channel. That intelligence shapes better decisions.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[['< 50ms', 'Average redirect latency'], ['100%', 'Link analytics coverage'], ['3 formats', 'PNG, SVG, and tracking QR'], ['Real-time', 'Live analytics pipeline']].map(([stat, label]) => (
              <div key={stat} style={{ padding: '20px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', minWidth: 80 }}>{stat}</div>
                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: 12 }}>
            What makes TraceLink different
          </h2>
          <p style={{ fontSize: 17, color: '#64748b', maxWidth: 520, margin: '0 auto' }}>
            Purpose-built for performance, visibility, and control — not just brevity.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {PILLARS.map(({ icon, title, body }) => (
            <div
              key={title}
              style={{ padding: '32px 28px', border: '1px solid #e2e8f0', borderRadius: 14, background: '#fff', transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#bfdbfe' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0' }}
            >
              <div style={{ width: 44, height: 44, background: '#eff6ff', color: '#2563eb', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1e3a8a', padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
          Ready to take control of your links?
        </h2>
        <p style={{ fontSize: 17, color: '#93c5fd', marginBottom: 36 }}>
          Start shortening, tracking, and optimising — completely free.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Link to="/register" style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'background 0.2s' }}>
            Get started free
          </Link>
          <Link to="/api-docs" style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
            View API Docs
          </Link>
        </div>
      </section>
    </div>
  )
}
