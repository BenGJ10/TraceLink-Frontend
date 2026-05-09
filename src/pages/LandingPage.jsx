import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoIcon } from '../components/Logo'

// ─── SVGs ──────
const TerminalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="2" y="3" width="16" height="14" rx="2" />
    <path d="M6 8l3 3-3 3M11 14h4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 15l4-6 3 4 3-7 4 4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 17h14" strokeLinecap="round" />
  </svg>
)
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M10 2l7 3v5c0 4-3.5 7-7 8C6.5 17 3 14 3 10V5l7-3z" strokeLinejoin="round" />
    <path d="M7.5 10l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const PlusIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
    <path d="M8 2v12M2 8h12" strokeLinecap="round" />
  </svg>
)
const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.1">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
)
const ChevronLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
const ChevronRight = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>

const FEATURES = [
  { Icon: TerminalIcon, title: 'URL Shortening', desc: 'Convert long URLs into base-62 encoded short links with instant sub-50ms redirect latency.' },
  { Icon: ChartIcon, title: 'Click Analytics', desc: 'Track every click with date-range filters, aggregate trends, and specific link performance.' },
  { Icon: ShieldIcon, title: 'Secure Access', desc: 'Stateless JWT authentication and secure BCrypt password hashing for every account.' },
]

const FAQS = [
  { q: 'Is TraceLink free to use?', a: 'Yes. TraceLink is currently completely free for personal and professional use. Create an account to get started.' },
  { q: 'Can I track where clicks come from?', a: 'TraceLink tracks the total click volume over time. We are working on adding geographic and referrer data in upcoming releases.' },
  { q: 'How long do the shortened links last?', a: 'Your short links are permanent and will never expire as long as your account remains active.' },
  { q: 'Is there an API I can use?', a: 'Yes! TraceLink is built API-first. Every action you can do in the dashboard can be done via our REST API.' },
]

