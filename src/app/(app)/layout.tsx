import PhoneFrame from '@/components/PhoneFrame'
import BottomNav from '@/components/BottomNav'
import AppTopBar from '@/components/AppTopBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame label="Josi App · Desafio 21 Dias">
      <AppTopBar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <BottomNav />
    </PhoneFrame>
  )
}
