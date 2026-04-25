'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIAS = ['cardio','forca','mobilidade','yoga','meditacao','alongamento']
const NIVEIS     = ['iniciante','intermediario','avancado']

type Form = {
  nome: string; descricao: string; video_url: string; categoria: string
  nivel: string; duracao_min: string; calorias_est: string
  musculos: string; equipamento: string; is_premium: boolean
}

const EMPTY: Form = { nome: '', descricao: '', video_url: '', categoria: 'cardio', nivel: 'iniciante', duracao_min: '', calorias_est: '', musculos: '', equipamento: '', is_premium: false }

export default function EditExercicioPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId]       = useState('')
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<Form>(EMPTY)

  const supabase = createClient()

  useEffect(() => {
    params.then(async p => {
      setId(p.id)
      const novo = p.id === 'novo'
      setIsNew(novo)
      if (!novo) {
        const { data } = await supabase.from('exercises').select('*').eq('id', p.id).single()
        if (data) setForm({
          nome:        data.nome ?? '',
          descricao:   data.descricao ?? '',
          video_url:   data.video_url ?? '',
          categoria:   data.categoria ?? 'cardio',
          nivel:       data.nivel ?? 'iniciante',
          duracao_min: data.duracao_min?.toString() ?? '',
          calorias_est: data.calorias_est?.toString() ?? '',
          musculos:    (data.musculos ?? []).join(', '),
          equipamento: (data.equipamento ?? []).join(', '),
          is_premium:  data.is_premium ?? false,
        })
      }
      setLoading(false)
    })
  }, [])

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const save = async () => {
    if (!form.nome.trim()) return
    setSaving(true)
    const payload = {
      nome:        form.nome,
      descricao:   form.descricao || null,
      video_url:   form.video_url || null,
      categoria:   form.categoria,
      nivel:       form.nivel,
      duracao_min: form.duracao_min ? parseInt(form.duracao_min) : null,
      calorias_est: form.calorias_est ? parseInt(form.calorias_est) : null,
      musculos:    form.musculos ? form.musculos.split(',').map(s => s.trim()).filter(Boolean) : [],
      equipamento: form.equipamento ? form.equipamento.split(',').map(s => s.trim()).filter(Boolean) : [],
      is_premium:  form.is_premium,
    }
    if (isNew) {
      await supabase.from('exercises').insert(payload)
    } else {
      await supabase.from('exercises').update(payload).eq('id', id)
    }
    setSaving(false); setSaved(true)
    setTimeout(() => { setSaved(false); if (isNew) router.push('/admin/exercicios') }, 1500)
  }

  const del = async () => {
    if (!confirm('Remover este exercício?')) return
    setDeleting(true)
    await supabase.from('exercises').delete().eq('id', id)
    router.push('/admin/exercicios')
  }

  const inp: React.CSSProperties = { width: '100%', background: '#F3E9DC', border: '1.5px solid #DDD5C5', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: '#2F4A3B', fontFamily: "'Lato',sans-serif", outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#6B7F63', display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }

  if (loading) return <div style={{ color: '#6B7F63', padding: 20 }}>Carregando…</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.push('/admin/exercicios')} style={{ background: '#D4E3D8', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F4A3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 600, color: '#2F4A3B' }}>{isNew ? 'Novo exercício' : 'Editar exercício'}</div>
          <div style={{ fontSize: 12, color: '#6B7F63' }}>{isNew ? 'Preencha os dados abaixo' : form.nome}</div>
        </div>
      </div>

      <div style={{ background: '#FAF7F2', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(47,74,59,0.10)' }}>

        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Nome do exercício *</label>
          <input value={form.nome} onChange={set('nome')} placeholder="ex: Agachamento Livre" style={inp} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <label style={lbl}>Categoria</label>
            <select value={form.categoria} onChange={set('categoria')} style={{ ...inp, cursor: 'pointer' }}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Nível</label>
            <select value={form.nivel} onChange={set('nivel')} style={{ ...inp, cursor: 'pointer' }}>
              {NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Descrição</label>
          <textarea value={form.descricao} onChange={set('descricao')} rows={3} placeholder="Como executar o exercício, dicas de postura..." style={{ ...inp, resize: 'vertical' }} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Link do vídeo (YouTube)</label>
          <input value={form.video_url} onChange={set('video_url')} placeholder="https://youtube.com/watch?v=..." style={inp} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <label style={lbl}>Duração (min)</label>
            <input type="number" value={form.duracao_min} onChange={set('duracao_min')} placeholder="15" min={1} style={inp} />
          </div>
          <div>
            <label style={lbl}>Calorias estimadas</label>
            <input type="number" value={form.calorias_est} onChange={set('calorias_est')} placeholder="150" min={0} style={inp} />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Músculos trabalhados (separados por vírgula)</label>
          <input value={form.musculos} onChange={set('musculos')} placeholder="glúteos, quadríceps, posterior" style={inp} />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={lbl}>Equipamentos necessários (separados por vírgula)</label>
          <input value={form.equipamento} onChange={set('equipamento')} placeholder="halteres, tapete (deixe vazio para sem equipamento)" style={inp} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '12px 14px', background: '#F3E9DC', borderRadius: 12 }}>
          <input type="checkbox" id="premium" checked={form.is_premium} onChange={set('is_premium')} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#C49A5A' }} />
          <label htmlFor="premium" style={{ fontSize: 14, color: '#2F4A3B', cursor: 'pointer' }}>
            Conteúdo Premium <span style={{ fontSize: 12, color: '#6B7F63' }}>— visível apenas para assinantes</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={save} disabled={saving || !form.nome.trim()}
            style={{ flex: 1, border: 'none', borderRadius: 100, padding: '13px 0', fontSize: 15, fontWeight: 600, fontFamily: "'Lato',sans-serif", cursor: saving || !form.nome.trim() ? 'not-allowed' : 'pointer', background: saved ? '#6B7F63' : saving ? '#C49A5A' : '#2F4A3B', color: '#FAF7F2', transition: 'background 200ms' }}>
            {saved ? '✓ Salvo!' : saving ? 'Salvando…' : isNew ? 'Criar exercício' : 'Salvar alterações'}
          </button>
          {!isNew && (
            <button onClick={del} disabled={deleting}
              style={{ background: '#D4E3D8', border: 'none', borderRadius: 100, padding: '13px 18px', fontSize: 14, fontWeight: 600, fontFamily: "'Lato',sans-serif", cursor: 'pointer', color: '#A06858' }}>
              {deleting ? '…' : '🗑'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
