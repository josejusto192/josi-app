import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

const TIPO_ICON: Record<string, string> = {
  treino: '🏋️', meditacao: '🧘', nutricao: '🥗', mentalidade: '🧠', descanso: '😴',
}

export default async function AdminDesafioPage() {
  const supabase = createAdminClient()
  const { data: days } = await supabase.from('challenge_days').select('*').order('day')

  // Stats
  const { count: totalUsers } = await supabase.from('challenge_enrollments').select('*', { count: 'exact', head: true })
  const { count: totalCompleted } = await supabase.from('challenge_progress').select('*', { count: 'exact', head: true }).eq('completed', true)

  const dayMap = new Map((days ?? []).map(d => [d.day, d]))
  const filled = (days ?? []).length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 600, color: '#2F4A3B', margin: '0 0 6px' }}>
          Desafio 21 Dias
        </h1>
        <p style={{ color: '#6B7F63', fontSize: 14, margin: 0 }}>
          Clique em qualquer dia para editar título, vídeo, descrição e dica.
        </p>
      </div>

      {/* Stats rápidas */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Dias preenchidos', value: `${filled}/21`, color: '#2F4A3B' },
          { label: 'Alunas inscritas', value: totalUsers ?? 0, color: '#6B7F63' },
          { label: 'Dias concluídos', value: totalCompleted ?? 0, color: '#C49A5A' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#FAF7F2', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(47,74,59,0.08)' }}>
            <div style={{ fontSize: 11, color: '#6B7F63', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 26, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Grade dos 21 dias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        {Array.from({ length: 21 }, (_, i) => i + 1).map(day => {
          const d = dayMap.get(day)
          const ok = !!d?.titulo
          return (
            <Link key={day} href={`/admin/desafio/${day}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#FAF7F2', borderRadius: 16, padding: '16px 18px',
                boxShadow: '0 2px 8px rgba(47,74,59,0.08)',
                border: ok ? '2px solid #6B7F63' : '2px dashed #DDD5C5',
                cursor: 'pointer', transition: 'transform 150ms, box-shadow 150ms',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: ok ? '#6B7F63' : '#D4E3D8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: ok ? '#FAF7F2' : '#2F4A3B' }}>{day}</span>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: ok ? '#6B7F63' : '#9DB09A', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {ok ? '✓ Publicado' : 'Sem conteúdo'}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#2F4A3B', lineHeight: 1.3, marginBottom: 6 }}>
                  {d?.titulo ?? `Dia ${day} — clique para preencher`}
                </div>
                {d?.tipo && (
                  <div style={{ fontSize: 12, color: '#6B7F63' }}>
                    {TIPO_ICON[d.tipo]} {d.tipo} · {d.duracao_min ?? '—'} min
                  </div>
                )}
                {d?.video_url && (
                  <div style={{ fontSize: 11, color: '#6B7F63', marginTop: 4 }}>▶ Vídeo cadastrado</div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
