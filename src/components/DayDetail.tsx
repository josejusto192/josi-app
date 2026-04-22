'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type ChallengeDay = {
  day: number; titulo: string; descricao: string | null
  video_url: string | null; duracao_min: number | null
  tipo: string | null; dica: string | null
}
type Habits = { agua: boolean; proteina: boolean; passos: boolean; treino: boolean }

interface Props { day: number; onClose: () => void }

function getEmbedUrl(url: string | null): string | null {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s?]+)/)
  if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0`
  return url
}

const TIPO_LABEL: Record<string, string> = {
  treino: '🏋️ Treino', meditacao: '🧘 Meditação', nutricao: '🥗 Nutrição',
  mentalidade: '🧠 Mentalidade', descanso: '😴 Descanso',
}

const TASKS = [
  { id: 'agua'     as const, label: '2 litros de água',          emoji: '💧' },
  { id: 'proteina' as const, label: 'Meta de proteína atingida', emoji: '🥩' },
  { id: 'passos'   as const, label: '8.000 passos',              emoji: '👟' },
  { id: 'treino'   as const, label: 'Treino concluído',          emoji: '🏋️' },
]

export default function DayDetail({ day, onClose }: Props) {
  const [loading, setLoading]       = useState(true)
  const [dayContent, setDayContent] = useState<ChallengeDay | null>(null)
  const [completed, setCompleted]   = useState(false)
  const [habits, setHabits]         = useState<Habits>({ agua: false, proteina: false, passos: false, treino: false })
  const [anotacao, setAnotacao]     = useState('')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)

  const supabase = createClient()

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    const [{ data: content }, { data: prog }, { data: habitsData }] = await Promise.all([
      supabase.from('challenge_days').select('*').eq('day', day).maybeSingle(),
      supabase.from('challenge_progress').select('completed,anotacao').eq('user_id', user.id).eq('day', day).maybeSingle(),
      supabase.from('habits_log').select('agua,proteina,passos,treino').eq('user_id', user.id).eq('date', today).maybeSingle(),
    ])

    setDayContent(content)
    if (prog) { setCompleted(prog.completed); setAnotacao(prog.anotacao ?? '') }
    if (habitsData) setHabits({ agua: habitsData.agua, proteina: habitsData.proteina, passos: habitsData.passos, treino: habitsData.treino })
    setLoading(false)
  }, [day])

  useEffect(() => { loadData() }, [loadData])

  const toggleHabit = async (key: keyof Habits) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const newHabits = { ...habits, [key]: !habits[key] }
    setHabits(newHabits)
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('habits_log').upsert(
      { user_id: user.id, date: today, ...newHabits },
      { onConflict: 'user_id,date' }
    )
  }

  const markComplete = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('challenge_progress').upsert(
      { user_id: user.id, day, completed: true, completed_at: new Date().toISOString(), anotacao: anotacao || null },
      { onConflict: 'user_id,day' }
    )
    setCompleted(true)
    setSaving(false)
    setSaved(true)
  }

  const embedUrl = getEmbedUrl(dayContent?.video_url ?? null)

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F5EDE3', zIndex: 10, display: 'flex', flexDirection: 'column', overflowY: 'auto', animation: 'slideUp 280ms cubic-bezier(0.22,1,0.36,1)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg,#C9826B,#D4A96A)', padding: '20px 20px 24px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(253,248,243,0.07)' }} />
        <button onClick={onClose} style={{ background: 'rgba(253,248,243,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FDF8F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div style={{ fontSize: 10, color: 'rgba(253,248,243,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
          Dia {day} de 21{dayContent?.tipo ? ` · ${TIPO_LABEL[dayContent.tipo] ?? dayContent.tipo}` : ''}
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: '#FDF8F3', lineHeight: 1.2 }}>
          {loading ? '…' : (dayContent?.titulo ?? `Dia ${day}`)}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {dayContent?.duracao_min && (
            <div style={{ background: 'rgba(253,248,243,0.2)', borderRadius: 100, padding: '3px 10px', fontSize: 11, color: '#FDF8F3' }}>⏱ {dayContent.duracao_min} min</div>
          )}
          {completed && (
            <div style={{ background: 'rgba(253,248,243,0.2)', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: '#FDF8F3' }}>✓ Concluído!</div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Vídeo / Aula */}
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: 16, boxShadow: '0 3px 12px rgba(74,46,34,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F0D5C8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9826B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#4A2E22' }}>Aula do dia</div>
              <div style={{ fontSize: 11, color: '#8A6A5A' }}>com Josi</div>
            </div>
          </div>

          {embedUrl ? (
            <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 12, position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe src={embedUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : (
            <div style={{ background: '#EDE0D3', borderRadius: 12, height: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#8A6A5A' }}>Aula em breve</div>
              <div style={{ fontSize: 11, color: '#B89B8C', marginTop: 2 }}>a Josi ainda vai cadastrar 😊</div>
            </div>
          )}

          {dayContent?.descricao && (
            <div style={{ fontSize: 13, color: '#4A2E22', lineHeight: 1.6, marginBottom: dayContent.dica ? 12 : 0 }}>
              {dayContent.descricao}
            </div>
          )}

          {dayContent?.dica && (
            <div style={{ background: '#F0D5C8', borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#C9826B', marginBottom: 3 }}>💡 Dica da Josi</div>
              <div style={{ fontSize: 12, color: '#4A2E22', lineHeight: 1.5 }}>{dayContent.dica}</div>
            </div>
          )}
        </div>

        {/* Checklist hábitos */}
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: 16, boxShadow: '0 3px 12px rgba(74,46,34,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4A2E22' }}>Checklist do dia</div>
            <div style={{ fontSize: 11, color: '#8A6A5A' }}>{Object.values(habits).filter(Boolean).length}/{TASKS.length} feitos</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TASKS.map(t => {
              const done = habits[t.id]
              return (
                <div key={t.id} onClick={() => toggleHabit(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: done ? '#F0D5C8' : '#F5EDE3', borderRadius: 12, cursor: 'pointer', transition: 'all 150ms' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: done ? '#C9826B' : '#E8D8CC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {done ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FDF8F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      : <span style={{ fontSize: 12 }}>{t.emoji}</span>}
                  </div>
                  <span style={{ fontSize: 13, color: done ? '#C9826B' : '#4A2E22', fontWeight: done ? 500 : 400, flex: 1 }}>{t.label}</span>
                  {done && <span style={{ fontSize: 11, color: '#C9826B' }}>✓</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Anotação */}
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: 16, boxShadow: '0 3px 12px rgba(74,46,34,0.08)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#4A2E22', marginBottom: 10 }}>📝 Sua anotação do dia</div>
          <textarea value={anotacao} onChange={e => setAnotacao(e.target.value)}
            placeholder="Como foi seu dia? Alguma conquista ou dificuldade?"
            style={{ width: '100%', minHeight: 80, background: '#F5EDE3', border: '1.5px solid #E8D8CC', borderRadius: 12, padding: '10px 12px', fontSize: 13, color: '#4A2E22', fontFamily: "'DM Sans',sans-serif", resize: 'none', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Botão concluir */}
        {!saved && !completed && (
          <button onClick={markComplete} disabled={saving}
            style={{ width: '100%', background: saving ? '#D4A96A' : '#C9826B', color: '#FDF8F3', border: 'none', borderRadius: 100, padding: 14, fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 200ms', marginBottom: 8 }}>
            {saving ? 'Salvando…' : `✓ Concluir dia ${day}`}
          </button>
        )}
        {(saved || completed) && (
          <div style={{ background: '#8A9E7B', borderRadius: 100, padding: 14, textAlign: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#FDF8F3' }}>🎉 Dia {day} concluído!</span>
          </div>
        )}
      </div>
    </div>
  )
}
