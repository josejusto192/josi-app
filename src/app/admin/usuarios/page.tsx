import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function AdminUsuariosPage() {
  const db = createAdminClient()

  const [{ data: profiles }, { data: enrollments }, { data: progressData }, { data: habitsData }] = await Promise.all([
    db.from('profiles').select('id,nome,objetivo,nivel_atividade,peso_inicial,created_at,onboarding_completed').eq('is_admin', false).order('created_at', { ascending: false }),
    db.from('challenge_enrollments').select('user_id,start_date'),
    db.from('challenge_progress').select('user_id').eq('completed', true),
    db.from('habits_log').select('user_id').gte('date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]),
  ])

  const enrollMap   = new Map((enrollments ?? []).map((e: { user_id: string; start_date: string }) => [e.user_id, e.start_date]))
  const countDays   = (uid: string) => (progressData ?? []).filter((p: { user_id: string }) => p.user_id === uid).length
  const activeSet   = new Set((habitsData ?? []).map((h: { user_id: string }) => h.user_id))

  const total       = profiles?.length ?? 0
  const withDesafio = (enrollments ?? []).length
  const activeWeek  = activeSet.size
  const noBoarding  = (profiles ?? []).filter((p: { onboarding_completed: boolean }) => !p.onboarding_completed).length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 600, color: '#2F4A3B', margin: '0 0 4px' }}>Usuárias</h1>
        <p style={{ color: '#6B7F63', fontSize: 14, margin: 0 }}>Gerencie e acompanhe o progresso de cada aluna</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total cadastradas', value: total,       color: '#2F4A3B' },
          { label: 'No desafio',        value: withDesafio, color: '#6B7F63' },
          { label: 'Ativas esta semana',value: activeWeek,  color: '#C49A5A' },
          { label: 'Sem onboarding',    value: noBoarding,  color: '#9DB09A' },
        ].map(s => (
          <div key={s.label} style={{ background: '#FAF7F2', borderRadius: 16, padding: '18px 20px', boxShadow: '0 2px 8px rgba(47,74,59,0.08)' }}>
            <div style={{ fontSize: 11, color: '#6B7F63', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 30, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ background: '#FAF7F2', borderRadius: 18, boxShadow: '0 2px 10px rgba(47,74,59,0.08)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 12, padding: '12px 20px', borderBottom: '2px solid #F0E4DC', background: '#FAF7F2' }}>
          {['Aluna', 'Objetivo', 'Progresso', 'Status', ''].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: '#6B7F63', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {(profiles ?? []).map((p: { id: string; nome: string | null; objetivo: string | null; nivel_atividade: string | null; peso_inicial: number | null; created_at: string; onboarding_completed: boolean }, idx: number) => {
          const done       = countDays(p.id)
          const pct        = Math.round((done / 21) * 100)
          const startDate  = enrollMap.get(p.id)
          const isActive   = activeSet.has(p.id)

          return (
            <Link key={p.id} href={`/admin/usuarios/${p.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 12, padding: '14px 20px', borderBottom: idx < (profiles?.length ?? 0) - 1 ? '1px solid #F0E4DC' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 150ms' }}>
                {/* Nome */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: isActive ? '#D6E4CE' : '#D4E3D8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Cinzel',serif", fontSize: 15, color: isActive ? '#3A5A42' : '#2F4A3B', fontWeight: 600 }}>
                      {(p.nome ?? 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#2F4A3B' }}>{p.nome ?? 'Sem nome'}</div>
                    <div style={{ fontSize: 11, color: '#9DB09A' }}>
                      {startDate ? `desde ${new Date(startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}` : 'não iniciou'}
                    </div>
                  </div>
                </div>

                {/* Objetivo */}
                <div style={{ fontSize: 13, color: '#2F4A3B' }}>{p.objetivo ?? '—'}</div>

                {/* Progresso */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#2F4A3B' }}>{done}/21</span>
                    <span style={{ fontSize: 11, color: '#9DB09A' }}>dias</span>
                  </div>
                  <div style={{ height: 5, background: '#D4E3D8', borderRadius: 3 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#2F4A3B,#C49A5A)', borderRadius: 3 }} />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100,
                    background: isActive ? '#D6E4CE' : done === 21 ? '#D4E3D8' : '#F3E9DC',
                    color: isActive ? '#3A5A42' : done === 21 ? '#2F4A3B' : '#6B7F63',
                  }}>
                    {done === 21 ? '🏆 Completo' : isActive ? '● Ativa' : startDate ? '○ Pausada' : 'Sem desafio'}
                  </span>
                </div>

                {/* Ver */}
                <div style={{ textAlign: 'right', fontSize: 12, color: '#2F4A3B' }}>Ver →</div>
              </div>
            </Link>
          )
        })}

        {total === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6B7F63', fontSize: 14 }}>
            Nenhuma aluna cadastrada ainda.
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
