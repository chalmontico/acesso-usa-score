'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
      
      // Salva resultado local PRIMEIRO — usuário nunca espera
      const resultado = { score, nivel, answers }
      localStorage.setItem('acesso_resultado', JSON.stringify(resultado))
      
      // Salva no banco em segundo plano (sem bloquear)
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, score, nivel })
      }).catch(() => {}) // ignora erro silenciosamente
      
      // Vai direto para resultado
      router.push('/resultado')
    }
  }

  const s = { black:'#060810',surface:'#111420',blue:'#1E6FFF',blueLight:'#3FA9F5',white:'#F0F4FF',whiteDim:'rgba(240,244,255,0.7)',whiteMuted:'rgba(240,244,255,0.35)' }

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:s.black,padding:'2rem',textAlign:'center'}}>
      <div style={{width:'48px',height:'48px',border:`2px solid rgba(30,111,255,0.2)`,borderTopColor:s.blue,borderRadius:'50%',animation:'spin 1s linear infinite',marginBottom:'2rem'}}></div>
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
              value={answers
