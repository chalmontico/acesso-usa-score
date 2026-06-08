# Acesso USA Score

Plataforma de diagnóstico estratégico para empresários brasileiros que desejam expandir para os Estados Unidos.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (banco de dados)
- OpenAI GPT-4o (resumo personalizado)

## Setup

### 1. Clone o repositório
```bash
git clone https://github.com/chalmontico/acesso-usa-score
cd acesso-usa-score
npm install
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.local.example .env.local
# Edite o .env.local com suas chaves
```

### 3. Configure o Supabase
- Crie um projeto em supabase.com
- Execute o SQL em `supabase/schema.sql` no SQL Editor do Supabase

### 4. Rode localmente
```bash
npm run dev
```

### 5. Deploy no Vercel
- Conecte o repositório no Vercel
- Configure as variáveis de ambiente
- Deploy automático

## Páginas
- `/` — Landing page
- `/quiz` — Questionário de diagnóstico
- `/resultado` — Resultado com score e roadmap
- `/admin` — Painel de leads (protegido por senha)

## API Routes
- `POST /api/leads` — Salva lead e gera diagnóstico
- `GET /api/admin` — Lista leads (requer ADMIN_SECRET)
- `PATCH /api/admin` — Atualiza status do lead
