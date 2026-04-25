import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

const CAT_ICON: Record<string, string> = {
  cardio: '🏃', forca: '🏋️', mobilidade: '🤸', yoga: '🧘', meditacao: '🧠', alongamento: '🌿',
}
const NIVEL_COLOR: Record<string, string> = {
  iniciante: '#6B7F63', intermediario: '#C49A5A', avancado: '#2F4A3B',
}

export default async function AdminExerciciosPage() {
  const db = createAdminClient()
  const { data: exercises } = await db
    .from('exercises')
    .select('*')
    .order('categoria')
    .order('nome')

  const byCategory: Record<string, typeof exercises> = {}
  ;(exercises ?? []).forEach(e => {
    if (!byCategory[e.categoria]) byCategory[e.categoria] = []
    byCategory[e.categoria]!.push(e)
  })

  const total    = exercises?.length ?? 0
  const premium  = exercises?.filter(e => e.is_premium).length ?? 0
  const cats     = Object.keys(byCategory).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 600, color: '#2F4A3B', margin: '0 0 4px' }}>Exercícios</h1>
          <p style={{ color: '#6B7F63', fontSize: 14, margin: 0 }}>Gerencie o catálogo de exercícios do app</p>
        </div>
        <Link href="/admin/exercicios/novo" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#2F4A3B', borderRadius: 100, padding: '10px 20px', color: '#FAF7F2', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Novo exercício
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total',       value: total,   color: '#2F4A3B' },
          { label: 'Premium',     value: premium, color: '#C49A5A' },
          { label: 'Categorias',  value: cats,    color: '#6B7F63' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#FAF7F2', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(47,74,59,0.08)' }}>
            <div style={{ fontSize: 11, color: '#6B7F63', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: '48px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(47,74,59,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏋️</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: '#2F4A3B', marginBottom: 8 }}>Catálogo vazio</div>
          <div style={{ fontSize: 13, color: '#6B7F63', marginBottom: 20 }}>Adicione o primeiro exercício para começar</div>
          <Link href="/admin/exercicios/novo" style={{ textDecoration: 'none', background: '#2F4A3B', borderRadius: 100, padding: '10px 24px', color: '#FAF7F2', fontSize: 14, fontWeight: 600 }}>
            + Criar exercício
          </Link>
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>{CAT_ICON[cat] ?? '🏃'}</span>
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', textTransform: 'capitalize' }}>{cat}</span>
              <span style={{ fontSize: 12, color: '#6B7F63' }}>({items?.length ?? 0})</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10 }}>
              {(items ?? []).map(ex => (
                <Link key={ex.id} href={`/admin/exercicios/${ex.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#FAF7F2', borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 8px rgba(47,74,59,0.07)', cursor: 'pointer', border: ex.is_premium ? '2px solid #C49A5A' : '2px solid transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#2F4A3B', lineHeight: 1.2 }}>{ex.nome}</div>
                      {ex.is_premium && <span style={{ fontSize: 9, fontWeight: 700, color: '#7A5020', background: '#F5E6CE', padding: '2px 7px', borderRadius: 100, flexShrink: 0 }}>PREMIUM</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#D4E3D8', color: NIVEL_COLOR[ex.nivel] ?? '#6B7F63', fontWeight: 600 }}>{ex.nivel}</span>
                      {ex.duracao_min && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#F3E9DC', color: '#6B7F63' }}>⏱ {ex.duracao_min}min</span>}
                      {ex.video_url && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#F3E9DC', color: '#6B7F63' }}>▶ Vídeo</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
export const dynamic = 'force-dynamic'
