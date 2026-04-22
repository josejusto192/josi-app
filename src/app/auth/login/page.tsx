'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    const supabase = createClient()
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#F5EDE3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#C9826B,#D4A96A)', boxShadow: '0 8px 24px rgba(201,130,107,0.40)', marginBottom: 16 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 48, color: '#FDF8F3', lineHeight: 1 }}>J</span>
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 600, color: '#4A2E22', marginBottom: 6 }}>
            Josi App
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 16, color: '#8A6A5A' }}>
            Desafio 21 Dias
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#FDF8F3', borderRadius: 24, padding: '28px 24px', boxShadow: '0 8px 32px rgba(74,46,34,0.12)' }}>

          {!sent ? (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#4A2E22', marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
                  Entrar no seu espaço 🌿
                </div>
                <div style={{ fontSize: 13, color: '#8A6A5A', lineHeight: 1.6 }}>
                  Digite seu email e enviaremos um link mágico de acesso. Sem senha!
                </div>
              </div>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: '#8A6A5A', display: 'block', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    style={{
                      width: '100%',
                      border: '1.5px solid #E8D8CC',
                      borderRadius: 14,
                      padding: '13px 16px',
                      fontSize: 15,
                      color: '#4A2E22',
                      fontFamily: "'DM Sans', sans-serif",
                      outline: 'none',
                      background: '#F5EDE3',
                      transition: 'border-color 150ms',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#C9826B')}
                    onBlur={e  => (e.target.style.borderColor = '#E8D8CC')}
                  />
                </div>

                {error && (
                  <div style={{ background: '#FEE2E2', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#991B1B' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  style={{
                    background: loading || !email.trim() ? '#E8D8CC' : 'linear-gradient(135deg,#C9826B,#D4A96A)',
                    color: loading || !email.trim() ? '#B89B8C' : '#FDF8F3',
                    border: 'none',
                    borderRadius: 100,
                    padding: '15px',
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: loading || !email.trim() ? 'default' : 'pointer',
                    transition: 'all 200ms',
                    boxShadow: !loading && email.trim() ? '0 4px 16px rgba(201,130,107,0.35)' : 'none',
                  }}
                >
                  {loading ? 'Enviando...' : 'Enviar link de acesso ✨'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: '#4A2E22', marginBottom: 10 }}>
                Link enviado!
              </div>
              <div style={{ fontSize: 14, color: '#8A6A5A', lineHeight: 1.7 }}>
                Verifique sua caixa de entrada em <strong style={{ color: '#C9826B' }}>{email}</strong> e clique no link para entrar.
              </div>
              <button
                onClick={() => setSent(false)}
                style={{ marginTop: 20, background: 'none', border: 'none', fontSize: 13, color: '#8A6A5A', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Usar outro email
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#B89B8C' }}>
          Seus dados ficam seguros e privados 🔒
        </div>
      </div>
    </div>
  )
}
