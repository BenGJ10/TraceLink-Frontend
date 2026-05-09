import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
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
        <Link to="/about" className="btn btn-ghost btn-sm">About</Link>
        <Link to="/" className="btn btn-ghost btn-sm">← Home</Link>
      </div>
    </div>
  </nav>
)

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
    toast.success("Enquiry received. Our sales team will reach out.")
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <NAV />

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 24px 64px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', padding: '5px 14px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24 }}>
          Contact Sales
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20, color: '#0f172a' }}>
          Bring TraceLink to your organization.
        </h1>
        <p style={{ fontSize: 19, color: '#64748b', lineHeight: 1.7, maxWidth: 640, margin: '0 auto' }}>
          Discuss volume pricing, custom integrations, or white-label solutions for your enterprise.
        </p>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 100px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64 }}>

        {/* Left: Form */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '48px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 64, height: 64, background: '#dcfce7', color: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' }}>✓</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Inquiry Sent</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>Our enterprise team will get back to you within 1 business day.</p>
              <button className="btn btn-secondary mt-8" onClick={() => setSent(false)}>Send another inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="field">
                  <label className="field-label">First Name</label>
                  <input type="text" className="input" placeholder="First Name" required />
                </div>
                <div className="field">
                  <label className="field-label">Last Name</label>
                  <input type="text" className="input" placeholder="Last Name" required />
                </div>
              </div>
              <div className="field">
                <label className="field-label">Work Email</label>
                <input type="email" className="input" placeholder="yourname@domain.com" required />
              </div>
              <div className="field">
                <label className="field-label">Company Name</label>
                <input type="text" className="input" placeholder="Company Name" required />
              </div>
              <div className="field">
                <label className="field-label">Company Size</label>
                <select className="input" required defaultValue="">
                  <option value="" disabled>Select size...</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div className="field">
                <label className="field-label">How can we help?</label>
                <textarea className="input" placeholder="Tell us about your requirements..." rows={4} required style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: 48, fontSize: 16, justifyContent: 'center' }} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Talk to Sales'}
              </button>
            </form>
          )}
        </div>

        {/* Right: Info */}
        <div style={{ paddingTop: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 32 }}>Why partner with TraceLink?</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                title: 'Volume Discounts',
                body: 'Scalable pricing for organizations creating thousands of links monthly with enterprise-grade reliability.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M12 2v20M17 5H9.5a4.5 4.5 0 000 9H18a4.5 4.5 0 010 9H6" /></svg>
              },
              {
                title: 'Dedicated Support',
                body: 'Direct access to our engineering team for integration assistance and custom feature requests.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              },
              {
                title: 'SLA Guarantees',
                body: '99.9% uptime SLA for your mission-critical redirect paths and analytics dashboards.',
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              }
            ].map(({ title, body, icon }) => (
              <div key={title} style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 48, height: 48, background: '#eff6ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56, padding: '32px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="mailto:gjdevelopment1015@gmail.com" style={{ fontSize: 16, color: '#2563eb', fontWeight: 600 }}>gjdevelopment1015@gmail.com</a>
              <p style={{ fontSize: 14, color: '#64748b' }}>Technical & Partnership Inquiries</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer style={{ padding: '60px 0 30px', background: 'var(--gray-900)', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, borderBottom: '1px solid var(--gray-800)', paddingBottom: 40, marginBottom: 30 }}>
            <div>
              <Link to="/" className="wordmark" style={{ fontSize: 18, color: '#fff', marginBottom: 16 }}>
                <div className="wordmark-icon" style={{ width: 26, height: 26 }}>
                  <svg viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" fill="white" fillOpacity="0.9" />
                    <path d="M4 7h6M7 4v6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
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
