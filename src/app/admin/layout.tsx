import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('nome,is_admin').eq('id', user.id).single()

  if (!profile?.is_admin) redirect('/desafio')

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDE3', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: '#4A2E22', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 4, height: 56 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: '#D4A96A', flex: 1 }}>
          Josi Admin
        </div>
        <Link href="/admin/desafio" style={{ color: '#F5EDE3', fontSize: 13, textDecoration: 'none', padding: '7px 16px', borderRadius: 100, background: 'rgba(253,248,243,0.12)' }}>
          Desafio
        </Link>
        <Link href="/admin/usuarios" style={{ color: '#F5EDE3', fontSize: 13, textDecoration: 'none', padding: '7px 16px', borderRadius: 100, background: 'rgba(253,248,243,0.12)', marginLeft: 6 }}>
          Usuários
        </Link>
        <Link href="/desafio" style={{ color: '#D4A96A', fontSize: 13, textDecoration: 'none', marginLeft: 16 }}>
          ← App
        </Link>
      </div>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
        {children}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
