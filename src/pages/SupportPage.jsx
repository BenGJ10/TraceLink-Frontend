import { useState, useRef } from 'react'
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
      <Link to="/" className="btn btn-ghost btn-sm">← Home</Link>
    </div>
  </nav>
)

const FAQS = [
  { q: 'How quickly does your team respond?', a: 'We aim to respond to all support requests within 24 hours on business days. Critical technical issues are prioritised.' },
  { q: 'Do you offer API integration help?', a: 'Yes — if you are integrating TraceLink into your application, include your use-case in the message and we will guide you through setup.' },
  { q: 'Can I request a custom feature?', a: 'Absolutely. Use the "Product Feedback" topic and describe what you need. We evaluate every request and add popular ones to our roadmap.' },
]

const PlusIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
    <path d="M8 2v12M2 8h12" strokeLinecap="round" />
  </svg>
)

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <div
        style={{ padding: '20px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)' }}
        onClick={() => setOpen(!open)}
      >
        {q}
        <PlusIcon open={open} />
      </div>
      {open && <div style={{ paddingBottom: '20px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 14 }}>{a}</div>}
    </div>
  )
}

export default function SupportPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const formRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSent(true)
    toast.success("Message sent — we'll get back to you shortly.")
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <NAV />

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 56px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ width: 56, height: 56, background: '#eff6ff', color: '#2563eb', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16, color: '#0f172a' }}>
          How can we help?
        </h1>
        <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.7 }}>
          Whether you have a technical question, feedback, or need assistance with your account — we're here for you.
        </p>
      </section>

      {/* Form */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '40px 44px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Send us a message</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32 }}>All fields are required. We'll reply to your email address.</p>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Message received!</h3>
              <p style={{ fontSize: 15, color: '#64748b' }}>We'll get back to you at the email you provided.</p>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 24 }} onClick={() => setSent(false)}>Send another</button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="field">
                  <label className="field-label">Full Name</label>
                  <input type="text" className="input" placeholder="Your Name" required />
                </div>
                <div className="field">
                  <label className="field-label">Email Address</label>
                  <input type="email" className="input" placeholder="yourname@domain.com" required />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Topic</label>
                <select className="input" required defaultValue="">
                  <option value="" disabled>Select a topic…</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Account &amp; Billing</option>
                  <option value="api">API &amp; Integration</option>
                  <option value="feedback">Product Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="field">
                <label className="field-label">Subject</label>
                <input type="text" className="input" placeholder="Brief description of your issue" required />
              </div>

              <div className="field">
                <label className="field-label">Message</label>
                <textarea className="input" placeholder="Describe your issue or question in detail…" rows={5} required style={{ resize: 'vertical' }} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15 }} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Send Message'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
                Or email us directly at <a href="mailto:gjdevelopment1015@gmail.com" style={{ color: '#2563eb' }}>tracelink.support@gmail.com</a>
              </p>
            </form>
          )}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 80, borderTop: '1px solid var(--border)', paddingTop: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 32, textAlign: 'center' }}>Frequently asked questions</h2>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
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
                  <LogoIcon size={30} />
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
