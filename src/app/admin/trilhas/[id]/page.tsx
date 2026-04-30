'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Desafio = { id: string; titulo: string; descricao: string | null; duracao_dias: number; ordem: number; is_active: boolean }
type Trilha  = { id: string; titulo: string; descricao: string | null; ordem: number; is_active: boolean }

export default function AdminTrilhaPage() {
  const params  = useParams()
  const router  = useRouter()
  const id      = params.id as string
  const isNova  = id === 'nova'

  const [trilha, setTrilha]         = useState<Trilha>({ id: '', titulo: '', descricao: '', ordem: 1, is_active: true })
  const [desafios, setDesafios]     = useState<Desafio[]>([])
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [newDesafio, setNewDesafio] = useState({ titulo: '', descricao: '', duracao_dias: 21 })
  const [addingD, setAddingD]       = useState(false)
  const [savingD, setSavingD]       = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (isNova) return
    const load = async () => {
      const [{ data: t }, { data: d }] = await Promise.all([
        supabase.from('trilhas').select('*').eq('id', id).single(),
        supabase.from('desafios').select('*').eq('trilha_id', id).order('ordem'),
      ])
      if (t) setTrilha(t)
      setDesafios(d ?? [])
    }
    load()
  }, [id])

  const saveTrilha = async () => {
    setSaving(true)
    if (isNova) {
      const { data } = await supabase.from('trilhas').insert({ titulo: trilha.titulo, descricao: trilha.descricao, ordem: trilha.ordem, is_active: trilha.is_active }).select().single()
      if (data) router.replace(`/admin/trilhas/${data.id}`)
    } else {
      await supabase.from('trilhas').update({ titulo: trilha.titulo, descricao: trilha.descricao, ordem: trilha.ordem, is_active: trilha.is_active }).eq('id', id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addDesafio = async () => {
    setSavingD(true)
    const nextOrdem = desafios.length + 1
    const { data } = await supabase.from('desafios').insert({
      trilha_id: id, titulo: newDesafio.titulo, descricao: newDesafio.descricao,
      duracao_dias: newDesafio.duracao_dias, ordem: nextOrdem, is_active: true,
    }).select().single()
    if (data) setDesafios(prev => [...prev, data])
    setNewDesafio({ titulo: '', descricao: '', duracao_dias: 21 })
    setAddingD(false)
    setSavingD(false)
  }

  const toggleDesafio = async (d: Desafio) => {
    await supabase.from('desafios').update({ is_active: !d.is_active }).eq('id', d.id)
    setDesafios(prev => prev.map(x => x.id === d.id ? { ...x, is_active: !x.is_active } : x))
  }

  const label = (f: string) => ({ fontSize: 12, fontWeight: 600, color: '#6B7F63', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 6, display: 'block' })
  const input = { width: '100%', background: '#F3E9DC', border: '1.5px solid #DDD5C5', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: '#2F4A3B', fontFamily: "'Lato',sans-serif", outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Link href="/admin/trilhas" style={{ textDecoration: 'none', background: '#D4E3D8', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F4A3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 600, color: '#2F4A3B', margin: 0 }}>
            {isNova ? 'Nova Trilha' : trilha.titulo || 'Editar Trilha'}
          </h1>
          <p style={{ color: '#6B7F63', fontSize: 13, margin: '4px 0 0' }}>Configure a trilha e seus desafios</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, alignItems: 'start' }}>

        {/* Left: trilha form */}
        <div style={{ background: '#FAF7F2', borderRadius: 20, padding: 24, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, color: '#2F4A3B', marginBottom: 20 }}>Dados da trilha</div>

          <div style={{ marginBottom: 16 }}>
            <label style={label('t')}>Título</label>
            <input style={input} value={trilha.titulo} onChange={e => setTrilha(p => ({ ...p, titulo: e.target.value }))} placeholder="Ex: Viver Bem — Fase 1" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={label('d')}>Descrição</label>
            <textarea style={{ ...input, minHeight: 70, resize: 'none' }} value={trilha.descricao ?? ''} onChange={e => setTrilha(p => ({ ...p, descricao: e.target.value }))} placeholder="Breve descrição da trilha" />
          </div>

          <div style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={label('o')}>Ordem</label>
              <input style={input} type="number" min={1} value={trilha.ordem} onChange={e => setTrilha(p => ({ ...p, ordem: +e.target.value }))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label('s')}>Status</label>
              <select style={input} value={trilha.is_active ? 'ativo' : 'inativo'} onChange={e => setTrilha(p => ({ ...p, is_active: e.target.value === 'ativo' }))}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <button onClick={saveTrilha} disabled={saving || !trilha.titulo}
            style={{ width: '100%', background: saved ? '#6B7F63' : '#2F4A3B', color: '#FAF7F2', border: 'none', borderRadius: 100, padding: 12, fontSize: 14, fontWeight: 600, fontFamily: "'Lato',sans-serif", cursor: saving ? 'wait' : 'pointer' }}>
            {saving ? 'Salvando…' : saved ? '✓ Salvo!' : 'Salvar trilha'}
          </button>
        </div>

        {/* Right: desafios */}
        {!isNova && (
          <div style={{ background: '#FAF7F2', borderRadius: 20, padding: 24, boxShadow: '0 2px 10px rgba(47,74,59,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, color: '#2F4A3B' }}>Desafios</div>
              <button onClick={() => setAddingD(true)} style={{ background: '#2F4A3B', color: '#FAF7F2', border: 'none', borderRadius: 100, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                + Adicionar
              </button>
            </div>

            {/* Form novo desafio */}
            {addingD && (
              <div style={{ background: '#F3E9DC', borderRadius: 16, padding: 16, marginBottom: 16, border: '1.5px solid #DDD5C5' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#2F4A3B', marginBottom: 12 }}>Novo desafio</div>
                <input style={{ ...input, marginBottom: 10 }} placeholder="Título do desafio" value={newDesafio.titulo} onChange={e => setNewDesafio(p => ({ ...p, titulo: e.target.value }))} />
                <textarea style={{ ...input, minHeight: 60, resize: 'none', marginBottom: 10 }} placeholder="Descrição (opcional)" value={newDesafio.descricao} onChange={e => setNewDesafio(p => ({ ...p, descricao: e.target.value }))} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <label style={{ fontSize: 13, color: '#6B7F63' }}>Duração:</label>
                  <input style={{ ...input, width: 80 }} type="number" min={1} max={365} value={newDesafio.duracao_dias} onChange={e => setNewDesafio(p => ({ ...p, duracao_dias: +e.target.value }))} />
                  <span style={{ fontSize: 13, color: '#6B7F63' }}>dias</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={addDesafio} disabled={savingD || !newDesafio.titulo}
                    style={{ flex: 1, background: '#2F4A3B', color: '#FAF7F2', border: 'none', borderRadius: 100, padding: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {savingD ? 'Salvando…' : 'Salvar'}
                  </button>
                  <button onClick={() => setAddingD(false)}
                    style={{ padding: '10px 16px', background: 'none', border: '1.5px solid #DDD5C5', borderRadius: 100, fontSize: 13, color: '#6B7F63', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Lista de desafios */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {desafios.map((d, i) => (
                <div key={d.id} style={{ background: d.is_active ? '#D4E3D8' : '#EBE0CF', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, border: `1.5px solid ${d.is_active ? '#9DB09A' : '#DDD5C5'}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: d.is_active ? '#2F4A3B' : '#9DB09A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Cinzel',serif", fontSize: 15, fontWeight: 700, color: '#FAF7F2' }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#2F4A3B' }}>{d.titulo}</div>
                    <div style={{ fontSize: 12, color: '#6B7F63' }}>{d.duracao_dias} dias · {d.is_active ? 'Ativo' : 'Inativo'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link href={`/admin/trilhas/${id}/desafios/${d.id}`} style={{ textDecoration: 'none', background: '#FAF7F2', border: 'none', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#2F4A3B', cursor: 'pointer' }}>
                      Editar conteúdo
                    </Link>
                    <button onClick={() => toggleDesafio(d)} style={{ background: 'none', border: '1.5px solid #DDD5C5', borderRadius: 100, padding: '6px 12px', fontSize: 11, color: '#6B7F63', cursor: 'pointer' }}>
                      {d.is_active ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {desafios.length === 0 && !addingD && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#9DB09A', fontSize: 13 }}>
                Nenhum desafio ainda. Clique em "+ Adicionar" para criar o primeiro.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
