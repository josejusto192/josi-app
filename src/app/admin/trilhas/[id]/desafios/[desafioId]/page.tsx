'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Dia = { id?: string; desafio_id: string; day: number; titulo: string | null; descricao: string | null; video_url: string | null; duracao_min: number | null; tipo: string | null; dica: string | null }
type Desafio = { id: string; titulo: string; descricao: string | null; duracao_dias: number; trilha_id: string }

const TIPO_ICON: Record<string, string> = { treino: '🏋️', meditacao: '🧘', nutricao: '🥗', mentalidade: '🧠', descanso: '😴' }
const TIPOS = ['treino', 'meditacao', 'nutricao', 'mentalidade', 'descanso']

export default function AdminDesafioContentPage() {
  const params    = useParams()
  const router    = useRouter()
  const desafioId = params.desafioId as string
  const trilhaId  = params.id as string

  const [desafio, setDesafio] = useState<Desafio | null>(null)
  const [dias, setDias]       = useState<Dia[]>([])
  const [editing, setEditing] = useState<Dia | null>(null)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const supabase = createClient()

  const load = useCallback(async () => {
    const [{ data: d }, { data: content }] = await Promise.all([
      supabase.from('desafios').select('*').eq('id', desafioId).single(),
      supabase.from('desafio_dias').select('*').eq('desafio_id', desafioId).order('day'),
    ])
    if (d) setDesafio(d)
    setDias(content ?? [])
  }, [desafioId])

  useEffect(() => { load() }, [load])

  const openDay = (day: number) => {
    const existing = dias.find(d => d.day === day)
    setEditing(existing ?? { desafio_id: desafioId, day, titulo: '', descricao: '', video_url: '', duracao_min: null, tipo: 'treino', dica: '' })
  }

  const saveDia = async () => {
    if (!editing) return
    setSaving(true)
    const payload = { desafio_id: desafioId, day: editing.day, titulo: editing.titulo || null, descricao: editing.descricao || null, video_url: editing.video_url || null, duracao_min: editing.duracao_min, tipo: editing.tipo || null, dica: editing.dica || null }
    if (editing.id) {
      await supabase.from('desafio_dias').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('desafio_dias').insert(payload)
    }
    await load()
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); setEditing(null) }, 1200)
  }

  const duracao = desafio?.duracao_dias ?? 21
  const diaMap  = new Map(dias.map(d => [d.day, d]))
  const filled  = dias.filter(d => d.titulo).length

  const inp = { width: '100%', background: '#F3E9DC', border: '1.5px solid #DDD5C5', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: '#2F4A3B', fontFamily: "'Lato',sans-serif", outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <Link href={`/admin/trilhas/${trilhaId}`} style={{ textDecoration: 'none', background: '#D4E3D8', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F4A3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 600, color: '#2F4A3B', margin: 0 }}>
            {desafio?.titulo ?? 'Desafio'}
          </h1>
          <p style={{ color: '#6B7F63', fontSize: 13, margin: '2px 0 0' }}>{filled}/{duracao} dias com conteúdo</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: editing ? '1fr 380px' : '1fr', gap: 20, alignItems: 'start' }}>

        {/* Grade de dias */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
          {Array.from({ length: duracao }, (_, i) => i + 1).map(day => {
            const d   = diaMap.get(day)
            const ok  = !!d?.titulo
            const sel = editing?.day === day
            return (
              <div key={day} onClick={() => openDay(day)} style={{
                background: sel ? '#2F4A3B' : '#FAF7F2', borderRadius: 16, padding: '14px 16px',
                boxShadow: '0 2px 8px rgba(47,74,59,0.08)', cursor: 'pointer', transition: 'transform 100ms',
                border: sel ? '2px solid #C49A5A' : ok ? '2px solid #6B7F63' : '2px dashed #DDD5C5',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: sel ? '#C49A5A' : ok ? '#6B7F63' : '#D4E3D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: sel || ok ? '#FAF7F2' : '#2F4A3B' }}>{day}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: sel ? '#C49A5A' : ok ? '#6B7F63' : '#9DB09A', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {ok ? '✓ Publicado' : 'Vazio'}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: sel ? '#FAF7F2' : '#2F4A3B', lineHeight: 1.3 }}>
                  {d?.titulo ?? `Dia ${day} — clique para preencher`}
                </div>
                {d?.tipo && <div style={{ fontSize: 11, color: sel ? 'rgba(250,247,242,0.6)' : '#6B7F63', marginTop: 4 }}>{TIPO_ICON[d.tipo]} {d.tipo} · {d.duracao_min ?? '—'} min</div>}
              </div>
            )
          })}
        </div>

        {/* Editor de dia */}
        {editing && (
          <div style={{ background: '#FAF7F2', borderRadius: 20, padding: 22, boxShadow: '0 2px 12px rgba(47,74,59,0.10)', position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, color: '#2F4A3B' }}>Dia {editing.day}</div>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9DB09A', fontSize: 18 }}>×</button>
            </div>

            {[
              { label: 'Título', key: 'titulo', ph: 'Nome do dia/aula' },
              { label: 'Vídeo URL (YouTube)', key: 'video_url', ph: 'https://youtu.be/...' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7F63', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input style={inp} placeholder={f.ph} value={(editing as Record<string, unknown>)[f.key] as string ?? ''} onChange={e => setEditing(p => p ? { ...p, [f.key]: e.target.value } : p)} />
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7F63', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 }}>Tipo</label>
              <select style={inp} value={editing.tipo ?? ''} onChange={e => setEditing(p => p ? { ...p, tipo: e.target.value } : p)}>
                <option value="">— selecionar —</option>
                {TIPOS.map(t => <option key={t} value={t}>{TIPO_ICON[t]} {t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7F63', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 }}>Duração (min)</label>
              <input style={inp} type="number" min={1} value={editing.duracao_min ?? ''} onChange={e => setEditing(p => p ? { ...p, duracao_min: e.target.value ? +e.target.value : null } : p)} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7F63', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 }}>Descrição</label>
              <textarea style={{ ...inp, minHeight: 70, resize: 'none' }} value={editing.descricao ?? ''} onChange={e => setEditing(p => p ? { ...p, descricao: e.target.value } : p)} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7F63', letterSpacing: '0.06em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 }}>💡 Dica da Josi</label>
              <textarea style={{ ...inp, minHeight: 60, resize: 'none' }} value={editing.dica ?? ''} onChange={e => setEditing(p => p ? { ...p, dica: e.target.value } : p)} />
            </div>

            <button onClick={saveDia} disabled={saving} style={{ width: '100%', background: saved ? '#6B7F63' : '#2F4A3B', color: '#FAF7F2', border: 'none', borderRadius: 100, padding: 12, fontSize: 14, fontWeight: 600, fontFamily: "'Lato',sans-serif", cursor: saving ? 'wait' : 'pointer' }}>
              {saving ? 'Salvando…' : saved ? '✓ Salvo!' : `Salvar dia ${editing.day}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
