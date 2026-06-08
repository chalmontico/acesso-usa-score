'use client'
import { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['novo','contato_feito','reuniao_agendada','proposta_enviada','fechado','perdido']
const STATUS_LABELS: Record<string,string> = {
  novo:'Novo', contato_feito:'Contato feito', reuniao_agendada:'Reunião agendada',
  proposta_enviada:'Proposta enviada', fechado:'Fechado', perdido:'Perdido'
}
const STATUS_COLORS: Record<string,string> = {
  novo:'#3B82F6', contato_feito:'#F59E0B', reuniao_agendada:'#8B5CF6',
  proposta_enviada:'#F97316', fechado:'#22C55E', perdido:'#6B7280'
}

export default function Admin() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<any>(null)

  async function login() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin', { headers: { 'x-admin-secret': secret } })
      if (!res.ok) { setError('Senha incorreta.'); setLoading(false); return }
      const data = await res.json()
      setLeads(data.data || [])
      setAuthed(true)
    } catch { setError('Erro de conexão.') }
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ id, status })
    })
    setLeads(l => l.map(lead => lead.id === id ? { ...lead, status } : lead))
  }

  const s = { black:'#060810', surface:'#111420', blue:'#1E6FFF', blueLight:'#3FA9F5', white:'#F0F4FF', whiteDim:'rgba(240,244,255,0.7)', whiteMuted:'rgba(240,244,255,0.35)' }

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
        <button className="btn-primary" style={{width:'100%',textAlign:'center'}} onClick={login} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  )

  const total = leads.length
  const novos = leads.filter(l => l.status === 'novo').length
  const fechados = leads.filter(l => l.status === 'fechado').length
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((acc, l) => acc + (l.diagnosticos?.[0]?.score_total || 0), 0) / leads.length) : 0

  return (
    <div style={{minHeight:'100vh',background:s.black,padding:'2rem 1.5rem'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.3rem'}}>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:300,color:s.white}}>Acesso</span>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>USA</span>
          <span style={{fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:s.whiteMuted,marginLeft:'0.8rem'}}>Admin</span>
        </div>
        <button className="btn-ghost" style={{fontSize:'0.62rem',padding:'0.6rem 1.2rem'}} onClick={() => setAuthed(false)}>Sair</button>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
        {[[total,'Total de leads'],[novos,'Novos'],[fechados,'Fechados'],[avgScore,'Score médio']].map(([v,l]) => (
          <div key={l as string} style={{background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',padding:'1.5rem'}}>
            <div style={{fontFamily:'Inter,sans-serif',fontSize:'2rem',fontWeight:200,letterSpacing:'-0.04em',background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{v}</div>
            <div style={{fontSize:'0.65rem',letterSpacing:'0.15em',textTransform:'uppercase',color:s.whiteMuted,marginTop:'0.3rem'}}>{l as string}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',overflow:'hidden'}}>
        <div style={{padding:'1.2rem 1.5rem',borderBottom:'1px solid rgba(30,111,255,0.08)'}}>
          <p style={{fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:s.whiteMuted}}>{leads.length} leads cadastrados</p>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(30,111,255,0.08)'}}>
                {['Nome','Empresa','Segmento','Score','Nível','Status','Data'].map(h => (
                  <th key={h} style={{padding:'0.8rem 1.2rem',textAlign:'left',fontSize:'0.6rem',letterSpacing:'0.15em',textTransform:'uppercase',color:s.whiteMuted,fontWeight:400}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const diag = lead.diagnosticos?.[0]
                return (
                  <tr key={lead.id} style={{borderBottom:'1px solid rgba(30,111,255,0.05)',cursor:'pointer',transition:'background 0.2s'}}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(30,111,255,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='transparent'}
                    onClick={() => setSelected(selected?.id===lead.id?null:lead)}>
                    <td style={{padding:'1rem 1.2rem',fontSize:'0.82rem',color:s.white,fontWeight:400}}>{lead.nome}</td>
                    <td style={{padding:'1rem 1.2rem',fontSize:'0.82rem',color:s.whiteDim}}>{lead.empresa}</td>
                    <td style={{padding:'1rem 1.2rem',fontSize:'0.78rem',color:s.whiteMuted}}>{lead.segmento}</td>
                    <td style={{padding:'1rem 1.2rem'}}>
                      {diag ? <span style={{fontFamily:'Inter,sans-serif',fontSize:'1rem',fontWeight:300,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{diag.score_total}</span> : <span style={{color:s.whiteMuted}}>—</span>}
                    </td>
                    <td style={{padding:'1rem 1.2rem',fontSize:'0.75rem',color:s.whiteDim}}>{diag?.nivel_label || '—'}</td>
                    <td style={{padding:'1rem 1.2rem'}} onClick={e => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={e => updateStatus(lead.id, e.target.value)}
                        style={{background:'rgba(6,8,16,0.8)',border:`1px solid ${STATUS_COLORS[lead.status]}40`,borderRadius:'2px',padding:'0.3rem 0.6rem',color:STATUS_COLORS[lead.status],fontSize:'0.72rem',cursor:'pointer',outline:'none'}}
                      >
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
            <div style={{padding:'4rem',textAlign:'center',color:s.whiteMuted,fontSize:'0.85rem'}}>Nenhum lead ainda. O primeiro diagnóstico aparece aqui automaticamente.</div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div style={{marginTop:'1.5rem',background:s.surface,border:'1px solid rgba(30,111,255,0.15)',borderRadius:'4px',padding:'2rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'}}>
            <div>
              <h3 style={{fontFamily:'Inter,sans-serif',fontSize:'1.2rem',fontWeight:200,letterSpacing:'-0.02em'}}>{selected.nome}</h3>
              <p style={{fontSize:'0.75rem',color:s.whiteMuted,marginTop:'0.2rem'}}>{selected.email} · {selected.whatsapp}</p>
            </div>
            <button onClick={() => setSelected(null)} style={{background:'none',border:'none',color:s.whiteMuted,fontSize:'1.2rem',cursor:'pointer'}}>✕</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',fontSize:'0.8rem'}}>
            {[['Empresa',selected.empresa],['Segmento',selected.segmento],['Cidade',selected.cidade||'—'],['WhatsApp',selected.whatsapp],['E-mail',selected.email],['Status',STATUS_LABELS[selected.status]]].map(([k,v]) => (
              <div key={k as string}>
                <span style={{fontSize:'0.6rem',letterSpacing:'0.15em',textTransform:'uppercase',color:s.whiteMuted,display:'block',marginBottom:'0.2rem'}}>{k as string}</span>
                <span style={{color:s.white}}>{v as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
