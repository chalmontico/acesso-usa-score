import { NextRequest, NextResponse } from 'next/server'
import { calcScore, getRiscos, getPassos, Answers } from '@/lib/score'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: Answers = body.answers

    const score = calcScore(answers)
    const riscos = getRiscos(answers, score)
    const passos = getPassos(answers, score)
    const resumo_ia = `A empresa ${answers.empresa} do segmento ${answers.segmento} obteve ${score.total} pontos. Nível ${score.nivel}: ${score.nivel_label}.`

    return NextResponse.json({
      success: true,
      lead_id: 'lead-' + Date.now(),
      diagnostico_id: 'diag-' + Date.now(),
      score,
      resumo_ia,
      riscos,
      passos,
      answers,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
