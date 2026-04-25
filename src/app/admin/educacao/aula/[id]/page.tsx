'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const TIPOS = ['video','texto','markdown','imagem','pdf']
type Form = { titulo:string; descricao:string; tipo:string; conteudo:string; video_url:string; imagem_url:string; duracao_min:string; ordem:string; is_premium:boolean; is_published:boolean }
const EMPTY: Form = { titulo:'', descricao:'', tipo:'video', conteudo:'', video_url:'', imagem_url:'', duracao_min:'', ordem:'1', is_premium:false, is_published:true }

function AulaForm({ id: paramId }: { id: string }) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createClient()

  const [id, setId]           = useState('')
  const [isNew, setIsNew]     = useState(false)
  const [modId, setModId]     = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [form, setForm]       = useState<Form>(EMPTY)

  const inp: React.CSSProperties = { width:'100%', background:'#F3E9DC', border:'1.5px solid #DDD5C5', borderRadius:12, padding:'11px 14px', fontSize:14, color:'#2F4A3B', fontFamily:"'Lato',sans-serif", outline:'none', boxSizing:'border-box' }
  const lbl: React.CSSProperties = { fontSize:11, fontWeight:600, color:'#6B7F63', display:'block', marginBottom:6, letterSpacing:'0.06em', textTransform:'uppercase' }

  useEffect(() => {
    const init = async () => {
      const novo = paramId === 'nova'
      setId(paramId); setIsNew(novo)
      if (novo) {
        const mId = searchParams.get('modulo') ?? ''
        setModId(mId)
        const { data: maxOrd } = await supabase.from('lessons').select('ordem').eq('module_id', mId).order('ordem', { ascending: false }).limit(1)
        const nextOrd = maxOrd?.[0] ? (maxOrd[0].ordem + 1).toString() : '1'
        setForm(f => ({ ...f, ordem: nextOrd }))
      } else {
        const { data } = await supabase.from('lessons').select('*').eq('id', paramId).single()
        if (data) {
          setModId(data.module_id)
          setForm({ titulo:data.titulo??'', descricao:data.descricao??'', tipo:data.tipo??'video', conteudo:data.conteudo??'', video_url:data.video_url??'', imagem_url:data.imagem_url??'', duracao_min:data.duracao_min?.toString()??'', ordem:data.ordem?.toString()??'1', is_premium:data.is_premium??false, is_published:data.is_published??true })
        }
      }
      setLoading(false)
    }
    init()
  }, [paramId])

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const save = async () => {
    if (!form.titulo.trim()) return
    setSaving(true)
    const payload = { titulo:form.titulo, descricao:form.descricao||null, tipo:form.tipo, conteudo:form.conteudo||null, video_url:form.video_url||null, imagem_url:form.imagem_url||null, duracao_min:form.duracao_min?parseInt(form.duracao_min):null, ordem:parseInt(form.ordem)||1, is_premium:form.is_premium, is_published:form.is_published, module_id: modId }
    if (isNew) {
      const { data } = await supabase.from('lessons').insert(payload).select('id').single()
      setSaving(false); setSaved(true)
      if (data) setTimeout(() => router.push(`/admin/educacao/aula/${data.id}`), 1000)
    } else {
      await supabase.from('lessons').update(payload).eq('id', id)
      setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 1500)
    }
  }

  const del = async () => {
    if (!confirm('Remover esta aula?')) return
    await supabase.from('lessons').delete().eq('id', id)
    router.push(`/admin/educacao/modulo/${modId}`)
  }

  if (loading) return <div style={{ color:'#6B7F63', padding:20 }}>Carregando…</div>

  return (
    <div style={{ maxWidth:640 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={() => modId ? router.push(`/admin/educacao/modulo/${modId}`) : router.push('/admin/educacao')}
          style={{ background:'#D4E3D8', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F4A3B" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:22, fontWeight:600, color:'#2F4A3B' }}>{isNew ? 'Nova aula' : 'Editar aula'}</div>
          <div style={{ fontSize:12, color:'#6B7F63' }}>{isNew ? 'Preencha os dados abaixo' : form.titulo}</div>
        </div>
      </div>

      <div style={{ background:'#FAF7F2', borderRadius:20, padding:28, boxShadow:'0 4px 20px rgba(47,74,59,0.10)' }}>
        <div style={{ marginBottom:18 }}>
          <label style={lbl}>Título da aula *</label>
          <input value={form.titulo} onChange={set('titulo')} placeholder="ex: Por que dietas restritivas não funcionam" style={inp} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 70px', gap:14, marginBottom:18 }}>
          <div>
            <label style={lbl}>Tipo de aula</label>
            <select value={form.tipo} onChange={set('tipo')} style={{ ...inp, cursor:'pointer' }}>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Duração (min)</label>
            <input type="number" value={form.duracao_min} onChange={set('duracao_min')} placeholder="10" min={1} style={inp} />
          </div>
          <div>
            <label style={lbl}>Ordem</label>
            <input type="number" value={form.ordem} onChange={set('ordem')} min={1} style={inp} />
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={lbl}>Descrição curta</label>
          <textarea value={form.descricao} onChange={set('descricao')} rows={2} placeholder="Resumo do que a aluna vai aprender…" style={{ ...inp, resize:'vertical' }} />
        </div>

        {(form.tipo === 'video') && (
          <div style={{ marginBottom:18 }}>
            <label style={lbl}>URL do vídeo (YouTube)</label>
            <input value={form.video_url} onChange={set('video_url')} placeholder="https://youtube.com/watch?v=..." style={inp} />
          </div>
        )}

        {(form.tipo === 'imagem') && (
          <div style={{ marginBottom:18 }}>
            <label style={lbl}>URL da imagem</label>
            <input value={form.imagem_url} onChange={set('imagem_url')} placeholder="https://..." style={inp} />
          </div>
        )}

        {(form.tipo === 'texto' || form.tipo === 'markdown' || form.tipo === 'pdf') && (
          <div style={{ marginBottom:18 }}>
            <label style={lbl}>{form.tipo === 'markdown' ? 'Conteúdo (Markdown)' : form.tipo === 'pdf' ? 'URL do PDF' : 'Conteúdo do texto'}</label>
            {form.tipo === 'pdf' ? (
              <input value={form.conteudo} onChange={set('conteudo')} placeholder="https://..." style={inp} />
            ) : (
              <textarea value={form.conteudo} onChange={set('conteudo')} rows={12}
                placeholder={form.tipo === 'markdown' ? '# Título\n\nEscreva em markdown...' : 'Escreva o conteúdo da aula...'}
                style={{ ...inp, resize:'vertical', fontFamily: form.tipo === 'markdown' ? 'monospace' : "'Lato',sans-serif", fontSize:13 }} />
            )}
            {form.tipo === 'markdown' && <div style={{ fontSize:11, color:'#9DB09A', marginTop:4 }}>Suporta: # títulos, **negrito**, *itálico*, - listas, {'>'} citação, ```código```, tabelas com |</div>}
          </div>
        )}

        <div style={{ display:'flex', gap:16, marginBottom:24 }}>
          {[
            { key:'is_published', label:'Publicada', hint:'visível no app', color:'#6B7F63' },
            { key:'is_premium', label:'Premium', hint:'apenas assinantes', color:'#C49A5A' },
          ].map(f => (
            <div key={f.key} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#F3E9DC', borderRadius:12, flex:1 }}>
              <input type="checkbox" id={f.key} checked={form[f.key as keyof Form] as boolean} onChange={set(f.key as keyof Form)} style={{ width:16, height:16, cursor:'pointer', accentColor: f.color }} />
              <label htmlFor={f.key} style={{ fontSize:14, color:'#2F4A3B', cursor:'pointer' }}>{f.label} <span style={{ fontSize:11, color:'#6B7F63' }}>({f.hint})</span></label>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving || !form.titulo.trim()}
            style={{ flex:1, border:'none', borderRadius:100, padding:'13px', fontSize:15, fontWeight:600, fontFamily:"'Lato',sans-serif", cursor:'pointer', background: saved?'#6B7F63':saving?'#C49A5A':'#2F4A3B', color:'#FAF7F2', transition:'background 200ms' }}>
            {saved ? '✓ Salvo!' : saving ? 'Salvando…' : isNew ? 'Criar aula' : 'Salvar alterações'}
          </button>
          {!isNew && (
            <button onClick={del} style={{ background:'#D4E3D8', border:'none', borderRadius:100, padding:'13px 18px', fontSize:14, fontWeight:600, fontFamily:"'Lato',sans-serif", cursor:'pointer', color:'#A06858' }}>🗑</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EditAulaPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('')
  useEffect(() => { params.then(p => setId(p.id)) }, [])
  if (!id) return <div style={{ color:'#6B7F63', padding:20 }}>Carregando…</div>
  return <Suspense><AulaForm id={id} /></Suspense>
}
export const dynamic = 'force-dynamic'
