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
      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/api-docs" className="btn btn-ghost btn-sm">API Docs</Link>
        <Link to="/" className="btn btn-ghost btn-sm">← Home</Link>
      </div>
    </div>
  </nav>
)

const POSTS = [
  {
    slug: 'foundations',
    tag: 'Engineering',
    date: 'March 2026',
    readTime: '6 min read',
    title: 'Building TraceLink — Part 1: Foundations',
    subtitle: 'How we went from a blank Spring Boot project to a working URL shortener with JWT auth and a production-ready React frontend.',
    content: [
      {
        heading: 'Starting from scratch',
        body: `Every production system starts with a set of constraints you impose on yourself before writing a single line. For TraceLink, the constraints were clear: sub-50ms redirect latency, stateless authentication, and a data model flexible enough to grow as features are added.

We chose Spring Boot as the backend framework for its ecosystem maturity, and React (with Vite) for the frontend. MySQL provided the persistence layer — a deliberate choice over NoSQL because our data has well-defined relationships: users own URL mappings, and URL mappings own click events.`,
      },
      {
        heading: 'The redirect contract',
        body: `The redirect flow is the most performance-critical path in the system. A user clicks a short link. They should be at the destination before they notice any delay. This informed our architectural decision early on: the redirect endpoint must do the absolute minimum.

In practice, this means a single indexed lookup on the \`short_url\` column, a 302 redirect response, and nothing else. Analytics enrichment — device parsing, geo-location — happens asynchronously on a separate thread pool, completely outside the HTTP response cycle.`,
      },
      {
        heading: 'Authentication with JWT',
        body: `We implemented stateless JWT-based authentication using a custom filter chain in Spring Security. On login, the server signs a token containing the username and expiry with an HS256 secret. No session state is maintained server-side — every authenticated request is self-contained.

The security filter chain permits the redirect endpoint (\`/{shortUrl}\`) and auth routes (\`/api/auth/**\`) publicly. All other routes require a valid token in the Authorization header. Role-based access control via \`@PreAuthorize\` ensures users can only manage their own data.`,
      },
      {
        heading: 'The frontend foundation',
        body: `On the React side, we built a clean design system from scratch using vanilla CSS variables — no Tailwind, no component library. This gave us full control over every visual token: colours, border radii, shadows, typography.

The app shell uses React Router for client-side navigation, React Hook Form for form handling, and Axios with an interceptor that injects the JWT token on every request automatically. The result is a clean separation of concerns: the frontend never manages authentication state manually.`,
      },
    ],
  },
  {
    slug: 'feature-expansion',
    tag: 'Product',
    date: 'April 2026',
    readTime: '8 min read',
    title: 'Building TraceLink — Part 2: Feature Expansion',
    subtitle: 'Adding QR code generation, a full click analytics pipeline, and a dashboard that turns raw events into actionable insights.',
    content: [
      {
        heading: 'QR codes as first-class citizens',
        body: `Most URL shorteners treat QR codes as an afterthought — a bolted-on feature that generates a static image. We took a different approach: every short link in TraceLink automatically has a QR code, and that QR code is independently tracked in the analytics pipeline.

We used the ZXing library for QR generation on the backend, exposing a public endpoint that returns PNG or SVG on demand. QR codes embed the short URL with a \`/q/\` prefix, routing through a dedicated redirect endpoint that records the source as \`QR\` rather than \`LINK\`. This lets you see, at a glance, whether your link traffic comes from sharing online or from printed materials.`,
      },
      {
        heading: 'The analytics pipeline',
        body: `Click events in TraceLink carry far more than a timestamp. Each event records the short URL, source (LINK or QR), a SHA-256 hash of the visitor's IP (for privacy), the raw user-agent string, and the parsed breakdown: browser, operating system, device class, country, and city.

User-agent parsing uses YAUAA — a highly accurate, maintained library with a well-tested classification system. Geographic resolution uses ip-api.com's JSON endpoint, called asynchronously from a \`@Async\` Spring service. If the call fails or times out, the event is still saved; geo fields simply remain null. The redirect user never experiences any delay.`,
      },
      {
        heading: 'Building the dashboard',
        body: `The analytics dashboard is built with a dual-charting approach. Chart.js handles time-series data (clicks per day), where a bar chart shows aggregate traffic and a line chart shows per-link trends. Recharts handles the enriched breakdown — device distribution via a horizontal bar chart and traffic source distribution via a donut pie chart.

A geographic insights table shows clicks by country, sorted by volume, with percentage-share progress bars. All three chart sections load from a single \`GET /api/analytics/{shortUrl}\` endpoint that runs server-side aggregation queries — grouping, counting, and sorting in SQL rather than in JavaScript.`,
      },
      {
        heading: 'Link state management',
        body: `Beyond creation and deletion, production link management requires finer control. We added \`isActive\` and \`expiresAt\` fields to the URL mapping model. Disabled links return HTTP 410 Gone. Expired links (where \`expiresAt\` is in the past) do the same.

The toggle is a simple PATCH endpoint, owner-authenticated. On the frontend, each link card shows an Active, Disabled, or Expired status pill, and the action dropdown provides a one-click toggle without a confirmation dialog — because disabling a link is easily reversible.`,
      },
    ],
  },
  {
    slug: 'towards-production',
    tag: 'Architecture',
    date: 'May 2026',
    readTime: '10 min read',
    title: 'Building TraceLink — Part 3: Towards Production',
    subtitle: 'Thinking beyond feature completion — observability, event-driven design, security hardening, and what a production deployment of TraceLink would actually look like.',
    content: [
      {
        heading: 'Observability starts before deployment',
        body: `A system you cannot observe is a system you cannot trust in production. For TraceLink, observability means three things: structured logging, health metrics, and traceability.

Spring Boot Actuator exposes health and metrics endpoints out of the box. In a real deployment, these feed into a metrics aggregator — Prometheus for scraping, Grafana for dashboarding. The async analytics thread pool is an area requiring particular attention: queue depth, task rejection, and execution latency should all be tracked as named metrics to detect backpressure early.`,
      },
      {
        heading: 'The case for an event-driven pipeline',
        body: `Our current analytics pipeline is async-within-process: the redirect endpoint hands off event enrichment to a Spring thread pool. This works well at low-to-medium scale. At high volume, it becomes a bottleneck.

The natural evolution is an event-driven architecture using a message broker — Apache Kafka or Amazon SQS. On redirect, the service publishes a minimal event (shortUrl, IP, user-agent, timestamp) to a topic. A separate consumer service subscribes to that topic, performs enrichment, and writes to the database. This decouples the redirect service entirely from storage and enrichment latency, making both independently scalable.`,
      },
      {
        heading: 'Security hardening',
        body: `Production deployments require more than JWT authentication. TraceLink's current security posture covers authentication and authorisation well. The missing layers for production are rate limiting (to prevent abuse of the redirect and shorten endpoints), HTTPS enforcement, and input validation on URLs to prevent open redirects to malicious domains.

A domain allowlist or blocklist (maintained as a database table and cached in memory) provides the most flexible approach. Rate limiting at the API Gateway layer — NGINX, AWS API Gateway, or Cloudflare — is more effective than application-level rate limiting, since it intercepts traffic before it hits Spring.`,
      },
      {
        heading: 'Deployment and scaling',
        body: `A containerised deployment on AWS is the natural next step. The Spring Boot application builds to a Docker image via a multi-stage Dockerfile, deployed to ECS Fargate. The MySQL database moves to Amazon RDS with Multi-AZ for high availability. Static frontend assets deploy to S3 and serve through CloudFront.

Horizontal scaling of the redirect service is trivial since it is stateless. Analytics consumers scale independently based on event queue depth. A Redis cache in front of the URL lookup (short_url → original_url) would dramatically reduce database read load at scale, given that redirects vastly outnumber writes.

TraceLink is architecturally ready for this transition. The clean separation between the redirect path, the analytics pipeline, and the management API means each component can be scaled, replaced, or extended independently.`,
      },
    ],
  },
]

