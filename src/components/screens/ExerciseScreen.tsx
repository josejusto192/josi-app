'use client'

import { useState } from 'react'

const MUSCLE_GROUPS = [
  {
    id: 'peito', label: 'Peito', sub: 'Peitoral e anterior',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h6l2 4-4 2-4-6z"/><path d="M20 4h-6l-2 4 4 2 4-6z"/><path d="M8 10l-2 10h12l-2-10"/></svg>,
  },
  {
    id: 'costas', label: 'Costas', sub: 'Dorsal e lombar',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M4 6l8-4 8 4M4 18l8 4 8-4M4 12h16"/></svg>,
  },
  {
    id: 'pernas', label: 'Pernas', sub: 'Quadríceps e isquio',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3h8v8l-2 10H10L8 11V3z"/><path d="M8 8h8"/></svg>,
  },
  {
    id: 'ombros', label: 'Ombros', sub: 'Deltoides',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M4 12c0-2 3-4 8-4s8 2 8 4"/><path d="M7 12v8m10-8v8"/></svg>,
  },
  {
    id: 'biceps', label: 'Bíceps', sub: 'Braço anterior',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6"/><path d="M12 6V3"/><path d="M12 18v3"/></svg>,
  },
  {
    id: 'triceps', label: 'Tríceps', sub: 'Braço posterior',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5l14 14M5 19L19 5"/><circle cx="12" cy="12" r="4"/></svg>,
  },
  {
    id: 'abdomen', label: 'Abdômen', sub: 'Core e oblíquos',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M6 9h12M6 14h12"/></svg>,
  },
  {
    id: 'gluteos', label: 'Glúteos', sub: 'Glúteo e posterior',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8"/><path d="M12 21c2.2 0 4-3.6 4-8s-1.8-8-4-8"/></svg>,
  },
  {
    id: 'fullbody', label: 'Corpo Todo', sub: 'Treino completo', full: true,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><path d="M15 8H9l-2 6h10l-2-6z"/><path d="M9 14l-2 6"/><path d="M15 14l2 6"/></svg>,
  },
]

const EXERCISES: Record<string, Array<{ name: string; type: string; sets: string; rest: string }>> = {
  peito: [
    { name: 'Flexão de Braço',   type: 'corpo', sets: '3×12', rest: '60s' },
    { name: 'Flexão Inclinada',  type: 'corpo', sets: '3×10', rest: '60s' },
    { name: 'Supino com Halter', type: 'peso',  sets: '4×10', rest: '90s' },
    { name: 'Crucifixo',         type: 'peso',  sets: '3×12', rest: '60s' },
  ],
  pernas: [
    { name: 'Agachamento Livre',     type: 'corpo',    sets: '4×15', rest: '60s' },
    { name: 'Agachamento c/ Halter', type: 'peso',     sets: '4×12', rest: '90s' },
    { name: 'Avanço',                type: 'corpo',    sets: '3×12', rest: '60s' },
    { name: 'Elevação Pélvica',      type: 'corpo',    sets: '4×15', rest: '45s' },
    { name: 'Leg Press',             type: 'aparelho', sets: '4×12', rest: '90s' },
  ],
  gluteos: [
    { name: 'Elevação Pélvica',   type: 'corpo', sets: '4×15', rest: '45s' },
    { name: 'Agachamento Sumo',   type: 'corpo', sets: '4×12', rest: '60s' },
    { name: 'Avanço Lateral',     type: 'corpo', sets: '3×12', rest: '60s' },
    { name: 'Glúteo 4 Apoios',    type: 'corpo', sets: '3×15', rest: '45s' },
  ],
}

const TYPE_LABEL: Record<string, string> = { corpo: 'Sem peso', peso: 'Com halter', aparelho: 'Aparelho' }
const TYPE_COLOR: Record<string, { bg: string; c: string }> = {
  corpo:    { bg: '#D4E3D8', c: '#2F4A3B' },
  peso:     { bg: '#EDD9B0', c: '#7A5020' },
  aparelho: { bg: '#D6E4CE', c: '#3A5A42' },
}

