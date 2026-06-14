'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SUPABASE_URL = 'https://gedqamkcflteuhlvrabo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZHFhbWtjZmx0ZXVobHZyYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NzU3NjAsImV4cCI6MjA5NjQ1MTc2MH0.AKt8e8JPUgZPanBwOog2aJDLBcD3zNHKp7c9TTB2878'

const STEPS = [
  {
    id: 'dados', title: 'Dados da empresa', subtitle: 'Vamos começar conhecendo você e sua empresa.',
    type: 'form',
    fields: [
      { key: 'nome', label: 'Seu nome', placeholder: 'João Silva' },
      { key: 'empresa', label: 'Nome da empresa', placeholder: 'Minha Empresa Ltda' },
      { key: 'email', label: 'E-mail', placeholder: 'joao@empresa.com.br', type: 'email' },
      { key: 'whatsapp', label: 'WhatsApp', placeholder: '(11) 99999-9999' },
      { key: 'segmento', label: 'Segmento', placeholder: 'Ex: Tecnologia, Moda, Alimentos...' },
    ]
  },
  {
    id: 'momento', title: 'Momento da empresa', subtitle: 'Entenda onde você está hoje.',
    type: 'questions',
    questions: [
      { key: 'faturamento', label: 'Qual o faturamento anual aproximado?', options: ['Menos de R$500 mil','R$500 mil a R$1 milhão','R$1 milhão a R$5 milhões','R$5 milhões a R$20 milhões','Acima de R$20 milhões'] },
      { key: 'vende_fora', label: 'A empresa já vende fora do Brasil?', options: ['Sim','Não'] },
      { key: 'clientes_eua', label: 'Já tem clientes nos Estados Unidos?', options: ['Sim','Não'] },
      { key: 'produto_americanos', label: 'Tem produto ou serviço que poderia ser vendido para americanos?', options: ['Sim','Não','Não sei'] },
    ]
  },
  {
    id: 'estrutura', title: 'Estrutura', subtitle: 'Sua situação jurídica e operacional.',
    type: 'questions',
    questions: [
      { key: 'cnpj', label: 'A empresa possui CNPJ ativo?', options: ['Sim','Não'] },
      { key: 'marca_brasil', label: 'A marca já é registrada no Brasil?', options: ['Sim','Não','Em andamento','Não sei'] },
      { key: 'marca_pesquisou_eua', label: 'Já pesquisou se a marca está disponível nos EUA?', options: ['Sim','Não'] },
      { key: 'empresa_eua', label: 'Já possui LLC, Corporation ou outra empresa nos EUA?', options: ['Sim','Não'] },
      { key: 'ein', label: 'Já possui EIN (número fiscal americano)?', options: ['Sim','Não'] },
      { key: 'conta_eua', label: 'Já possui conta bancária nos EUA?', options: ['Sim','Não'] },
    ]
  },
  {
    id: 'comercial', title: 'Comercial e operação', subtitle: 'Sua capacidade de entrar e operar no mercado.',
    type: 'questions',
    questions: [
      { key: 'site_profissional', label: 'A empresa tem site profissional?', options: ['Sim','Não'] },
      { key: 'equipe_comercial', label: 'Tem equipe comercial?', options: ['Sim','Não'] },
      { key: 'material_ingles', label: 'Tem material em inglês?', options: ['Sim','Não'] },
      { key: 'fala_ingles', label: 'Tem alguém que fala inglês na operação?', options: ['Sim','Não'] },
      { key: 'visitou_eua', label: 'Já visitou os EUA com objetivo de negócios?', options: ['Sim','Não'] },
      { key: 'prazo', label: 'Pretende entrar nos EUA em quanto tempo?', options: ['0 a 3 meses','3 a 6 meses','6 a 12 meses','Mais de 12 meses','Só quero entender'] },
    ]
  },
]

