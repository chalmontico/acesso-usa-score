'use client'
import { useState } from 'react'

const SUPABASE_URL = 'https://gedqamkcflteuhlvrabo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZHFhbWtjZmx0ZXVobHZyYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NzU3NjAsImV4cCI6MjA5NjQ1MTc2MH0.AKt8e8JPUgZPanBwOog2aJDLBcD3zNHKp7c9TTB2878'

const STATUS_OPTIONS = ['novo','contato_feito','reuniao_agendada','proposta_enviada','fechado','perdido']
const STATUS_LABELS: Record<string,string> = {
  novo:'Novo', contato_feito:'Contato feito', reuniao_agendada:'Reunião agendada',
  proposta_enviada:'Proposta enviada', fechado:'Fechado', perdido:'Perdido'
}
const STATUS_COLORS: Record<string,string> = {
  novo:'#3B82F6', contato_feito:'#F59E0B', reuniao_agendada:'#8B5CF6',
  proposta_enviada:'#F97316', fechado:'#22C55E', perdido:'#6B7280'
}

// Igual ao resultado.tsx
function getScoreColor(score: number): string {
  if (score >= 75) return '#22C55E'   // verde — Pronto para Expandir
  if (score >= 50) return '#3B82F6'   // azul — Em Desenvolvimento
  if (score >= 25) return '#F59E0B'   // amarelo — Iniciando Jornada
  return '#EF4444'                    // vermelho — Precisa Estruturar
}

function getNivelColor(nivel: string): string {
  if (nivel === 'Pronto para Expandir') return '#22C55E'
  if (nivel === 'Em Desenvolvimento') return '#3B82F6'
  if (nivel === 'Iniciando Jornada') return '#F59E0B'
  return '#EF4444'
}

