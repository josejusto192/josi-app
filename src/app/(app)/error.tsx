'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3E9DC', minHeight: '100%', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 280 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 600, color: '#2F4A3B', marginBottom: 8 }}>
          Algo não carregou direito
        </div>
        <div style={{ fontSize: 13, color: '#6B7F63', marginBottom: 20, lineHeight: 1.5 }}>
          Verifique sua conexão e tente novamente.
        </div>
        <button
          onClick={reset}
          style={{ background: '#2F4A3B', color: '#FAF7F2', border: 'none', borderRadius: 100, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Tentar de novo
        </button>
      </div>
    </div>
  )
}