function calcScore(answers: Record<string,string>) {
  let score = 0
  const sim = (k: string) => answers[k] === 'Sim'
  if (answers.faturamento === 'Acima de R$20 milhões') score += 15
  else if (answers.faturamento === 'R$5 milhões a R$20 milhões') score += 12
  else if (answers.faturamento === 'R$1 milhão a R$5 milhões') score += 8
  else if (answers.faturamento === 'R$500 mil a R$1 milhão') score += 4
  if (sim('vende_fora')) score += 10
  if (sim('clientes_eua')) score += 10
  if (answers.produto_americanos === 'Sim') score += 8
  if (sim('cnpj')) score += 5
  if (sim('marca_brasil')) score += 5
  if (sim('marca_pesquisou_eua')) score += 5
  if (sim('empresa_eua')) score += 10
  if (sim('ein')) score += 5
  if (sim('conta_eua')) score += 5
  if (sim('site_profissional')) score += 4
  if (sim('equipe_comercial')) score += 4
  if (sim('material_ingles')) score += 4
  if (sim('fala_ingles')) score += 4
  if (sim('visitou_eua')) score += 4
  if (answers.prazo === '0 a 3 meses') score += 2
  return Math.min(score, 100)
}

function getNivel(score: number) {
  if (score >= 75) return 'Pronto para Expandir'
  if (score >= 50) return 'Em Desenvolvimento'
  if (score >= 25) return 'Iniciando Jornada'
  return 'Precisa Estruturar'
}

