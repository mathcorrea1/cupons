# 📐 Arquitetura do Sistema de Cupons

## 🎯 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO (Browser)                     │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │     Nuxt 3 App      │
          │   (Frontend/SSR)    │
          └──────────┬──────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   ┌────▼─────┐            ┌─────▼─────┐
   │  Pages   │            │  Server   │
   │ (Vue 3)  │            │  Routes   │
   └────┬─────┘            │  (Nitro)  │
        │                  └─────┬─────┘
        │                        │
        └────────┬───────────────┘
                 │
          ┌──────▼──────┐
          │  Supabase   │
          │   Client    │
          └──────┬──────┘
                 │
     ┌───────────┴───────────┐
     │                       │
┌────▼─────┐          ┌─────▼──────┐
│   Auth   │          │ PostgreSQL │
│ (Users)  │          │  Database  │
└──────────┘          └────────────┘
```

## 🗂️ Estrutura de Diretórios

```
cupons/
│
├── 📁 assets/                  # Recursos estáticos
│   └── css/
│       └── main.css            # Estilos Tailwind + customizações
│
├── 📁 layouts/                 # Layouts reutilizáveis
│   └── default.vue             # Layout padrão (header + footer)
│
├── 📁 middleware/              # Middlewares de rota
│   └── auth.ts                 # Proteção de rotas autenticadas
│
├── 📁 pages/                   # Páginas (auto-roteamento)
│   ├── index.vue               # Home (/)
│   ├── cadastro.vue            # Escolha de cadastro (/cadastro)
│   ├── cadastro-comercio.vue   # Form comerciante
│   ├── cadastro-morador.vue    # Form morador
│   ├── login.vue               # Login (/login)
│   └── dashboard/              # Área autenticada
│       ├── index.vue           # Redirecionador
│       ├── comerciante.vue     # Dashboard comerciante
│       └── morador.vue         # Dashboard morador
│
├── 📁 server/                  # Backend (Nitro)
│   └── api/                    # API Routes
│       ├── categorias.get.ts   # GET /api/categorias
│       └── auth/
│           ├── cadastro-comercio.post.ts
│           ├── cadastro-morador.post.ts
│           └── login.post.ts
│
├── 📁 types/                   # TypeScript definitions
│   └── index.ts                # Interfaces e tipos
│
├── 📁 utils/                   # Funções utilitárias
│   └── validators.ts           # Validações (CPF, CNPJ, etc)
│
├── 📄 app.vue                  # Root component
├── 📄 nuxt.config.ts           # Configuração Nuxt
├── 📄 tailwind.config.js       # Configuração Tailwind
├── 📄 package.json             # Dependências
├── 📄 tsconfig.json            # TypeScript config
├── 📄 .env                     # Variáveis de ambiente (não versionado)
├── 📄 .gitignore               # Arquivos ignorados pelo Git
├── 📄 supabase-schema.sql      # Schema do banco de dados
└── 📄 README.md                # Documentação
```

## 🔄 Fluxo de Dados

### Cadastro de Usuário

```
1. Usuário preenche formulário
   ↓
2. Frontend valida (CPF/CNPJ, senha)
   ↓
3. POST /api/auth/cadastro-{tipo}
   ↓
4. Server Route:
   a) Converte CPF/CNPJ → email fake
   b) Cria usuário no Supabase Auth
   c) Insere dados na tabela (COMERCIO/ASSOCIADO)
   d) Faz login automático
   ↓
5. Redireciona para dashboard
```

### Login

```
1. Usuário informa documento + senha
   ↓
2. Frontend valida formato
   ↓
3. POST /api/auth/login
   ↓
4. Server Route:
   a) Converte documento → email fake
   b) Autentica no Supabase
   c) Verifica tabela correta (COMERCIO/ASSOCIADO)
   ↓
5. Retorna sessão
   ↓
6. Redireciona para dashboard apropriado
```

### Criação de Cupom (Comerciante)

```
1. Comerciante preenche form
   ↓
2. Frontend valida datas
   ↓
3. Gera hash de 12 caracteres
   ↓
4. INSERT direto via Supabase Client
   ↓
5. RLS valida que é o dono
   ↓
6. Cupom salvo no banco
   ↓
