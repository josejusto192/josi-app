'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Lesson = { id: string; titulo: string; tipo: string; duracao_min: number | null; ordem: number; is_premium: boolean; is_published: boolean }

export default function EditModulePage({ params }: { params: Promise<{ id: string }> }) {
  const router   = useRouter()
  const supabase = createClient()
  const [modId, setModId]   = useState('')
  const [courseId, setCourseId] = useState('')
  const [modTitulo, setModTitulo] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  const inp: React.CSSProperties = { width:'100%', background:'#F5EDE3', border:'1.5px solid #E8D8CC', borderRadius:12, padding:'11px 14px', fontSize:14, color:'#4A2E22', fontFamily:"'DM Sans',sans-serif", outline:'none', boxSizing:'border-box' }

  useEffect(() => {
    params.then(async p => {
      setModId(p.id)
      const { data: mod } = await supabase.from('course_modules').select('*').eq('id', p.id).single()
      if (mod) { setModTitulo(mod.titulo); setCourseId(mod.course_id) }
      const { data: ls } = await supabase.from('lessons').select('*').eq('module_id', p.id).order('ordem')
      if (ls) setLessons(ls as Lesson[])
      setLoading(false)
    })
  }, [])

  const saveModule = async () => {
    if (!modTitulo.trim()) return
    setSaving(true)
    await supabase.from('course_modules').update({ titulo: modTitulo.trim() }).eq('id', modId)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 1500)
  }

  const deleteLesson = async (lid: string) => {
    if (!confirm('Remover esta aula?')) return
    await supabase.from('lessons').delete().eq('id', lid)
    setLessons(prev => prev.filter(l => l.id !== lid))
  }

  const TIPO_ICON: Record<string,string> = { video:'▶', texto:'📄', markdown:'📝', imagem:'🖼', pdf:'📋' }

  if (loading) return <div style={{ color:'#8A6A5A', padding:20 }}>Carregando…</div>

  return (
    <div style={{ maxWidth:640 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={() => courseId ? router.push(`/admin/educacao/curso/${courseId}`) : router.push('/admin/educacao')}
          style={{ background:'#F0D5C8', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9826B" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:'#4A2E22' }}>Editar módulo</div>
          <div style={{ fontSize:12, color:'#8A6A5A' }}>{modTitulo}</div>
        </div>
      </div>

      {/* Module title */}
      <div style={{ background:'#FDF8F3', borderRadius:16, padding:'18px 20px', boxShadow:'0 2px 8px rgba(74,46,34,0.08)', marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:600, color:'#8A6A5A', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Título do módulo</div>
        <div style={{ display:'flex', gap:10 }}>
          <input value={modTitulo} onChange={e => setModTitulo(e.target.value)} style={{ ...inp, flex:1 }} />
          <button onClick={saveModule} disabled={saving} style={{ padding:'11px 18px', borderRadius:12, background: saved?'#8A9E7B':'#C9826B', border:'none', color:'#FDF8F3', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'background 200ms' }}>
            {saved ? '✓' : saving ? '…' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Lessons */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:'#4A2E22' }}>Aulas</div>
        <Link href={`/admin/educacao/aula/nova?modulo=${modId}`} style={{ textDecoration:'none', background:'#C9826B', borderRadius:100, padding:'8px 16px', color:'#FDF8F3', fontSize:13, fontWeight:600 }}>
          + Nova aula
        </Link>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {lessons.map((lesson, idx) => (
          <div key={lesson.id} style={{ background:'#FDF8F3', borderRadius:14, padding:'12px 16px', boxShadow:'0 2px 8px rgba(74,46,34,0.07)', display:'flex', alignItems:'center', gap:12, opacity: lesson.is_published ? 1 : 0.6 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'#F0D5C8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>
              {TIPO_ICON[lesson.tipo] ?? '📄'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:500, color:'#4A2E22', marginBottom:2 }}>{idx+1}. {lesson.titulo}</div>
              <div style={{ fontSize:11, color:'#8A6A5A', display:'flex', gap:8 }}>
                <span>{lesson.tipo}</span>
                {lesson.duracao_min && <span>· {lesson.duracao_min}min</span>}
                {lesson.is_premium && <span style={{ color:'#D4A96A' }}>· Premium</span>}
                {!lesson.is_published && <span>· Rascunho</span>}
              </div>
            </div>
            <Link href={`/admin/educacao/aula/${lesson.id}`} style={{ textDecoration:'none', fontSize:12, color:'#C9826B', fontWeight:600 }}>Editar</Link>
            <button onClick={() => deleteLesson(lesson.id)} style={{ background:'#F0D5C8', border:'none', borderRadius:8, padding:'5px 8px', cursor:'pointer', fontSize:12, color:'#A06858' }}>🗑</button>
          </div>
        ))}
        {lessons.length === 0 && (
          <div style={{ textAlign:'center', padding:'32px 20px', background:'#FDF8F3', borderRadius:14, color:'#8A6A5A', fontSize:13 }}>
            Nenhuma aula neste módulo ainda.
          </div>
        )}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
