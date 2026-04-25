'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import LessonViewer from './LessonViewer'
import { CourseType, CAT_GRADIENT, CAT_EMOJI, CAT_LABEL } from '@/components/screens/EducationScreen'

type Lesson = { id: string; titulo: string; tipo: string; duracao_min: number | null; ordem: number; is_premium: boolean; module_id: string }
type Module = { id: string; titulo: string; ordem: number; lessons?: Lesson[] }

const TIPO_ICON: Record<string, string> = { video: '▶', texto: '📄', markdown: '📝', imagem: '🖼', pdf: '📋' }
const TIPO_LABEL: Record<string, string> = { video: 'Vídeo', texto: 'Texto', markdown: 'Artigo', imagem: 'Imagem', pdf: 'PDF' }

export default function CourseDetail({ course, userId, onBack, onLessonComplete }: {
  course: CourseType
  userId: string | null
  onBack: () => void
  onLessonComplete: (lessonId: string) => void
}) {
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set())
  const [openModule, setOpenModule]     = useState<string | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)

  const grad = CAT_GRADIENT[course.categoria] ?? CAT_GRADIENT.nutricao

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    supabase.from('lesson_progress').select('lesson_id').eq('user_id', userId).then(({ data }) => {
      if (data) setCompletedSet(new Set(data.map((r: { lesson_id: string }) => r.lesson_id)))
    })
    // Open first module by default
    if (course.modules?.[0]) setOpenModule(course.modules[0].id)
  }, [userId, course.modules])

  const allLessons = (course.modules ?? []).flatMap(m => m.lessons ?? [])
  const totalMin   = allLessons.reduce((s, l) => s + (l.duracao_min ?? 0), 0)
  const h = Math.floor(totalMin / 60), m = totalMin % 60
  const durStr = h > 0 ? `${h}h${m > 0 ? m + 'min' : ''}` : `${m}min`
  const completedCount = allLessons.filter(l => completedSet.has(l.id)).length
  const pct = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0

  const handleLessonDone = async (lessonId: string) => {
    if (!userId || completedSet.has(lessonId)) return
    const supabase = createClient()
    await supabase.from('lesson_progress').upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' })
    setCompletedSet(prev => new Set([...prev, lessonId]))
    onLessonComplete(lessonId)
  }

  if (activeLesson) {
    return (
      <LessonViewer
        lessonId={activeLesson.id}
        onBack={() => setActiveLesson(null)}
        onComplete={() => handleLessonDone(activeLesson.id)}
        isCompleted={completedSet.has(activeLesson.id)}
        courseGradient={grad}
      />
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F3E9DC' }}>
      {/* Hero */}
      <div style={{ background: grad, padding: '0 0 0', position: 'relative' }}>
        <button onClick={onBack}
          style={{ position: 'absolute', top: 16, left: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        {course.is_premium && (
          <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.25)', borderRadius: 100, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: '#FAF7F2' }}>✦ PREMIUM</div>
        )}
        <div style={{ padding: '52px 20px 24px' }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>{CAT_EMOJI[course.categoria]}</div>
          <div style={{ fontSize: 9, color: 'rgba(253,248,243,0.75)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 6 }}>{CAT_LABEL[course.categoria]}</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 600, color: '#FAF7F2', lineHeight: 1.2, marginBottom: 10 }}>{course.titulo}</div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            {[
              `${allLessons.length} aulas`,
              durStr,
              `${(course.modules ?? []).length} módulos`,
            ].map(t => (
              <span key={t} style={{ fontSize: 11, color: 'rgba(253,248,243,0.8)', background: 'rgba(0,0,0,0.15)', borderRadius: 100, padding: '3px 10px' }}>{t}</span>
            ))}
          </div>
          {pct > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'rgba(253,248,243,0.75)' }}>{completedCount} de {allLessons.length} aulas concluídas</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#FAF7F2' }}>{pct}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 3 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'rgba(255,255,255,0.85)', borderRadius: 3 }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Descrição */}
      {course.descricao && (
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ background: '#FAF7F2', borderRadius: 16, padding: '14px 16px', fontSize: 13, color: '#2F4A3B', lineHeight: 1.65, boxShadow: '0 2px 8px rgba(47,74,59,0.07)' }}>
            {course.descricao}
          </div>
        </div>
      )}

      {/* Módulos */}
      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(course.modules ?? []).map((mod: Module, idx: number) => {
          const modLessons = mod.lessons ?? []
          const modCompleted = modLessons.filter(l => completedSet.has(l.id)).length
          const isOpen = openModule === mod.id
          return (
            <div key={mod.id} style={{ background: '#FAF7F2', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(47,74,59,0.08)' }}>
              {/* Module header */}
              <div onClick={() => setOpenModule(isOpen ? null : mod.id)}
                style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: isOpen ? '#FAF3EE' : '#FAF7F2' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FAF7F2', flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#2F4A3B', marginBottom: 2 }}>{mod.titulo}</div>
                  <div style={{ fontSize: 11, color: '#6B7F63' }}>
                    {modLessons.length} aulas
                    {modCompleted > 0 && <span style={{ color: '#6B7F63', marginLeft: 6 }}>· {modCompleted} concluídas</span>}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9DB09A" strokeWidth="2" strokeLinecap="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {/* Lessons list */}
              {isOpen && (
                <div style={{ borderTop: '1px solid #F0E4DC' }}>
                  {modLessons.map((lesson, li) => {
                    const done = completedSet.has(lesson.id)
                    return (
                      <div key={lesson.id} onClick={() => setActiveLesson(lesson)}
                        style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: li < modLessons.length - 1 ? '1px solid #F3E9DC' : 'none', background: done ? '#F8FCF6' : '#FAF7F2' }}>
                        {/* Completion dot */}
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#6B7F63' : '#D4E3D8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>
                          {done ? <span style={{ color: '#FAF7F2', fontSize: 12 }}>✓</span> : <span style={{ color: '#2F4A3B' }}>{TIPO_ICON[lesson.tipo] ?? '▶'}</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: done ? 400 : 500, color: done ? '#6B7F63' : '#2F4A3B', marginBottom: 2 }}>{lesson.titulo}</div>
                          <div style={{ fontSize: 11, color: '#9DB09A', display: 'flex', gap: 8 }}>
                            <span>{TIPO_LABEL[lesson.tipo] ?? lesson.tipo}</span>
                            {lesson.duracao_min && <span>· {lesson.duracao_min}min</span>}
                            {lesson.is_premium && <span style={{ color: '#C49A5A' }}>· ✦ Premium</span>}
                          </div>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2F4A3B" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
