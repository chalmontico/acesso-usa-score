import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { calcScore, getRiscos, getPassos, Answers } from '@/lib/score'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: Answers = body.answers
    const supabase = getServiceClient()

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        nome: answers.nome,
        empresa: answers.empresa,
        email: answers.email,
        whatsapp: answers.whatsapp,
        cidade: answers.cidade || '',
        estado: answers.estado || '',
        segmento: answers.segmento,
        site: answers.site || '',
        instagram: answers.instagram || '',
      })
      .select()
      .single()

    if (leadError) throw new Error(`Supabase error: ${leadError.message}`)

    const score = calcScore(answers)
    const riscos = getRiscos(answers, score)
    const passos = getPassos(answers, score)

    let resumo_ia = `A empresa ${answers.empresa} do segmento ${answers.segmento} obteve ${score.total}/100 no diagnóstico. Nível ${score.nivel}: ${score.nivel_label}.`

    try {
      const { default: OpenAI } = await import('openai')
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 400,
        messages: [
          { role: 'system', content: 'Você é um especialista em internacionalização de empresas brasileiras para os EUA. Escreva em português, direto e estratégico. Máximo 3 parágrafos curtos.' },
          { role: 'user', content: `Empresa: ${answers.empresa}, Segmento: ${answers.segmento}, Faturamento: ${answers.faturamento}, Score: ${score.total}/100, Nível: ${score.nivel_label}. Escreva um resumo analítico personalizado.` }
        ]
      })
      resumo_ia = completion.choices[0]?.message?.content || resumo_ia
    } catch (e) {
      console.log('OpenAI fallback:', e)
    }

    const { data: diagnostico, error: diagError } = await supabase
      .from('diagnosticos')
      .insert({
        lead_id: lead.id,
        respostas: answers,
        score_total: score.total,
        score_marca: score.marca,
        score_estrutura: score.estrutura,
        score_financeiro: score.financeiro,
        score_produto: score.produto,
        score_comercial: score.comercial,
        score_timing: score.timing,
        nivel: score.nivel,
        nivel_label: score.nivel_label,
        resumo_ia,
        riscos_ia: riscos,
        passos_ia: passos,
      })
      .select()
      .single()

    if (diagError) throw new Error(`Diagnostico error: ${diagError.message}`)

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      diagnostico_id: diagnostico.id,
      score,
      resumo_ia,
      riscos,
      passos,
    })

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
