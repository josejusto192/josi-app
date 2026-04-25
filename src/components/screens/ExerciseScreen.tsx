'use client'

import { useState } from 'react'

const MUSCLE_GROUPS = [
  { id:'peito',    label:'Peito',     emoji:'💪', color:'#D4E3D8' },
  { id:'costas',   label:'Costas',    emoji:'🔙', color:'#D6E4CE' },
  { id:'pernas',   label:'Pernas',    emoji:'🦵', color:'#F0DEBB' },
  { id:'ombros',   label:'Ombros',    emoji:'🏋️', color:'#D4E3D8' },
  { id:'biceps',   label:'Bíceps',    emoji:'💪', color:'#D6E4CE' },
  { id:'triceps',  label:'Tríceps',   emoji:'💪', color:'#F0DEBB' },
  { id:'abdomen',  label:'Abdômen',   emoji:'🎯', color:'#F9EAF0' },
  { id:'gluteos',  label:'Glúteos',   emoji:'✨', color:'#D4E3D8' },
  { id:'fullbody', label:'Full Body', emoji:'🌟', color:'gradient', full:true },
]

const EXERCISES: Record<string, Array<{ name:string; type:string; sets:string; rest:string; img:string }>> = {
  peito:  [
    { name:'Flexão de Braço',   type:'corpo',    sets:'3x12', rest:'60s',  img:'🤸' },
    { name:'Flexão Inclinada',  type:'corpo',    sets:'3x10', rest:'60s',  img:'🤸' },
    { name:'Supino com Halter', type:'peso',     sets:'4x10', rest:'90s',  img:'🏋️' },
    { name:'Crucifixo',         type:'peso',     sets:'3x12', rest:'60s',  img:'🏋️' },
  ],
  pernas: [
    { name:'Agachamento Livre',      type:'corpo',    sets:'4x15', rest:'60s', img:'🦵' },
    { name:'Agachamento c/ Halter',  type:'peso',     sets:'4x12', rest:'90s', img:'🏋️' },
    { name:'Avanço',                 type:'corpo',    sets:'3x12', rest:'60s', img:'🦵' },
    { name:'Elevação Pélvica',       type:'corpo',    sets:'4x15', rest:'45s', img:'✨' },
    { name:'Leg Press',              type:'aparelho', sets:'4x12', rest:'90s', img:'🏋️' },
  ],
}

const TYPE_LABEL: Record<string, string> = { corpo:'Sem peso', peso:'Com halter', aparelho:'Aparelho' }
const TYPE_COLOR: Record<string, { bg:string; c:string }> = {
  corpo:    { bg:'#D6E4CE', c:'#3A5A42' },
  peso:     { bg:'#D4E3D8', c:'#2F4A3B' },
  aparelho: { bg:'#F0DEBB', c:'#7A5020' },
}

export default function ExerciseScreen() {
  const [selected, setSelected] = useState<string|null>(null)
  const [filter, setFilter]     = useState('todos')

  const exercises = selected ? (EXERCISES[selected] || [
    { name:'Exercício exemplo A', type:'corpo', sets:'3x12', rest:'60s', img:'💪' },
    { name:'Exercício exemplo B', type:'peso',  sets:'4x10', rest:'90s', img:'🏋️' },
  ]) : []

  const filtered = filter === 'todos' ? exercises : exercises.filter(e => e.type === filter)

  if (selected) {
    const group = MUSCLE_GROUPS.find(g => g.id === selected)
    return (
      <div style={{ flex:1, overflowY:'auto', background:'#F3E9DC' }}>
        <div style={{ background:'#FAF7F2', padding:'16px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid #DDD5C5' }}>
          <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#2F4A3B', display:'flex', padding:4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:20, fontWeight:500, color:'#2F4A3B' }}>{group?.emoji} {group?.label}</div>
          <div style={{ marginLeft:'auto', fontSize:12, color:'#6B7F63' }}>{exercises.length} exercícios</div>
        </div>
        <div style={{ display:'flex', gap:8, padding:'12px 20px', overflowX:'auto' }}>
          {['todos','corpo','peso','aparelho'].map(f => (
            <div key={f} onClick={() => setFilter(f)} style={{ padding:'7px 14px', borderRadius:100, fontSize:12, fontWeight:500, whiteSpace:'nowrap', cursor:'pointer', background: filter===f?'#2F4A3B':'#FAF7F2', color: filter===f?'#FAF7F2':'#2F4A3B', border: filter===f?'1.5px solid #2F4A3B':'1.5px solid #DDD5C5', transition:'all 150ms', flexShrink:0 }}>
              {f==='todos'?'Todos':TYPE_LABEL[f]}
            </div>
          ))}
        </div>
        <div style={{ padding:'0 20px 24px', display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map((ex, i) => {
            const tc = TYPE_COLOR[ex.type] || TYPE_COLOR.corpo
            return (
              <div key={i} style={{ background:'#FAF7F2', borderRadius:18, padding:'14px 16px', display:'flex', gap:14, alignItems:'center', boxShadow:'0 2px 10px rgba(47,74,59,0.08)', cursor:'pointer' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'#F3E9DC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{ex.img}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:500, color:'#2F4A3B', marginBottom:4 }}>{ex.name}</div>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <span style={{ background:tc.bg, color:tc.c, borderRadius:100, padding:'2px 9px', fontSize:10, fontWeight:600 }}>{TYPE_LABEL[ex.type]}</span>
                    <span style={{ fontSize:11, color:'#6B7F63' }}>{ex.sets}</span>
                    <span style={{ fontSize:11, color:'#9DB09A' }}>· {ex.rest} descanso</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DB09A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex:1, overflowY:'auto', background:'#F3E9DC' }}>
      <div style={{ background:'#FAF7F2', padding:'16px 20px 20px', borderBottom:'1px solid #DDD5C5' }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:22, fontWeight:600, color:'#2F4A3B', marginBottom:4 }}>Banco de Exercícios</div>
        <div style={{ fontSize:13, color:'#6B7F63' }}>Com peso, sem peso ou só com o corpo 💪</div>
      </div>
      <div style={{ padding:'16px 20px 8px' }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:17, fontWeight:500, color:'#2F4A3B' }}>Por grupo muscular</div>
      </div>
      <div style={{ padding:'0 20px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {MUSCLE_GROUPS.map(g => (
          <div key={g.id} onClick={() => setSelected(g.id)}
            style={{ background: g.full?'linear-gradient(135deg,#2F4A3B,#C49A5A)':'#FAF7F2', borderRadius:18, padding:16, cursor:'pointer', boxShadow: g.full?'0 6px 18px rgba(47,74,59,0.30)':'0 2px 10px rgba(47,74,59,0.08)', gridColumn: g.full?'span 2':'auto', display:'flex', alignItems:'center', gap:12, transition:'transform 150ms' }}
            onMouseEnter={e => (e.currentTarget.style.transform='scale(1.02)')}
            onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}>
            <div style={{ width:44, height:44, borderRadius:12, background: g.full?'rgba(253,248,243,0.2)':g.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{g.emoji}</div>
            <div>
              <div style={{ fontSize:15, fontWeight:500, color: g.full?'#FAF7F2':'#2F4A3B' }}>{g.label}</div>
              <div style={{ fontSize:11, color: g.full?'rgba(253,248,243,0.7)':'#6B7F63', marginTop:2 }}>{EXERCISES[g.id]?.length||3}+ exercícios</div>
            </div>
            <div style={{ marginLeft:'auto' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={g.full?'rgba(253,248,243,0.6)':'#9DB09A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