export default function ExerciseScreen() {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter]     = useState('todos')

  const group     = MUSCLE_GROUPS.find(g => g.id === selected)
  const exercises = selected ? (EXERCISES[selected] ?? [
    { name: 'Exercício A', type: 'corpo', sets: '3×12', rest: '60s' },
    { name: 'Exercício B', type: 'peso',  sets: '4×10', rest: '90s' },
  ]) : []
  const filtered  = filter === 'todos' ? exercises : exercises.filter(e => e.type === filter)

  /* ── Exercise list view ── */
  if (selected) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', background: '#F3E9DC' }}>

        {/* Sub-header */}
        <div style={{ background: '#FAF7F2', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #EBE0CF' }}>
          <button onClick={() => { setSelected(null); setFilter('todos') }}
            style={{ width: 36, height: 36, borderRadius: 12, background: '#F3E9DC', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2F4A3B', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B' }}>{group?.label}</div>
            <div style={{ fontSize: 11, color: '#9DB09A' }}>{exercises.length} exercícios</div>
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto' }}>
          {(['todos', 'corpo', 'peso', 'aparelho'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600,
              whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0, border: 'none',
              background: filter === f ? '#2F4A3B' : '#FAF7F2',
              color: filter === f ? '#FAF7F2' : '#6B7F63',
              boxShadow: filter === f ? '0 2px 8px rgba(47,74,59,0.20)' : 'none',
              transition: 'all 150ms',
            }}>
              {f === 'todos' ? 'Todos' : TYPE_LABEL[f]}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((ex, i) => {
            const tc = TYPE_COLOR[ex.type] ?? TYPE_COLOR.corpo
            return (
              <div key={i} style={{ background: '#FAF7F2', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 8px rgba(47,74,59,0.06)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: tc.bg, border: `2px solid ${tc.c}`, flexShrink: 0, opacity: 0.7 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#2F4A3B', marginBottom: 4 }}>{ex.name}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: tc.bg, color: tc.c, borderRadius: 100, padding: '2px 10px', fontSize: 10, fontWeight: 700 }}>{TYPE_LABEL[ex.type]}</span>
                    <span style={{ fontSize: 12, color: '#6B7F63', fontWeight: 500 }}>{ex.sets}</span>
                    <span style={{ fontSize: 11, color: '#9DB09A' }}>· {ex.rest} descanso</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ── Muscle group grid ── */
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F3E9DC' }}>

      {/* Hero banner */}
      <div style={{ background: '#2F4A3B', padding: '22px 24px 26px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, bottom: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(196,154,90,0.07)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 11, color: '#C49A5A', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>Academia em casa</div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 600, color: '#FAF7F2', marginBottom: 4 }}>Exercícios</div>
        <div style={{ fontSize: 13, color: 'rgba(250,247,242,0.45)' }}>Escolha o grupo muscular para treinar</div>
      </div>

      {/* Grid */}
      <div style={{ padding: '16px 20px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {MUSCLE_GROUPS.map(g => (
          <div
            key={g.id}
            onClick={() => setSelected(g.id)}
            style={{
              background: g.full ? '#2F4A3B' : '#FAF7F2',
              borderRadius: 18,
              padding: '18px 16px',
              cursor: 'pointer',
              boxShadow: g.full ? '0 6px 20px rgba(47,74,59,0.22)' : '0 1px 8px rgba(47,74,59,0.06)',
              gridColumn: g.full ? 'span 2' : 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: g.full ? 16 : 12,
              transition: 'transform 120ms, box-shadow 120ms',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.015)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: g.full ? 'rgba(250,247,242,0.12)' : '#F3E9DC',
              color: g.full ? '#C49A5A' : '#6B7F63',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {g.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: g.full ? '#FAF7F2' : '#2F4A3B', marginBottom: 2 }}>{g.label}</div>
              <div style={{ fontSize: 11, color: g.full ? 'rgba(250,247,242,0.50)' : '#9DB09A' }}>{g.sub}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={g.full ? 'rgba(196,154,90,0.7)' : '#C8BEAE'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}
