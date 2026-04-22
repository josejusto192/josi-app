'use client'

import { useState } from 'react'
import DayDetail from '@/components/DayDetail'

const CHALLENGE_DAYS = Array.from({ length: 21 }, (_, i) => ({
  day: i + 1,
  title: ['Medidas & Peso Inicial','Dieta: Como Montar seu Prato','Treino Full Body',
    'Déficit Calórico na Prática','Caminhada 30 min','Treino HIIT 20 min',
    'Check-in: Peso & Medidas','Treino de Pernas','Alimentação Sem Frescura',
    'Cardio + Hidratação','Treino de Glúteos','Dieta: Substitutos Inteligentes',
    'Treino Full Body','Como Ler Rótulos','Caminhada 45 min',
    'Treino HIIT Avançado','Check-in Semana 2','Treino Abdominal',
    'Receitas Low Carb','Treino Final','Medidas Finais & Resultados 🏆'][i],
  done: i < 7, locked: i > 7, current: i === 7,
}))

const HABITS = [
  { id: 'agua',     label: '2L de água',       icon: '💧', done: true  },
  { id: 'proteina', label: 'Meta de proteína', icon: '🥩', done: true  },
  { id: 'passos',   label: '8.000 passos',     icon: '👟', done: false },
  { id: 'treino',   label: 'Treino do dia',    icon: '🏋️', done: false },
]

export default function ChallengeScreen() {
  const [habits, setHabits]       = useState(HABITS.reduce((a, h) => ({ ...a, [h.id]: h.done }), {} as Record<string, boolean>))
  const [dayDetail, setDayDetail] = useState<number | null>(null)

  const habitsDone = Object.values(habits).filter(Boolean).length
  const progress   = (7 / 21) * 100

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F5EDE3', position: 'relative' }}>
      {/* Header */}
      <div style={{ background: '#FDF8F3', padding: '16px 20px 0', borderBottom: '1px solid #E8D8CC' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: '#4A2E22' }}>Desafio 21 Dias</div>
            <div style={{ fontSize: 12, color: '#8A6A5A', marginTop: 2 }}>Semana 2 · Dia 8 de 21</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: '#C9826B' }}>7</div>
            <div style={{ fontSize: 9, color: '#8A6A5A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>dias feitos</div>
          </div>
        </div>
        <div style={{ height: 5, background: '#F0D5C8', borderRadius: 3, marginBottom: 16 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#C9826B,#D4A96A)', borderRadius: 3 }}/>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 20px 0' }}>
        {[
          { label: 'Peso inicial', value: '72 kg',   sub: 'meta: 65 kg',  tc: '#C9826B' },
          { label: 'Perdido',      value: '−1,4 kg', sub: 'falta 5,6 kg', tc: '#3A5A42' },
          { label: 'Streak',       value: '🔥 7',    sub: 'dias seguidos', tc: '#7A5020' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#FDF8F3', borderRadius: 14, padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(74,46,34,0.08)' }}>
            <div style={{ fontSize: 9, color: '#8A6A5A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: s.tc }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#B89B8C', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Today card */}
      <div style={{ padding: '14px 20px 0' }}>
        <div onClick={() => setDayDetail(8)} style={{ background: 'linear-gradient(135deg,#C9826B,#D4A96A)', borderRadius: 20, padding: 18, boxShadow: '0 6px 20px rgba(201,130,107,0.28)', cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div style={{ background: 'rgba(253,248,243,0.25)', borderRadius: 8, padding: '3px 10px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#FDF8F3', letterSpacing: '0.06em' }}>DIA 8 · HOJE</span>
            </div>
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 600, color: '#FDF8F3', marginBottom: 6 }}>Treino de Pernas</div>
          <div style={{ fontSize: 13, color: 'rgba(253,248,243,0.85)', lineHeight: 1.5, marginBottom: 14 }}>
            Agachamento, avanço e elevação pélvica. Sem equipamento, em casa mesmo.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'Aula',   sub: '22 min' },
              { label: 'Tarefa', sub: 'Registrar' },
              { label: 'Dieta',  sub: 'Cardápio' },
            ].map(b => (
              <div key={b.label} style={{ flex: 1, background: 'rgba(253,248,243,0.18)', borderRadius: 10, padding: '9px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#FDF8F3' }}>{b.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(253,248,243,0.7)' }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Habits */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 500, color: '#4A2E22' }}>Hábitos de hoje</div>
          <div style={{ fontSize: 12, color: '#8A6A5A' }}>{habitsDone}/4 feitos</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {HABITS.map(h => {
            const done = habits[h.id]
            return (
              <div key={h.id} onClick={() => setHabits(p => ({ ...p, [h.id]: !p[h.id] }))}
                style={{ background: done ? '#8A9E7B' : '#FDF8F3', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', border: done ? 'none' : '1.5px solid #E8D8CC', transition: 'all 150ms', boxShadow: '0 2px 8px rgba(74,46,34,0.07)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: done ? 'rgba(253,248,243,0.25)' : '#F5EDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{h.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: done ? '#FDF8F3' : '#4A2E22' }}>{h.label}</div>
                <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: done ? 'rgba(253,248,243,0.30)' : '#F0D5C8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FDF8F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Days grid */}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 500, color: '#4A2E22' }}>Cronograma</div>
        <div style={{ fontSize: 11, color: '#8A6A5A' }}>21 dias</div>
      </div>
      <div style={{ padding: '0 20px 28px', display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
        {CHALLENGE_DAYS.map(d => (
          <div key={d.day} onClick={() => !d.locked && setDayDetail(d.day)} style={{
            aspectRatio: '1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: d.locked ? 'default' : 'pointer',
            background: d.current ? 'linear-gradient(135deg,#C9826B,#D4A96A)' : d.done ? '#8A9E7B' : d.locked ? '#EDE0D3' : '#FDF8F3',
            boxShadow: d.current ? '0 4px 10px rgba(201,130,107,0.40)' : 'none',
            border: (!d.done && !d.locked && !d.current) ? '1.5px solid #E8D8CC' : 'none',
          }}>
            <span style={{ fontSize: d.locked ? 10 : 11, fontWeight: 700, color: d.current || d.done ? '#FDF8F3' : d.locked ? '#C4B0A8' : '#8A6A5A' }}>
              {d.done && !d.current ? '✓' : d.locked ? '·' : d.day}
            </span>
          </div>
        ))}
      </div>

      {/* Day detail overlay */}
      {dayDetail && <DayDetail day={dayDetail} onClose={() => setDayDetail(null)} />}
    </div>
  )
}
