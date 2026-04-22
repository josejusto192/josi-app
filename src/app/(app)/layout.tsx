import PhoneFrame from '@/components/PhoneFrame'
import BottomNav from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame label="Josi App · Desafio 21 Dias">
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <BottomNav />
    </PhoneFrame>
  )
}