function PostCard({ post, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px 36px',
        cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
        background: '#fff',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#bfdbfe' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <span style={{ padding: '3px 10px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{post.tag}</span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{post.date}</span>
        <span style={{ fontSize: 13, color: '#cbd5e1' }}>•</span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{post.readTime}</span>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 12, letterSpacing: '-0.02em' }}>{post.title}</h2>
      <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>{post.subtitle}</p>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#2563eb' }}>
        Read article
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h8M8 4l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  )
}

function PostDetail({ post, onBack }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 100px' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 40, fontWeight: 500, padding: 0 }}>
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 7H3M6 4L3 7l3 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to Blog
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ padding: '3px 10px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{post.tag}</span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{post.date}</span>
        <span style={{ fontSize: 13, color: '#cbd5e1' }}>•</span>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{post.readTime}</span>
      </div>

      <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 20 }}>{post.title}</h1>
      <p style={{ fontSize: 19, color: '#64748b', lineHeight: 1.7, marginBottom: 48, borderBottom: '1px solid #e2e8f0', paddingBottom: 40 }}>{post.subtitle}</p>

      {post.content.map(({ heading, body }) => (
        <div key={heading} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.01em' }}>{heading}</h2>
          {body.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: 16, color: '#374151', lineHeight: 1.85, marginBottom: 16 }}>{para}</p>
          ))}
        </div>
      ))}

      <div style={{ marginTop: 56, padding: '28px 32px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14 }}>
        <p style={{ fontSize: 15, color: '#64748b', marginBottom: 16 }}>
          Want to see TraceLink in action or dive deeper into the technical details?
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/register" style={{ padding: '9px 20px', background: '#2563eb', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Get started free</Link>
          <Link to="/api-docs" style={{ padding: '9px 20px', background: '#fff', color: '#374151', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid #e2e8f0' }}>View API Docs</Link>
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  const [selected, setSelected] = useState(null)

  const post = POSTS.find(p => p.slug === selected)

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <NAV />

      {post ? (
        <PostDetail post={post} onBack={() => setSelected(null)} />
      ) : (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 100px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', padding: '5px 14px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24 }}>
              Engineering Blog
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
              The TraceLink Journal
            </h1>
            <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
              A transparent look into how TraceLink was designed, built, and evolved — from first commit to production-ready architecture.
            </p>
          </div>

          {/* Posts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {POSTS.map(post => (
              <PostCard key={post.slug} post={post} onClick={() => setSelected(post.slug)} />
            ))}
          </div>

          {/* Bottom note */}
          <div style={{ textAlign: 'center', marginTop: 72, padding: '40px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✍️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>More posts coming soon</h3>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              Upcoming topics: Kafka integration, multi-tenancy design, custom domain support, and our deployment journey on AWS.
            </p>
          </div>
        </div>
      )}
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
