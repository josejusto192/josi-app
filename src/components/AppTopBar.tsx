import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

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
      padding: '10px 20px 8px',
      background: '#FAF7F2',
      borderBottom: '1px solid #EBE0CF',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <Image
        src="/logo-viverbem.svg"
        alt="Viver Bem"
        width={90}
        height={85}
        style={{ display: 'block', height: 28, width: 'auto' }}
        priority
      />

      {/* Profile button */}
      <Link href="/perfil" style={{ textDecoration: 'none' }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: '#2F4A3B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
