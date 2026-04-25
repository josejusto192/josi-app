import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const NAV = [
  { href: '/admin/dashboard',  label: 'Dashboard',   icon: '▦' },
  { href: '/admin/insights',   label: 'Insights',    icon: '◈' },
  { href: '/admin/usuarios',   label: 'Usuárias',    icon: '♀' },
  { href: '/admin/desafio',    label: 'Desafio',     icon: '◎' },
  { href: '/admin/exercicios', label: 'Exercícios',  icon: '◉' },
  { href: '/admin/educacao',   label: 'Educação',    icon: '◧' },
  { href: '/admin/loja',       label: 'Loja',        icon: '◫' },
  { href: '/admin/comunidade', label: 'Comunidade',  icon: '◇' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('nome,is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/desafio')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Lato', sans-serif", background: '#F3E9DC' }}>

      {/* Sidebar */}
      <aside style={{ width: 220, background: '#2F4A3B', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>

        {/* Logo */}
        <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid rgba(250,247,242,0.12)' }}>
          <div style={{ marginBottom: 10 }}>
            <Image
              src="/logo-viverbem-light.svg"
              alt="Viver Bem"
              width={160}
              height={152}
              style={{ height: 52, width: 'auto' }}
            />
          </div>
          <div style={{ fontSize: 9, color: '#C49A5A', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }}>Painel Admin</div>
          <div style={{ fontSize: 11, color: 'rgba(250,247,242,0.40)', marginTop: 4 }}>{profile?.nome ?? 'Administrador'}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: 'rgba(250,247,242,0.7)', textDecoration: 'none', fontSize: 14, marginBottom: 4, transition: 'all 150ms' }}
              className="admin-nav-link">
              <span style={{ fontSize: 16, opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(250,247,242,0.10)' }}>
          <Link href="/desafio"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, color: '#C49A5A', textDecoration: 'none', fontSize: 13 }}>
            ← Ver app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 28px' }}>
          {children}
        </div>
      </main>

      <style>{`
        .admin-nav-link:hover { background: rgba(250,247,242,0.10) !important; color: #FAF7F2 !important; }
      `}</style>
    </div>
  )
}

export const dynamic = 'force-dynamic'
