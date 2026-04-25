'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const TIPOS = ['treino', 'meditacao', 'nutricao', 'mentalidade', 'descanso']

type FormState = {
  titulo: string; descricao: string; video_url: string
  dica: string; duracao_min: string; tipo: string
}

export default function EditDayPage({ params }: { params: Promise<{ day: string }> }) {
  const router = useRouter()
  const [day, setDay] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [form, setForm] = useState<FormState>({
    titulo: '', descricao: '', video_url: '', dica: '', duracao_min: '', tipo: 'treino',
  })

  const supabase = createClient()

  useEffect(() => {
    params.then(p => {
      const d = parseInt(p.day)
      setDay(d)
      supabase.from('challenge_days').select('*').eq('day', d).maybeSingle()
        .then(({ data }) => {
          if (data) setForm({
            titulo:      data.titulo ?? '',
            descricao:   data.descricao ?? '',
            video_url:   data.video_url ?? '',
            dica:        data.dica ?? '',
            duracao_min: data.duracao_min?.toString() ?? '',
            tipo:        data.tipo ?? 'treino',
          })
          setLoading(false)
        })
    })
  }, [])

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }))

  const save = async () => {
    if (!form.titulo.trim()) return
    setSaving(true)
    await supabase.from('challenge_days').upsert({
      day,
      titulo:      form.titulo,
      descricao:   form.descricao || null,
      video_url:   form.video_url || null,
      dica:        form.dica || null,
      duracao_min: form.duracao_min ? parseInt(form.duracao_min) : null,
      tipo:        form.tipo,
    }, { onConflict: 'day' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#F3E9DC', border: '1.5px solid #DDD5C5',
    borderRadius: 12, padding: '11px 14px', fontSize: 14, color: '#2F4A3B',
    fontFamily: "'Lato',sans-serif", outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: '#6B7F63', display: 'block',
    marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase',
  }

  if (loading) return <div style={{ color: '#6B7F63', padding: 20 }}>Carregando…</div>

  return (
    <div style={{ maxWidth: 620 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button onClick={() => router.push('/admin/desafio')}
          style={{ background: '#D4E3D8', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F4A3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 600, color: '#2F4A3B' }}>Dia {day}</div>
          <div style={{ fontSize: 12, color: '#6B7F63' }}>Editar conteúdo do desafio</div>
        </div>
      </div>

      <div style={{ background: '#FAF7F2', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(47,74,59,0.10)' }}>

        {/* Título */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Título do dia *</label>
          <input value={form.titulo} onChange={set('titulo')} placeholder="ex: Treino de Pernas com Josi" style={inputStyle} />
        </div>

        {/* Descrição */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Descrição</label>
          <textarea value={form.descricao} onChange={set('descricao')}
            placeholder="Explique o que a aluna vai fazer hoje, o objetivo do dia, o que esperar..."
            rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        {/* Link YouTube */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Link do vídeo (YouTube)</label>
          <input value={form.video_url} onChange={set('video_url')}
            placeholder="https://youtube.com/watch?v=... ou https://youtu.be/..." style={inputStyle} />
          {form.video_url && (
            <div style={{ fontSize: 11, color: '#6B7F63', marginTop: 5 }}>
              ✓ Vídeo vai aparecer incorporado no app
            </div>
          )}
        </div>

        {/* Dica */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>💡 Dica da Josi</label>
          <textarea value={form.dica} onChange={set('dica')}
            placeholder="Uma mensagem motivacional, conselho prático ou segredo para esse dia..."
            rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        {/* Duração + Tipo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Duração (minutos)</label>
            <input type="number" value={form.duracao_min} onChange={set('duracao_min')}
              placeholder="ex: 25" min={1} max={120} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Tipo</label>
            <select value={form.tipo} onChange={set('tipo')} style={{ ...inputStyle, cursor: 'pointer' }}>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Salvar */}
        <button onClick={save} disabled={saving || !form.titulo.trim()}
          style={{
            width: '100%', border: 'none', borderRadius: 100, padding: '14px 0', fontSize: 15, fontWeight: 600,
            fontFamily: "'Lato',sans-serif", cursor: saving || !form.titulo.trim() ? 'not-allowed' : 'pointer',
            background: saved ? '#6B7F63' : saving ? '#C49A5A' : '#2F4A3B',
            color: '#FAF7F2', transition: 'background 200ms',
          }}>
          {saved ? '✓ Salvo com sucesso!' : saving ? 'Salvando…' : `Salvar Dia ${day}`}
        </button>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
