'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Mode = 'login' | 'signup' | 'forgot'

const inp = (focused: boolean): React.CSSProperties => ({
  width: '100%', border: `1.5px solid ${focused ? '#2F4A3B' : '#DDD5C5'}`,
  borderRadius: 12, padding: '13px 16px', fontSize: 15, color: '#2F4A3B',
  fontFamily: "'Lato', sans-serif", outline: 'none', background: '#FAF7F2',
  transition: 'border-color 200ms', boxSizing: 'border-box',
})

const btn = (disabled: boolean): React.CSSProperties => ({
  background: disabled ? '#DDD5C5' : '#2F4A3B',
  color: disabled ? '#9DB09A' : '#FAF7F2', border: 'none', borderRadius: 100,
  padding: '15px', fontSize: 15, fontWeight: 600, fontFamily: "'Lato', sans-serif",
  cursor: disabled ? 'default' : 'pointer', transition: 'background 200ms', width: '100%',
  boxShadow: disabled ? 'none' : '0 4px 14px rgba(47,74,59,0.28)',
  letterSpacing: '0.02em',
})

function Field({ label, type, value, onChange, placeholder, hint }: {
  label: string; type: string; value: string; placeholder: string
  hint?: string; onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7F63', display: 'block', marginBottom: 6, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPass && show ? 'text' : type}
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={inp(focused)}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#9DB09A', padding: 0, letterSpacing: '0.03em' }}>
            {show ? 'ocultar' : 'ver'}
          </button>
        )}
      </div>
      {hint && <div style={{ fontSize: 11, color: '#9DB09A', marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

export default function AuthPage() {
  const router   = useRouter()
  const [mode, setMode]     = useState<Mode>('login')
  const [nome, setNome]     = useState('')
  const [email, setEmail]   = useState('')
  const [senha, setSenha]   = useState('')
  const [senha2, setSenha2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const reset = (m: Mode) => { setMode(m); setError(''); setSuccess('') }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha })
    setLoading(false)
    if (error) {
      if (error.message.includes('Invalid login credentials'))
        setError('Email ou senha incorretos. Tente novamente.')
      else setError(error.message)
    } else {
      router.push('/desafio')
      router.refresh()
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!nome.trim()) return setError('Digite seu nome.')
    if (senha.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.')
    if (senha !== senha2) return setError('As senhas não coincidem.')
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(), password: senha,
      options: { data: { nome: nome.trim() }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      if (error.message.includes('already registered')) setError('Este email já está cadastrado. Faça login.')
      else setError(error.message)
      return
    }
    if (data.session) {
      await supabase.from('profiles').update({ nome: nome.trim() }).eq('id', data.user!.id)
      router.push('/onboarding')
      router.refresh()
    } else {
      setSuccess(`Perfeito, ${nome.split(' ')[0]}! Verifique seu email para confirmar o cadastro.`)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSuccess('Enviamos um link para redefinir sua senha. Verifique seu email.')
  }

  const errorBlock = error && (
    <div style={{ background: '#FEE2E2', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#991B1B' }}>{error}</div>
  )
  const successBlock = success && (
    <div style={{ background: '#D4E3D8', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#2F4A3B', lineHeight: 1.5 }}>✓ {success}</div>
  )

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#F3E9DC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      fontFamily: "'Lato', system-ui, sans-serif",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <Image
          src="/logo-viverbem.svg"
          alt="Viver Bem by Josiane Szewczuk"
          width={180}
          height={171}
          priority
          style={{ display: 'block', margin: '0 auto' }}
        />
      </div>

      <div style={{ width: '100%', maxWidth: 360 }}>

        {/* Tab switch */}
        {mode !== 'forgot' && (
          <div style={{ display: 'flex', background: '#EBE0CF', borderRadius: 100, padding: 3, marginBottom: 24 }}>
            {(['login', 'signup'] as const).map((m) => (
              <button key={m} onClick={() => reset(m)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 100, border: 'none',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  fontFamily: "'Lato', sans-serif", transition: 'all 200ms',
                  background: mode === m ? '#FAF7F2' : 'transparent',
                  color: mode === m ? '#2F4A3B' : '#9DB09A',
                  boxShadow: mode === m ? '0 1px 6px rgba(47,74,59,0.12)' : 'none',
                }}>
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>
        )}

        <div style={{ background: '#FAF7F2', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 24px rgba(47,74,59,0.10)' }}>

          {/* LOGIN */}
          {mode === 'login' && !success && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', letterSpacing: '0.04em' }}>Bem-vinda de volta</div>
                <div style={{ fontSize: 13, color: '#9DB09A', marginTop: 3 }}>Continue sua jornada</div>
              </div>
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" />
              <Field label="Senha" type="password" value={senha} onChange={setSenha} placeholder="••••••••" />
              {errorBlock}
              <button type="submit" disabled={loading || !email || !senha} style={btn(loading || !email || !senha)}>
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
              <button type="button" onClick={() => reset('forgot')}
                style={{ background: 'none', border: 'none', fontSize: 13, color: '#9DB09A', cursor: 'pointer', textAlign: 'center', marginTop: -4 }}>
                Esqueci minha senha
              </button>
            </form>
          )}

          {/* SIGNUP */}
          {mode === 'signup' && !success && (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', letterSpacing: '0.04em' }}>Comece sua jornada</div>
                <div style={{ fontSize: 13, color: '#9DB09A', marginTop: 3 }}>Crie sua conta gratuitamente</div>
              </div>
              <Field label="Seu nome" type="text" value={nome} onChange={setNome} placeholder="ex: Ana Paula" />
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" />
              <Field label="Senha" type="password" value={senha} onChange={setSenha} placeholder="mínimo 6 caracteres" hint="Use letras, números ou símbolos." />
              <Field label="Confirmar senha" type="password" value={senha2} onChange={setSenha2} placeholder="repita a senha" />
              {errorBlock}
              <button type="submit" disabled={loading || !nome || !email || !senha || !senha2} style={btn(loading || !nome || !email || !senha || !senha2)}>
                {loading ? 'Criando conta…' : 'Criar minha conta'}
              </button>
            </form>
          )}

          {/* FORGOT */}
          {mode === 'forgot' && !success && (
            <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 600, color: '#2F4A3B', letterSpacing: '0.04em', marginBottom: 6 }}>Redefinir senha</div>
                <div style={{ fontSize: 13, color: '#9DB09A', lineHeight: 1.6 }}>Digite seu email e enviaremos um link para criar uma nova senha.</div>
              </div>
              <Field label="Email cadastrado" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" />
              {errorBlock}
              <button type="submit" disabled={loading || !email} style={btn(loading || !email)}>
                {loading ? 'Enviando…' : 'Enviar link'}
              </button>
              <button type="button" onClick={() => reset('login')}
                style={{ background: 'none', border: 'none', fontSize: 13, color: '#9DB09A', cursor: 'pointer', textAlign: 'center' }}>
                ← Voltar para o login
              </button>
            </form>
          )}

          {/* SUCCESS */}
          {success && (
            <div style={{ textAlign: 'center', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontSize: 40 }}>{mode === 'forgot' ? '📬' : '🌿'}</div>
              {successBlock}
              <button onClick={() => reset('login')}
                style={{ background: 'none', border: 'none', fontSize: 14, color: '#2F4A3B', cursor: 'pointer', fontWeight: 600 }}>
                {mode === 'forgot' ? '← Voltar para o login' : 'Fazer login agora →'}
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#C8BEAE' }}>
          Seus dados ficam seguros e privados
        </div>
      </div>
    </div>
  )
}
