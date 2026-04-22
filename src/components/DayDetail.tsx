'use client'

import { useState } from 'react'

const TITLES = ['','Medidas & Peso Inicial','Dieta: Como Montar seu Prato','Treino Full Body',
  'Déficit Calórico na Prática','Caminhada 30 min','Treino HIIT 20 min',
  'Check-in: Peso & Medidas','Treino de Pernas','Alimentação Sem Frescura',
  'Cardio + Hidratação','Treino de Glúteos','Dieta: Substitutos Inteligentes',
  'Treino Full Body','Como Ler Rótulos','Caminhada 45 min',
  'Treino HIIT Avançado','Check-in Semana 2','Treino Abdominal',
  'Receitas Low Carb','Treino Final','Medidas Finais & Resultados 🏆']

const DURATIONS = ['','15 min','20 min','30 min','18 min','35 min','22 min','15 min','28 min',
  '20 min','40 min','25 min','18 min','30 min','15 min','45 min','25 min','15 min','22 min','20 min','30 min','20 min']

const MEALS = [
  { meal: 'Café da manhã', desc: '2 ovos mexidos + 1 fruta + café sem açúcar' },
  { meal: 'Almoço',        desc: 'Frango grelhado + arroz integral + salada à vontade' },
  { meal: 'Lanche',        desc: 'Whey ou iogurte grego + 1 punhado de castanhas' },
  { meal: 'Jantar',        desc: 'Omelete de legumes ou peixe grelhado + vegetais' },
]

const TASKS = [
  { id: 'treino',   label: 'Treino concluído',         emoji: '🏋️' },
  { id: 'agua',     label: '2 litros de água',          emoji: '💧' },
  { id: 'proteina', label: 'Meta de proteína atingida', emoji: '🥩' },
  { id: 'peso',     label: 'Registrou peso/medidas',    emoji: '📏' },
]

interface Props { day: number; onClose: () => void }

export default function DayDetail({ day, onClose }: Props) {
  const [lessonDone, setLessonDone] = useState(false)
  const [checked, setChecked]       = useState<Record<string, boolean>>({})

  const toggle    = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }))
  const doneCount = Object.values(checked).filter(Boolean).length

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#F5EDE3', zIndex: 10,
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
      animation: 'slideUp 280ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      {/* Header gradient */}
      <div style={{ background: 'linear-gradient(160deg,#C9826B,#D4A96A)', padding: '20px 20px 24px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(253,248,243,0.07)' }}/>
        <button onClick={onClose} style={{ background: 'rgba(253,248,243,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FDF8F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ fontSize: 10, color: 'rgba(253,248,243,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Dia {day} de 21</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: '#FDF8F3', lineHeight: 1.2 }}>{TITLES[day]}</div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Lesson card */}
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: 16, boxShadow: '0 3px 12px rgba(74,46,34,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F0D5C8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9826B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#4A2E22' }}>Aula do dia</div>
                <div style={{ fontSize: 11, color: '#8A6A5A' }}>{DURATIONS[day]} · com Josi</div>
              </div>
            </div>
            {lessonDone && <span style={{ background: '#D6E4CE', borderRadius: 100, padding: '3px 9px', fontSize: 10, fontWeight: 600, color: '#3A5A42' }}>✓ Feito</span>}
          </div>
          <div style={{ background: '#EDE0D3', borderRadius: 12, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'absolute', width: 40, height: 40, borderRadius: '50%', background: '#C9826B', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(201,130,107,0.45)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FDF8F3"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <button onClick={() => setLessonDone(true)} style={{ width: '100%', background: lessonDone ? '#8A9E7B' : '#C9826B', color: '#FDF8F3', border: 'none', borderRadius: 100, padding: 11, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', transition: 'background 200ms' }}>
            {lessonDone ? '✓ Aula concluída!' : 'Assistir aula'}
          </button>
        </div>

        {/* Checklist */}
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: 16, boxShadow: '0 3px 12px rgba(74,46,34,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4A2E22' }}>Checklist do dia</div>
            <div style={{ fontSize: 11, color: '#8A6A5A' }}>{doneCount}/{TASKS.length} feitos</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TASKS.map(t => {
              const done = !!checked[t.id]
              return (
                <div key={t.id} onClick={() => toggle(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: done ? '#F0D5C8' : '#F5EDE3', borderRadius: 12, cursor: 'pointer', transition: 'all 150ms' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: done ? '#C9826B' : '#E8D8CC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {done
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FDF8F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <span style={{ fontSize: 12 }}>{t.emoji}</span>}
                  </div>
                  <span style={{ fontSize: 13, color: done ? '#C9826B' : '#4A2E22', fontWeight: done ? 500 : 400, flex: 1 }}>{t.label}</span>
                  {done && <span style={{ fontSize: 11, color: '#C9826B' }}>✓</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Meals */}
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: 16, boxShadow: '0 3px 12px rgba(74,46,34,0.08)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#4A2E22', marginBottom: 10 }}>🥗 Cardápio sugerido</div>
          {MEALS.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: 8, marginBottom: 8, borderBottom: i < 3 ? '1px solid #F0E4DC' : 'none' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#C9826B', letterSpacing: '0.04em', textTransform: 'uppercase', width: 70, flexShrink: 0, paddingTop: 1 }}>{m.meal}</div>
              <div style={{ fontSize: 12, color: '#4A2E22', lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
