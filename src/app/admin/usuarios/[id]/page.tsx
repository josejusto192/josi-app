import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = createAdminClient()

  const [{ data: profile }, { data: enrollment }, { data: progress }, { data: habits }, { data: measures }] = await Promise.all([
    db.from('profiles').select('*').eq('id', id).single(),
    db.from('challenge_enrollments').select('*').eq('user_id', id).maybeSingle(),
    db.from('challenge_progress').select('*').eq('user_id', id).order('day'),
    db.from('habits_log').select('*').eq('user_id', id).order('date', { ascending: false }).limit(30),
    db.from('measurements').select('*').eq('user_id', id).order('date', { ascending: false }),
  ])

  if (!profile) notFound()

  const doneDays   = (progress ?? []).filter((p: { completed: boolean }) => p.completed).length
  const lastMeasure = measures?.[0]
  const weightLost = profile.peso_inicial && lastMeasure?.peso
    ? +(profile.peso_inicial - lastMeasure.peso).toFixed(1)
    : null

  // Habit stats (last 30 logs)
  const hab = habits ?? []
  const habTotal = hab.length || 1
  const habStats = {
    agua:     Math.round(hab.filter((h: { agua: boolean }) => h.agua).length     / habTotal * 100),
    proteina: Math.round(hab.filter((h: { proteina: boolean }) => h.proteina).length / habTotal * 100),
    passos:   Math.round(hab.filter((h: { passos: boolean }) => h.passos).length   / habTotal * 100),
    treino:   Math.round(hab.filter((h: { treino: boolean }) => h.treino).length   / habTotal * 100),
  }

  return (
    <div>
      {/* Back */}
      <Link href="/admin/usuarios" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6B7F63', textDecoration: 'none', fontSize: 13, marginBottom: 20 }}>
        ← Voltar para usuárias
      </Link>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#2F4A3B,#2F4A3B)', borderRadius: 20, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(212,169,106,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: 26, color: '#C49A5A', fontWeight: 600 }}>
            {(profile.nome ?? 'U')[0].toUpperCase()}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 600, color: '#FAF7F2' }}>{profile.nome ?? 'Sem nome'}</div>
          <div style={{ fontSize: 13, color: 'rgba(253,248,243,0.6)', marginTop: 3 }}>
            Cadastrada em {new Date(profile.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, textAlign: 'center' }}>
          {[
            { label: 'Dias feitos',  value: `${doneDays}/21`, color: '#C49A5A' },
            { label: 'Peso inicial', value: profile.peso_inicial ? `${profile.peso_inicial}kg` : '—', color: '#FAF7F2' },
            { label: 'Perdeu',       value: weightLost !== null && weightLost > 0 ? `−${weightLost}kg` : '—', color: '#6B7F63' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(253,248,243,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Perfil do onboarding */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', marginBottom: 16 }}>Perfil (onboarding)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Idade',         value: profile.idade ? `${profile.idade} anos` : '—' },
              { label: 'Altura',        value: profile.altura ? `${profile.altura} cm` : '—' },
              { label: 'IMC',           value: profile.imc ?? '—' },
              { label: 'Objetivo',      value: profile.objetivo ?? '—' },
              { label: 'Nível',         value: profile.nivel_atividade ?? '—' },
              { label: 'Dias/semana',   value: profile.dias_semana ? `${profile.dias_semana}x` : '—' },
              { label: 'Condições',     value: (profile.condicoes_saude ?? []).join(', ') || 'nenhuma' },
              { label: 'Motivação',     value: profile.motivacao ?? '—' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#6B7F63', minWidth: 90, fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontSize: 13, color: '#2F4A3B', flex: 1 }}>{String(row.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hábitos + medidas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Hábitos */}
          <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', marginBottom: 14 }}>Hábitos (últimos 30 dias)</div>
            {[
              { label: '💧 Água',     value: habStats.agua,     color: '#6BA3BE' },
              { label: '🥩 Proteína', value: habStats.proteina, color: '#2F4A3B' },
              { label: '👟 Passos',   value: habStats.passos,   color: '#6B7F63' },
              { label: '🏋️ Treino',  value: habStats.treino,   color: '#C49A5A' },
            ].map(h => (
              <div key={h.label} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: '#2F4A3B' }}>{h.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: h.color }}>{h.value}%</span>
                </div>
                <div style={{ height: 5, background: '#D4E3D8', borderRadius: 3 }}>
                  <div style={{ width: `${h.value}%`, height: '100%', background: h.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
            {hab.length === 0 && <div style={{ fontSize: 13, color: '#9DB09A' }}>Sem registros ainda</div>}
          </div>

          {/* Medidas */}
          {(measures ?? []).length > 0 && (
            <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', marginBottom: 14 }}>Último registro de medidas</div>
              <div style={{ fontSize: 11, color: '#6B7F63', marginBottom: 10 }}>
                {new Date(measures![0].date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Peso',    value: measures![0].peso,   unit: 'kg' },
                  { label: 'Cintura', value: measures![0].cintura, unit: 'cm' },
                  { label: 'Quadril', value: measures![0].quadril, unit: 'cm' },
                  { label: 'Coxa',    value: measures![0].coxa,   unit: 'cm' },
                ].filter(m => m.value).map(m => (
                  <div key={m.label} style={{ background: '#F3E9DC', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: '#6B7F63', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: '#2F4A3B', fontWeight: 600 }}>{m.value} <span style={{ fontSize: 12 }}>{m.unit}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desafio grid */}
      <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B' }}>Progresso no desafio</div>
            {enrollment && (
              <div style={{ fontSize: 12, color: '#6B7F63', marginTop: 2 }}>
                Iniciado em {new Date(enrollment.start_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
              </div>
            )}
          </div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 600, color: '#2F4A3B' }}>{doneDays}/21</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
          {Array.from({ length: 21 }, (_, i) => {
            const day  = i + 1
            const prog = (progress ?? []).find((p: { day: number }) => p.day === day)
            const done = prog?.completed ?? false
            return (
              <div key={day} title={done ? `Dia ${day} ✓ ${prog?.completed_at ? new Date(prog.completed_at).toLocaleDateString('pt-BR') : ''}` : `Dia ${day}`}
                style={{ aspectRatio: '1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? '#6B7F63' : '#D4E3D8', border: done ? 'none' : '1px solid #DDD5C5' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: done ? '#FAF7F2' : '#C4B0A8' }}>{done ? '✓' : day}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Anotações dos dias */}
      {(progress ?? []).filter((p: { anotacao: string | null }) => p.anotacao).length > 0 && (
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', marginBottom: 16 }}>📝 Anotações da aluna</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(progress ?? []).filter((p: { anotacao: string | null }) => p.anotacao).map((p: { day: number; anotacao: string | null; completed_at: string | null }) => (
              <div key={p.day} style={{ background: '#F3E9DC', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Dia {p.day}</div>
                <div style={{ fontSize: 13, color: '#2F4A3B', lineHeight: 1.5 }}>{p.anotacao}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