const TESTIMONIALS = [
  {
    quote: "TraceLink completely transformed how we manage our marketing campaigns. The sub-50ms redirect speeds and real-time analytics are absolutely unmatched. Best URL shortener we've used.",
    name: "Sarah Jenkins",
    role: "CMO at GlobalTech",
    image: "https://i.pravatar.cc/150?u=sarahj"
  },
  {
    quote: "As a developer, I love tools that just work. The REST API is incredibly clean, and the JWT stateless authentication gives us the security guarantees we need for our enterprise clients.",
    name: "David Chen",
    role: "Lead Engineer at ACME Corp",
    image: "https://i.pravatar.cc/150?u=davidc"
  },
  {
    quote: "The automated QR code generation saves our events team hours every week. We just drop in the URL, grab the QR code, and we're ready to print. The analytics dashboard is just the cherry on top.",
    name: "Michelle Rodriguez",
    role: "Events Coordinator at PULSE",
    image: "https://i.pravatar.cc/150?u=elenar"
  }
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <div className="faq-q" onClick={() => setOpen(!open)}>
        {q}
        <PlusIcon open={open} />
      </div>
      {open && <div className="faq-a">{a}</div>}
    </div>
  )
}

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused])

  return (
    <div
      style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '20px 60px' }}>
        <div style={{
          display: 'flex',
          transition: 'transform 0.5s ease-in-out',
          transform: `translateX(-${current * 100}%)`
        }}>
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} style={{ width: '100%', flexShrink: 0, padding: '0 10px' }}>
              {/* Stacked Card UI */}
              <div style={{ position: 'relative' }}>
                {/* Background Layer */}
                <div style={{
                  position: 'absolute', top: 12, left: 16, right: -16, bottom: -12,
                  background: 'var(--blue-100)', borderRadius: 'var(--r-xl)', zIndex: 0,
                  opacity: 0.6
                }} />

                {/* Foreground Card */}
                <div
                  className="card"
                  style={{
                    position: 'relative', zIndex: 1, padding: 40, background: '#fff',
                    borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-md)',
                    transition: 'transform 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ position: 'absolute', top: 24, right: 24 }}><QuoteIcon /></div>
                  <p style={{ fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 32, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--blue-100)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>{t.name}</div>
                      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent(c => c === 0 ? TESTIMONIALS.length - 1 : c - 1)}
        style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: '#fff', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s', zIndex: 10 }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--blue-600)'; e.currentTarget.style.borderColor = 'var(--blue-600)'; e.currentTarget.style.background = 'var(--blue-50)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fff'; }}
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => setCurrent(c => c === TESTIMONIALS.length - 1 ? 0 : c + 1)}
        style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: '#fff', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s', zIndex: 10 }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--blue-600)'; e.currentTarget.style.borderColor = 'var(--blue-600)'; e.currentTarget.style.background = 'var(--blue-50)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fff'; }}
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: current === i ? 24 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0,
              background: current === i ? 'var(--blue-600)' : 'var(--blue-300)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ... icons ...

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [longUrl, setLongUrl] = useState('')

  const handleHeroSubmit = (e) => {
    e.preventDefault()
    if (!longUrl) return
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ── Nav ── */}
      <nav className="landing-nav">
        <div className="container flex items-center justify-between" style={{ width: '100%' }}>
          <Link to="/" className="wordmark">
            <div className="wordmark-icon">
              <LogoIcon size={30} />
            </div>
            TraceLink
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign up free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(36px,6vw,56px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24 }}>
            Build stronger digital <br /> connections with every link.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 40px' }}>
            TraceLink is a fast, developer-friendly URL shortener. Track clicks, analyze performance, and manage your links in one unified platform.
          </p>

          {/* Interactive Hero Shortener */}
          <form className="hero-input-wrap" onSubmit={handleHeroSubmit}>
            <div style={{ padding: '10px 0 10px 16px', color: 'var(--gray-400)', display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <input
              className="hero-input"
              placeholder="Paste your long link here..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--r-md)' }}>
              Shorten
            </button>
          </form>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 12 }}>
            By clicking Shorten, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>

      {/* ── Trusted By ── */}
      <section style={{ padding: '40px 0 60px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 24 }}>
            Trusted by modern engineering teams
          </p>
          <div className="logo-cloud">
            <h3 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-sans)', letterSpacing: '-1px' }}>ACME Corp</h3>
            <h3 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'serif', fontStyle: 'italic' }}>GlobalTech</h3>
            <h3 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>NEXUS</h3>
            <h3 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-sans)', letterSpacing: '2px' }}>PULSE</h3>
            <h3 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: '50%' }}></div> VERTEX</h3>
          </div>
        </div>
      </section>

      {/* ── Product Preview / Demo ── */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', overflow: 'visible' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 12 }}>
              See TraceLink in action
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>A powerful, analytics-first dashboard built for modern teams.</p>
          </div>

          <div style={{ position: 'relative', maxWidth: 960, margin: '0 auto' }}>

            {/* Floating Labels */}
            <div style={{ position: 'absolute', top: -15, left: -40, background: '#fff', padding: '8px 16px', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', zIndex: 10, fontSize: 13, fontWeight: 600, color: 'var(--blue-600)', animation: 'float 3s ease-in-out infinite' }}>
              Real-time analytics
            </div>
            <div style={{ position: 'absolute', bottom: 40, right: -30, background: '#fff', padding: '8px 16px', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', zIndex: 10, fontSize: 13, fontWeight: 600, color: 'var(--blue-600)', animation: 'float 3.5s ease-in-out infinite', animationDelay: '0.5s' }}>
              1,100+ new clicks
            </div>

            {/* Dashboard Container */}
            <div
              style={{
                background: '#fff', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-modal)',
                border: '1px solid var(--border)', overflow: 'hidden',
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-modal)' }}
            >
              {/* Mac Title Bar */}
              <div style={{ height: 44, background: '#f9fafb', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6, marginRight: 24 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <div style={{ flex: 1, maxWidth: 300, margin: '0 auto', height: 24, background: '#fff', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', fontSize: 11, fontWeight: 500 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  tracelink.app/dashboard
                </div>
              </div>

              {/* Fake Dashboard Body */}
              <div style={{ display: 'flex', padding: 24, gap: 24, background: 'var(--bg-page)', minHeight: 460 }}>
                {/* Fake Sidebar */}
                <div style={{ width: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, borderRight: '1px solid var(--border)', paddingRight: 24 }}>
                  <div style={{ width: 36, height: 36, background: 'var(--blue-600)', borderRadius: 8, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" fill="white" /></svg>
                  </div>
                  <div style={{ width: 36, height: 36, background: 'var(--blue-50)', color: 'var(--blue-600)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                  </div>
                  <div style={{ width: 36, height: 36, color: 'var(--gray-400)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  </div>
                  <div style={{ width: 36, height: 36, color: 'var(--gray-400)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 15l4-6 3 4 3-7 4 4" /><path d="M3 17h14" /></svg>
                  </div>
                </div>

                {/* Fake Main Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* Top: Input Action */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1, height: 44, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 16px', display: 'flex', alignItems: 'center', color: 'var(--gray-400)', fontSize: 14 }}>
                      Paste your long link here...
                    </div>
                    <div style={{ height: 44, padding: '0 24px', background: 'var(--blue-600)', color: '#fff', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 14 }}>
                      Create link
                    </div>
                  </div>

                  {/* Fake Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div style={{ height: 90, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-xs)' }}>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8 }}>Total Clicks</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>12,408</div>
                    </div>
                    <div style={{ height: 90, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-xs)' }}>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8 }}>Engagement Rate</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>24.8%</div>
                    </div>
                    <div style={{ height: 90, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-xs)' }}>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8 }}>Active Links</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>342</div>
                    </div>
                  </div>

                  {/* Fake Chart */}
                  <div style={{ height: 240, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Click Analytics</div>
                      <div style={{ height: 28, width: 80, background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 4 }} />
                    </div>
                    <div style={{ flex: 1, borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)', display: 'flex', alignItems: 'center', position: 'relative' }}>
                      {/* Fake line chart wave */}
                      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
                        <path d="M0 80 Q 15 50, 30 60 T 60 40 T 100 10" fill="none" stroke="var(--blue-500)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M0 80 Q 15 50, 30 60 T 60 40 T 100 10 L 100 100 L 0 100 Z" fill="url(#blue-grad)" opacity="0.3" />
                        <defs>
                          <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--blue-500)" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 12 }}>
              One platform. Infinite possibilities.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>See how TraceLink fits into your workflow.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div className="use-case-card">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>For Marketers</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Track campaign performance in real-time. Append UTM parameters to your links and monitor exactly which channels drive the most traffic.</p>
            </div>
            <div className="use-case-card">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>For Developers</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Integrate shortening directly into your apps using our REST API. Benefit from sub-50ms latency powered by our optimized Spring Boot backend.</p>
            </div>
            <div className="use-case-card">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>For Creators</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Share clean, branded links on your social media profiles. Instantly generate QR codes for offline events, presentations, or merchandise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Features ── */}
      <section style={{ padding: '80px 0', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: 20 }}>
                <div style={{ color: 'var(--accent)', background: 'var(--blue-50)', width: 48, height: 48, borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-page)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        <div className="container">
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 40, textAlign: 'center' }}>
            What our customers are saying
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 0', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 32, textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ borderTop: '1px solid var(--border)' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ padding: '80px 0', background: '#fff', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 16 }}>
            More than just a link shortener
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
            Get started for free and experience the fastest, most reliable way to manage your links and track analytics.
          </p>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ padding: '14px 28px', fontSize: 16 }}>
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: '14px 28px', fontSize: 16 }}>
              Get Started for Free
            </Link>
          )}
        </div>
      </section>

      {/* ── Fat Footer ── */}
      <footer style={{ padding: '60px 0 30px', background: 'var(--gray-900)', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, borderBottom: '1px solid var(--gray-800)', paddingBottom: 40, marginBottom: 30 }}>
            <div>
              <Link to="/" className="wordmark" style={{ fontSize: 18, color: '#fff', marginBottom: 16 }}>
                <div className="wordmark-icon" style={{ width: 26, height: 26 }}>
                  <LogoIcon size={26} />
                </div>
                TraceLink
              </Link>
              <p style={{ fontSize: 14, color: 'var(--gray-400)', lineHeight: 1.6, maxWidth: 280 }}>
                Enterprise-grade link management and analytics built on Spring Boot and React.
              </p>
            </div>

            <div className="footer-col">
              <h4 style={{ color: '#fff' }}>Products</h4>
              <ul>
                <li><Link to="/my-urls">Link Management</Link></li>
                <li><Link to="/my-urls">QR Codes</Link></li>
                <li><Link to="/dashboard">Analytics</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 style={{ color: '#fff' }}>Resources</h4>
              <ul>
                <li><Link to="/api-docs">API Documentation</Link></li>
                <li><Link to="/support">Support</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 style={{ color: '#fff' }}>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between" style={{ color: 'var(--gray-500)', fontSize: 13 }}>
            <div>© {new Date().getFullYear()} TraceLink. All rights reserved.</div>
            <div className="flex gap-4">
              <Link to="/about">Privacy Policy</Link>
              <Link to="/about">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
