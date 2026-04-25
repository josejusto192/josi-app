'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string; nome: string | null; idade: number | null; peso_inicial: number | null
  altura: number | null; imc: number | null; objetivo: string | null
  nivel_atividade: string | null; condicoes_saude: string[]; motivacao: string | null
  sequencia_atual: number; sequencia_recorde: number; pontos: number
  dias_semana: number | null
}

type Measurement = {
  id: string; date: string; peso: number | null; cintura: number | null
  quadril: number | null; braco: number | null; coxa: number | null
}

type NewMeasure = { peso: string; cintura: string; quadril: string; braco: string; coxa: string }

const OBJETIVO_LABEL: Record<string, string> = {
  emagrecer: 'Emagrecer', definir: 'Definir o corpo', massa: 'Ganhar massa',
  saude: 'Saúde geral', manutencao: 'Manutenção',
}
const NIVEL_LABEL: Record<string, string> = {
  sedentario: 'Sedentária', leve: 'Levemente ativa',
  moderada: 'Moderadamente ativa', ativa: 'Muito ativa',
}

export default function ProfileScreen() {
  const router = useRouter()
  const [profile, setProfile]       = useState<Profile | null>(null)
  const [measures, setMeasures]     = useState<Measurement[]>([])
  const [loading, setLoading]       = useState(true)
  const [showMeasure, setShowMeasure] = useState(false)
  const [editName, setEditName]     = useState(false)
  const [nameInput, setNameInput]   = useState('')
  const [newMeasure, setNewMeasure] = useState<NewMeasure>({ peso: '', cintura: '', quadril: '', braco: '', coxa: '' })
  const [saving, setSaving]         = useState(false)
  const [doneDays, setDoneDays]     = useState(0)
  const [email, setEmail]           = useState('')

  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setEmail(user.email ?? '')

    const [{ data: p }, { data: m }, { data: prog }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('measurements').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('challenge_progress').select('day').eq('user_id', user.id).eq('completed', true),
    ])
    if (p) { setProfile(p); setNameInput(p.nome ?? '') }
    setMeasures(m ?? [])
    setDoneDays((prog ?? []).length)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const saveName = async () => {
    if (!nameInput.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ nome: nameInput.trim() }).eq('id', user.id)
      setProfile(p => p ? { ...p, nome: nameInput.trim() } : p)
    }
    setSaving(false)
    setEditName(false)
  }

  const saveMeasure = async () => {
    const { peso, cintura, quadril, braco, coxa } = newMeasure
    if (!peso && !cintura && !quadril) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('measurements').insert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        peso:    peso    ? parseFloat(peso)    : null,
        cintura: cintura ? parseFloat(cintura) : null,
        quadril: quadril ? parseFloat(quadril) : null,
        braco:   braco   ? parseFloat(braco)   : null,
        coxa:    coxa    ? parseFloat(coxa)    : null,
      }).select().single()
      if (data) setMeasures(prev => [data, ...prev])
    }
    setNewMeasure({ peso: '', cintura: '', quadril: '', braco: '', coxa: '' })
    setSaving(false)
    setShowMeasure(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const latest   = measures[0]
  const previous = measures[1]
  const weightDiff = latest?.peso && previous?.peso
    ? +(latest.peso - previous.peso).toFixed(1)
    : null
  const totalLoss = profile?.peso_inicial && latest?.peso
    ? +(profile.peso_inicial - latest.peso).toFixed(1)
    : null
  const initial = profile?.nome ? profile.nome[0].toUpperCase() : '?'

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3E9DC' }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: '#2F4A3B' }}>Carregando…</div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F3E9DC' }}>

      {/* Header */}
      <div style={{ background: '#2F4A3B', padding: '22px 22px 26px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(196,154,90,0.07)', pointerEvents: 'none' }} />

        {/* Avatar + nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'rgba(250,247,242,0.12)', border: '2px solid rgba(196,154,90,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 700, color: '#C49A5A' }}>{initial}</span>
          </div>
          <div style={{ flex: 1 }}>
            {editName ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={nameInput} onChange={e => setNameInput(e.target.value)} autoFocus
                  style={{ background: 'rgba(250,247,242,0.12)', border: '1.5px solid rgba(196,154,90,0.4)', borderRadius: 10, padding: '7px 12px', fontSize: 15, color: '#FAF7F2', fontFamily: "'Lato',sans-serif", outline: 'none', flex: 1 }} />
                <button onClick={saveName} disabled={saving}
                  style={{ background: '#C49A5A', border: 'none', borderRadius: 8, padding: '7px 14px', color: '#FAF7F2', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
                  {saving ? '…' : 'OK'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#FAF7F2' }}>
                    {profile?.nome ?? 'Sem nome'}
                  </div>
                  <button onClick={() => setEditName(true)}
                    style={{ background: 'transparent', border: '1px solid rgba(250,247,242,0.2)', borderRadius: 100, padding: '2px 10px', color: 'rgba(250,247,242,0.5)', fontSize: 11, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
                    editar
                  </button>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.40)', marginTop: 3 }}>{email}</div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Dias feitos', value: `${doneDays}/21` },
            { label: 'Dias seguidos', value: profile?.sequencia_atual ? `🔥 ${profile.sequencia_atual}` : '—' },
            { label: 'IMC', value: profile?.imc ?? '—' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(250,247,242,0.08)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#FAF7F2' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(250,247,242,0.40)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Medidas — peso principal */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 18, boxShadow: '0 3px 12px rgba(47,74,59,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 600, color: '#2F4A3B' }}>Peso & Medidas</div>
            <button onClick={() => setShowMeasure(v => !v)}
              style={{ background: '#2F4A3B', border: 'none', borderRadius: 100, padding: '6px 14px', color: '#FAF7F2', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
              + Registrar
            </button>
          </div>

          {/* Formulário novo registro */}
          {showMeasure && (
            <div style={{ background: '#F3E9DC', borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#2F4A3B', marginBottom: 10 }}>Novo registro — hoje</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                {([
                  { key: 'peso',    label: 'Peso (kg)',    ph: '68.5' },
                  { key: 'cintura', label: 'Cintura (cm)', ph: '72' },
                  { key: 'quadril', label: 'Quadril (cm)', ph: '96' },
                  { key: 'braco',   label: 'Braço (cm)',   ph: '28' },
                  { key: 'coxa',    label: 'Coxa (cm)',    ph: '55' },
                ] as const).map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 10, color: '#6B7F63', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 3 }}>{f.label}</label>
                    <input type="number" placeholder={f.ph} value={newMeasure[f.key]}
                      onChange={e => setNewMeasure(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: '#FAF7F2', border: '1.5px solid #DDD5C5', borderRadius: 10, padding: '8px 10px', fontSize: 13, color: '#2F4A3B', fontFamily: "'Lato',sans-serif", outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
              <button onClick={saveMeasure} disabled={saving || (!newMeasure.peso && !newMeasure.cintura)}
                style={{ width: '100%', background: saving ? '#C49A5A' : '#2F4A3B', border: 'none', borderRadius: 100, padding: '10px 0', color: '#FAF7F2', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Lato',sans-serif" }}>
                {saving ? 'Salvando…' : 'Salvar medidas'}
              </button>
            </div>
          )}

          {/* Resumo peso */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Peso inicial', value: profile?.peso_inicial ? `${profile.peso_inicial} kg` : '—', color: '#6B7F63' },
              { label: 'Atual',        value: latest?.peso ? `${latest.peso} kg` : '—', color: '#2F4A3B' },
              { label: 'Perda total',  value: totalLoss !== null && totalLoss > 0 ? `−${totalLoss} kg` : '—', color: '#6B7F63' },
            ].map(s => (
              <div key={s.label} style={{ background: '#F3E9DC', borderRadius: 12, padding: '10px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 600, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#9DB09A', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Histórico */}
          {measures.length > 0 ? (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7F63', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Histórico</div>
              {measures.slice(0, 5).map((m, i) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: i < Math.min(measures.length, 5) - 1 ? '1px solid #F0E4DC' : 'none', gap: 10 }}>
                  <div style={{ fontSize: 11, color: '#6B7F63', width: 72, flexShrink: 0 }}>
                    {new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
                    {m.peso    && <span style={{ fontSize: 12, color: '#2F4A3B' }}>⚖️ {m.peso}kg</span>}
                    {m.cintura && <span style={{ fontSize: 12, color: '#2F4A3B' }}>📏 {m.cintura}cm</span>}
                    {m.quadril && <span style={{ fontSize: 12, color: '#2F4A3B' }}>hip {m.quadril}cm</span>}
                  </div>
                  {i === 0 && weightDiff !== null && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: weightDiff <= 0 ? '#6B7F63' : '#2F4A3B' }}>
                      {weightDiff > 0 ? '+' : ''}{weightDiff}kg
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 13, color: '#9DB09A' }}>
              Nenhum registro ainda — adicione o primeiro!
            </div>
          )}
        </div>

        {/* Minhas informações */}
        <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 18, boxShadow: '0 3px 12px rgba(47,74,59,0.08)' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 600, color: '#2F4A3B', marginBottom: 14 }}>Minhas informações</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🎂', label: 'Idade',         value: profile?.idade ? `${profile.idade} anos` : '—' },
              { icon: '📏', label: 'Altura',         value: profile?.altura ? `${profile.altura} cm` : '—' },
              { icon: '🎯', label: 'Objetivo',       value: OBJETIVO_LABEL[profile?.objetivo ?? ''] ?? profile?.objetivo ?? '—' },
              { icon: '⚡', label: 'Nível',          value: NIVEL_LABEL[profile?.nivel_atividade ?? ''] ?? profile?.nivel_atividade ?? '—' },
              { icon: '📅', label: 'Dias/semana',    value: profile?.dias_semana ? `${profile.dias_semana} dias` : '—' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #F3E9DC' }}>
                <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{row.icon}</span>
                <span style={{ fontSize: 12, color: '#6B7F63', width: 80, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: 13, color: '#2F4A3B', fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>
          {profile?.motivacao && (
            <div style={{ marginTop: 12, background: '#D4E3D8', borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: '#2F4A3B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Minha motivação</div>
              <div style={{ fontSize: 13, color: '#2F4A3B', lineHeight: 1.5, fontStyle: 'italic' }}>"{profile.motivacao}"</div>
            </div>
          )}
        </div>

        {/* Condições de saúde */}
        {(profile?.condicoes_saude ?? []).length > 0 && (
          <div style={{ background: '#FAF7F2', borderRadius: 18, padding: 18, boxShadow: '0 3px 12px rgba(47,74,59,0.08)' }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 600, color: '#2F4A3B', marginBottom: 10 }}>Condições de saúde</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(profile?.condicoes_saude ?? []).map(c => (
                <span key={c} style={{ background: '#D4E3D8', borderRadius: 100, padding: '4px 12px', fontSize: 12, color: '#2F4A3B' }}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* Sair */}
        <button onClick={logout}
          style={{ width: '100%', background: 'transparent', border: '1.5px solid #DDD5C5', borderRadius: 100, padding: 13, fontSize: 14, fontWeight: 500, color: '#6B7F63', cursor: 'pointer', fontFamily: "'Lato',sans-serif", marginTop: 4, marginBottom: 16 }}>
          Sair da conta
        </button>
      </div>
    </div>
  )
}
