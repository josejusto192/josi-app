# Josi App — Desafio 21 Dias

App companion para a comunidade da Josi — criadora de conteúdo com 500k+ seguidores.

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript
- **Estilo:** Design System próprio (tokens CSS + inline styles)
- **Auth:** Supabase Auth (magic link por email)
- **Banco:** Supabase Postgres com Row Level Security
- **Deploy:** Vercel

## Primeiros passos

### 1. Clone e instale

```bash
git clone https://github.com/SEU_USUARIO/josi-app.git
cd josi-app
npm install
```

### 2. Configure o Supabase

Crie um projeto em [supabase.com](https://supabase.com), execute o SQL em `supabase/schema.sql` no SQL Editor e copie as credenciais:

```bash
cp .env.local.example .env.local
# Edite .env.local com suas chaves do Supabase
```

### 3. Rode localmente

```bash
npm run dev
# Acesse http://localhost:3000
```

## Estrutura

```
src/
├── app/
│   ├── auth/login/         # Tela de login (magic link)
│   ├── auth/callback/      # Callback OAuth do Supabase
│   ├── onboarding/         # Fluxo de onboarding (8 etapas)
│   └── (app)/              # Screens protegidas
│       ├── desafio/        # Home — 21 dias
│       ├── comunidade/     # Feed + ranking
│       ├── exercicios/     # Banco de exercícios
│       ├── educacao/       # Cursos + artigos
│       └── loja/           # Produtos da Josi
├── components/
│   ├── PhoneFrame.tsx      # Frame estilo iPhone
│   ├── BottomNav.tsx       # Navegação inferior
│   ├── DayDetail.tsx       # Overlay do dia
│   ├── onboarding/         # Fluxo de onboarding
│   └── screens/            # Um componente por tela
└── lib/
    ├── supabase/            # Clients browser + server
    └── types.ts             # Interfaces TypeScript
```

## Deploy no Vercel

1. Faça push para o GitHub
2. Importe o repo em [vercel.com](https://vercel.com)
3. Adicione as vars `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático a cada push na `main` ✅

## Banco de dados (Supabase)

Execute `supabase/schema.sql` no SQL Editor. Tabelas:

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Perfil + dados do onboarding |
| `challenge_progress` | Progresso diário dos 21 dias |
| `habits_log` | Registro diário de hábitos |
| `measurements` | Histórico de peso e medidas |

Todas as tabelas têm **Row Level Security** ativo.
