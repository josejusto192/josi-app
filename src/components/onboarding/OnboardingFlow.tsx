'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ── Sub-components ─────────────────────────────────────────────────

function OBInput({ label, placeholder, value, onChange, type = 'text', unit }: {
  label: string; placeholder: string; value: string
  onChange: (v: string) => void; type?: string; unit?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#8A6A5A' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', background: '#FDF8F3', border: '1.5px solid #E8D8CC', borderRadius: 14, overflow: 'hidden' }}>
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '13px 16px', fontSize: 15, color: '#4A2E22', fontFamily: "'DM Sans',sans-serif" }}
        />
        {unit && <span style={{ paddingRight: 14, fontSize: 13, color: '#B89B8C', fontWeight: 500 }}>{unit}</span>}
      </div>
    </div>
  )
}

function OBOptionCard({ emoji, title, subtitle, selected, onClick }: {
  emoji: string; title: string; subtitle?: string; selected: boolean; onClick: () => void
}) {
  return (
    <div onClick={onClick} style={{
      background: selected ? '#F0D5C8' : '#FDF8F3',
      border: selected ? '2px solid #C9826B' : '1.5px solid #E8D8CC',
      borderRadius: 16, padding: '14px 16px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 12,
      transition: 'all 150ms',
      boxShadow: selected ? '0 4px 14px rgba(201,130,107,0.18)' : '0 2px 8px rgba(74,46,34,0.06)',
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: selected ? '#C9826B' : '#F5EDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, transition: 'background 150ms' }}>
        {selected
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FDF8F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: selected ? '#C9826B' : '#4A2E22' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: '#8A6A5A', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  )
}

function OBCheckCard({ emoji, label, checked, onClick }: {
  emoji: string; label: string; checked: boolean; onClick: () => void
}) {
  return (
    <div onClick={onClick} style={{
      background: checked ? '#F0D5C8' : '#FDF8F3',
      border: checked ? '2px solid #C9826B' : '1.5px solid #E8D8CC',
      borderRadius: 14, padding: '11px 14px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 10, transition: 'all 150ms',
    }}>
      <div style={{ width: 24, height: 24, borderRadius: 7, background: checked ? '#C9826B' : '#F5EDE3', border: checked ? 'none' : '1.5px solid #D4BEB2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FDF8F3" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <span style={{ fontSize: 12, color: checked ? '#C9826B' : '#4A2E22', fontWeight: checked ? 500 : 400 }}>{emoji} {label}</span>
    </div>
  )
}

function NextBtn({ disabled, onClick, label = 'Continuar →' }: {
  disabled?: boolean; onClick: () => void; label?: string
}) {
  return (
    <button disabled={disabled} onClick={onClick} style={{
      width: '100%',
      background: disabled ? '#E8D8CC' : 'linear-gradient(135deg,#C9826B,#D4A96A)',
      color: disabled ? '#B89B8C' : '#FDF8F3',
      border: 'none', borderRadius: 100, padding: 16,
      fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans',sans-serif",
      cursor: disabled ? 'default' : 'pointer',
      transition: 'all 200ms',
      boxShadow: disabled ? 'none' : '0 4px 16px rgba(201,130,107,0.35)',
    }}>
      {label}
    </button>
  )
}

// ── Steps ──────────────────────────────────────────────────────────

const STEPS = ['welcome','nome','dados','objetivo','atividade','saude','disponibilidade','motivacao','resumo']

export default function OnboardingFlow() {
  const router  = useRouter()
  const supabase = createClient()

  const [step, setStep]         = useState(0)
  const [leaving, setLeaving]   = useState(false)
  const [saving, setSaving]     = useState(false)

  const [nome, setNome]             = useState('')
  const [idade, setIdade]           = useState('')
  const [peso, setPeso]             = useState('')
  const [altura, setAltura]         = useState('')
  const [objetivo, setObjetivo]     = useState('')
  const [atividade, setAtividade]   = useState('')
  const [saude, setSaude]           = useState<string[]>([])
  const [disponibilidade, setDisp]  = useState('')
  const [motivacao, setMotivacao]   = useState('')

  const totalSteps   = STEPS.length - 2
  const stepIdx      = step - 1
  const showProgress = step > 0 && step < STEPS.length - 1
  const progress     = showProgress ? (stepIdx / totalSteps) * 100 : 0

  const imc = peso && altura
    ? (parseFloat(peso.replace(',','.')) / Math.pow(parseFloat(altura.replace(',','.'))/100, 2)).toFixed(1)
    : null

  const advance = () => {
    setLeaving(true)
    setTimeout(() => { setStep(s => s + 1); setLeaving(false) }, 220)
  }
  const back = () => {
    setLeaving(true)
    setTimeout(() => { setStep(s => s - 1); setLeaving(false) }, 220)
  }

  const toggleSaude = (val: string) => {
    if (val === 'nenhuma') { setSaude(['nenhuma']); return }
    setSaude(prev => {
      const next = prev.filter(v => v !== 'nenhuma')
      return next.includes(val) ? next.filter(v => v !== val) : [...next, val]
    })
  }

  const canNext = () => {
    switch (STEPS[step]) {
      case 'welcome':         return true
      case 'nome':            return nome.trim().length >= 2
      case 'dados':           return !!(idade && peso && altura)
      case 'objetivo':        return !!objetivo
      case 'atividade':       return !!atividade
      case 'saude':           return saude.length > 0
      case 'disponibilidade': return !!disponibilidade
      case 'motivacao':       return motivacao.trim().length >= 3
      default:                return true
    }
  }

  const handleComplete = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    await supabase.from('profiles').upsert({
      id: user.id,
      nome: nome.trim(),
      idade: parseInt(idade),
      peso_inicial: parseFloat(peso.replace(',','.')),
      altura: parseInt(altura),
      imc: imc ? parseFloat(imc) : null,
      objetivo,
      nivel_atividade: atividade,
      condicoes_saude: saude,
      dias_semana: parseInt(disponibilidade),
      motivacao: motivacao.trim(),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })

    router.push('/desafio')
  }

  const s = STEPS[step]
  const slideStyle: React.CSSProperties = {
    animation: leaving
      ? 'slideOutLeft 220ms cubic-bezier(0.64,0,0.78,0) forwards'
      : 'slideInRight 280ms cubic-bezier(0.22,1,0.36,1) forwards',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <>
      <style>{`
        @keyframes slideInRight  { from{transform:translateX(32px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes slideOutLeft  { from{transform:translateX(0);opacity:1}    to{transform:translateX(-32px);opacity:0} }
        @keyframes popIn         { from{transform:scale(0.85);opacity:0}      to{transform:scale(1);opacity:1} }
        @keyframes checkPulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
      `}</style>

      <div style={{ flex: 1, overflowY: 'auto', background: '#F5EDE3', display: 'flex', flexDirection: 'column' }}>

        {/* Progress bar */}
        {showProgress && (
          <div style={{ background: '#FDF8F3', padding: '14px 20px 12px', borderBottom: '1px solid #E8D8CC', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {step > 1 && (
                <button onClick={back} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A6A5A', display: 'flex', padding: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ height: 4, background: '#F0D5C8', borderRadius: 2 }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#C9826B,#D4A96A)', borderRadius: 2, transition: 'width 350ms cubic-bezier(0.22,1,0.36,1)' }}/>
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#8A6A5A', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {stepIdx} de {totalSteps}
              </span>
            </div>
          </div>
        )}

        {/* Step content */}
        <div key={step} style={slideStyle}>

          {/* WELCOME */}
          {s === 'welcome' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', textAlign: 'center' }}>
              <div style={{ animation: 'popIn 500ms cubic-bezier(0.22,1,0.36,1)', marginBottom: 24 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 88, height: 88, borderRadius: 24, background: 'linear-gradient(135deg,#C9826B,#D4A96A)', boxShadow: '0 8px 32px rgba(201,130,107,0.45)' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 56, color: '#FDF8F3', lineHeight: 1 }}>J</span>
                </div>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 13, color: '#C9826B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Bem-vinda ao</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 600, color: '#4A2E22', lineHeight: 1.1, marginBottom: 8 }}>Desafio 21 Dias</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 18, color: '#8A6A5A', marginBottom: 20 }}>com Josi</div>
              <div style={{ background: '#FDF8F3', borderRadius: 20, padding: '18px 20px', boxShadow: '0 4px 16px rgba(74,46,34,0.10)', marginBottom: 32, maxWidth: 320 }}>
                <div style={{ fontSize: 14, color: '#4A2E22', lineHeight: 1.7 }}>
                  Antes de começar, vou te fazer algumas perguntas rápidas para <strong style={{ color: '#C9826B' }}>personalizar sua jornada</strong> e garantir que você chegue aos seus resultados com segurança 🌿
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
                {['📝 8 perguntas', '⏱️ 3 minutos', '🔒 Só você vê'].map(t => (
                  <div key={t} style={{ background: '#FDF8F3', borderRadius: 100, padding: '6px 14px', fontSize: 11, fontWeight: 500, color: '#8A6A5A', border: '1px solid #E8D8CC' }}>{t}</div>
                ))}
              </div>
              <button onClick={advance} style={{ width: '100%', maxWidth: 300, background: 'linear-gradient(135deg,#C9826B,#D4A96A)', color: '#FDF8F3', border: 'none', borderRadius: 100, padding: 16, fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', boxShadow: '0 6px 20px rgba(201,130,107,0.40)' }}>
                Vamos começar ✨
              </button>
            </div>
          )}

          {/* NOME */}
          {s === 'nome' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 24px' }}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: '#4A2E22', lineHeight: 1.2, marginBottom: 8 }}>Como você se chama? 🌸</div>
                <div style={{ fontSize: 14, color: '#8A6A5A', lineHeight: 1.6 }}>Vou usar seu nome para tornar a experiência mais pessoal.</div>
              </div>
              <OBInput label="Seu primeiro nome" placeholder="Ex: Ana Paula" value={nome} onChange={setNome} />
              {nome.trim().length >= 2 && (
                <div style={{ marginTop: 16, background: '#FDF8F3', borderRadius: 16, padding: '14px 16px', border: '1px solid #F0D5C8', animation: 'popIn 250ms var(--ease-out)' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 16, color: '#C9826B' }}>
                    Oi, {nome.trim()}! Que nome lindo 🌿
                  </div>
                </div>
              )}
              <div style={{ flex: 1 }}/>
              <NextBtn disabled={!canNext()} onClick={advance} />
            </div>
          )}

          {/* DADOS FÍSICOS */}
          {s === 'dados' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 24px' }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: '#4A2E22', lineHeight: 1.2, marginBottom: 8 }}>Seus dados físicos</div>
                <div style={{ fontSize: 14, color: '#8A6A5A', lineHeight: 1.6 }}>Essas informações ajudam a calcular suas metas de forma segura.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                <OBInput label="Idade" placeholder="Ex: 28" value={idade} onChange={setIdade} type="number" unit="anos" />
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}><OBInput label="Peso atual" placeholder="Ex: 68" value={peso} onChange={setPeso} type="number" unit="kg" /></div>
                  <div style={{ flex: 1 }}><OBInput label="Altura" placeholder="Ex: 165" value={altura} onChange={setAltura} type="number" unit="cm" /></div>
                </div>
              </div>
              {imc && (
                <div style={{ background: '#FDF8F3', borderRadius: 16, padding: '14px 16px', border: '1px solid #E8D8CC', animation: 'popIn 250ms var(--ease-out)', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: '#8A6A5A', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Seu IMC atual</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 600, color: '#C9826B' }}>{imc}</span>
                    <span style={{ fontSize: 12, color: '#8A6A5A' }}>
                      {parseFloat(imc) < 18.5 ? '· Abaixo do peso' : parseFloat(imc) < 25 ? '· Peso normal ✓' : parseFloat(imc) < 30 ? '· Sobrepeso' : '· Obesidade'}
                    </span>
                  </div>
                </div>
              )}
              <div style={{ flex: 1 }}/>
              <NextBtn disabled={!canNext()} onClick={advance} />
            </div>
          )}

          {/* OBJETIVO */}
          {s === 'objetivo' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 24px' }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: '#4A2E22', lineHeight: 1.2, marginBottom: 8 }}>Qual é o seu objetivo? 🎯</div>
                <div style={{ fontSize: 14, color: '#8A6A5A', lineHeight: 1.6 }}>Escolha o que mais representa você agora.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {[
                  { val: 'emagrecer',  emoji: '🔥', title: 'Perder peso',           sub: 'Reduzir medidas e gordura corporal' },
                  { val: 'definir',    emoji: '💪', title: 'Definir o corpo',        sub: 'Tonificar e ganhar forma' },
                  { val: 'massa',      emoji: '🏋️', title: 'Ganhar massa muscular',  sub: 'Aumentar volume e força' },
                  { val: 'saude',      emoji: '🌿', title: 'Melhorar a saúde',       sub: 'Mais energia, qualidade de vida' },
                  { val: 'manutencao', emoji: '⚖️', title: 'Manter o peso',          sub: 'Já estou bem, quero manter' },
                ].map(o => (
                  <OBOptionCard key={o.val} emoji={o.emoji} title={o.title} subtitle={o.sub}
                    selected={objetivo === o.val} onClick={() => setObjetivo(o.val)} />
                ))}
              </div>
              <div style={{ marginTop: 16 }}><NextBtn disabled={!canNext()} onClick={advance} /></div>
            </div>
          )}

          {/* ATIVIDADE */}
          {s === 'atividade' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 24px' }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: '#4A2E22', lineHeight: 1.2, marginBottom: 8 }}>Como você está hoje? 🌱</div>
                <div style={{ fontSize: 14, color: '#8A6A5A', lineHeight: 1.6 }}>Seu nível de atividade física atual.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {[
                  { val: 'sedentario', emoji: '🛋️', title: 'Sedentária',           sub: 'Passo a maior parte do dia sentada' },
                  { val: 'leve',       emoji: '🚶', title: 'Levemente ativa',       sub: 'Caminhadas leves ou exercício 1–2x/semana' },
                  { val: 'moderada',   emoji: '🏃', title: 'Moderadamente ativa',   sub: 'Exercício 3–4x por semana' },
                  { val: 'ativa',      emoji: '⚡', title: 'Muito ativa',           sub: 'Treino intenso 5+ vezes por semana' },
                ].map(o => (
                  <OBOptionCard key={o.val} emoji={o.emoji} title={o.title} subtitle={o.sub}
                    selected={atividade === o.val} onClick={() => setAtividade(o.val)} />
                ))}
              </div>
              <div style={{ marginTop: 16 }}><NextBtn disabled={!canNext()} onClick={advance} /></div>
            </div>
          )}

          {/* SAÚDE */}
          {s === 'saude' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 24px' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: '#4A2E22', lineHeight: 1.2, marginBottom: 8 }}>Saúde em primeiro lugar 💙</div>
                <div style={{ fontSize: 14, color: '#8A6A5A', lineHeight: 1.6 }}>Selecione tudo que se aplica a você.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { val: 'hipertensao', label: 'Hipertensão',      emoji: '❤️' },
                  { val: 'diabetes',    label: 'Diabetes',          emoji: '🩸' },
                  { val: 'joelho',      label: 'Lesão no joelho',   emoji: '🦵' },
                  { val: 'lombar',      label: 'Dor lombar',        emoji: '🔙' },
                  { val: 'cardio',      label: 'Prob. cardíaco',    emoji: '💓' },
                  { val: 'gestante',    label: 'Gestante',          emoji: '🤰' },
                  { val: 'tireoide',    label: 'Tireoide',          emoji: '⚗️' },
                  { val: 'outro',       label: 'Outro',             emoji: '📋' },
                ].map(h => (
                  <OBCheckCard key={h.val} emoji={h.emoji} label={h.label}
                    checked={saude.includes(h.val)} onClick={() => toggleSaude(h.val)} />
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <OBCheckCard emoji="✅" label="Nenhuma das anteriores" checked={saude.includes('nenhuma')} onClick={() => toggleSaude('nenhuma')} />
              </div>
              {saude.some(s => ['hipertensao','cardio','diabetes','gestante'].includes(s)) && (
                <div style={{ marginTop: 12, background: '#FDF8F3', borderRadius: 14, padding: '12px 14px', border: '1.5px solid #F0DEBB' }}>
                  <div style={{ fontSize: 12, color: '#7A5020', lineHeight: 1.6 }}>⚠️ <strong>Atenção:</strong> Para as condições selecionadas, recomendamos consultar um médico antes de iniciar qualquer programa de exercícios.</div>
                </div>
              )}
              <div style={{ marginTop: 14 }}><NextBtn disabled={!canNext()} onClick={advance} /></div>
            </div>
          )}

          {/* DISPONIBILIDADE */}
          {s === 'disponibilidade' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 24px' }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: '#4A2E22', lineHeight: 1.2, marginBottom: 8 }}>Quantos dias por semana? 📅</div>
                <div style={{ fontSize: 14, color: '#8A6A5A', lineHeight: 1.6 }}>Com base na sua rotina, quantos dias você consegue dedicar aos treinos?</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 16 }}>
                {['3','4','5','6','7'].map(d => (
                  <div key={d} onClick={() => setDisp(d)} style={{
                    background: disponibilidade === d ? 'linear-gradient(135deg,#C9826B,#D4A96A)' : '#FDF8F3',
                    borderRadius: 16, padding: '18px 8px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    cursor: 'pointer',
                    border: disponibilidade === d ? '2px solid transparent' : '1.5px solid #E8D8CC',
                    boxShadow: disponibilidade === d ? '0 4px 14px rgba(201,130,107,0.30)' : '0 2px 8px rgba(74,46,34,0.06)',
                    transition: 'all 150ms',
                  }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: disponibilidade === d ? '#FDF8F3' : '#4A2E22' }}>{d}</span>
                    <span style={{ fontSize: 9, color: disponibilidade === d ? 'rgba(253,248,243,0.8)' : '#8A6A5A', textAlign: 'center' }}>dias</span>
                  </div>
                ))}
              </div>
              {disponibilidade && (
                <div style={{ background: '#FDF8F3', borderRadius: 14, padding: '12px 16px', border: '1px solid #E8D8CC', animation: 'popIn 250ms var(--ease-out)', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: '#4A2E22', lineHeight: 1.6 }}>
                    {disponibilidade === '3' && '🌿 Perfeito para iniciantes! 3 dias são suficientes para transformar seu corpo.'}
                    {disponibilidade === '4' && '🔥 Ótimo ritmo! 4 dias garantem progressão consistente.'}
                    {disponibilidade === '5' && '💪 Muito bem! 5 dias é o equilíbrio ideal entre resultado e recuperação.'}
                    {disponibilidade === '6' && '⚡ Alto comprometimento! Lembre de respeitar o descanso.'}
                    {disponibilidade === '7' && '🏆 Dedicação total! Pelo menos 1 dia leve para recuperação muscular.'}
                  </div>
                </div>
              )}
              <div style={{ flex: 1 }}/>
              <NextBtn disabled={!canNext()} onClick={advance} />
            </div>
          )}

          {/* MOTIVAÇÃO */}
          {s === 'motivacao' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 24px' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: '#4A2E22', lineHeight: 1.2, marginBottom: 8 }}>O que te trouxe até aqui? ✨</div>
                <div style={{ fontSize: 14, color: '#8A6A5A', lineHeight: 1.6 }}>Selecione ou escreva o que te motiva.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[
                  'Quero me sentir bem na minha própria pele 🌸',
                  'Quero ter mais energia no dia a dia ⚡',
                  'Quero dar um exemplo para minha família 👨‍👩‍👧',
                  'Estou me preparando para um evento especial 💍',
                  'Quero melhorar minha saúde por indicação médica 💙',
                ].map(m => {
                  const sel = motivacao === m
                  return (
                    <div key={m} onClick={() => setMotivacao(m)} style={{ background: sel ? '#F0D5C8' : '#FDF8F3', border: sel ? '2px solid #C9826B' : '1.5px solid #E8D8CC', borderRadius: 14, padding: '12px 16px', cursor: 'pointer', transition: 'all 150ms' }}>
                      <span style={{ fontSize: 13, color: sel ? '#C9826B' : '#4A2E22', fontWeight: sel ? 500 : 400, lineHeight: 1.5 }}>{m}</span>
                    </div>
                  )
                })}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#8A6A5A', display: 'block', marginBottom: 6 }}>Ou escreva com suas palavras:</label>
                <textarea
                  value={['Quero me sentir bem na minha própria pele 🌸','Quero ter mais energia no dia a dia ⚡','Quero dar um exemplo para minha família 👨‍👩‍👧','Estou me preparando para um evento especial 💍','Quero melhorar minha saúde por indicação médica 💙'].includes(motivacao) ? '' : motivacao}
                  onChange={e => setMotivacao(e.target.value)}
                  placeholder="Ex: Quero me sentir poderosa e confiante..."
                  rows={3}
                  style={{ width: '100%', border: '1.5px solid #E8D8CC', borderRadius: 14, padding: '12px 16px', fontSize: 14, color: '#4A2E22', fontFamily: "'DM Sans',sans-serif", resize: 'none', outline: 'none', background: '#FDF8F3', lineHeight: 1.6 }}
                />
              </div>
              <div style={{ flex: 1 }}/>
              <NextBtn disabled={!canNext()} onClick={advance} label="Ver meu resumo →" />
            </div>
          )}

          {/* RESUMO */}
          {s === 'resumo' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px 32px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 12, animation: 'checkPulse 600ms ease' }}>🎉</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, color: '#4A2E22', lineHeight: 1.2, marginBottom: 8 }}>Tudo pronto, {nome}!</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 16, color: '#8A6A5A' }}>Aqui está o seu perfil personalizado 🌿</div>
              </div>

              <div style={{ background: '#FDF8F3', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(74,46,34,0.10)', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#C9826B,#D4A96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {nome.trim()[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: '#4A2E22' }}>{nome}</div>
                    <div style={{ fontSize: 12, color: '#8A6A5A' }}>{idade} anos · {peso} kg · {altura} cm {imc ? `· IMC ${imc}` : ''}</div>
                  </div>
                </div>
                {[
                  { label: 'Objetivo',     val: ({ emagrecer:'Perder peso 🔥', definir:'Definir o corpo 💪', massa:'Ganhar massa 🏋️', saude:'Melhorar a saúde 🌿', manutencao:'Manter o peso ⚖️' } as Record<string,string>)[objetivo] },
                  { label: 'Nível atual',  val: ({ sedentario:'Sedentária 🛋️', leve:'Levemente ativa 🚶', moderada:'Moderadamente ativa 🏃', ativa:'Muito ativa ⚡' } as Record<string,string>)[atividade] },
                  { label: 'Dias/semana', val: `${disponibilidade} dias de treino 📅` },
                  { label: 'Condições',   val: saude.includes('nenhuma') ? 'Nenhuma restrição ✓' : saude.join(', ') },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: 10, paddingBottom: 8, borderBottom: '1px solid #F0E4DC', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#B89B8C', textTransform: 'uppercase', letterSpacing: '0.04em', width: 80, flexShrink: 0, paddingTop: 1 }}>{row.label}</div>
                    <div style={{ fontSize: 13, color: '#4A2E22', flex: 1 }}>{row.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'linear-gradient(135deg,#C9826B,#D4A96A)', borderRadius: 18, padding: '18px 20px', marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 16, color: '#FDF8F3', lineHeight: 1.6, marginBottom: 6 }}>
                  &quot;{motivacao}&quot;
                </div>
                <div style={{ fontSize: 11, color: 'rgba(253,248,243,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sua motivação</div>
              </div>

              <button
                disabled={saving}
                onClick={handleComplete}
                style={{ width: '100%', background: saving ? '#E8D8CC' : 'linear-gradient(135deg,#C9826B,#D4A96A)', color: saving ? '#B89B8C' : '#FDF8F3', border: 'none', borderRadius: 100, padding: 18, fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", cursor: saving ? 'default' : 'pointer', boxShadow: saving ? 'none' : '0 6px 24px rgba(201,130,107,0.45)' }}>
                {saving ? 'Salvando...' : 'Começar meu desafio! 🚀'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <span style={{ fontSize: 11, color: '#B89B8C' }}>Seus dados ficam salvos apenas no seu dispositivo 🔒</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
