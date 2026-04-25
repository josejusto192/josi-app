'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import DayDetail from '@/components/DayDetail'

type Profile = { id: string; nome: string | null; peso_inicial: number | null; objetivo: string | null; sequencia_atual: number }
type Enrollment = { id: string; start_date: string }
type Progress = { day: number; completed: boolean }
type Habits = { agua: boolean; proteina: boolean; passos: boolean; treino: boolean }

const HABITS_CONFIG: { id: keyof Habits; label: string; sub: string; icon: ReactNode }[] = [
  {
    id: 'agua', label: '2 litros de água', sub: 'Hidratação diária',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  },
  {
    id: 'proteina', label: 'Meta de proteína', sub: 'Nutrição estratégica',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    id: 'passos', label: '8.000 passos', sub: 'Movimento do dia',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M19 9h-5l-2.5 5H8l-2 5"/><path d="M14 14l1 5"/></svg>,
  },
  {
    id: 'treino', label: 'Treino do dia', sub: 'Força e disciplina',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 9.5h3v5H3z"/><path d="M18 9.5h3v5h-3z"/></svg>,
  },
]

function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
        .from('challenge_enrollments').insert({ user_id: user.id, start_date: new Date().toISOString().split('T')[0] }).select().single()
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
    await supabase.from('habits_log').upsert({ user_id: user.id, date: new Date().toISOString().split('T')[0], ...newHabits }, { onConflict: 'user_id,date' })
    setSavingHabit(null)
  }

  const currentDay    = enrollment ? Math.min(Math.max(1, Math.floor((Date.now() - new Date(enrollment.start_date).getTime()) / 86400000) + 1), 21) : 1
  const completedDays = progress.filter(p => p.completed).length
  const progressPct   = (completedDays / 21) * 100
  const semana        = Math.ceil(currentDay / 7)
  const habitsDone    = Object.values(habits).filter(Boolean).length
  const todayDone     = progress.find(p => p.day === currentDay)?.completed ?? false
  const firstName     = profile?.nome?.split(' ')[0] ?? ''
  const diasSeguidos  = profile?.sequencia_atual ?? 0

  const pesoInicial = profile?.peso_inicial ?? null
  const pesoCurrent = currentWeight ?? pesoInicial
  const perdido     = pesoInicial && pesoCurrent ? +(pesoInicial - pesoCurrent).toFixed(1) : null

  const days = Array.from({ length: 21 }, (_, i) => {
    const day = i + 1
    const prog = progress.find(p => p.day === day)
    return { day, done: prog?.completed ?? false, current: day === currentDay, locked: day > currentDay }
  })

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2F4A3B' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid rgba(196,154,90,0.3)', borderTopColor: '#C49A5A', borderRadius: '50%', animation: 'spin 900ms linear infinite', margin: '0 auto 14px' }} />
        <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.5)', letterSpacing: '0.08em', fontFamily:"'Cinzel',serif" }}>CARREGANDO</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F3E9DC' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{ background: '#2F4A3B', padding: '24px 24px 28px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background circle */}
        <div style={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(196,154,90,0.06)', pointerEvents: 'none' }} />

        {/* Greeting */}
        {firstName && (
          <div style={{ fontSize: 13, color: '#C49A5A', fontWeight: 600, marginBottom: 2, letterSpacing: '0.04em' }}>
            Olá, {firstName}!
          </div>
        )}

        {/* Title + week */}
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 600, color: '#FAF7F2', marginBottom: 2 }}>
          Desafio 21 Dias
        </div>
        <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.45)', marginBottom: 24 }}>
          Semana {semana} de 3
        </div>

        {/* Big day display */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 14 }}>
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: 56, fontWeight: 700, color: '#FAF7F2', lineHeight: 1 }}>
            {currentDay}
          </span>
          <span style={{ fontSize: 14, color: 'rgba(250,247,242,0.45)', marginBottom: 8 }}>
            de 21
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ height: 6, background: 'rgba(250,247,242,0.12)', borderRadius: 100 }}>
            <div style={{
              width: `${progressPct}%`, height: '100%',
              background: '#C49A5A', borderRadius: 100,
              transition: 'width 700ms cubic-bezier(0.22,1,0.36,1)',
              minWidth: completedDays > 0 ? 12 : 0,
            }} />
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.45)' }}>
          {completedDays} {completedDays === 1 ? 'dia concluído' : 'dias concluídos'}
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          {diasSeguidos > 0 && (
            <div style={{ background: 'rgba(250,247,242,0.10)', borderRadius: 100, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span style={{ fontSize: 12, color: 'rgba(250,247,242,0.80)', fontWeight: 500 }}>
                {diasSeguidos} {diasSeguidos === 1 ? 'dia seguido' : 'dias seguidos'}
              </span>
            </div>
          )}
          {perdido !== null && perdido > 0 && (
            <div style={{ background: 'rgba(196,154,90,0.18)', borderRadius: 100, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#C49A5A', fontWeight: 600 }}>−{perdido} kg</span>
              <span style={{ fontSize: 12, color: 'rgba(250,247,242,0.50)' }}>perdidos</span>
            </div>
          )}
        </div>
      </div>

      {/* ── CTA DO DIA ──────────────────────────────────────────── */}
      <div style={{ padding: '18px 20px 0' }}>
        <button onClick={() => setDayDetail(currentDay)} style={{ width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
          <div style={{
            background: todayDone ? '#EBF0E8' : '#FAF7F2',
            borderRadius: 18,
            padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 2px 12px rgba(47,74,59,0.08)',
            border: todayDone ? '1.5px solid #C3D4BC' : '1.5px solid #EBE0CF',
          }}>
            {/* Day badge */}
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: todayDone ? '#6B7F63' : '#2F4A3B',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              {todayDone ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 700, color: '#FAF7F2', lineHeight: 1 }}>{currentDay}</span>
                  <span style={{ fontSize: 8, color: 'rgba(250,247,242,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>hoje</span>
                </>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 15, fontWeight: 600, color: '#2F4A3B', marginBottom: 3 }}>
                {todayDone ? 'Dia concluído!' : 'Ver aula de hoje'}
              </div>
              <div style={{ fontSize: 12, color: '#9DB09A' }}>
                {todayDone ? 'Você arrasou hoje 🌿' : 'Aula, missões e dica do dia'}
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C49A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </button>
      </div>

      {/* ── HÁBITOS ─────────────────────────────────────────────── */}
      <div style={{ margin: '16px 20px 0', background: '#FAF7F2', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(47,74,59,0.07)' }}>
        <div style={{ padding: '14px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0E8DC' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 600, color: '#2F4A3B', letterSpacing: '0.04em' }}>Hábitos de hoje</div>
          <div style={{ fontSize: 12, color: habitsDone === 4 ? '#6B7F63' : '#9DB09A', fontWeight: 600 }}>
            {habitsDone === 4 ? '✓ Todos feitos!' : `${habitsDone} de 4`}
          </div>
        </div>
        {HABITS_CONFIG.map((h, i) => {
          const done = habits[h.id]
          return (
            <div key={h.id} onClick={() => toggleHabit(h.id)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 18px',
              borderBottom: i < 3 ? '1px solid #F5EFE6' : 'none',
              cursor: 'pointer',
              opacity: savingHabit === h.id ? 0.6 : 1,
              transition: 'opacity 150ms',
              userSelect: 'none',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: done ? '#2F4A3B' : '#F3E9DC',
                color: done ? '#C49A5A' : '#9DB09A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms',
              }}>
                {h.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: done ? 600 : 400, color: done ? '#2F4A3B' : '#4A5E4C', marginBottom: 1 }}>{h.label}</div>
                <div style={{ fontSize: 11, color: '#9DB09A' }}>{h.sub}</div>
              </div>
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
      <div style={{ margin: '16px 20px 32px', background: '#FAF7F2', borderRadius: 18, padding: '16px 16px 18px', boxShadow: '0 2px 12px rgba(47,74,59,0.07)' }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 600, color: '#2F4A3B', letterSpacing: '0.04em', marginBottom: 14 }}>
          Todos os dias
        </div>
        {[0, 1, 2].map(week => (
          <div key={week} style={{ marginBottom: week < 2 ? 12 : 0 }}>
            <div style={{ fontSize: 9, color: '#C8BEAE', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
              Semana {week + 1}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
              {days.slice(week * 7, week * 7 + 7).map(d => (
                <div key={d.day} onClick={() => !d.locked && setDayDetail(d.day)} style={{
                  aspectRatio: '1', borderRadius: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: d.locked ? 'default' : 'pointer',
                  background: d.current ? '#2F4A3B' : d.done ? '#D4E3D8' : d.locked ? 'transparent' : '#F3E9DC',
                  border: d.locked ? '1px dashed #E0D5C5' : 'none',
                  position: 'relative',
                }}>
                  {d.done && !d.current ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6B7F63" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: d.current ? 700 : 400, color: d.current ? '#FAF7F2' : d.locked ? '#D4CAB8' : '#6B7F63', fontFamily: d.current ? "'Cinzel',serif" : 'inherit' }}>
                      {d.day}
                    </span>
                  )}
                  {d.current && <div style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: '50%', background: '#C49A5A' }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {dayDetail && <DayDetail day={dayDetail} onClose={() => { setDayDetail(null); loadData() }} />}
    </div>
  )
}
