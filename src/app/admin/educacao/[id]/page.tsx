'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIAS = ['nutricao','treino','mentalidade','receitas','saude','estilo_de_vida']

type Form = {
  titulo: string; descricao: string; conteudo: string; video_url: string
  categoria: string; duracao_min: string; ordem: string; is_premium: boolean
}
const EMPTY: Form = { titulo: '', descricao: '', conteudo: '', video_url: '', categoria: 'nutricao', duracao_min: '', ordem: '0', is_premium: false }

export default function EditEducacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const router  = useRouter()
  const [id, setId]       = useState('')
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<Form>(EMPTY)

  const supabase = createClient()

  useEffect(() => {
    params.then(async p => {
      setId(p.id); const novo = p.id === 'novo'; setIsNew(novo)
      if (!novo) {
        const { data } = await supabase.from('education_content').select('*').eq('id', p.id).single()
        if (data) setForm({ titulo: data.titulo ?? '', descricao: data.descricao ?? '', conteudo: data.conteudo ?? '', video_url: data.video_url ?? '', categoria: data.categoria ?? 'nutricao', duracao_min: data.duracao_min?.toString() ?? '', ordem: data.ordem?.toString() ?? '0', is_premium: data.is_premium ?? false })
      }
      setLoading(false)
    })
  }, [])

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const save = async () => {
    if (!form.titulo.trim()) return
    setSaving(true)
    const payload = { titulo: form.titulo, descricao: form.descricao || null, conteudo: form.conteudo || null, video_url: form.video_url || null, categoria: form.categoria, duracao_min: form.duracao_min ? parseInt(form.duracao_min) : null, ordem: form.ordem ? parseInt(form.ordem) : 0, is_premium: form.is_premium }
    if (isNew) { await supabase.from('education_content').insert(payload) }
    else { await supabase.from('education_content').update(payload).eq('id', id) }
    setSaving(false); setSaved(true)
    setTimeout(() => { setSaved(false); if (isNew) router.push('/admin/educacao') }, 1500)
  }

  const del = async () => {
    if (!confirm('Remover este conteúdo?')) return
    setDeleting(true)
    await supabase.from('education_content').delete().eq('id', id)
    router.push('/admin/educacao')
  }

  const inp: React.CSSProperties = { width: '100%', background: '#F5EDE3', border: '1.5px solid #E8D8CC', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: '#4A2E22', fontFamily: "'DM Sans',sans-serif", outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#8A6A5A', display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }

  if (loading) return <div style={{ color: '#8A6A5A', padding: 20 }}>Carregando…</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.push('/admin/educacao')} style={{ background: '#F0D5C8', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9826B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600, color: '#4A2E22' }}>{isNew ? 'Novo conteúdo' : 'Editar conteúdo'}</div>
          <div style={{ fontSize: 12, color: '#8A6A5A' }}>{isNew ? 'Artigo ou vídeo educativo' : form.titulo}</div>
        </div>
      </div>

      <div style={{ background: '#FDF8F3', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(74,46,34,0.10)' }}>
        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Título *</label>
          <input value={form.titulo} onChange={set('titulo')} placeholder="ex: Como montar um prato equilibrado" style={inp} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 14, marginBottom: 18 }}>
          <div>
            <label style={lbl}>Categoria</label>
            <select value={form.categoria} onChange={set('categoria')} style={{ ...inp, cursor: 'pointer' }}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Duração (min)</label>
            <input type="number" value={form.duracao_min} onChange={set('duracao_min')} placeholder="10" min={1} style={inp} />
          </div>
          <div>
            <label style={lbl}>Ordem</label>
            <input type="number" value={form.ordem} onChange={set('ordem')} placeholder="0" min={0} style={inp} />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Descrição curta</label>
          <textarea value={form.descricao} onChange={set('descricao')} rows={2} placeholder="Um resumo do que a aluna vai aprender..." style={{ ...inp, resize: 'vertical' }} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Link do vídeo (YouTube) — opcional</label>
          <input value={form.video_url} onChange={set('video_url')} placeholder="https://youtube.com/watch?v=..." style={inp} />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={lbl}>Conteúdo do artigo (texto, markdown)</label>
          <textarea value={form.conteudo} onChange={set('conteudo')} rows={8} placeholder="Escreva o conteúdo completo do artigo aqui..." style={{ ...inp, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '12px 14px', background: '#F5EDE3', borderRadius: 12 }}>
          <input type="checkbox" id="prem" checked={form.is_premium} onChange={set('is_premium')} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#D4A96A' }} />
          <label htmlFor="prem" style={{ fontSize: 14, color: '#4A2E22', cursor: 'pointer' }}>Conteúdo Premium <span style={{ fontSize: 12, color: '#8A6A5A' }}>— apenas assinantes</span></label>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={save} disabled={saving || !form.titulo.trim()}
            style={{ flex: 1, border: 'none', borderRadius: 100, padding: '13px 0', fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: saving || !form.titulo.trim() ? 'not-allowed' : 'pointer', background: saved ? '#8A9E7B' : saving ? '#D4A96A' : '#C9826B', color: '#FDF8F3', transition: 'background 200ms' }}>
            {saved ? '✓ Salvo!' : saving ? 'Salvando…' : isNew ? 'Publicar conteúdo' : 'Salvar alterações'}
          </button>
          {!isNew && (
            <button onClick={del} disabled={deleting} style={{ background: '#F0D5C8', border: 'none', borderRadius: 100, padding: '13px 18px', fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', color: '#A06858' }}>
              {deleting ? '…' : '🗑'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
