import React from 'react'

interface PhoneFrameProps {
  children: React.ReactNode
  label?: string
}

export default function PhoneFrame({ children, label }: PhoneFrameProps) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: '#1E1108',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 390,
          height: 820,
          borderRadius: 52,
          background: '#F3E9DC',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: `
            0 40px 100px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 0 0 8px #2A1A12,
            0 0 0 9px rgba(255,255,255,0.04)
          `,
          flexShrink: 0,
        }}>
          {/* Status Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 28px 8px',
            flexShrink: 0,
            background: '#FAF7F2',
          }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: '#2F4A3B' }}>
              9:41
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {/* Signal */}
              <svg width="15" height="11" viewBox="0 0 15 11" fill="#2F4A3B">
                <rect x="0"  y="4"   width="3" height="7"    rx="1"/>
                <rect x="4"  y="2.5" width="3" height="8.5"  rx="1"/>
                <rect x="8"  y="1"   width="3" height="10"   rx="1"/>
                <rect x="12" y="0"   width="3" height="11"   rx="1"/>
              </svg>
              {/* WiFi */}
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="#2F4A3B" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 3.5C3.5 1 6 0 8 0s4.5 1 7 3.5"/>
                <path d="M3 5.5C4.8 3.8 6.3 3 8 3s3.2.8 5 2.5"/>
                <path d="M5.5 7.5C6.5 6.5 7.2 6 8 6s1.5.5 2.5 1.5"/>
                <circle cx="8" cy="10" r="1" fill="#2F4A3B" stroke="none"/>
              </svg>
              {/* Battery */}
              <div style={{ width: 22, height: 11, border: '1.5px solid rgba(47,74,59,0.3)', borderRadius: 3, padding: '1.5px 2px', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '75%', height: '100%', background: '#2F4A3B', borderRadius: 1.5, opacity: 0.8 }}/>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </div>

        {label && (
          <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
            {label}
          </div>
        )}
      </div>

      {/* Responsive: full-width on mobile */}
      <style>{`
        @media (max-width: 420px) {
          div[style*="1E1108"] { background: #F3E9DC !important; }
          div[style*="border-radius: 52px"] {
            width: 100vw !important;
            height: 100dvh !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
