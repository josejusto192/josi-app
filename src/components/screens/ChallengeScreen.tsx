'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import DayDetail from '@/components/DayDetail'

type Profile = { id: string; nome: string | null; peso_inicial: number | null; objetivo: string | null; sequencia_atual: number }
type Enrollment = { id: string; start_date: string }
type Progress = { day: number; completed: boolean }
type Habits = { agua: boolean; proteina: boolean; passos: boolean; treino: boolean }

const HABITS_CONFIG: { id: keyof Habits; label: string; sub: string }[] = [
  { id: 'agua',     label: '2 litros de água',    sub: 'Hidratação diária'     },
  { id: 'proteina', label: 'Meta de proteína',     sub: 'Nutrição estratégica'  },
  { id: 'passos',   label: '8.000 passos',         sub: 'Movimento consciente'  },
  { id: 'treino',   label: 'Treino do dia',        sub: 'Força e disciplina'    },
]

// SVG icon for each habit
const HABIT_ICONS: Record<string, ReactNode> = {
  agua: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  ),
  proteina: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  passos: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 6.5a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4 4z"/>
      <path d="M5 17.5a4 4 0 0 1 4-4h2l3 4H5z"/>
    </svg>
  ),
  treino: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/>
      <path d="M3 9.5h3v5H3z"/><path d="M18 9.5h3v5h-3z"/>
    </svg>
  ),
}

// Circular progress ring
function ProgressRing({ pct, day, total }: { pct: number; day: number; total: number }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
      <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(250,247,242,0.12)" strokeWidth="6"/>
        <circle cx="64" cy="64" r={r} fill="none" stroke="#C49A5A" strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Cinzel',serif", fontSize: 36, fontWeight: 700, color: '#FAF7F2', lineHeight: 1 }}>{day}</span>
        <span style={{ fontSize: 10, color: 'rgba(250,247,242,0.5)', letterSpacing: '0.10em', textTransform: 'uppercase', marginTop: 2 }}>de {total}</span>
      </div>
    </div>
  )
}

