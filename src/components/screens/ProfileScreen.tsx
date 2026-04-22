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
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5EDE3' }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#C9826B' }}>Carregando…</div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F5EDE3' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg,#4A2E22,#7A4A32)', padding: '20px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(212,169,106,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,130,107,0.1)' }} />

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#C9826B,#D4A96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: '#FDF8F3' }}>{initial}</span>
          </div>
          <div style={{ flex: 1 }}>
            {editName ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={nameInput} onChange={e => setNameInput(e.target.value)}
                  autoFocus
                  style={{ background: 'rgba(253,248,243,0.15)', border: '1.5px solid rgba(253,248,243,0.3)', borderRadius: 10, padding: '6px 10px', fontSize: 16, color: '#FDF8F3', fontFamily: "'DM Sans',sans-serif", outline: 'none', flex: 1 }} />
                <button onClick={saveName} disabled={saving}
                  style={{ background: '#C9826B', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#FDF8F3', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                  {saving ? '…' : 'OK'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: '#FDF8F3' }}>
                  {profile?.nome ?? 'Sem nome'}
                </div>
                <button onClick={() => setEditName(true)}
                  style={{ background: 'rgba(253,248,243,0.15)', border: 'none', borderRadius: 6, padding: '3px 8px', color: 'rgba(253,248,243,0.7)', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                  editar
                </button>
              </div>
            )}
            <div style={{ fontSize: 12, color: 'rgba(253,248,243,0.55)', marginTop: 2 }}>{email}</div>
          </div>
        </div>

        {/* Stats rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { label: 'Dias feitos',  value: `${doneDays}/21`, color: '#D4A96A' },
            { label: 'Streak',       value: `🔥 ${profile?.sequencia_atual ?? 0}`, color: '#FDF8F3' },
            { label: 'IMC',          value: profile?.imc ?? '—', color: '#FDF8F3' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(253,248,243,0.1)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(253,248,243,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Medidas — peso principal */}
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: 18, boxShadow: '0 3px 12px rgba(74,46,34,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: '#4A2E22' }}>Peso & Medidas</div>
            <button onClick={() => setShowMeasure(v => !v)}
              style={{ background: '#C9826B', border: 'none', borderRadius: 100, padding: '6px 14px', color: '#FDF8F3', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
              + Registrar
            </button>
          </div>

          {/* Formulário novo registro */}
          {showMeasure && (
            <div style={{ background: '#F5EDE3', borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#4A2E22', marginBottom: 10 }}>Novo registro — hoje</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                {([
                  { key: 'peso',    label: 'Peso (kg)',    ph: '68.5' },
                  { key: 'cintura', label: 'Cintura (cm)', ph: '72' },
                  { key: 'quadril', label: 'Quadril (cm)', ph: '96' },
                  { key: 'braco',   label: 'Braço (cm)',   ph: '28' },
                  { key: 'coxa',    label: 'Coxa (cm)',    ph: '55' },
                ] as const).map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 10, color: '#8A6A5A', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 3 }}>{f.label}</label>
                    <input type="number" placeholder={f.ph} value={newMeasure[f.key]}
                      onChange={e => setNewMeasure(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: '#FDF8F3', border: '1.5px solid #E8D8CC', borderRadius: 10, padding: '8px 10px', fontSize: 13, color: '#4A2E22', fontFamily: "'DM Sans',sans-serif", outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
              <button onClick={saveMeasure} disabled={saving || (!newMeasure.peso && !newMeasure.cintura)}
                style={{ width: '100%', background: saving ? '#D4A96A' : '#C9826B', border: 'none', borderRadius: 100, padding: '10px 0', color: '#FDF8F3', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                {saving ? 'Salvando…' : 'Salvar medidas'}
              </button>
            </div>
          )}

          {/* Resumo peso */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Peso inicial', value: profile?.peso_inicial ? `${profile.peso_inicial} kg` : '—', color: '#8A6A5A' },
              { label: 'Atual',        value: latest?.peso ? `${latest.peso} kg` : '—', color: '#C9826B' },
              { label: 'Perda total',  value: totalLoss !== null && totalLoss > 0 ? `−${totalLoss} kg` : '—', color: '#8A9E7B' },
            ].map(s => (
              <div key={s.label} style={{ background: '#F5EDE3', borderRadius: 12, padding: '10px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#B89B8C', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Histórico */}
          {measures.length > 0 ? (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#8A6A5A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Histórico</div>
              {measures.slice(0, 5).map((m, i) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: i < Math.min(measures.length, 5) - 1 ? '1px solid #F0E4DC' : 'none', gap: 10 }}>
                  <div style={{ fontSize: 11, color: '#8A6A5A', width: 72, flexShrink: 0 }}>
                    {new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
                    {m.peso    && <span style={{ fontSize: 12, color: '#4A2E22' }}>⚖️ {m.peso}kg</span>}
                    {m.cintura && <span style={{ fontSize: 12, color: '#4A2E22' }}>📏 {m.cintura}cm</span>}
                    {m.quadril && <span style={{ fontSize: 12, color: '#4A2E22' }}>hip {m.quadril}cm</span>}
                  </div>
                  {i === 0 && weightDiff !== null && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: weightDiff <= 0 ? '#8A9E7B' : '#C9826B' }}>
                      {weightDiff > 0 ? '+' : ''}{weightDiff}kg
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 13, color: '#B89B8C' }}>
              Nenhum registro ainda — adicione o primeiro!
            </div>
          )}
        </div>

        {/* Minhas informações */}
        <div style={{ background: '#FDF8F3', borderRadius: 18, padding: 18, boxShadow: '0 3px 12px rgba(74,46,34,0.08)' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: '#4A2E22', marginBottom: 14 }}>Minhas informações</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🎂', label: 'Idade',         value: profile?.idade ? `${profile.idade} anos` : '—' },
              { icon: '📏', label: 'Altura',         value: profile?.altura ? `${profile.altura} cm` : '—' },
              { icon: '🎯', label: 'Objetivo',       value: OBJETIVO_LABEL[profile?.objetivo ?? ''] ?? profile?.objetivo ?? '—' },
              { icon: '⚡', label: 'Nível',          value: NIVEL_LABEL[profile?.nivel_atividade ?? ''] ?? profile?.nivel_atividade ?? '—' },
              { icon: '📅', label: 'Dias/semana',    value: profile?.dias_semana ? `${profile.dias_semana} dias` : '—' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #F5EDE3' }}>
                <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{row.icon}</span>
                <span style={{ fontSize: 12, color: '#8A6A5A', width: 80, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: 13, color: '#4A2E22', fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>
          {profile?.motivacao && (
            <div style={{ marginTop: 12, background: '#F0D5C8', borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: '#C9826B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Minha motivação</div>
              <div style={{ fontSize: 13, color: '#4A2E22', lineHeight: 1.5, fontStyle: 'italic' }}>"{profile.motivacao}"</div>
            </div>
          )}
        </div>

        {/* Condições de saúde */}
        {(profile?.condicoes_saude ?? []).length > 0 && (
          <div style={{ background: '#FDF8F3', borderRadius: 18, padding: 18, boxShadow: '0 3px 12px rgba(74,46,34,0.08)' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: '#4A2E22', marginBottom: 10 }}>Condições de saúde</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(profile?.condicoes_saude ?? []).map(c => (
                <span key={c} style={{ background: '#F0D5C8', borderRadius: 100, padding: '4px 12px', fontSize: 12, color: '#7A4A32' }}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* Sair */}
        <button onClick={logout}
          style={{ width: '100%', background: 'transparent', border: '1.5px solid #E8D8CC', borderRadius: 100, padding: 13, fontSize: 14, fontWeight: 500, color: '#8A6A5A', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", marginTop: 4, marginBottom: 16 }}>
          Sair da conta
        </button>
      </div>
    </div>
  )
}
