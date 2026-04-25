'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import DayDetail from '@/components/DayDetail'

type Profile = { id: string; nome: string | null; peso_inicial: number | null; objetivo: string | null; sequencia_atual: number }
type Enrollment = { id: string; start_date: string }
type Progress = { day: number; completed: boolean }
type Habits = { agua: boolean; proteina: boolean; passos: boolean; treino: boolean }

const HABITS_CONFIG = [
  { id: 'agua'     as const, label: '2L de água',       icon: '💧' },
  { id: 'proteina' as const, label: 'Meta de proteína', icon: '🥩' },
  { id: 'passos'   as const, label: '8.000 passos',     icon: '👟' },
  { id: 'treino'   as const, label: 'Treino do dia',    icon: '🏋️' },
]

export default function ChallengeScreen() {
  const [loading, setLoading]           = useState(true)
  const [profile, setProfile]           = useState<Profile | null>(null)
  const [enrollment, setEnrollment]     = useState<Enrollment | null>(null)
  const [progress, setProgress]         = useState<Progress[]>([])
  const [habits, setHabits]             = useState<Habits>({ agua: false, proteina: false, passos: false, treino: false })
  const [currentWeight, setCurrentWeight] = useState<number | null>(null)
  const [dayDetail, setDayDetail]       = useState<number | null>(null)
  const [savingHabit, setSavingHabit]   = useState<string | null>(null)

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

  const pesoInicial = profile?.peso_inicial ?? null
  const pesoCurrent = currentWeight ?? pesoInicial
  const perdido     = pesoInicial && pesoCurrent ? +(pesoInicial - pesoCurrent).toFixed(1) : null

  const days = Array.from({ length: 21 }, (_, i) => {
    const day  = i + 1
    const prog = progress.find(p => p.day === day)
    return { day, done: prog?.completed ?? false, current: day === currentDay, locked: day > currentDay }
  })

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3E9DC' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: '#2F4A3B', marginBottom: 8 }}>Carregando…</div>
        <div style={{ fontSize: 13, color: '#6B7F63' }}>Buscando seu progresso</div>
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F3E9DC', position: 'relative' }}>

      {/* Header */}
      <div style={{ background: '#FAF7F2', padding: '16px 20px 0', borderBottom: '1px solid #DDD5C5' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 600, color: '#2F4A3B' }}>Desafio 21 Dias</div>
            <div style={{ fontSize: 12, color: '#6B7F63', marginTop: 2 }}>Semana {semana} · Dia {currentDay} de 21</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 700, color: '#2F4A3B' }}>{completedDays}</div>
            <div style={{ fontSize: 9, color: '#6B7F63', letterSpacing: '0.04em', textTransform: 'uppercase' }}>dias feitos</div>
          </div>
        </div>
        <div style={{ height: 5, background: '#D4E3D8', borderRadius: 3, marginBottom: 16 }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg,#2F4A3B,#C49A5A)', borderRadius: 3, transition: 'width 600ms ease' }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 20px 0' }}>
        {[
          { label: 'Peso inicial', value: pesoInicial ? `${pesoInicial} kg` : '—', sub: profile?.objetivo ?? 'meta', tc: '#2F4A3B' },
          { label: perdido !== null && perdido > 0 ? 'Perdido' : 'Peso atual', value: perdido !== null && perdido > 0 ? `−${perdido} kg` : pesoCurrent ? `${pesoCurrent} kg` : '—', sub: perdido !== null && perdido > 0 ? 'continue assim!' : 'registre medidas', tc: '#3A5A42' },
          { label: 'Streak', value: `🔥 ${profile?.sequencia_atual ?? 0}`, sub: 'dias seguidos', tc: '#7A5020' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: '#FAF7F2', borderRadius: 14, padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(47,74,59,0.08)' }}>
            <div style={{ fontSize: 9, color: '#6B7F63', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: s.tc }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#9DB09A', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Today card */}
      <div style={{ padding: '14px 20px 0' }}>
        <div onClick={() => setDayDetail(currentDay)} style={{ background: 'linear-gradient(135deg,#2F4A3B,#C49A5A)', borderRadius: 20, padding: 18, boxShadow: '0 6px 20px rgba(47,74,59,0.28)', cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div style={{ background: 'rgba(253,248,243,0.25)', borderRadius: 8, padding: '3px 10px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#FAF7F2', letterSpacing: '0.06em' }}>DIA {currentDay} · HOJE</span>
            </div>
            {progress.find(p => p.day === currentDay)?.completed && (
              <div style={{ background: 'rgba(253,248,243,0.25)', borderRadius: 8, padding: '3px 10px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#FAF7F2' }}>✓ CONCLUÍDO</span>
              </div>
            )}
          </div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 19, fontWeight: 600, color: '#FAF7F2', marginBottom: 6 }}>
            Toque para ver o dia de hoje
          </div>
          <div style={{ fontSize: 13, color: 'rgba(253,248,243,0.85)', lineHeight: 1.5, marginBottom: 14 }}>
            Acesse a aula, checklist e dica do dia {currentDay}.
          </div>
          <div style={{ background: 'rgba(253,248,243,0.18)', borderRadius: 10, padding: '9px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#FAF7F2' }}>Abrir dia →</span>
          </div>
        </div>
      </div>

      {/* Hábitos */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 500, color: '#2F4A3B' }}>Hábitos de hoje</div>
          <div style={{ fontSize: 12, color: '#6B7F63' }}>{habitsDone}/4 feitos</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {HABITS_CONFIG.map(h => {
            const done = habits[h.id]
            return (
              <div key={h.id} onClick={() => toggleHabit(h.id)}
                style={{ background: done ? '#6B7F63' : '#FAF7F2', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', border: done ? 'none' : '1.5px solid #DDD5C5', transition: 'all 150ms', boxShadow: '0 2px 8px rgba(47,74,59,0.07)', opacity: savingHabit === h.id ? 0.7 : 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: done ? 'rgba(253,248,243,0.25)' : '#F3E9DC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{h.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: done ? '#FAF7F2' : '#2F4A3B' }}>{h.label}</div>
                <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: done ? 'rgba(253,248,243,0.30)' : '#D4E3D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cronograma */}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 500, color: '#2F4A3B' }}>Cronograma</div>
        <div style={{ fontSize: 11, color: '#6B7F63' }}>21 dias</div>
      </div>
      <div style={{ padding: '0 20px 28px', display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
        {days.map(d => (
          <div key={d.day} onClick={() => !d.locked && setDayDetail(d.day)} style={{
            aspectRatio: '1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: d.locked ? 'default' : 'pointer',
            background: d.current ? 'linear-gradient(135deg,#2F4A3B,#C49A5A)' : d.done ? '#6B7F63' : d.locked ? '#EBE0CF' : '#FAF7F2',
            boxShadow: d.current ? '0 4px 10px rgba(47,74,59,0.40)' : 'none',
            border: (!d.done && !d.locked && !d.current) ? '1.5px solid #DDD5C5' : 'none',
          }}>
            <span style={{ fontSize: d.locked ? 10 : 11, fontWeight: 700, color: d.current || d.done ? '#FAF7F2' : d.locked ? '#C4B0A8' : '#6B7F63' }}>
              {d.done && !d.current ? '✓' : d.locked ? '·' : d.day}
            </span>
          </div>
        ))}
      </div>

      {dayDetail && <DayDetail day={dayDetail} onClose={() => { setDayDetail(null); loadData() }} />}
    </div>
  )
}