// Checkmark SVG
function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export default function ChallengeScreen() {
  const [loading, setLoading]       = useState(true)
  const [profile, setProfile]       = useState<Profile | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [progress, setProgress]     = useState<Progress[]>([])
  const [habits, setHabits]         = useState<Habits>({ agua: false, proteina: false, passos: false, treino: false })
  const [currentWeight, setCurrentWeight] = useState<number | null>(null)
  const [dayDetail, setDayDetail]   = useState<number | null>(null)
  const [savingHabit, setSavingHabit] = useState<string | null>(null)

  const supabase = createClient()

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: profileData }, { data: enrollmentData }, { data: progressData }, { data: habitsData }, { data: measureData }] = await Promise.all([
      supabase.from('profiles').select('id,nome,peso_inicial,objetivo,sequencia_atual').eq('id', user.id).single(),
      supabase.from('challenge_enrollments').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('challenge_progress').select('day,completed').eq('user_id', user.id),
      supabase.from('habits_log').select('agua,proteina,passos,treino').eq('user_id', user.id).eq('date', new Date().toISOString().split('T')[0]).maybeSingle(),
      supabase.from('measurements').select('peso').eq('user_id', user.id).order('date', { ascending: false }).limit(1).maybeSingle(),
    ])

    setProfile(profileData)
    setProgress(progressData ?? [])
    if (habitsData) setHabits({ agua: habitsData.agua, proteina: habitsData.proteina, passos: habitsData.passos, treino: habitsData.treino })
    setCurrentWeight(measureData?.peso ?? null)

    if (enrollmentData) {
      setEnrollment(enrollmentData)
    } else {
      const { data: newEnrollment } = await supabase
        .from('challenge_enrollments')
        .insert({ user_id: user.id, start_date: new Date().toISOString().split('T')[0] })
        .select().single()
      setEnrollment(newEnrollment)
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const toggleHabit = async (key: keyof Habits) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || savingHabit) return
    const newHabits = { ...habits, [key]: !habits[key] }
    setHabits(newHabits)
    setSavingHabit(key)
    await supabase.from('habits_log').upsert(
      { user_id: user.id, date: new Date().toISOString().split('T')[0], ...newHabits },
      { onConflict: 'user_id,date' }
    )
    setSavingHabit(null)
  }

  const currentDay    = enrollment ? Math.min(Math.max(1, Math.floor((Date.now() - new Date(enrollment.start_date).getTime()) / 86400000) + 1), 21) : 1
  const completedDays = progress.filter(p => p.completed).length
  const progressPct   = (completedDays / 21) * 100
  const semana        = Math.ceil(currentDay / 7)
  const habitsDone    = Object.values(habits).filter(Boolean).length
  const todayDone     = progress.find(p => p.day === currentDay)?.completed ?? false

  const pesoInicial = profile?.peso_inicial ?? null
  const pesoCurrent = currentWeight ?? pesoInicial
  const perdido     = pesoInicial && pesoCurrent ? +(pesoInicial - pesoCurrent).toFixed(1) : null

  const days = Array.from({ length: 21 }, (_, i) => {
    const day  = i + 1
    const prog = progress.find(p => p.day === day)
    return { day, done: prog?.completed ?? false, current: day === currentDay, locked: day > currentDay }
  })

  const firstName = profile?.nome?.split(' ')[0] ?? ''

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2F4A3B' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid rgba(196,154,90,0.3)', borderTopColor: '#C49A5A', borderRadius: '50%', animation: 'spin 900ms linear infinite', margin: '0 auto 16px' }} />
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: 'rgba(250,247,242,0.6)', letterSpacing: '0.08em' }}>CARREGANDO</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F3E9DC' }}>

      {/* ── HERO — dark green immersive header ──────────────────── */}
      <div style={{
        background: '#243A2D',
        padding: '24px 24px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative arcs */}
        <svg style={{ position: 'absolute', top: -40, right: -40, opacity: 0.06 }} width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#C49A5A" strokeWidth="40"/>
        </svg>
        <svg style={{ position: 'absolute', bottom: -20, left: 10, opacity: 0.05 }} width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#FAF7F2" strokeWidth="30"/>
        </svg>

        {/* Greeting */}
        <div style={{ marginBottom: 24 }}>
          {firstName && (
            <div style={{ fontSize: 12, color: '#C49A5A', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
              Olá, {firstName}
            </div>
          )}
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 600, color: '#FAF7F2', letterSpacing: '0.04em', lineHeight: 1.2 }}>
            Desafio 21 Dias
          </div>
          <div style={{ fontSize: 13, color: 'rgba(250,247,242,0.45)', marginTop: 4 }}>
            Semana {semana} · {completedDays} dias concluídos
          </div>
        </div>

        {/* Progress ring + stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <ProgressRing pct={progressPct} day={currentDay} total={21} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Streak */}
            <div>
              <div style={{ fontSize: 10, color: 'rgba(250,247,242,0.4)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 2 }}>Streak</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 700, color: '#FAF7F2', lineHeight: 1 }}>
                {profile?.sequencia_atual ?? 0}
                <span style={{ fontSize: 12, fontWeight: 400, color: '#C49A5A', marginLeft: 4 }}>dias</span>
              </div>
            </div>

            {/* Peso */}
            <div>
              <div style={{ fontSize: 10, color: 'rgba(250,247,242,0.4)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 2 }}>
                {perdido !== null && perdido > 0 ? 'Perdido' : 'Peso atual'}
              </div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 700, color: perdido !== null && perdido > 0 ? '#C49A5A' : '#FAF7F2', lineHeight: 1 }}>
                {perdido !== null && perdido > 0 ? `−${perdido}` : pesoCurrent ?? '—'}
                <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(250,247,242,0.4)', marginLeft: 4 }}>kg</span>
              </div>
            </div>

            {/* Hábitos hoje */}
            <div>
              <div style={{ fontSize: 10, color: 'rgba(250,247,242,0.4)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6 }}>Hábitos hoje</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: i < habitsDone ? '#C49A5A' : 'rgba(250,247,242,0.15)',
                    transition: 'background 300ms',
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TODAY CTA ───────────────────────────────────────────── */}
      <div style={{ padding: '20px 20px 0' }}>
        <button
          onClick={() => setDayDetail(currentDay)}
          style={{
            width: '100%', background: 'none', border: 'none', padding: 0,
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div style={{
            background: '#2F4A3B',
            borderRadius: 20,
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 28px rgba(47,74,59,0.22)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle texture ring */}
            <svg style={{ position: 'absolute', right: -20, top: -20, opacity: 0.08 }} width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#C49A5A" strokeWidth="20"/>
            </svg>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#C49A5A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Dia {currentDay} · Hoje
                </span>
                {todayDone && (
                  <span style={{ fontSize: 10, color: 'rgba(250,247,242,0.5)', letterSpacing: '0.06em' }}>· Concluído</span>
                )}
              </div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#FAF7F2', letterSpacing: '0.03em', lineHeight: 1.2, marginBottom: 4 }}>
                {todayDone ? 'Dia completo ✓' : 'Ver aula e checklist'}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.5)' }}>
                {todayDone ? 'Você arrasou hoje!' : 'Aula, dica e missões do dia'}
              </div>
            </div>

            <div style={{
              position: 'relative', zIndex: 1,
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(196,154,90,0.18)',
              border: '1.5px solid rgba(196,154,90,0.40)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C49A5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* ── HÁBITOS ─────────────────────────────────────────────── */}
      <div style={{ margin: '20px 20px 0', background: '#FAF7F2', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(47,74,59,0.07)' }}>
        <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0E8DC' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 600, color: '#2F4A3B', letterSpacing: '0.04em' }}>Hábitos de hoje</div>
          <div style={{ fontSize: 11, color: '#C49A5A', fontWeight: 600, letterSpacing: '0.04em' }}>{habitsDone} / 4</div>
        </div>

        {HABITS_CONFIG.map((h, i) => {
          const done = habits[h.id]
          const saving = savingHabit === h.id
          return (
            <div
              key={h.id}
              onClick={() => toggleHabit(h.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px',
                borderBottom: i < 3 ? '1px solid #F3EDE4' : 'none',
                cursor: 'pointer',
                opacity: saving ? 0.6 : 1,
                transition: 'opacity 150ms',
                userSelect: 'none',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: done ? '#2F4A3B' : '#F3E9DC',
                color: done ? '#C49A5A' : '#9DB09A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms',
              }}>
                {HABIT_ICONS[h.id]}
              </div>

              {/* Labels */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: done ? 600 : 400, color: done ? '#2F4A3B' : '#4A5E4C', marginBottom: 1, transition: 'font-weight 150ms' }}>
                  {h.label}
                </div>
                <div style={{ fontSize: 11, color: '#9DB09A' }}>{h.sub}</div>
              </div>

              {/* Checkbox */}
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: done ? '#2F4A3B' : 'transparent',
                border: done ? 'none' : '1.5px solid #DDD5C5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms',
              }}>
                {done && <Check />}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── CRONOGRAMA ──────────────────────────────────────────── */}
      <div style={{ margin: '20px 20px 0', background: '#FAF7F2', borderRadius: 20, padding: '16px 18px 18px', boxShadow: '0 2px 12px rgba(47,74,59,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 600, color: '#2F4A3B', letterSpacing: '0.04em' }}>Cronograma</div>
          <div style={{ fontSize: 11, color: '#9DB09A', letterSpacing: '0.04em' }}>21 dias</div>
        </div>

        {/* 3 weeks as rows */}
        {[0, 1, 2].map(week => (
          <div key={week} style={{ marginBottom: week < 2 ? 10 : 0 }}>
            <div style={{ fontSize: 9, color: '#C8BEAE', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
              Semana {week + 1}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
              {days.slice(week * 7, week * 7 + 7).map(d => (
                <div
                  key={d.day}
                  onClick={() => !d.locked && setDayDetail(d.day)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: d.locked ? 'default' : 'pointer',
                    background: d.current
                      ? '#2F4A3B'
                      : d.done
                        ? '#D4E3D8'
                        : d.locked
                          ? 'transparent'
                          : '#F3E9DC',
                    border: d.locked ? '1px dashed #E0D5C5' : d.current ? 'none' : 'none',
                    position: 'relative',
                    transition: 'transform 100ms',
                  }}
                >
                  {d.done && !d.current ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7F63" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <span style={{
                      fontSize: 11, fontWeight: d.current ? 700 : 400,
                      color: d.current ? '#FAF7F2' : d.locked ? '#D4CAB8' : '#6B7F63',
                      fontFamily: d.current ? "'Cinzel',serif" : 'inherit',
                    }}>
                      {d.day}
                    </span>
                  )}
                  {/* Golden dot for today */}
                  {d.current && (
                    <div style={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: '50%', background: '#C49A5A' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── QUOTE strip ─────────────────────────────────────────── */}
      <div style={{ margin: '20px 20px 32px', padding: '18px 22px', background: '#2F4A3B', borderRadius: 16 }}>
        <div style={{ fontSize: 10, color: '#C49A5A', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Frase do dia</div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: 'rgba(250,247,242,0.85)', lineHeight: 1.6, fontWeight: 400, letterSpacing: '0.02em' }}>
          "O progresso, não a perfeição, é o que importa."
        </div>
      </div>

      {dayDetail && <DayDetail day={dayDetail} onClose={() => { setDayDetail(null); loadData() }} />}
    </div>
  )
}
