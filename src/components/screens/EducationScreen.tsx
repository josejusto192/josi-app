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
  nutricao:    'linear-gradient(135deg,#C9826B,#D4A96A)',
  mentalidade: 'linear-gradient(135deg,#8A9E7B,#A8BE98)',
  receitas:    'linear-gradient(135deg,#D4A96A,#E8C878)',
  treino:      'linear-gradient(135deg,#6BA3BE,#8ABCD6)',
  saude:       'linear-gradient(135deg,#A06858,#C9826B)',
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
    <div style={{ flex: 1, overflowY: 'auto', background: '#F5EDE3' }}>
      <div style={{ background: '#FDF8F3', padding: '16px 20px 16px', borderBottom: '1px solid #E8D8CC' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: '#4A2E22' }}>Educação</div>
        <div style={{ fontSize: 13, color: '#8A6A5A', marginTop: 2 }}>Cursos, módulos e aulas exclusivas</div>
      </div>

      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#8A6A5A', fontSize: 13 }}>Carregando cursos…</div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: '#4A2E22' }}>Nenhum curso disponível</div>
          </div>
        ) : courses.map(course => {
          const pct = course.totalLessons ? Math.round(((course.completedLessons ?? 0) / course.totalLessons) * 100) : 0
          const done = pct === 100
          const grad = CAT_GRADIENT[course.categoria] ?? CAT_GRADIENT.nutricao
          const totalMin = (course.modules ?? []).flatMap(m => m.lessons ?? []).reduce((s, l) => s + (l.duracao_min ?? 0), 0)
          const h = Math.floor(totalMin / 60), m = totalMin % 60
          const durStr = h > 0 ? `${h}h${m > 0 ? m + 'min' : ''}` : `${m}min`

          return (
            <div key={course.id} onClick={() => setSelectedCourse(course)}
              style={{ background: '#FDF8F3', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 16px rgba(74,46,34,0.10)', cursor: 'pointer', border: done ? '2px solid #8A9E7B' : '2px solid transparent' }}>
              <div style={{ background: grad, padding: '20px 18px 22px', position: 'relative' }}>
                {course.is_premium && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.25)', borderRadius: 100, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: '#FDF8F3' }}>✦ PREMIUM</div>
                )}
                {done && (
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(138,158,123,0.9)', borderRadius: 100, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: '#FDF8F3' }}>✓ Concluído</div>
                )}
                <div style={{ fontSize: 34, marginBottom: 8 }}>{CAT_EMOJI[course.categoria]}</div>
                <div style={{ fontSize: 9, color: 'rgba(253,248,243,0.75)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 4 }}>{CAT_LABEL[course.categoria]}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: '#FDF8F3', lineHeight: 1.25 }}>{course.titulo}</div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                {course.descricao && (
                  <div style={{ fontSize: 12, color: '#8A6A5A', lineHeight: 1.55, marginBottom: 10 }}>
                    {course.descricao.length > 100 ? course.descricao.slice(0, 100) + '…' : course.descricao}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: pct > 0 ? 8 : 0 }}>
                  <span style={{ fontSize: 12, color: '#8A6A5A' }}>{course.totalLessons} aulas · {durStr} · {(course.modules ?? []).length} módulos</span>
                  {pct > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: done ? '#8A9E7B' : '#C9826B' }}>{pct}%</span>}
                </div>
                {pct > 0 ? (
                  <div style={{ height: 4, background: '#F0D5C8', borderRadius: 3 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: grad, borderRadius: 3 }} />
                  </div>
                ) : (
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#C9826B', marginTop: 4 }}>Começar curso →</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
