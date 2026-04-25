'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import CourseDetail from '@/components/education/CourseDetail'

type Lesson = { id: string; titulo: string; tipo: string; duracao_min: number | null; ordem: number; is_premium: boolean; module_id: string }
type Module = { id: string; titulo: string; ordem: number; lessons?: Lesson[] }
export type CourseType = {
  id: string; titulo: string; descricao: string | null; categoria: string
  is_premium: boolean; ordem: number; thumbnail_url: string | null
  modules?: Module[]; totalLessons?: number; completedLessons?: number
}

export const CAT_GRADIENT: Record<string, string> = {
  nutricao:    'linear-gradient(135deg,#2F4A3B,#C49A5A)',
  mentalidade: 'linear-gradient(135deg,#6B7F63,#A8BE98)',
  receitas:    'linear-gradient(135deg,#C49A5A,#E8C878)',
  treino:      'linear-gradient(135deg,#6BA3BE,#8ABCD6)',
  saude:       'linear-gradient(135deg,#A06858,#2F4A3B)',
  beleza:      'linear-gradient(135deg,#A0526A,#C87090)',
}
export const CAT_EMOJI: Record<string, string> = {
  nutricao:'🥗', mentalidade:'🧠', receitas:'🍳', treino:'💪', saude:'❤️', beleza:'🌸',
}
export const CAT_LABEL: Record<string, string> = {
  nutricao:'Nutrição', mentalidade:'Mentalidade', receitas:'Receitas',
  treino:'Treino', saude:'Saúde', beleza:'Beleza',
}

