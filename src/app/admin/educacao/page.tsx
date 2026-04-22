import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

const CAT_LABEL: Record<string, string> = {
  nutricao: '🥗 Nutrição', treino: '🏋️ Treino', mentalidade: '🧠 Mentalidade',
  receitas: '👩‍🍳 Receitas', saude: '❤️ Saúde', estilo_de_vida: '✨ Estilo de vida',
}

export default async function AdminEducacaoPage() {
  const db = createAdminClient()
  const { data: content } = await db
    .from('education_content')
    .select('*')
    .order('categoria')
    .order('ordem')

  const total   = content?.length ?? 0
  const premium = content?.filter(c => c.is_premium).length ?? 0
  const withVideo = content?.filter(c => c.video_url).length ?? 0

  const byCategory: Record<string, typeof content> = {}
  ;(content ?? []).forEach(c => {
    if (!byCategory[c.categoria]) byCategory[c.categoria] = []
    byCategory[c.categoria]!.push(c)
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 600, color: '#4A2E22', margin: '0 0 4px' }}>Educação</h1>
          <p style={{ color: '#8A6A5A', fontSize: 14, margin: 0 }}>Artigos, vídeos e conteúdo educativo do app</p>
        </div>
        <Link href="/admin/educacao/novo" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#C9826B', borderRadius: 100, padding: '10px 20px', color: '#FDF8F3', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Novo conteúdo</div>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total de conteúdos', value: total,     color: '#C9826B' },
          { label: 'Com vídeo',          value: withVideo, color: '#8A9E7B' },
          { label: 'Premium',            value: premium,   color: '#D4A96A' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#FDF8F3', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(74,46,34,0.08)' }}>
            <div style={{ fontSize: 11, color: '#8A6A5A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: '48px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(74,46,34,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#4A2E22', marginBottom: 8 }}>Nenhum conteúdo ainda</div>
          <div style={{ fontSize: 13, color: '#8A6A5A', marginBottom: 20 }}>Crie artigos e vídeos para as alunas aprenderem</div>
          <Link href="/admin/educacao/novo" style={{ textDecoration: 'none', background: '#C9826B', borderRadius: 100, padding: '10px 24px', color: '#FDF8F3', fontSize: 14, fontWeight: 600 }}>
            + Criar conteúdo
          </Link>
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#4A2E22', marginBottom: 10 }}>{CAT_LABEL[cat] ?? cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(items ?? []).map(item => (
                <Link key={item.id} href={`/admin/educacao/${item.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#FDF8F3', borderRadius: 14, padding: '14px 18px', boxShadow: '0 2px 8px rgba(74,46,34,0.07)', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', border: item.is_premium ? '2px solid #D4A96A' : '2px solid transparent' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: item.video_url ? '#D6E4CE' : '#F0D5C8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                      {item.video_url ? '▶' : '📄'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#4A2E22', marginBottom: 3 }}>{item.titulo}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {item.duracao_min && <span style={{ fontSize: 11, color: '#8A6A5A' }}>⏱ {item.duracao_min}min</span>}
                        {item.is_premium && <span style={{ fontSize: 10, fontWeight: 700, color: '#7A5020', background: '#F5E6CE', padding: '1px 7px', borderRadius: 100 }}>PREMIUM</span>}
                        <span style={{ fontSize: 11, color: '#B89B8C' }}>ordem {item.ordem}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#C9826B' }}>Editar →</div>
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
