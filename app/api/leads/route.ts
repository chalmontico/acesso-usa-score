import { NextRequest, NextResponse } from 'next/server'
import { calcScore, getRiscos, getPassos, Answers } from '@/lib/score'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: Answers = body.answers

    const score = calcScore(answers)
    const riscos = getRiscos(answers, score)
    const passos = getPassos(answers, score)

    const resumo_ia = `A empresa ${answers.empresa} do segmento ${answers.segmento} obteve ${score.total} pontos no diagnóstico Acesso USA Score. Nível ${score.nivel}: ${score.nivel_label}. Com faturamento de ${answers.faturamento}, a empresa apresenta oportunidades claras para estruturar sua entrada no mercado americano.`

    return NextResponse.json({
      success: true,
      lead_id: 'temp-' + Date.now(),
      diagnostico_id: 'temp-' + Date.now(),
      score,
      resumo_ia,
      riscos,
      passos,
      answers,
    })

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
