-- Tabela de leads
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nome TEXT NOT NULL,
  empresa TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  cidade TEXT,
  estado TEXT,
  segmento TEXT,
  site TEXT,
  instagram TEXT,
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo','contato_feito','reuniao_agendada','proposta_enviada','fechado','perdido'))
);

-- Tabela de diagnósticos
CREATE TABLE diagnosticos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  respostas JSONB NOT NULL,
  score_total INTEGER NOT NULL,
  score_marca INTEGER,
  score_estrutura INTEGER,
  score_financeiro INTEGER,
  score_produto INTEGER,
  score_comercial INTEGER,
  score_timing INTEGER,
  nivel INTEGER,
  nivel_label TEXT,
  resumo_ia TEXT,
  riscos_ia JSONB,
  passos_ia JSONB
);

-- Indexes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_diagnosticos_lead ON diagnosticos(lead_id);

-- RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;

-- Policy: service role tem acesso total
CREATE POLICY "service_role_leads" ON leads FOR ALL USING (true);
CREATE POLICY "service_role_diagnosticos" ON diagnosticos FOR ALL USING (true);
