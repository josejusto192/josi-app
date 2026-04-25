import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

function StatCard({ label, value, sub, color = '#2F4A3B', href }: { label: string; value: string | number; sub?: string; color?: string; href?: string }) {
  const card = (
    <div style={{ background: '#FAF7F2', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 10px rgba(47,74,59,0.08)', cursor: href ? 'pointer' : 'default' }}>
      <div style={{ fontSize: 11, color: '#6B7F63', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 32, fontWeight: 600, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#9DB09A', marginTop: 6 }}>{sub}</div>}
    </div>
  )
  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{card}</Link> : card
}

function MiniBar({ value, max, color = '#2F4A3B' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#D4E3D8', borderRadius: 3 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, color: '#6B7F63', width: 32, textAlign: 'right' }}>{pct}%</span>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const db = createAdminClient()

  const weekAgo  = new Date(Date.now() - 7 * 86400000).toISOString()
  const weekDate = weekAgo.split('T')[0]
  const monthDate = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]

  const [
    { count: totalUsers },
    { count: newThisWeek },
    { count: enrolled },
    { data: activeData },
    { data: allProgress },
    { data: habitData },
    { data: recentUsers },
    { data: dayData },
  ] = await Promise.all([
    db.from('profiles').select('*', { count: 'exact', head: true }).eq('is_admin', false),
    db.from('profiles').select('*', { count: 'exact', head: true }).eq('is_admin', false).gte('created_at', weekAgo),
    db.from('challenge_enrollments').select('*', { count: 'exact', head: true }),
    db.from('habits_log').select('user_id').gte('date', weekDate),
    db.from('challenge_progress').select('user_id').eq('completed', true),
    db.from('habits_log').select('agua,proteina,passos,treino').gte('date', monthDate),
    db.from('profiles').select('id,nome,created_at,objetivo').eq('is_admin', false).order('created_at', { ascending: false }).limit(5),
    db.from('challenge_progress').select('day').eq('completed', true),
  ])

  // Active users this week (unique)
  const activeCount = new Set((activeData ?? []).map((h: { user_id: string }) => h.user_id)).size

  // Users who completed all 21 days
  const userDayCount: Record<string, number> = {}
  ;(allProgress ?? []).forEach((p: { user_id: string }) => { userDayCount[p.user_id] = (userDayCount[p.user_id] || 0) + 1 })
  const completedAll = Object.values(userDayCount).filter(v => v >= 21).length
  const avgDays = totalUsers && totalUsers > 0
    ? Math.round(Object.values(userDayCount).reduce((a, b) => a + b, 0) / (totalUsers || 1))
    : 0

  // Habit rates
  const habits = habitData ?? []
  const total  = habits.length || 1
  const habitRates = {
    agua:     Math.round(habits.filter((h: { agua: boolean }) => h.agua).length     / total * 100),
    proteina: Math.round(habits.filter((h: { proteina: boolean }) => h.proteina).length / total * 100),
    passos:   Math.round(habits.filter((h: { passos: boolean }) => h.passos).length   / total * 100),
    treino:   Math.round(habits.filter((h: { treino: boolean }) => h.treino).length   / total * 100),
  }

  // Per-day completions
  const dayCounts: Record<number, number> = {}
  ;(dayData ?? []).forEach((p: { day: number }) => { dayCounts[p.day] = (dayCounts[p.day] || 0) + 1 })
  const maxDayCount = Math.max(...Object.values(dayCounts), 1)

  // Hardest days (least completed)
  const hardestDays = Array.from({ length: 21 }, (_, i) => i + 1)
    .map(day => ({ day, count: dayCounts[day] ?? 0 }))
    .filter(d => d.count >= 0)
    .sort((a, b) => a.count - b.count)
    .slice(0, 5)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 600, color: '#2F4A3B', margin: '0 0 4px' }}>Dashboard</h1>
        <p style={{ color: '#6B7F63', fontSize: 14, margin: 0 }}>Visão geral do app · atualizado em tempo real</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total de alunas"      value={totalUsers ?? 0}  sub="cadastradas"              color="#2F4A3B" href="/admin/usuarios" />
        <StatCard label="Novas esta semana"    value={newThisWeek ?? 0} sub="últimos 7 dias"            color="#C49A5A" />
        <StatCard label="Ativas esta semana"   value={activeCount}      sub="registraram hábitos"       color="#6B7F63" href="/admin/insights" />
        <StatCard label="No desafio"           value={enrolled ?? 0}    sub={`${completedAll} completos`} color="#7A5020" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Hábitos */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Adesão aos hábitos</div>
          <div style={{ fontSize: 12, color: '#6B7F63', marginBottom: 16 }}>Últimos 30 dias · % dias cumprido</div>
          {[
            { label: '💧 Água',     value: habitRates.agua,     color: '#6BA3BE' },
            { label: '🥩 Proteína', value: habitRates.proteina, color: '#2F4A3B' },
            { label: '👟 Passos',   value: habitRates.passos,   color: '#6B7F63' },
            { label: '🏋️ Treino',  value: habitRates.treino,   color: '#C49A5A' },
          ].map(h => (
            <div key={h.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#2F4A3B' }}>{h.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: h.color }}>{h.value}%</span>
              </div>
              <MiniBar value={h.value} max={100} color={h.color} />
            </div>
          ))}
        </div>

        {/* Progresso médio */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Progresso no desafio</div>
          <div style={{ fontSize: 12, color: '#6B7F63', marginBottom: 20 }}>Distribuição de conclusão por dia</div>

          {/* Big stat */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 36, fontWeight: 600, color: '#2F4A3B' }}>{avgDays}</div>
              <div style={{ fontSize: 11, color: '#6B7F63', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Média dias</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 36, fontWeight: 600, color: '#6B7F63' }}>{completedAll}</div>
              <div style={{ fontSize: 11, color: '#6B7F63', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completos</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 36, fontWeight: 600, color: '#C49A5A' }}>{enrolled ?? 0}</div>
              <div style={{ fontSize: 11, color: '#6B7F63', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inscritas</div>
            </div>
          </div>

          {/* Mini day bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 48 }}>
            {Array.from({ length: 21 }, (_, i) => {
              const count = dayCounts[i + 1] ?? 0
              const h = maxDayCount > 0 ? Math.round((count / maxDayCount) * 44) : 0
              return (
                <div key={i} title={`Dia ${i + 1}: ${count} alunas`} style={{ flex: 1, height: h || 2, background: count > 0 ? '#2F4A3B' : '#D4E3D8', borderRadius: 3, alignSelf: 'flex-end' }} />
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#9DB09A' }}>Dia 1</span>
            <span style={{ fontSize: 10, color: '#9DB09A' }}>Dia 21</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Dias mais difíceis */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Dias com menor adesão</div>
          <div style={{ fontSize: 12, color: '#6B7F63', marginBottom: 16 }}>Onde as alunas mais abandonam</div>
          {hardestDays.map(({ day, count }) => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#D4E3D8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2F4A3B' }}>{day}</span>
              </div>
              <div style={{ flex: 1 }}>
                <MiniBar value={count} max={Math.max(maxDayCount, 1)} color="#2F4A3B" />
              </div>
              <span style={{ fontSize: 12, color: '#6B7F63', width: 28, textAlign: 'right' }}>{count}</span>
            </div>
          ))}
          {hardestDays.length === 0 && <div style={{ fontSize: 13, color: '#9DB09A', textAlign: 'center', padding: '20px 0' }}>Sem dados ainda</div>}
        </div>

        {/* Últimas alunas */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B' }}>Novas alunas</div>
              <div style={{ fontSize: 12, color: '#6B7F63' }}>Últimas cadastradas</div>
            </div>
            <Link href="/admin/usuarios" style={{ fontSize: 12, color: '#2F4A3B', textDecoration: 'none' }}>Ver todas →</Link>
          </div>
          {(recentUsers ?? []).map((u: { id: string; nome: string | null; created_at: string; objetivo: string | null }) => (
            <Link key={u.id} href={`/admin/usuarios/${u.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #F0E4DC' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#D4E3D8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: '#2F4A3B', fontWeight: 600 }}>
                    {(u.nome ?? 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#2F4A3B' }}>{u.nome ?? 'Sem nome'}</div>
                  <div style={{ fontSize: 11, color: '#6B7F63' }}>{u.objetivo ?? '—'}</div>
                </div>
                <div style={{ fontSize: 11, color: '#9DB09A' }}>
                  {new Date(u.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            </Link>
          ))}
          {(recentUsers ?? []).length === 0 && <div style={{ fontSize: 13, color: '#9DB09A', textAlign: 'center', padding: '20px 0' }}>Sem alunas ainda</div>}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
