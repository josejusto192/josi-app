import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminUsuariosPage() {
  const supabase = createAdminClient()

  const [{ data: profiles }, { data: enrollments }, { data: progressData }] = await Promise.all([
    supabase.from('profiles').select('id,nome,onboarding_completed,created_at,objetivo,peso_inicial').eq('is_admin', false).order('created_at', { ascending: false }),
    supabase.from('challenge_enrollments').select('user_id,start_date'),
    supabase.from('challenge_progress').select('user_id').eq('completed', true),
  ])

  const enrollMap = new Map((enrollments ?? []).map(e => [e.user_id, e]))
  const countDone = (uid: string) => (progressData ?? []).filter(p => p.user_id === uid).length

  const total = profiles?.length ?? 0
  const comDesafio = (enrollments ?? []).length
  const semOnboarding = (profiles ?? []).filter(p => !p.onboarding_completed).length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 600, color: '#4A2E22', margin: '0 0 6px' }}>
          Usuários
        </h1>
        <p style={{ color: '#8A6A5A', fontSize: 14, margin: 0 }}>Acompanhe o progresso de cada aluna no desafio.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total cadastradas', value: total,         color: '#C9826B' },
          { label: 'No desafio',        value: comDesafio,    color: '#8A9E7B' },
          { label: 'Sem onboarding',    value: semOnboarding, color: '#D4A96A' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#FDF8F3', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(74,46,34,0.08)' }}>
            <div style={{ fontSize: 11, color: '#8A6A5A', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(profiles ?? []).map(p => {
          const enrollment = enrollMap.get(p.id)
          const done       = countDone(p.id)
          const pct        = Math.round((done / 21) * 100)

          return (
            <div key={p.id} style={{ background: '#FDF8F3', borderRadius: 16, padding: '16px 20px', boxShadow: '0 2px 8px rgba(74,46,34,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Avatar */}
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F0D5C8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#C9826B', fontWeight: 600 }}>
                    {(p.nome ?? 'U')[0].toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#4A2E22', marginBottom: 2 }}>{p.nome ?? 'Sem nome'}</div>
                  <div style={{ fontSize: 12, color: '#8A6A5A' }}>
                    {enrollment
                      ? `Desafio desde ${new Date(enrollment.start_date).toLocaleDateString('pt-BR')}`
                      : 'Ainda não iniciou o desafio'}
                    {p.objetivo && ` · objetivo: ${p.objetivo}`}
                  </div>
                  {/* Barra de progresso */}
                  {enrollment && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ height: 4, background: '#F0D5C8', borderRadius: 2 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#C9826B,#D4A96A)', borderRadius: 2, transition: 'width 600ms' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Dias feitos */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: done > 0 ? '#C9826B' : '#C4B0A8' }}>{done}/21</div>
                  <div style={{ fontSize: 10, color: '#8A6A5A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>dias</div>
                </div>
              </div>
            </div>
          )
        })}

        {total === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8A6A5A', fontSize: 14 }}>
            Nenhuma usuária cadastrada ainda.
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