export default function EducationScreen() {
  const [courses, setCourses]     = useState<CourseType[]>([])
  const [loading, setLoading]     = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null)
  const [userId, setUserId]       = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const uid = user?.id ?? null
      setUserId(uid)

      const { data: coursesData } = await supabase
        .from('courses')
        .select('*, modules:course_modules(*, lessons:lessons(id,titulo,tipo,duracao_min,ordem,is_premium,module_id))')
        .eq('is_published', true)
        .order('ordem')

      if (!coursesData) { setLoading(false); return }

      let completedSet = new Set<string>()
      if (uid) {
        const { data: prog } = await supabase.from('lesson_progress').select('lesson_id').eq('user_id', uid)
        completedSet = new Set((prog ?? []).map((r: { lesson_id: string }) => r.lesson_id))
      }

      const enriched = coursesData.map((c: CourseType) => {
        const mods = ((c.modules ?? []) as Module[]).sort((a, b) => a.ordem - b.ordem).map(m => ({
          ...m,
          lessons: ((m.lessons ?? []) as Lesson[]).sort((a, b) => a.ordem - b.ordem),
        }))
        const allLessons = mods.flatMap(m => m.lessons ?? [])
        return { ...c, modules: mods, totalLessons: allLessons.length, completedLessons: allLessons.filter(l => completedSet.has(l.id)).length }
      })

      setCourses(enriched)
      setLoading(false)
    }
    load()
  }, [])

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        userId={userId}
        onBack={() => setSelectedCourse(null)}
        onLessonComplete={(lessonId) => {
          setCourses(prev => prev.map(c => {
            if (c.id !== selectedCourse.id) return c
            const completed = (c.completedLessons ?? 0) + 1
            setSelectedCourse(sc => sc ? { ...sc, completedLessons: completed } : sc)
            return { ...c, completedLessons: completed }
          }))
        }}
      />
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F3E9DC' }}>
      {/* Hero banner */}
      <div style={{ background: '#2F4A3B', padding: '20px 22px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, bottom: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(196,154,90,0.07)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, color: '#C49A5A', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>Conteúdo exclusivo</div>
          <a href="/perfil" style={{ textDecoration: 'none', width: 30, height: 30, borderRadius: '50%', background: 'rgba(250,247,242,0.10)', border: '1px solid rgba(196,154,90,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(196,154,90,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </a>
        </div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 600, color: '#FAF7F2', marginBottom: 4, position: 'relative', zIndex: 1 }}>Educação</div>
        <div style={{ fontSize: 13, color: 'rgba(250,247,242,0.45)', position: 'relative', zIndex: 1 }}>Cursos e aulas para a sua jornada</div>
      </div>

      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#9DB09A', fontSize: 13 }}>Carregando cursos…</div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, color: '#2F4A3B' }}>Nenhum curso disponível</div>
            <div style={{ fontSize: 13, color: '#9DB09A', marginTop: 6 }}>Em breve novos conteúdos</div>
          </div>
        ) : courses.map(course => {
          const pct = course.totalLessons ? Math.round(((course.completedLessons ?? 0) / course.totalLessons) * 100) : 0
          const done = pct === 100
          const CAT_SOLID: Record<string, string> = {
            nutricao: '#2F4A3B', mentalidade: '#4A5A3B', receitas: '#5A4A2A',
            treino: '#2A3A5A', saude: '#4A3A2A', beleza: '#4A2A3A',
          }
          const bg = CAT_SOLID[course.categoria] ?? '#2F4A3B'
          const totalMin = (course.modules ?? []).flatMap(m => m.lessons ?? []).reduce((s, l) => s + (l.duracao_min ?? 0), 0)
          const h = Math.floor(totalMin / 60), min = totalMin % 60
          const durStr = totalMin > 0 ? (h > 0 ? `${h}h${min > 0 ? min + 'min' : ''}` : `${min}min`) : ''

          return (
            <div key={course.id} onClick={() => setSelectedCourse(course)}
              style={{ background: '#FAF7F2', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(47,74,59,0.08)', cursor: 'pointer', border: done ? '1.5px solid #6B7F63' : '1.5px solid transparent' }}>

              {/* Banner */}
              <div style={{ background: bg, padding: '18px 20px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -20, bottom: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(196,154,90,0.10)' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                  <div>
                    <div style={{ fontSize: 9, color: 'rgba(250,247,242,0.55)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                      {CAT_LABEL[course.categoria]}
                    </div>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#FAF7F2', lineHeight: 1.25, maxWidth: '80%' }}>
                      {course.titulo}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                    {course.is_premium && (
                      <div style={{ background: 'rgba(196,154,90,0.25)', borderRadius: 100, padding: '3px 10px', fontSize: 9, fontWeight: 700, color: '#C49A5A', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>✦ PREMIUM</div>
                    )}
                    {done && (
                      <div style={{ background: 'rgba(250,247,242,0.15)', borderRadius: 100, padding: '3px 10px', fontSize: 9, fontWeight: 700, color: '#FAF7F2', whiteSpace: 'nowrap' }}>✓ Concluído</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info row */}
              <div style={{ padding: '12px 18px 14px' }}>
                {course.descricao && (
                  <div style={{ fontSize: 12, color: '#6B7F63', lineHeight: 1.55, marginBottom: 10 }}>
                    {course.descricao.length > 90 ? course.descricao.slice(0, 90) + '…' : course.descricao}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {course.totalLessons ? (
                      <span style={{ fontSize: 11, color: '#9DB09A' }}>{course.totalLessons} aulas</span>
                    ) : null}
                    {durStr && <span style={{ fontSize: 11, color: '#9DB09A' }}>· {durStr}</span>}
                    {(course.modules ?? []).length > 0 && (
                      <span style={{ fontSize: 11, color: '#9DB09A' }}>· {(course.modules ?? []).length} módulos</span>
                    )}
                  </div>
                  {pct > 0 && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: done ? '#6B7F63' : '#C49A5A' }}>{pct}%</span>
                  )}
                </div>
                {pct > 0 ? (
                  <div style={{ height: 3, background: '#EBE0CF', borderRadius: 100, marginTop: 8 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: done ? '#6B7F63' : '#C49A5A', borderRadius: 100, transition: 'width 600ms ease' }} />
                  </div>
                ) : (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#2F4A3B' }}>Começar</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C49A5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
