import PhoneFrame from '@/components/PhoneFrame'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

export default function OnboardingPage() {
  return (
    <PhoneFrame label="Josi App · Configuração inicial">
      <OnboardingFlow />
    </PhoneFrame>
  )
}
export const dynamic = 'force-dynamic'
