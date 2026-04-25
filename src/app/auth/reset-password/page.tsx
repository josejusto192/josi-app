'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

function Field({ label, value, onChange, placeholder, hint }: {
  label: string; value: string; placeholder: string; hint?: string; onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const [show, setShow]       = useState(false)
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#6B7F63', display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', border: `1.5px solid ${focused ? '#2F4A3B' : '#DDD5C5'}`,
            borderRadius: 14, padding: '13px 16px', fontSize: 15, color: '#2F4A3B',
            fontFamily: "'Lato', sans-serif", outline: 'none', background: '#F3E9DC',
            transition: 'border-color 150ms', boxSizing: 'border-box',
          }}
        />
        <button type="button" onClick={() => setShow(s => !s)}
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6B7F63', padding: 0 }}>
          {show ? 'ocultar' : 'ver'}
        </button>
      </div>
      {hint && <div style={{ fontSize: 11, color: '#9DB09A', marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

export default function ResetPasswordPage() {
  const router   = useRouter()
  const [senha, setSenha]   = useState('')
  const [senha2, setSenha2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (senha.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.')
    if (senha !== senha2) return setError('As senhas não coincidem.')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: senha })
    setLoading(false)
    if (error) setError(error.message)
    else setDone(true)
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F3E9DC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Lato', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 68, height: 68, borderRadius: 20, background: 'linear-gradient(135deg,#2F4A3B,#C49A5A)', boxShadow: '0 8px 24px rgba(47,74,59,0.40)', marginBottom: 14 }}>
            <span style={{ fontFamily: "'Lato', Georgia, serif", fontStyle: 'italic', fontSize: 44, color: '#FAF7F2', lineHeight: 1 }}>J</span>
          </div>
          <div style={{ fontFamily: "'Cinzel', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#2F4A3B', marginBottom: 4 }}>Josi App</div>
        </div>

        <div style={{ background: '#FAF7F2', borderRadius: 24, padding: '28px 24px', boxShadow: '0 8px 32px rgba(47,74,59,0.12)' }}>
          {!done ? (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginBottom: 6 }}>Nova senha 🔑</div>
                <div style={{ fontSize: 13, color: '#6B7F63', lineHeight: 1.6 }}>Escolha uma nova senha para a sua conta.</div>
              </div>

              <Field label="Nova senha" value={senha} onChange={setSenha} placeholder="mínimo 6 caracteres" hint="Use letras, números ou símbolos." />
              <Field label="Confirmar nova senha" value={senha2} onChange={setSenha2} placeholder="repita a nova senha" />

              {error && (
                <div style={{ background: '#FEE2E2', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#991B1B' }}>{error}</div>
              )}

              <button type="submit" disabled={loading || !senha || !senha2}
                style={{
                  background: loading || !senha || !senha2 ? '#DDD5C5' : 'linear-gradient(135deg,#2F4A3B,#C49A5A)',
                  color: loading || !senha || !senha2 ? '#9DB09A' : '#FAF7F2',
                  border: 'none', borderRadius: 100, padding: '15px', fontSize: 15, fontWeight: 600,
                  fontFamily: "'Lato', sans-serif", cursor: loading || !senha || !senha2 ? 'default' : 'pointer',
                  transition: 'all 200ms', boxShadow: !loading && senha && senha2 ? '0 4px 16px rgba(47,74,59,0.35)' : 'none',
                }}>
                {loading ? 'Salvando…' : 'Salvar nova senha'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 48 }}>✅</div>
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: '#2F4A3B', marginBottom: 8 }}>Senha atualizada!</div>
                <div style={{ fontSize: 13, color: '#6B7F63', lineHeight: 1.6 }}>Sua senha foi redefinida com sucesso.</div>
              </div>
              <button onClick={() => router.push('/desafio')}
                style={{ background: 'linear-gradient(135deg,#2F4A3B,#C49A5A)', color: '#FAF7F2', border: 'none', borderRadius: 100, padding: '13px 28px', fontSize: 14, fontWeight: 600, fontFamily: "'Lato',sans-serif", cursor: 'pointer', boxShadow: '0 4px 16px rgba(47,74,59,0.3)' }}>
                Ir para o app →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
