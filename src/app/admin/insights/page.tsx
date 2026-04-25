import { createAdminClient } from '@/lib/supabase/admin'

function Bar({ value, max, color = '#2F4A3B', label }: { value: number; max: number; color?: string; label?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <div style={{ fontSize: 12, color: '#2F4A3B', marginBottom: 3 }}>{label}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 8, background: '#D4E3D8', borderRadius: 4 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
        </div>
        <span style={{ fontSize: 12, color: '#6B7F63', minWidth: 24, textAlign: 'right' }}>{value}</span>
      </div>
    </div>
  )
}

export default async function InsightsPage() {
  const db = createAdminClient()

  const month30 = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const week7   = new Date(Date.now() - 7  * 86400000).toISOString().split('T')[0]

  const [
    { data: allProfiles },
    { data: enrollments },
    { data: allProgress },
    { data: habits30 },
    { data: measurements },
    { data: communityPosts },
  ] = await Promise.all([
    db.from('profiles').select('id,nome,objetivo,nivel_atividade,dias_semana,peso_inicial,created_at').eq('is_admin', false),
    db.from('challenge_enrollments').select('user_id,start_date'),
    db.from('challenge_progress').select('user_id,day,completed').eq('completed', true),
    db.from('habits_log').select('user_id,date,agua,proteina,passos,treino').gte('date', month30),
    db.from('measurements').select('user_id,date,peso').order('date', { ascending: false }),
    db.from('community_posts').select('id,user_id,created_at,likes_count').eq('is_deleted', false),
  ])

  const profiles   = allProfiles   ?? []
  const enrollMap  = new Map((enrollments ?? []).map((e: { user_id: string; start_date: string }) => [e.user_id, e]))
  const total      = profiles.length || 1

  // --- Objetivos ---
  const objetivoCounts: Record<string, number> = {}
  profiles.forEach((p: { objetivo: string | null }) => {
    const k = p.objetivo ?? 'não informado'
    objetivoCounts[k] = (objetivoCounts[k] || 0) + 1
  })

  // --- Nível de atividade ---
  const nivelCounts: Record<string, number> = {}
  profiles.forEach((p: { nivel_atividade: string | null }) => {
    const k = p.nivel_atividade ?? 'não informado'
    nivelCounts[k] = (nivelCounts[k] || 0) + 1
  })

  // --- Disponibilidade semanal ---
  const diasCounts: Record<string, number> = {}
  profiles.forEach((p: { dias_semana: number | null }) => {
    const k = p.dias_semana ? `${p.dias_semana}x/sem` : '?'
    diasCounts[k] = (diasCounts[k] || 0) + 1
  })

  // --- Progresso por dia (funil) ---
  const dayCounts: Record<number, number> = {}
  ;(allProgress ?? []).forEach((p: { day: number }) => { dayCounts[p.day] = (dayCounts[p.day] || 0) + 1 })
  const maxDay = Math.max(...Object.values(dayCounts), 1)

  // --- Hábitos 30 dias ---
  const hab = habits30 ?? []
  const habTotal = hab.length || 1
  const habRates = {
    '💧 Água':     Math.round(hab.filter((h: { agua: boolean }) => h.agua).length     / habTotal * 100),
    '🥩 Proteína': Math.round(hab.filter((h: { proteina: boolean }) => h.proteina).length / habTotal * 100),
    '👟 Passos':   Math.round(hab.filter((h: { passos: boolean }) => h.passos).length   / habTotal * 100),
    '🏋️ Treino':  Math.round(hab.filter((h: { treino: boolean }) => h.treino).length   / habTotal * 100),
  }

  // --- Active users: habit last 7 days ---
  const activeSet = new Set((habits30 ?? []).filter((h: { date: string }) => h.date >= week7).map((h: { user_id: string }) => h.user_id))

  // --- Engajamento comunidade ---
  const postCount   = (communityPosts ?? []).length
  const totalLikes  = (communityPosts ?? []).reduce((s: number, p: { likes_count: number }) => s + (p.likes_count || 0), 0)
  const postersSet  = new Set((communityPosts ?? []).map((p: { user_id: string }) => p.user_id))

  // --- Peso médio perdido ---
  const weightLosses: number[] = []
  profiles.forEach((p: { id: string; peso_inicial: number | null }) => {
    if (!p.peso_inicial) return
    const userMeasures = (measurements ?? []).filter((m: { user_id: string }) => m.user_id === p.id)
    if (userMeasures.length === 0) return
    const latest = userMeasures[0]
    const diff = p.peso_inicial - latest.peso
    if (diff > 0) weightLosses.push(diff)
  })
  const avgLoss = weightLosses.length > 0
    ? (weightLosses.reduce((a, b) => a + b, 0) / weightLosses.length).toFixed(1)
    : null

  // --- Retenção ---
  const enrolled = enrollments?.length ?? 0
  const completedAll = (() => {
    const m: Record<string, number> = {}
    ;(allProgress ?? []).forEach((p: { user_id: string }) => { m[p.user_id] = (m[p.user_id] || 0) + 1 })
    return Object.values(m).filter(v => v >= 21).length
  })()
  const reached7  = Object.values(dayCounts).filter((_, i) => i + 1 === 7)[0] ?? (dayCounts[7] || 0)
  const reached14 = dayCounts[14] || 0

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 600, color: '#2F4A3B', margin: '0 0 4px' }}>Insights</h1>
        <p style={{ color: '#6B7F63', fontSize: 14, margin: 0 }}>Análise profunda do comportamento das alunas</p>
      </div>

      {/* Retenção */}
      <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 24, boxShadow: '0 2px 10px rgba(47,74,59,0.08)', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Funil de retenção do desafio</div>
        <div style={{ fontSize: 12, color: '#6B7F63', marginBottom: 20 }}>De quantas que iniciaram, quantas chegaram até cada marco</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {[
            { label: 'Inscritas',   value: enrolled,     color: '#C49A5A' },
            { label: 'Dia 7',       value: reached7,     color: '#2F4A3B' },
            { label: 'Dia 14',      value: reached14,    color: '#A06858' },
            { label: 'Concluíram',  value: completedAll, color: '#6B7F63' },
            { label: 'Ativas/sem',  value: activeSet.size, color: '#6A8E5C' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', background: '#F3E9DC', borderRadius: 14, padding: '16px 10px' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 600, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#6B7F63', marginTop: 4 }}>{s.label}</div>
              {enrolled > 0 && <div style={{ fontSize: 10, color: '#9DB09A', marginTop: 2 }}>{Math.round(s.value / enrolled * 100)}%</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Perfil das alunas */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 24, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Perfil das alunas</div>
          <div style={{ fontSize: 12, color: '#6B7F63', marginBottom: 18 }}>Objetivos declarados no onboarding</div>
          {Object.entries(objetivoCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
            <Bar key={k} label={k} value={v} max={total} color="#2F4A3B" />
          ))}
          {Object.keys(objetivoCounts).length === 0 && <div style={{ fontSize: 13, color: '#9DB09A' }}>Sem dados</div>}
        </div>

        {/* Nível de atividade */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 24, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Nível de atividade física</div>
          <div style={{ fontSize: 12, color: '#6B7F63', marginBottom: 18 }}>Como as alunas se descrevem</div>
          {Object.entries(nivelCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
            <Bar key={k} label={k} value={v} max={total} color="#6B7F63" />
          ))}
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginTop: 20, marginBottom: 4 }}>Disponibilidade semanal</div>
          <div style={{ fontSize: 12, color: '#6B7F63', marginBottom: 12 }}>Dias por semana disponíveis</div>
          {Object.entries(diasCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
            <Bar key={k} label={k} value={v} max={total} color="#C49A5A" />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Hábitos */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 24, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Adesão aos hábitos</div>
          <div style={{ fontSize: 12, color: '#6B7F63', marginBottom: 18 }}>Últimos 30 dias — % de dias cumpridos</div>
          {Object.entries(habRates).map(([k, v]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#2F4A3B' }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#2F4A3B' }}>{v}%</span>
              </div>
              <div style={{ height: 8, background: '#D4E3D8', borderRadius: 4 }}>
                <div style={{ width: `${v}%`, height: '100%', background: '#2F4A3B', borderRadius: 4 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '12px 14px', background: '#F3E9DC', borderRadius: 12 }}>
            <div style={{ fontSize: 11, color: '#6B7F63', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registros de hábitos (30d)</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 24, color: '#2F4A3B', fontWeight: 600 }}>{habits30?.length ?? 0}</div>
          </div>
        </div>

        {/* Métricas de peso + comunidade */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)', flex: 1 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginBottom: 14 }}>Resultados de peso</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1, background: '#F3E9DC', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 26, fontWeight: 600, color: '#6B7F63' }}>{avgLoss ?? '—'}</div>
                <div style={{ fontSize: 11, color: '#6B7F63', marginTop: 3 }}>kg perdidos (média)</div>
              </div>
              <div style={{ flex: 1, background: '#F3E9DC', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 26, fontWeight: 600, color: '#2F4A3B' }}>{weightLosses.length}</div>
                <div style={{ fontSize: 11, color: '#6B7F63', marginTop: 3 }}>com resultado</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)', flex: 1 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginBottom: 14 }}>Comunidade</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'Posts',       value: postCount,       color: '#C49A5A' },
                { label: 'Curtidas',    value: totalLikes,      color: '#2F4A3B' },
                { label: 'Publicaram',  value: postersSet.size, color: '#6B7F63' },
              ].map(s => (
                <div key={s.label} style={{ background: '#F3E9DC', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#6B7F63', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Funil por dia */}
      <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 24, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Conclusões por dia do desafio</div>
        <div style={{ fontSize: 12, color: '#6B7F63', marginBottom: 16 }}>Quantas alunas concluíram cada dia</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21,1fr)', gap: 4, alignItems: 'end', height: 80 }}>
          {Array.from({ length: 21 }, (_, i) => {
            const count = dayCounts[i + 1] ?? 0
            const h = maxDay > 0 ? Math.max(Math.round((count / maxDay) * 72), count > 0 ? 4 : 2) : 2
            return (
              <div key={i} title={`Dia ${i + 1}: ${count}`} style={{ alignSelf: 'flex-end' }}>
                <div style={{ height: h, background: count > 0 ? `hsl(${12 + (count / maxDay) * 20}, 55%, 60%)` : '#D4E3D8', borderRadius: '3px 3px 0 0' }} />
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {[1, 7, 14, 21].map(d => (
            <span key={d} style={{ fontSize: 10, color: '#9DB09A' }}>Dia {d}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