7. Recarrega lista de cupons
```

### Reserva de Cupom (Morador)

```
1. Morador vê marketplace
   ↓
2. Cupons filtrados por data válida (RLS)
   ↓
3. Clica em "Reservar"
   ↓
4. INSERT em CUPOM_ASSOCIADO
   ↓
5. RLS valida que é o próprio CPF
   ↓
6. Reserva criada
   ↓
7. Aparece em "Meus Cupons"
```

### Validação de Uso (Comerciante)

```
1. Comerciante vê detalhes do cupom
   ↓
2. Lista reservas (RLS permite ver suas próprias)
   ↓
3. Clica em "Validar Uso"
   ↓
4. UPDATE dta_uso_cupom_associado = hoje
   ↓
5. RLS valida que o cupom é dele
   ↓
6. Status atualizado
```

## 🔐 Camadas de Segurança

```
┌─────────────────────────────────────┐
│   1. Validação no Frontend          │
│   - CPF/CNPJ válido                 │
│   - Campos obrigatórios             │
│   - Formato de datas                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   2. Autenticação (Middleware)      │
│   - useSupabaseUser()               │
│   - Redireciona se não autenticado  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   3. Server Routes Validation       │
│   - readBody validation             │
│   - Business logic checks           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   4. Supabase Auth                  │
│   - JWT token validation            │
│   - Session management              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   5. Row Level Security (RLS)       │
│   - auth.uid() = auth_user_id       │
│   - Políticas por tabela/operação   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   6. Database Constraints           │
│   - Foreign Keys                    │
│   - UNIQUE constraints              │
│   - CHECK constraints               │
│   - NOT NULL                        │
└─────────────────────────────────────┘
```

## 📊 Modelo de Dados

```
CATEGORIA (1) ──────< (N) COMERCIO
                            │
                            │ (1)
                            │
                            ▼
                      CUPOM (N)
                            │
                            │ (1)
                            │
                            ▼
               CUPOM_ASSOCIADO (N) >──── (1) ASSOCIADO
```

### Relacionamentos

- **CATEGORIA → COMERCIO**: 1:N (Uma categoria tem vários comércios)
- **COMERCIO → CUPOM**: 1:N (Um comércio cria vários cupons)
- **CUPOM → CUPOM_ASSOCIADO**: 1:N (Um cupom pode ter várias reservas)
- **ASSOCIADO → CUPOM_ASSOCIADO**: 1:N (Um morador pode ter várias reservas)

### Campos Especiais

- **auth_user_id**: Liga tabela ao Supabase Auth
- **num_cupom**: Hash único de 12 caracteres
- **dta_uso_cupom_associado**: NULL = não usado, DATA = usado

## 🎨 Stack de UI

```
Tailwind CSS
    ↓
Componentes Base (input-field, btn-primary, card)
    ↓
Layouts (default.vue)
    ↓
Pages (Vue 3 Composition API)
    ↓
Lucide Icons
```

## 🚀 Deploy Pipeline

```
Local Development
    ↓
Git Commit
    ↓
Push to GitHub
    ↓
Vercel detecta mudanças
    ↓
Build automático (npm run build)
    ↓
Deploy em Edge Network
    ↓
URL production live
```

## 📦 Build Output

```
npm run build
    ↓
.output/
  ├── server/      # Server routes (Nitro)
  ├── public/      # Static assets
  └── nitro.json   # Metadados
```

## 🔌 Integrações

```
Aplicação Nuxt
    ↕
Supabase Client SDK
    ↕
Supabase API (REST)
    ↕
PostgreSQL Database
```

## 📈 Performance

- **SSR**: Primeira renderização no servidor
- **Edge Functions**: API routes em edge
- **RLS**: Filtros no banco (não no app)
- **Indexes**: Campos frequentemente consultados
- **Lazy Loading**: Rotas carregadas sob demanda

## 🧪 Pontos de Teste

1. **Validações**: utils/validators.ts
2. **Auth**: server/api/auth/*.ts
3. **RLS**: Testar no Supabase SQL Editor
4. **UI**: Testar formulários e filtros
5. **Fluxo**: E2E test (cadastro → login → ação)

---

**Arquitetura baseada em:**
- JAMstack
- Serverless
- Edge Computing
- Row Level Security
- Zero Config Deploy
