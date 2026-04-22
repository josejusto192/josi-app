export interface UserProfile {
  id: string
  nome: string
  idade: number
  peso_inicial: number
  altura: number
  imc: number
  objetivo: 'emagrecer' | 'definir' | 'massa' | 'saude' | 'manutencao'
  nivel_atividade: 'sedentario' | 'leve' | 'moderada' | 'ativa'
  condicoes_saude: string[]
  dias_semana: number
  motivacao: string
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface ChallengeDay {
  day: number
  title: string
  done: boolean
  locked: boolean
  current: boolean
}

export interface HabitsLog {
  id: string
  user_id: string
  date: string
  agua: boolean
  proteina: boolean
  passos: boolean
  treino: boolean
}

export interface ChallengeProgress {
  id: string
  user_id: string
  day: number
  completed: boolean
  lesson_done: boolean
  completed_at: string | null
}

export type Tab = 'desafio' | 'comunidade' | 'exercicios' | 'educacao' | 'loja'
