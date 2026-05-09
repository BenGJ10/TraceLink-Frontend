import React from 'react'

export const LogoIcon = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'block' }}
  >
    <defs>
      {/* Unique ID for the gradient to prevent conflicts */}
      <linearGradient id="tracelink-t-gradient" x1="16" y1="8" x2="16" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e40af" /> {/* Deep Blue */}
        <stop offset="100%" stopColor="#3b82f6" /> {/* Lighter Blue */}
      </linearGradient>

      <filter id="tracelink-soft-glow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feFlood floodColor="#3b82f6" floodOpacity="0.3" result="glowColor" />
        <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
        <feMerge>
          <feMergeNode in="softGlow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="tracelink-glass-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.05"/>
      </filter>
    </defs>

    {/* Container */}
    <rect 
      x="2" 
      y="2" 
      width="28" 
      height="28" 
      rx="7.5" 
      fill="#ffffff" 
      filter="url(#tracelink-glass-shadow)"
    />
    <rect 
      x="2" 
      y="2" 
      width="28" 
      height="28" 
      rx="7.5" 
      fill="rgba(255, 255, 255, 0.8)" 
      stroke="#f1f5f9" 
      strokeWidth="0.5" 
    />

    {/* Bold 'T' - Added solid blue fallback fill */}
    <path 
      d="M9 9H23V12.5H18V24H14V12.5H9V9Z" 
      fill="#1e40af" 
      fillOpacity="1"
    />
    <path 
      d="M9 9H23V12.5H18V24H14V12.5H9V9Z" 
      fill="url(#tracelink-t-gradient)" 
      filter="url(#tracelink-soft-glow)"
    />
  </svg>
)

export const Wordmark = ({ size = 32 }) => (
  <div className="wordmark">
    <div className="wordmark-icon">
      <LogoIcon size={size} />
    </div>
    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
      TraceLink
    </span>
  </div>
)
