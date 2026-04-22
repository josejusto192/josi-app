import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

const CAT_ICON: Record<string, string> = {
  cardio: '🏃', forca: '🏋️', mobilidade: '🤸', yoga: '🧘', meditacao: '🧠', alongamento: '🌿',
}
const NIVEL_COLOR: Record<string, string> = {
  iniciante: '#8A9E7B', intermediario: '#D4A96A', avancado: '#C9826B',
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
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 600, color: '#4A2E22', margin: '0 0 4px' }}>Exercícios</h1>
          <p style={{ color: '#8A6A5A', fontSize: 14, margin: 0 }}>Gerencie o catálogo de exercícios do app</p>
        </div>
        <Link href="/admin/exercicios/novo" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#C9826B', borderRadius: 100, padding: '10px 20px', color: '#FDF8F3', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Novo exercício
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total',       value: total,   color: '#C9826B' },
          { label: 'Premium',     value: premium, color: '#D4A96A' },
          { label: 'Categorias',  value: cats,    color: '#8A9E7B' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#FDF8F3', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(74,46,34,0.08)' }}>
            <div style={{ fontSize: 11, color: '#8A6A5A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: '48px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(74,46,34,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏋️</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#4A2E22', marginBottom: 8 }}>Catálogo vazio</div>
          <div style={{ fontSize: 13, color: '#8A6A5A', marginBottom: 20 }}>Adicione o primeiro exercício para começar</div>
          <Link href="/admin/exercicios/novo" style={{ textDecoration: 'none', background: '#C9826B', borderRadius: 100, padding: '10px 24px', color: '#FDF8F3', fontSize: 14, fontWeight: 600 }}>
            + Criar exercício
          </Link>
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>{CAT_ICON[cat] ?? '🏃'}</span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: '#4A2E22', textTransform: 'capitalize' }}>{cat}</span>
              <span style={{ fontSize: 12, color: '#8A6A5A' }}>({items?.length ?? 0})</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10 }}>
              {(items ?? []).map(ex => (
                <Link key={ex.id} href={`/admin/exercicios/${ex.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#FDF8F3', borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 8px rgba(74,46,34,0.07)', cursor: 'pointer', border: ex.is_premium ? '2px solid #D4A96A' : '2px solid transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#4A2E22', lineHeight: 1.2 }}>{ex.nome}</div>
                      {ex.is_premium && <span style={{ fontSize: 9, fontWeight: 700, color: '#7A5020', background: '#F5E6CE', padding: '2px 7px', borderRadius: 100, flexShrink: 0 }}>PREMIUM</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#F0D5C8', color: NIVEL_COLOR[ex.nivel] ?? '#8A6A5A', fontWeight: 600 }}>{ex.nivel}</span>
                      {ex.duracao_min && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#F5EDE3', color: '#8A6A5A' }}>⏱ {ex.duracao_min}min</span>}
                      {ex.video_url && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: '#F5EDE3', color: '#8A9E7B' }}>▶ Vídeo</span>}
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
