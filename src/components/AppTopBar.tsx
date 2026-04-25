import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AppTopBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let nome = ''
  if (user) {
    const { data } = await supabase.from('profiles').select('nome').eq('id', user.id).single()
    nome = data?.nome ?? ''
  }

  const initial = nome ? nome[0].toUpperCase() : '?'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 20px 6px',
      background: '#FAF7F2',
      borderBottom: '1px solid #EBE0CF',
      flexShrink: 0,
    }}>
      {/* Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="22" height="22" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" fill="#2F4A3B"/>
          <path d="M40 18 L40 62" stroke="#C49A5A" strokeWidth="3" strokeLinecap="round"/>
          <path d="M28 26 L40 18 L52 26" stroke="#C49A5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 40 L56 40" stroke="#C49A5A" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          <path d="M26 54 L54 54" stroke="#C49A5A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        </svg>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 13,
          fontWeight: 600,
          color: '#2F4A3B',
          letterSpacing: '0.04em',
          lineHeight: 1.2,
        }}>
          <span style={{ display: 'block', fontSize: 11, color: '#6B7F63', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase' }}>by Josiane</span>
          VIVER BEM
        </div>
      </div>

      {/* Profile button */}
      <Link href="/perfil" style={{ textDecoration: 'none' }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2F4A3B, #C49A5A)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(47,74,59,0.35)',
          cursor: 'pointer',
        }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 14,
            fontWeight: 600,
            color: '#FAF7F2',
          }}>
            {initial}
          </span>
        </div>
      </Link>
    </div>
  )
}
