import BottomNav from '@/components/BottomNav'
import AppTopBar from '@/components/AppTopBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#F3E9DC' }}>
      <AppTopBar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', paddingBottom: 70 }}>
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
