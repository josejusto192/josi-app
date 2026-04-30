import { NextRequest, NextResponse } from 'next/server'

type HabitsYesterday = { agua: boolean; proteina: boolean; passos: boolean; treino: boolean } | null

interface MensagemContext {
  nome: string | null
  objetivo: string | null
  streak: number
  currentDay: number
  completedDays: number
  yesterdayHabits: HabitsYesterday
}

const HABIT_LABEL: Record<string, string> = {
  agua: 'água', proteina: 'proteína', passos: 'caminhada', treino: 'treino',
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-latest:generateContent'

function generateFallback(ctx: MensagemContext): string {
  const first = ctx.nome?.split(' ')[0] || 'Você'
  const yh    = ctx.yesterdayHabits
  const yAll  = yh && Object.values(yh).every(Boolean)
  const yNone = yh && Object.values(yh).every(v => !v)

  if (ctx.streak >= 14)        return `${first}, ${ctx.streak} dias seguidos falam mais alto que qualquer motivação. Isso é identidade. 🌿`
  if (ctx.streak >= 7)         return `Uma semana inteira, ${first}! Você já provou que consegue — agora é questão de tempo.`
  if (yAll)                    return `Ontem foi impecável, ${first}. Cada hábito cumprido constrói a pessoa que você está se tornando.`
  if (yNone && yh)             return `Ninguém acerta todos os dias, ${first}. O que importa é que você está aqui no dia ${ctx.currentDay}. Recomeça agora.`
  if (ctx.currentDay === 1)    return `O primeiro passo é o mais importante. Bem-vinda ao seu desafio, ${first}!`
  if (ctx.currentDay <= 3)     return `Os primeiros dias são os que mais constroem o hábito. Você está exatamente no lugar certo, ${first}.`
  if (ctx.completedDays >= 14) return `Mais da metade do caminho percorrido, ${first}. A linha de chegada está mais perto do que você imagina.`
  return `Dia ${ctx.currentDay}, ${first}. Cada pequena escolha certa de hoje é o resultado de amanhã.`
}

function buildPrompt(ctx: MensagemContext): string {
  const yh      = ctx.yesterdayHabits
  const yAll    = yh && Object.values(yh).every(Boolean)
  const yDone   = yh ? Object.entries(yh).filter(([, v]) => v).map(([k]) => HABIT_LABEL[k] ?? k) : []
  const yMissed = yh ? Object.entries(yh).filter(([, v]) => !v).map(([k]) => HABIT_LABEL[k] ?? k) : []

  const contextLines = [
    `- Nome: ${ctx.nome || 'usuária'}`,
    `- Objetivo pessoal: ${ctx.objetivo || 'transformação e bem-estar'}`,
    `- Dia atual no desafio de 21 dias: dia ${ctx.currentDay}`,
    `- Total de dias do desafio concluídos: ${ctx.completedDays}`,
    `- Sequência atual (dias seguidos): ${ctx.streak} ${ctx.streak === 1 ? 'dia' : 'dias'}`,
    yh === null
      ? '- Ontem: sem dados de hábitos registrados'
      : yAll
        ? '- Ontem: concluiu todos os hábitos (água, proteína, caminhada e treino) ✓'
        : yDone.length > 0
          ? `- Ontem: completou ${yDone.join(', ')} — não completou ${yMissed.join(', ')}`
          : '- Ontem: não registrou nenhum hábito',
  ].join('\n')

  return `Você é a coach de bem-estar da Josiane Szewczuk no app "Viver Bem". Escreva uma mensagem diária curta, calorosa e personalizada em português brasileiro para a usuária abaixo.

${contextLines}

Regras:
- Máximo 2 frases, no máximo 70 palavras no total
- Use "você" (não tutear de outra forma)
- Seja específica ao contexto (mencione o que for relevante: streak, ontem, dia no desafio)
- Tom: como uma amiga coach — humana, encorajadora, sem exagero
- Sem asteriscos, sem markdown, sem listas
- No máximo 1 emoji sutil se combinar naturalmente
- Não comece com "Olá" ou saudação genérica — vá direto ao ponto`
}

export async function POST(req: NextRequest) {
  const ctx: MensagemContext = await req.json()

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ message: generateFallback(ctx) })
  }

  try {
    const res = await fetch(GEMINI_URL, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(ctx) }] }],
        generationConfig: {
          maxOutputTokens: 200,
          temperature:     0.85,
        },
      }),
    })

    if (!res.ok) throw new Error(`Gemini ${res.status}`)

    const data = await res.json()
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
    return NextResponse.json({ message: text || generateFallback(ctx) })
  } catch {
    return NextResponse.json({ message: generateFallback(ctx) })
  }
}
