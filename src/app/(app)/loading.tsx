export default function Loading() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2F4A3B', minHeight: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid rgba(196,154,90,0.3)', borderTopColor: '#C49A5A', borderRadius: '50%', animation: 'spin 900ms linear infinite', margin: '0 auto 14px' }} />
        <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.5)', letterSpacing: '0.08em', fontFamily: "'Cinzel',serif" }}>CARREGANDO</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )
}
