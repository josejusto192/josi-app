import BottomNav from '@/components/BottomNav'
import AppTopBar from '@/components/AppTopBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: '#F5EDE3' }}>
      <AppTopBar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
