import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function AdminEducacaoPage() {
  const db = createAdminClient()
  const { data: courses } = await db
    .from('courses')
    .select('*, modules:course_modules(id, lessons:lessons(id))')
    .order('ordem')

  const enriched = (courses ?? []).map((c: Record<string,unknown>) => {
    const mods = (c.modules as {id:string,lessons:{id:string}[]}[]) ?? []
    const totalLessons = mods.reduce((s, m) => s + m.lessons.length, 0)
    return { ...c, moduleCount: mods.length, lessonCount: totalLessons }
  })

  const CAT_EMOJI: Record<string,string> = { nutricao:'🥗', mentalidade:'🧠', receitas:'🍳', treino:'💪', saude:'❤️', beleza:'🌸' }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:600, color:'#4A2E22', margin:'0 0 4px' }}>Educação</h1>
          <p style={{ color:'#8A6A5A', fontSize:14, margin:0 }}>Cursos, módulos e aulas</p>
        </div>
        <Link href="/admin/educacao/curso/novo" style={{ textDecoration:'none' }}>
          <div style={{ background:'#C9826B', borderRadius:100, padding:'10px 20px', color:'#FDF8F3', fontSize:14, fontWeight:600, cursor:'pointer' }}>+ Novo curso</div>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:28 }}>
        {[
          { label:'Cursos', value: enriched.length, color:'#C9826B' },
          { label:'Módulos', value: enriched.reduce((s,c) => s+(c as {moduleCount:number}).moduleCount,0), color:'#8A9E7B' },
          { label:'Aulas',   value: enriched.reduce((s,c) => s+(c as {lessonCount:number}).lessonCount,0), color:'#D4A96A' },
        ].map(s => (
          <div key={s.label} style={{ background:'#FDF8F3', borderRadius:16, padding:'16px 18px', boxShadow:'0 2px 8px rgba(74,46,34,0.08)' }}>
            <div style={{ fontSize:11, color:'#8A6A5A', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:600, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Course list */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {enriched.map((c) => {
          const course = c as { id:string; titulo:string; categoria:string; is_premium:boolean; is_published:boolean; moduleCount:number; lessonCount:number }
          return (
            <Link key={course.id} href={`/admin/educacao/curso/${course.id}`} style={{ textDecoration:'none' }}>
              <div style={{ background:'#FDF8F3', borderRadius:16, padding:'16px 20px', boxShadow:'0 2px 8px rgba(74,46,34,0.08)', display:'flex', alignItems:'center', gap:14, cursor:'pointer', opacity: course.is_published ? 1 : 0.6 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'#F0D5C8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {CAT_EMOJI[course.categoria] ?? '📚'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <div style={{ fontSize:15, fontWeight:600, color:'#4A2E22' }}>{course.titulo}</div>
                    {course.is_premium && <span style={{ fontSize:9, fontWeight:700, color:'#7A5020', background:'#F5E6CE', padding:'2px 7px', borderRadius:100 }}>PREMIUM</span>}
                    {!course.is_published && <span style={{ fontSize:9, fontWeight:700, color:'#8A6A5A', background:'#F0E4DC', padding:'2px 7px', borderRadius:100 }}>RASCUNHO</span>}
                  </div>
                  <div style={{ fontSize:12, color:'#8A6A5A' }}>{course.moduleCount} módulos · {course.lessonCount} aulas</div>
                </div>
                <div style={{ fontSize:12, color:'#C9826B' }}>Editar →</div>
              </div>
            </Link>
          )
        })}
        {enriched.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 20px', background:'#FDF8F3', borderRadius:18, boxShadow:'0 2px 8px rgba(74,46,34,0.08)' }}>
            <div style={{ fontSize:32, marginBottom:12 }}>📚</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:'#4A2E22', marginBottom:8 }}>Nenhum curso ainda</div>
            <Link href="/admin/educacao/curso/novo" style={{ textDecoration:'none', background:'#C9826B', borderRadius:100, padding:'10px 24px', color:'#FDF8F3', fontSize:14, fontWeight:600, display:'inline-block' }}>
              + Criar primeiro curso
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
