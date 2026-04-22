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
      background: '#FDF8F3',
      borderBottom: '1px solid #EDE0D3',
      flexShrink: 0,
    }}>
      {/* Branding */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 15,
        fontWeight: 600,
        color: '#C9826B',
        letterSpacing: '-0.01em',
      }}>
        Josi
      </div>

      {/* Profile button */}
      <Link href="/perfil" style={{ textDecoration: 'none' }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C9826B, #D4A96A)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(201,130,107,0.35)',
          cursor: 'pointer',
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 14,
            fontWeight: 600,
            color: '#FDF8F3',
          }}>
            {initial}
          </span>
        </div>
      </Link>
    </div>
  )
}