export default function Quiz() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string,string>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const cur = STEPS[step]
  const progress = ((step + 1) / STEPS.length) * 100

  function setAns(key: string, val: string) {
    setAnswers(a => ({ ...a, [key]: val }))
    setError('')
  }

  async function handleNext() {
    if (cur.type === 'form') {
      const required = (cur as any).fields.map((f: any) => f.key)
      for (const k of required) {
        if (!answers[k]) { setError('Por favor, preencha todos os campos.'); return }
      }
    }
    if (cur.type === 'questions') {
      const unanswered = (cur as any).questions.find((q: any) => !answers[q.key])
      if (unanswered) { setError('Por favor, responda todas as perguntas.'); return }
    }
    setError('')

    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setLoading(true)
      const score = calcScore(answers)
      const nivel = getNivel(score)
      const resultado = { score, nivel, answers }
      localStorage.setItem('acesso_resultado', JSON.stringify(resultado))

      // Salva direto no Supabase do browser
      fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: answers.nome || 'Sem nome',
          email: answers.email || 'sem@email.com',
          whatsapp: answers.whatsapp || null,
          score,
          nivel,
          respostas: answers,
        })
      }).catch(() => {})

      router.push('/resultado')
    }
  }

  const s = { black:'#060810',surface:'#111420',blue:'#1E6FFF',blueLight:'#3FA9F5',white:'#F0F4FF',whiteDim:'rgba(240,244,255,0.7)',whiteMuted:'rgba(240,244,255,0.35)' }

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:s.black,padding:'2rem',textAlign:'center'}}>
      <div style={{width:'48px',height:'48px',border:'2px solid rgba(30,111,255,0.2)',borderTopColor:s.blue,borderRadius:'50%',animation:'spin 1s linear infinite',marginBottom:'2rem'}}></div>
      <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'1.8rem',fontWeight:200,letterSpacing:'-0.03em',marginBottom:'1rem'}}>Analisando sua empresa</h2>
      <p style={{color:s.whiteMuted,fontSize:'0.85rem',letterSpacing:'0.05em'}}>Gerando seu diagnóstico personalizado...</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:s.black,padding:'2rem 1.5rem',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{marginBottom:'3rem',display:'flex',alignItems:'center'}}>
        <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:300,color:s.white}}>Acesso</span>
        <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginLeft:'0.3rem'}}>USA</span>
      </div>

      <div style={{width:'100%',maxWidth:'580px',marginBottom:'0.5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
          <span style={{fontSize:'0.62rem',letterSpacing:'0.15em',textTransform:'uppercase',color:s.whiteMuted}}>Etapa {step+1} de {STEPS.length}</span>
          <span style={{fontSize:'0.62rem',color:s.blueLight}}>{Math.round(progress)}%</span>
        </div>
        <div style={{height:'1px',background:'rgba(30,111,255,0.1)',borderRadius:'1px',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#0A3D91,#3FA9F5)',transition:'width 0.5s ease',borderRadius:'1px'}}></div>
        </div>
      </div>

      <div style={{display:'flex',gap:'4px',width:'100%',maxWidth:'580px',marginBottom:'2.5rem'}}>
        {STEPS.map((_,i) => <div key={i} style={{flex:1,height:'2px',borderRadius:'1px',background:i<=step?s.blue:'rgba(30,111,255,0.12)',transition:'background 0.3s'}}></div>)}
      </div>

      <div style={{width:'100%',maxWidth:'580px',background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',padding:'2.5rem 2rem'}}>
        <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'1.5rem',fontWeight:200,letterSpacing:'-0.03em',marginBottom:'0.5rem'}}>{cur.title}</h2>
        <p style={{fontSize:'0.82rem',color:s.whiteDim,marginBottom:'2rem'}}>{cur.subtitle}</p>

        {cur.type === 'form' && (cur as any).fields.map((f: any) => (
          <div key={f.key} style={{marginBottom:'1.2rem'}}>
            <label style={{display:'block',fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'0.5rem'}}>{f.label}</label>
            <input
              type={f.type||'text'} placeholder={f.placeholder}
              value={answers[f.key]||''}
              onChange={e => setAns(f.key, e.target.value)}
              style={{width:'100%',background:'rgba(6,8,16,0.7)',border:'1px solid rgba(30,111,255,0.15)',borderRadius:'2px',padding:'0.85rem 1rem',color:s.white,fontFamily:'DM Sans,sans-serif',fontSize:'0.9rem',outline:'none',transition:'border-color 0.2s'}}
              onFocus={e => e.target.style.borderColor=s.blue}
              onBlur={e => e.target.style.borderColor='rgba(30,111,255,0.15)'}
            />
          </div>
        ))}

        {cur.type === 'questions' && (cur as any).questions.map((q: any, qi: number) => (
          <div key={q.key} style={{marginBottom:'2rem'}}>
            <p style={{fontSize:'0.85rem',fontWeight:400,marginBottom:'0.8rem',lineHeight:1.5,color:s.white}}>
              <span style={{color:s.blueLight,marginRight:'0.5rem',fontSize:'0.65rem',letterSpacing:'0.1em'}}>{String(qi+1).padStart(2,'0')}</span>
              {q.label}
            </p>
            {q.options.map((opt: string) => (
              <button key={opt} onClick={() => setAns(q.key, opt)} style={{
                width:'100%',textAlign:'left',
                background:answers[q.key]===opt?'rgba(30,111,255,0.1)':'rgba(6,8,16,0.5)',
                border:`1px solid ${answers[q.key]===opt?s.blue:'rgba(30,111,255,0.12)'}`,
                borderRadius:'2px',padding:'0.9rem 1rem',
                color:answers[q.key]===opt?s.white:s.whiteDim,
                fontFamily:'DM Sans,sans-serif',fontSize:'0.85rem',
                cursor:'pointer',transition:'all 0.2s',
                display:'flex',alignItems:'center',gap:'0.8rem',marginBottom:'0.5rem'
              }}>
                <div style={{width:'18px',height:'18px',borderRadius:'50%',border:`1.5px solid ${answers[q.key]===opt?s.blue:'rgba(30,111,255,0.25)'}`,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:answers[q.key]===opt?s.blue:'transparent'}}>
                  {answers[q.key]===opt && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                </div>
                {opt}
              </button>
            ))}
          </div>
        ))}

        {error && <div style={{padding:'0.8rem 1rem',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'2px',color:'#FCA5A5',fontSize:'0.8rem',marginBottom:'1.2rem'}}>{error}</div>}

        <div style={{display:'flex',justifyContent:'space-between',marginTop:'1rem'}}>
          {step > 0 ? (
            <button onClick={() => setStep(s => s-1)} style={{background:'none',border:'none',color:s.whiteMuted,fontSize:'0.75rem',letterSpacing:'0.1em',cursor:'pointer',textTransform:'uppercase'}}>← Voltar</button>
          ) : <div/>}
          <button onClick={handleNext} style={{background:'linear-gradient(135deg,#0A3D91,#1E6FFF)',border:'none',borderRadius:'2px',padding:'0.85rem 2rem',color:'white',fontFamily:'DM Sans,sans-serif',fontSize:'0.8rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}}>
            {step === STEPS.length-1 ? 'Ver meu diagnóstico →' : 'Continuar →'}
          </button>
        </div>
      </div>

      <p style={{marginTop:'1.5rem',fontSize:'0.65rem',color:s.whiteMuted,maxWidth:'580px',textAlign:'center',lineHeight:1.6}}>
        Suas informações são confidenciais e utilizadas apenas para gerar seu diagnóstico.
      </p>
    </div>
  )
}
