'use client'

import { useRouter, usePathname } from 'next/navigation'

const tabs = [
  {
    id: 'exercicios', label: 'Exercícios', path: '/exercicios',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/>
        <path d="M3 9.5h3v5H3z"/><path d="M18 9.5h3v5h-3z"/>
        <line x1="6.5" y1="12" x2="17.5" y2="12"/>
      </svg>
    ),
  },
  {
    id: 'comunidade', label: 'Comunidade', path: '/comunidade',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'desafio', label: 'Desafio', path: '/desafio', center: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDF8F3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
        <path d="M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
        <path d="M17.8 5.4A6.5 6.5 0 1 1 6.2 5.4"/>
      </svg>
    ),
  },
  {
    id: 'educacao', label: 'Educação', path: '/educacao',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    id: 'loja', label: 'Loja', path: '/loja',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
]

export default function BottomNav() {
  const router   = useRouter()
  const pathname = usePathname()

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'stretch',
      background: '#FDF8F3',
      borderTop: '1px solid #E8D8CC',
      paddingBottom: 14,
      flexShrink: 0,
    }}>
      {tabs.map(tab => {
        const active = pathname === tab.path
        return (
          <div
            key={tab.id}
            onClick={() => router.push(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 2px 2px',
              gap: 3,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {tab.center ? (
              <>
                <div style={{
                  width: 52, height: 52,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#C9826B,#D4A96A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(201,130,107,0.50)',
                  marginTop: -16,
                }}>
                  {tab.icon}
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, color: active ? '#C9826B' : '#8A6A5A' }}>
                  {tab.label}
                </span>
              </>
            ) : (
              <>
                <div style={{ color: active ? '#C9826B' : '#B89B8C' }}>{tab.icon}</div>
                <span style={{ fontSize: 9, fontWeight: 500, color: active ? '#C9826B' : '#B89B8C' }}>
                  {tab.label}
                </span>
                {active && (
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9826B', marginTop: 2 }}/>
                )}
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}