export default function Admin() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<any>(null)

  async function login() {
    if (secret !== 'acesso2025') { setError('Senha incorreta.'); return }
    setLoading(true)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?order=created_at.desc`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      })
      const data = await res.json()
      setLeads(Array.isArray(data) ? data : [])
      setAuthed(true)
    } catch { setError('Erro de conexão.') }
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ status })
    })
    setLeads(l => l.map(lead => lead.id === id ? { ...lead, status } : lead))
  }

  function getField(lead: any, field: string) {
    return lead[field] || lead.respostas?.[field] || '—'
  }

  const s = {
    black:'#060810', surface:'#111420', blue:'#1E6FFF',
    blueLight:'#3FA9F5', white:'#F0F4FF',
    whiteDim:'rgba(240,244,255,0.7)', whiteMuted:'rgba(240,244,255,0.35)'
  }

  if (!authed) return (
    <div style={{minHeight:'100vh',background:s.black,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',padding:'2.5rem 2rem',width:'100%',maxWidth:'380px'}}>
        <div style={{marginBottom:'2rem',textAlign:'center'}}>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.2rem',fontWeight:300,color:s.white}}>Acesso</span>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.2rem',fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginLeft:'0.3rem'}}>USA</span>
          <p style={{fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:s.whiteMuted,marginTop:'0.5rem'}}>Admin</p>
        </div>
        <input
          type="password" placeholder="Senha de acesso"
          value={secret} onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key==='Enter' && login()}
          style={{width:'100%',background:'rgba(6,8,16,0.7)',border:'1px solid rgba(30,111,255,0.15)',borderRadius:'2px',padding:'0.85rem 1rem',color:s.white,fontFamily:'DM Sans,sans-serif',fontSize:'0.9rem',outline:'none',marginBottom:'1rem'}}
        />
        {error && <p style={{fontSize:'0.75rem',color:'#FCA5A5',marginBottom:'1rem'}}>{error}</p>}
        <button onClick={login} disabled={loading} style={{width:'100%',background:'linear-gradient(135deg,#0A3D91,#1E6FFF)',border:'none',borderRadius:'2px',padding:'0.85rem',color:'white',fontFamily:'DM Sans,sans-serif',fontSize:'0.8rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  )

  const total = leads.length
  const novos = leads.filter(l => !l.status || l.status === 'novo').length
  const fechados = leads.filter(l => l.status === 'fechado').length
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((acc, l) => acc + (l.score || 0), 0) / leads.length) : 0

  // Cores dos cards de resumo
  const statsCards = [
    { value: total,    label: 'Total de leads', color: '#3FA9F5' },
    { value: novos,    label: 'Novos',           color: '#3B82F6' },
    { value: fechados, label: 'Fechados',         color: '#22C55E' },
    { value: avgScore, label: 'Score médio',      color: getScoreColor(avgScore) },
  ]

  return (
    <div style={{minHeight:'100vh',background:s.black,padding:'2rem 1.5rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.3rem'}}>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:300,color:s.white}}>Acesso</span>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>USA</span>
          <span style={{fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:s.whiteMuted,marginLeft:'0.8rem'}}>Admin</span>
        </div>
        <button onClick={() => setAuthed(false)} style={{background:'none',border:'1px solid rgba(30,111,255,0.2)',borderRadius:'2px',padding:'0.5rem 1rem',color:s.whiteMuted,fontSize:'0.72rem',cursor:'pointer'}}>Sair</button>
      </div>

      {/* Cards de resumo com cores */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
        {statsCards.map(({ value, label, color }) => (
          <div key={label} style={{background:s.surface,border:`1px solid ${color}25`,borderRadius:'4px',padding:'1.5rem',position:'relative',overflow:'hidden'}}>
            {/* Barra colorida no topo */}
            <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:color,borderRadius:'4px 4px 0 0'}}></div>
            <div style={{fontFamily:'Inter,sans-serif',fontSize:'2.2rem',fontWeight:200,color:color,lineHeight:1,marginBottom:'0.4rem'}}>
              {value}
            </div>
            <div style={{fontSize:'0.62rem',letterSpacing:'0.15em',textTransform:'uppercase',color:s.whiteMuted}}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabela de leads */}
      <div style={{background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',overflow:'hidden'}}>
        <div style={{padding:'1.2rem 1.5rem',borderBottom:'1px solid rgba(30,111,255,0.08)'}}>
          <p style={{fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:s.whiteMuted}}>{leads.length} leads cadastrados</p>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(30,111,255,0.08)'}}>
                {['Nome','Empresa','Email','WhatsApp','Score','Nível','Status','Data'].map(h => (
                  <th key={h} style={{padding:'0.8rem 1.2rem',textAlign:'left',fontSize:'0.6rem',letterSpacing:'0.15em',textTransform:'uppercase',color:s.whiteMuted,fontWeight:400}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const score = lead.score || 0
                const scoreColor = getScoreColor(score)
                const nivel = lead.nivel || '—'
                const nivelColor = getNivelColor(nivel)
                return (
                  <tr key={lead.id}
                    style={{borderBottom:'1px solid rgba(30,111,255,0.05)',cursor:'pointer'}}
                    onClick={() => setSelected(selected?.id===lead.id?null:lead)}>
                    <td style={{padding:'1rem 1.2rem',fontSize:'0.82rem',color:s.white}}>{lead.name || getField(lead,'nome')}</td>
                    <td style={{padding:'1rem 1.2rem',fontSize:'0.82rem',color:s.whiteDim}}>{getField(lead,'empresa')}</td>
                    <td style={{padding:'1rem 1.2rem',fontSize:'0.78rem',color:s.whiteDim}}>{lead.email}</td>
                    <td style={{padding:'1rem 1.2rem',fontSize:'0.78rem',color:s.whiteMuted}}>{lead.whatsapp || '—'}</td>

                    {/* Score colorido com círculo */}
                    <td style={{padding:'1rem 1.2rem'}}>
                      <span style={{
                        display:'inline-flex',alignItems:'center',justifyContent:'center',
                        width:'36px',height:'36px',borderRadius:'50%',
                        border:`2px solid ${scoreColor}`,
                        color:scoreColor,fontSize:'0.78rem',fontWeight:600,fontFamily:'Inter,sans-serif'
                      }}>
                        {score || '—'}
                      </span>
                    </td>

                    {/* Nível com badge colorido */}
                    <td style={{padding:'1rem 1.2rem'}}>
                      {nivel !== '—' ? (
                        <span style={{
                          display:'inline-block',
                          padding:'0.25rem 0.6rem',
                          borderRadius:'100px',
                          background:`${nivelColor}18`,
                          border:`1px solid ${nivelColor}50`,
                          color:nivelColor,
                          fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.05em',
                          whiteSpace:'nowrap'
                        }}>
                          {nivel}
                        </span>
                      ) : <span style={{color:s.whiteMuted}}>—</span>}
                    </td>

                    <td style={{padding:'1rem 1.2rem'}} onClick={e => e.stopPropagation()}>
                      <select value={lead.status||'novo'} onChange={e => updateStatus(lead.id, e.target.value)}
                        style={{background:'rgba(6,8,16,0.8)',border:`1px solid ${STATUS_COLORS[lead.status||'novo']}40`,borderRadius:'2px',padding:'0.3rem 0.6rem',color:STATUS_COLORS[lead.status||'novo'],fontSize:'0.72rem',cursor:'pointer',outline:'none'}}>
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{STATUS_LABELS[opt]}</option>)}
                      </select>
                    </td>
                    <td style={{padding:'1rem 1.2rem',fontSize:'0.72rem',color:s.whiteMuted}}>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {leads.length === 0 && (
            <div style={{padding:'4rem',textAlign:'center',color:s.whiteMuted,fontSize:'0.85rem'}}>Nenhum lead ainda.</div>
          )}
        </div>
      </div>
    </div>
  )
}
