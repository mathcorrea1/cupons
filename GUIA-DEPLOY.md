# 🚀 Guia Completo - Deploy e Teste

## ⚠️ PROBLEMA ATUAL: Node.js 16 (Precisa 18+)

Você está usando **Node.js 16.20.0**, mas o projeto precisa de **Node.js 18+**.

### Solução: Atualizar Node.js

**Opção 1: Download Direto**
1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS (20.x)** ou **18.x**
3. Instale (vai substituir a versão 16)
4. Reinicie o VS Code
5. Teste: `node --version` (deve mostrar 18+ ou 20+)

**Opção 2: Usando NVM (Node Version Manager)**
```powershell
# Instalar NVM-Windows
# https://github.com/coreybutler/nvm-windows/releases

# Após instalar NVM:
nvm install 20
nvm use 20
node --version
```

---

## 🧪 Como Testar Localmente

### 1. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anonima-aqui
```

**Onde encontrar essas credenciais:**
1. Acesse: https://supabase.com/dashboard
2. Entre no seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **URL**: Project URL
   - **Key**: anon public (chave pública)

### 2. Criar o Banco de Dados

No Supabase:
1. Vá em **SQL Editor**
2. Abra o arquivo `supabase-schema.sql` deste projeto
3. Copie todo o conteúdo
4. Cole no SQL Editor do Supabase
5. Clique em **Run**

### 3. Rodar o Projeto

```powershell
cd "c:\Users\multimidia\Desktop\cupons"

# Instalar dependências (se ainda não fez)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🌐 Deploy na Vercel

### Método 1: Via GitHub (Recomendado)

1. **Acesse:** https://vercel.com
2. **Login** com sua conta GitHub
3. **Import Project:**
   - Clique em "Add New..."
   - Selecione "Project"
   - Escolha o repositório: `mathcorrea1/cupons`
4. **Configure as variáveis:**
   - `SUPABASE_URL`: Cole a URL do Supabase
   - `SUPABASE_KEY`: Cole a chave anon do Supabase
5. **Deploy!**

### Método 2: Via CLI Vercel

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd "c:\Users\multimidia\Desktop\cupons"
vercel --prod
```

Durante o deploy, a Vercel vai perguntar:
- **Set up environment variables?** → YES
- Adicione:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`

---

## 📱 Testando o Sistema

### Como Comerciante:
1. Acesse `/cadastro-comercio`
2. Preencha:
   - CNPJ: 12345678901234
   - Nome Fantasia: Loja Teste
   - Email: comercio@teste.com
   - Senha: teste123
3. Após login, você pode:
   - ✅ Criar cupons
   - ✅ Ver estatísticas
   - ✅ Listar reservas

### Como Morador:
1. Acesse `/cadastro-morador`
2. Preencha:
   - CPF: 12345678901
   - Nome: João Teste
   - Email: morador@teste.com
   - Senha: teste123
3. Após login, você pode:
   - ✅ Buscar cupons
   - ✅ Reservar cupons
   - ✅ Ver meus cupons

---

## 🔧 Arquitetura do Projeto

### ❌ NÃO precisa de XAMPP!
O projeto usa **Supabase** como backend:
- **Banco de Dados:** PostgreSQL (na nuvem)
- **Autenticação:** Supabase Auth
- **API:** Server routes do Nuxt 3

### Stack Tecnológica:
- **Frontend:** Nuxt 3 + Vue 3 + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Deploy:** Vercel (serverless)

---

## 🔑 Estrutura de Pastas

```
cupons/
├── components/          # Componentes Vue
│   ├── ui/             # Componentes base (BaseButton, BaseInput...)
│   ├── comerciante/    # Componentes do dashboard do comerciante
│   └── morador/        # Componentes do dashboard do morador
├── composables/        # Lógica de negócio reutilizável
│   ├── useAuth.ts      # Autenticação
│   ├── useCupons.ts    # CRUD de cupons
│   ├── useReservas.ts  # Reservas de cupons
│   └── useCategorias.ts # Categorias
├── pages/              # Páginas (roteamento automático)
├── server/api/         # API endpoints (backend)
├── types/              # Tipos TypeScript
└── supabase-schema.sql # Schema do banco
```

---

## 🐛 Troubleshooting

### Erro: "Cannot read properties of undefined"
**Causa:** Node.js 16 (incompatível)
**Solução:** Atualizar para Node.js 18+

### Erro: "Invalid API key"
**Causa:** Variáveis de ambiente não configuradas
**Solução:** 
1. Criar arquivo `.env` local
2. Adicionar variáveis na Vercel

### Erro: "Failed to fetch"
**Causa:** Supabase não configurado
**Solução:** Executar `supabase-schema.sql` no SQL Editor

### Erro de CORS
**Causa:** URL do Supabase incorreta
**Solução:** Verificar se a `SUPABASE_URL` está correta no `.env`

---

## 📊 Mapeamento SQL ↔ TypeScript

O projeto faz mapeamento automático entre os nomes das colunas em português (SQL) e inglês (TypeScript):

| SQL (Banco)              | TypeScript (Código)  |
|--------------------------|----------------------|
| `cnpj_comercio`          | `cnpj`               |
| `nom_fantasia_comercio`  | `nome_fantasia`      |
| `raz_social_comercio`    | `razao_social`       |
| `num_cupom`              | `id`                 |
| `tit_cupom`              | `titulo`             |
| `per_desc_cupom`         | `percentual_desconto`|
| `dta_inicio_cupom`       | `data_inicio`        |
| `cpf_associado`          | `cpf`                |
| `nom_associado`          | `nome`               |

---

## ✅ Checklist Final

- [x] Código enviado para GitHub: https://github.com/mathcorrea1/cupons
- [x] Todos os erros TypeScript resolvidos
- [x] Schema SQL pronto
- [ ] **Node.js 18+ instalado** ⚠️
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] Supabase configurado (schema executado)
- [ ] Teste local funcionando (`npm run dev`)
- [ ] Deploy na Vercel realizado

---

## 📞 Próximos Passos

1. **Atualizar Node.js** para 18+ ou 20+
2. **Configurar Supabase:**
   - Criar projeto em supabase.com
   - Executar `supabase-schema.sql`
   - Copiar credenciais
3. **Criar `.env`** local com as credenciais
4. **Testar:** `npm run dev`
5. **Deploy:** Conectar repositório GitHub na Vercel

---

**Repositório:** https://github.com/mathcorrea1/cupons.git
**Desenvolvido com:** Nuxt 3 + Supabase + TypeScript
