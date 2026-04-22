'use client'

import { useState } from 'react'

const COURSES = [
  { id:1, title:'Alimentação Real no Dia a Dia', tag:'Nutrição',   lessons:8,  duration:'2h14', progress:60,  color:['#C9826B','#D4A96A'], emoji:'🥗', enrolled:true  },
  { id:2, title:'Mindset de Transformação',      tag:'Mental',     lessons:6,  duration:'1h40', progress:0,   color:['#8A9E7B','#A8BE98'], emoji:'🧠', enrolled:false },
  { id:3, title:'Skincare Natural com a Josi',   tag:'Beleza',     lessons:5,  duration:'1h15', progress:100, color:['#A0526A','#C87090'], emoji:'🌸', enrolled:true, done:true },
  { id:4, title:'Receitas Práticas da Chácara',  tag:'Culinária',  lessons:10, duration:'3h20', progress:0,   color:['#D4A96A','#E8C878'], emoji:'🍳', enrolled:false },
]

const ARTICLES = [
  { title:'Como criar uma rotina matinal sustentável', tag:'Hábitos',   time:'6 min', emoji:'☀️' },
  { title:'Suplementação para mulheres ativas',        tag:'Saúde',     time:'8 min', emoji:'💊' },
  { title:'A importância do descanso no processo',     tag:'Bem-estar', time:'5 min', emoji:'🌙' },
]

export default function EducationScreen() {
  const [tab, setTab] = useState<'cursos'|'artigos'>('cursos')

  return (
    <div style={{ flex:1, overflowY:'auto', background:'#F5EDE3' }}>
      <div style={{ background:'#FDF8F3', padding:'16px 20px 0', borderBottom:'1px solid #E8D8CC' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:'#4A2E22', marginBottom:12 }}>Educação</div>
        <div style={{ display:'flex' }}>
          {(['cursos','artigos'] as const).map(t => (
            <div key={t} onClick={() => setTab(t)} style={{ flex:1, textAlign:'center', paddingBottom:10, fontSize:13, fontWeight:500, color: tab===t?'#C9826B':'#8A6A5A', borderBottom: tab===t?'2px solid #C9826B':'2px solid transparent', cursor:'pointer', transition:'all 150ms' }}>
              {t === 'cursos' ? 'Cursos' : 'Artigos'}
            </div>
          ))}
        </div>
      </div>

      {tab === 'cursos' ? (
        <div style={{ padding:'16px 20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:500, color:'#4A2E22' }}>Em andamento</div>
          {COURSES.filter(c => c.enrolled && !c.done).map(course => (
            <div key={course.id} style={{ background:'#FDF8F3', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 16px rgba(74,46,34,0.10)', cursor:'pointer' }}>
              <div style={{ background:`linear-gradient(135deg,${course.color[0]},${course.color[1]})`, padding:'18px 18px 20px' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{course.emoji}</div>
                <div style={{ fontSize:9, color:'rgba(253,248,243,0.7)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>{course.tag}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:500, color:'#FDF8F3', lineHeight:1.25 }}>{course.title}</div>
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:12, color:'#8A6A5A' }}>{course.lessons} aulas · {course.duration}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:'#C9826B' }}>{course.progress}%</span>
                </div>
                <div style={{ height:5, background:'#F0D5C8', borderRadius:3 }}>
                  <div style={{ width:`${course.progress}%`, height:'100%', background:`linear-gradient(90deg,${course.color[0]},${course.color[1]})`, borderRadius:3 }}/>
                </div>
                <button style={{ marginTop:12, width:'100%', background:'#C9826B', color:'#FDF8F3', border:'none', borderRadius:100, padding:11, fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:'pointer' }}>Continuar →</button>
              </div>
            </div>
          ))}

          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:500, color:'#4A2E22', marginTop:4 }}>Concluídos ✓</div>
          {COURSES.filter(c => c.done).map(course => (
            <div key={course.id} style={{ background:'#FDF8F3', borderRadius:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 2px 8px rgba(74,46,34,0.07)', opacity:0.85 }}>
              <div style={{ width:46, height:46, borderRadius:14, background:`linear-gradient(135deg,${course.color[0]},${course.color[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{course.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500, color:'#4A2E22' }}>{course.title}</div>
                <div style={{ fontSize:11, color:'#8A9E7B', marginTop:2, fontWeight:500 }}>✓ Concluído · {course.lessons} aulas</div>
              </div>
              <div style={{ background:'#D6E4CE', borderRadius:100, padding:'4px 10px', fontSize:10, fontWeight:600, color:'#3A5A42' }}>100%</div>
            </div>
          ))}

          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:500, color:'#4A2E22', marginTop:4 }}>Explorar</div>
          {COURSES.filter(c => !c.enrolled).map(course => (
            <div key={course.id} style={{ background:'#FDF8F3', borderRadius:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 2px 8px rgba(74,46,34,0.08)', cursor:'pointer' }}>
              <div style={{ width:46, height:46, borderRadius:14, background:`linear-gradient(135deg,${course.color[0]},${course.color[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{course.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500, color:'#4A2E22', marginBottom:3 }}>{course.title}</div>
                <div style={{ fontSize:11, color:'#8A6A5A' }}>{course.lessons} aulas · {course.duration}</div>
              </div>
              <button style={{ background:'#F0D5C8', color:'#C9826B', border:'none', borderRadius:100, padding:'6px 14px', fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif", cursor:'pointer', flexShrink:0 }}>Ver</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding:'16px 20px 24px', display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:500, color:'#4A2E22' }}>Leituras recomendadas</div>
          {ARTICLES.map((a, i) => (
            <div key={i} style={{ background:'#FDF8F3', borderRadius:18, padding:16, display:'flex', gap:14, alignItems:'flex-start', boxShadow:'0 2px 8px rgba(74,46,34,0.08)', cursor:'pointer' }}>
              <div style={{ width:48, height:48, borderRadius:14, background:'#F5EDE3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{a.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500, color:'#4A2E22', lineHeight:1.35, marginBottom:6 }}>{a.title}</div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ background:'#F0D5C8', color:'#C9826B', borderRadius:100, padding:'2px 9px', fontSize:10, fontWeight:600 }}>{a.tag}</span>
                  <span style={{ fontSize:11, color:'#8A6A5A' }}>📖 {a.time} de leitura</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
