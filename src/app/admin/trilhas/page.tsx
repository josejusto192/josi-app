import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function AdminTrilhasPage() {
  const supabase = createAdminClient()

  const { data: trilhas } = await supabase
    .from('trilhas')
    .select('*, desafios(id, titulo, duracao_dias, ordem, is_active)')
    .order('ordem')

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, fontWeight: 600, color: '#2F4A3B', margin: '0 0 6px' }}>Trilhas</h1>
          <p style={{ color: '#6B7F63', fontSize: 14, margin: 0 }}>Gerencie as jornadas de aprendizado das suas alunas.</p>
        </div>
        <Link href="/admin/trilhas/nova" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#2F4A3B', color: '#FAF7F2', borderRadius: 100, padding: '10px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Nova trilha
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(trilhas ?? []).map((trilha, idx) => {
          const desafios = ((trilha.desafios ?? []) as Array<{ id: string; titulo: string; duracao_dias: number; ordem: number; is_active: boolean }>)
            .sort((a, b) => a.ordem - b.ordem)
          const totalDias = desafios.reduce((s, d) => s + d.duracao_dias, 0)
          return (
            <div key={trilha.id} style={{ background: '#FAF7F2', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(47,74,59,0.08)' }}>
              {/* Trilha header */}
              <div style={{ background: idx === 0 ? '#2F4A3B' : '#6B7F63', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(250,247,242,0.55)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 4 }}>Trilha {idx + 1}</div>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 600, color: '#FAF7F2' }}>{trilha.titulo}</div>
                  {trilha.descricao && <div style={{ fontSize: 13, color: 'rgba(250,247,242,0.55)', marginTop: 2 }}>{trilha.descricao}</div>}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ background: 'rgba(250,247,242,0.15)', borderRadius: 100, padding: '4px 12px', fontSize: 12, color: '#FAF7F2' }}>
                    {desafios.length} desafios · {totalDias} dias
                  </div>
                  <Link href={`/admin/trilhas/${trilha.id}`} style={{ textDecoration: 'none', background: '#C49A5A', color: '#FAF7F2', borderRadius: 100, padding: '8px 18px', fontSize: 13, fontWeight: 600 }}>
                    Editar
                  </Link>
                </div>
              </div>

              {/* Desafios da trilha */}
              <div style={{ padding: '16px 24px 20px' }}>
                {desafios.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#9DB09A', fontSize: 13 }}>
                    Nenhum desafio ainda —{' '}
                    <Link href={`/admin/trilhas/${trilha.id}`} style={{ color: '#C49A5A', fontWeight: 600 }}>adicionar desafio</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {desafios.map((d, i) => (
                      <Link key={d.id} href={`/admin/trilhas/${trilha.id}/desafios/${d.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                          background: d.is_active ? '#D4E3D8' : '#EBE0CF',
                          borderRadius: 14, padding: '10px 16px', cursor: 'pointer',
                          border: d.is_active ? '1.5px solid #9DB09A' : '1.5px solid #DDD5C5',
                        }}>
                          <div style={{ fontSize: 10, color: '#6B7F63', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                            #{i + 1} {d.is_active ? '● Ativo' : '○ Inativo'}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#2F4A3B' }}>{d.titulo}</div>
                          <div style={{ fontSize: 12, color: '#6B7F63', marginTop: 2 }}>{d.duracao_dias} dias</div>
                        </div>
                      </Link>
                    ))}
                    <Link href={`/admin/trilhas/${trilha.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'transparent', borderRadius: 14, padding: '10px 16px', border: '1.5px dashed #DDD5C5', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 120, color: '#9DB09A', fontSize: 13 }}>
                        + Desafio
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {(trilhas ?? []).length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9DB09A' }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: '#2F4A3B', marginBottom: 8 }}>Nenhuma trilha criada</div>
            <div style={{ fontSize: 13, marginBottom: 20 }}>Crie a primeira trilha para começar</div>
            <Link href="/admin/trilhas/nova" style={{ textDecoration: 'none', background: '#2F4A3B', color: '#FAF7F2', borderRadius: 100, padding: '12px 28px', fontSize: 14, fontWeight: 600 }}>
              + Criar primeira trilha
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
