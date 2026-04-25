'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATS = ['nutricao','treino','mentalidade','receitas','saude','beleza']
type Module = { id: string; titulo: string; descricao: string | null; ordem: number; lessonCount?: number }

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router   = useRouter()
  const supabase = createClient()
  const [id, setId]       = useState('')
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [modules, setModules]   = useState<Module[]>([])
  const [newModTitle, setNewModTitle] = useState('')
  const [addingMod, setAddingMod]    = useState(false)

  const [form, setForm] = useState({ titulo:'', descricao:'', categoria:'nutricao', is_premium:false, is_published:true, ordem:'1' })

  useEffect(() => {
    params.then(async p => {
      setId(p.id); const novo = p.id === 'novo'; setIsNew(novo)
      if (!novo) {
        const { data } = await supabase.from('courses').select('*').eq('id', p.id).single()
        if (data) setForm({ titulo: data.titulo??'', descricao: data.descricao??'', categoria: data.categoria??'nutricao', is_premium: data.is_premium??false, is_published: data.is_published??true, ordem: data.ordem?.toString()??'1' })
        // Load modules
        const { data: mods } = await supabase.from('course_modules').select('*, lessons:lessons(id)').eq('course_id', p.id).order('ordem')
        if (mods) setModules(mods.map((m: Record<string,unknown>) => ({ ...m, lessonCount: (m.lessons as {id:string}[]).length })) as Module[])
      }
      setLoading(false)
    })
  }, [])

  const inp: React.CSSProperties = { width:'100%', background:'#F3E9DC', border:'1.5px solid #DDD5C5', borderRadius:12, padding:'11px 14px', fontSize:14, color:'#2F4A3B', fontFamily:"'Lato',sans-serif", outline:'none', boxSizing:'border-box' }
  const lbl: React.CSSProperties = { fontSize:11, fontWeight:600, color:'#6B7F63', display:'block', marginBottom:6, letterSpacing:'0.06em', textTransform:'uppercase' }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const save = async () => {
    if (!form.titulo.trim()) return
    setSaving(true)
    const payload = { titulo:form.titulo, descricao:form.descricao||null, categoria:form.categoria, is_premium:form.is_premium, is_published:form.is_published, ordem:parseInt(form.ordem)||1 }
    if (isNew) {
      const { data } = await supabase.from('courses').insert(payload).select('id').single()
      setSaving(false); setSaved(true)
      setTimeout(() => { if (data) router.push(`/admin/educacao/curso/${data.id}`) }, 1000)
    } else {
      await supabase.from('courses').update(payload).eq('id', id)
      setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 1500)
    }
  }

  const del = async () => {
    if (!confirm('Remover este curso e todos os seus módulos/aulas?')) return
    await supabase.from('courses').delete().eq('id', id)
    router.push('/admin/educacao')
  }

  const addModule = async () => {
    if (!newModTitle.trim() || isNew) return
    setAddingMod(true)
    const { data } = await supabase.from('course_modules').insert({ course_id: id, titulo: newModTitle.trim(), ordem: modules.length + 1 }).select('*').single()
    if (data) setModules(prev => [...prev, { ...data, lessonCount: 0 }])
    setNewModTitle(''); setAddingMod(false)
  }

  const deleteModule = async (modId: string) => {
    if (!confirm('Remover módulo e todas as suas aulas?')) return
    await supabase.from('course_modules').delete().eq('id', modId)
    setModules(prev => prev.filter(m => m.id !== modId))
  }

  if (loading) return <div style={{ color:'#6B7F63', padding:20 }}>Carregando…</div>

  return (
    <div style={{ maxWidth:680 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={() => router.push('/admin/educacao')} style={{ background:'#D4E3D8', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F4A3B" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:24, fontWeight:600, color:'#2F4A3B' }}>{isNew ? 'Novo curso' : 'Editar curso'}</div>
          <div style={{ fontSize:12, color:'#6B7F63' }}>{isNew ? 'Preencha as informações abaixo' : form.titulo}</div>
        </div>
      </div>

      {/* Course form */}
      <div style={{ background:'#FAF7F2', borderRadius:20, padding:28, boxShadow:'0 4px 20px rgba(47,74,59,0.10)', marginBottom:20 }}>
        <div style={{ marginBottom:18 }}>
          <label style={lbl}>Título do curso *</label>
          <input value={form.titulo} onChange={set('titulo')} placeholder="ex: Nutrição Real no Dia a Dia" style={inp} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 60px', gap:14, marginBottom:18 }}>
          <div>
            <label style={lbl}>Categoria</label>
            <select value={form.categoria} onChange={set('categoria')} style={{ ...inp, cursor:'pointer' }}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Ordem</label>
            <input type="number" value={form.ordem} onChange={set('ordem')} min={1} style={inp} />
          </div>
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={lbl}>Descrição</label>
          <textarea value={form.descricao} onChange={set('descricao')} rows={3} placeholder="O que a aluna vai aprender neste curso…" style={{ ...inp, resize:'vertical' }} />
        </div>
        <div style={{ display:'flex', gap:16, marginBottom:24 }}>
          {[
            { key:'is_published', label:'Publicado', hint:'visível no app' },
            { key:'is_premium', label:'Premium', hint:'apenas assinantes' },
          ].map(f => (
            <div key={f.key} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#F3E9DC', borderRadius:12, flex:1 }}>
              <input type="checkbox" id={f.key} checked={form[f.key as keyof typeof form] as boolean} onChange={set(f.key)} style={{ width:16, height:16, cursor:'pointer', accentColor:'#6B7F63' }} />
              <label htmlFor={f.key} style={{ fontSize:14, color:'#2F4A3B', cursor:'pointer' }}>{f.label} <span style={{ fontSize:11, color:'#6B7F63' }}>({f.hint})</span></label>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving || !form.titulo.trim()}
            style={{ flex:1, border:'none', borderRadius:100, padding:'13px', fontSize:15, fontWeight:600, fontFamily:"'Lato',sans-serif", cursor:'pointer', background: saved?'#6B7F63':saving?'#C49A5A':'#2F4A3B', color:'#FAF7F2', transition:'background 200ms' }}>
            {saved ? '✓ Salvo!' : saving ? 'Salvando…' : isNew ? 'Criar curso' : 'Salvar alterações'}
          </button>
          {!isNew && (
            <button onClick={del} style={{ background:'#D4E3D8', border:'none', borderRadius:100, padding:'13px 18px', fontSize:14, fontWeight:600, fontFamily:"'Lato',sans-serif", cursor:'pointer', color:'#A06858' }}>🗑</button>
          )}
        </div>
      </div>

      {/* Modules section */}
      {!isNew && (
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:18, fontWeight:600, color:'#2F4A3B' }}>Módulos</div>
            <span style={{ fontSize:12, color:'#6B7F63' }}>{modules.length} módulo{modules.length !== 1 ? 's' : ''}</span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
            {modules.map((mod, idx) => (
              <div key={mod.id} style={{ background:'#FAF7F2', borderRadius:14, padding:'14px 16px', boxShadow:'0 2px 8px rgba(47,74,59,0.07)', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#2F4A3B,#C49A5A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#FAF7F2', flexShrink:0 }}>{idx+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'#2F4A3B' }}>{mod.titulo}</div>
                  <div style={{ fontSize:11, color:'#6B7F63' }}>{mod.lessonCount ?? 0} aulas</div>
                </div>
                <Link href={`/admin/educacao/modulo/${mod.id}`} style={{ textDecoration:'none', fontSize:12, color:'#2F4A3B', fontWeight:600 }}>Editar →</Link>
                <button onClick={() => deleteModule(mod.id)} style={{ background:'#D4E3D8', border:'none', borderRadius:8, padding:'5px 8px', cursor:'pointer', fontSize:12, color:'#A06858' }}>🗑</button>
              </div>
            ))}
            {modules.length === 0 && (
              <div style={{ textAlign:'center', padding:'24px', background:'#FAF7F2', borderRadius:14, color:'#6B7F63', fontSize:13 }}>Nenhum módulo ainda. Adicione o primeiro abaixo.</div>
            )}
          </div>

          <div style={{ background:'#FAF7F2', borderRadius:14, padding:'14px 16px', boxShadow:'0 2px 8px rgba(47,74,59,0.07)' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#6B7F63', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>+ Novo módulo</div>
            <div style={{ display:'flex', gap:10 }}>
              <input value={newModTitle} onChange={e => setNewModTitle(e.target.value)} placeholder="Título do módulo…"
                onKeyDown={e => e.key === 'Enter' && addModule()}
                style={{ ...inp, flex:1 }} />
              <button onClick={addModule} disabled={addingMod || !newModTitle.trim()}
                style={{ padding:'11px 18px', borderRadius:12, background:'#2F4A3B', border:'none', color:'#FAF7F2', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Lato',sans-serif" }}>
                {addingMod ? '…' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export const dynamic = 'force-dynamic'
