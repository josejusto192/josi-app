import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#F5EDE3' }}>

      {/* Sidebar */}
      <aside style={{ width: 220, background: '#4A2E22', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(253,248,243,0.1)' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: '#D4A96A' }}>Josi Admin</div>
          <div style={{ fontSize: 11, color: 'rgba(253,248,243,0.45)', marginTop: 3 }}>{profile?.nome ?? 'Administrador'}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: 'rgba(253,248,243,0.7)', textDecoration: 'none', fontSize: 14, marginBottom: 4, transition: 'all 150ms' }}
              className="admin-nav-link">
              <span style={{ fontSize: 16, opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(253,248,243,0.1)' }}>
          <Link href="/desafio" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, color: '#D4A96A', textDecoration: 'none', fontSize: 13 }}>
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
        .admin-nav-link:hover { background: rgba(253,248,243,0.1) !important; color: #FDF8F3 !important; }
      `}</style>
    </div>
  )
}

export const dynamic = 'force-dynamic'
