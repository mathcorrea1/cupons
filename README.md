# Sistema de Cupons de Desconto - CuponsFácil

Sistema web para conectar comerciantes e moradores através de cupons de desconto. Projeto de Extensão Universitária desenvolvido com Nuxt 3 e Supabase.

## 📋 Funcionalidades

### Para Comerciantes (RF001-RF004)
- ✅ **RF001**: Cadastro de comerciantes com validação de CNPJ
- ✅ **RF002**: Login seguro com autenticação Supabase
- ✅ **RF003**: Criação e gerenciamento de cupons com hash único de 12 caracteres
- ✅ **RF004**: Validação de uso de cupons pelos moradores
- Dashboard com estatísticas de cupons ativos, reservas e utilizações
- CRUD completo de cupons (criar, editar, visualizar, excluir)

### Para Moradores (RF005-RF007)
- ✅ **RF001**: Cadastro de moradores com validação de CPF
- ✅ **RF002**: Login seguro com autenticação Supabase
- ✅ **RF005**: Marketplace de cupons com filtros por categoria e ordenação
- ✅ **RF006**: Reserva de cupons disponíveis
- ✅ **RF007**: Visualização de cupons reservados e utilizados
- Informações completas do comércio (endereço, telefone)

## 🛠️ Tecnologias

- **Frontend/Backend**: Nuxt 3 (Vue 3 Composition API + Nitro Server Routes)
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide Vue Next
- **Banco de Dados**: PostgreSQL (Supabase)
- **Autenticação**: Supabase Auth
- **Deploy**: Vercel (Zero Config)

## 📊 Estrutura do Banco de Dados

O banco de dados segue o Diagrama de Entidade-Relacionamento fornecido:

- **CATEGORIA**: Categorias de comércios
- **COMERCIO**: Dados dos estabelecimentos comerciais
- **ASSOCIADO**: Dados dos moradores
- **CUPOM**: Cupons de desconto criados pelos comerciantes
- **CUPOM_ASSOCIADO**: Reservas e utilização de cupons

Ver script completo em: `supabase-schema.sql`

## 🚀 Configuração Local

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git

### Passo 1: Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Aguarde a criação do banco de dados (2-3 minutos)
4. Vá em **SQL Editor** e execute o script `supabase-schema.sql` completo
5. Verifique se todas as tabelas foram criadas em **Table Editor**
6. Copie as credenciais:
   - Vá em **Project Settings** > **API**
   - Copie a **Project URL** 
   - Copie a **anon/public key**

### Passo 2: Instalar o Projeto

```powershell
# Clone ou navegue até a pasta do projeto
cd C:\Users\multimidia\Desktop\cupons

# Instalar dependências
npm install

# Criar arquivo de variáveis de ambiente
Copy-Item .env.example .env
```

### Passo 3: Configurar Variáveis de Ambiente

Edite o arquivo `.env` e adicione suas credenciais do Supabase:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-publica
```

### Passo 4: Executar em Desenvolvimento

```powershell
# Iniciar servidor de desenvolvimento
npm run dev
```

O sistema estará disponível em: http://localhost:3000

## 📦 Deploy na Vercel

### Método 1: Via GitHub (Recomendado)

1. **Criar repositório no GitHub**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - Sistema de Cupons"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/sistema-cupons.git
   git push -u origin main
   ```

2. **Fazer Deploy na Vercel**:
   - Acesse [vercel.com](https://vercel.com) e faça login
   - Clique em "Add New" > "Project"
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente:
     - `SUPABASE_URL`: sua URL do Supabase
     - `SUPABASE_KEY`: sua chave pública do Supabase
   - Clique em "Deploy"

3. Pronto! Seu site estará no ar em poucos segundos.

### Método 2: Via Vercel CLI

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Para deploy em produção
vercel --prod
```

Durante o processo, informe as variáveis de ambiente quando solicitado.

## 🧪 Testando o Sistema

### Cadastrar Comerciante
1. Acesse `/cadastro-comercio`
2. Use um CNPJ válido (ex: `12345678000190`)
3. Preencha todos os dados
4. Crie uma senha com no mínimo 6 caracteres

### Cadastrar Morador
1. Acesse `/cadastro-morador`
2. Use um CPF válido (ex: `12345678900`)
3. Preencha todos os dados
4. Crie uma senha com no mínimo 6 caracteres

### Fluxo Completo
1. **Como Comerciante**:
   - Faça login
   - Acesse o Dashboard
   - Crie um cupom (ex: 15% de desconto válido por 30 dias)
   - Observe o código hash gerado automaticamente

2. **Como Morador**:
   - Faça login
   - Acesse o Marketplace
   - Filtre cupons por categoria
   - Reserve um cupom
   - Veja na aba "Meus Cupons"
   - Apresente o código no comércio

3. **Validar Uso (Comerciante)**:
   - No dashboard, clique em "Ver Detalhes" do cupom
   - Veja as reservas
   - Clique em "Validar Uso" quando o cliente apresentar o cupom

## 🔒 Segurança

- Todas as senhas são gerenciadas pelo Supabase Auth (bcrypt)
- Row Level Security (RLS) configurado para proteger dados
- Validação de CPF/CNPJ no frontend e backend
- Autenticação obrigatória para áreas restritas

## 📁 Estrutura do Projeto

```
cupons/
├── assets/
│   └── css/
│       └── main.css          # Estilos globais Tailwind
├── layouts/
│   └── default.vue           # Layout principal com header/footer
├── middleware/
│   └── auth.ts               # Middleware de autenticação
├── pages/
│   ├── index.vue             # Página inicial
│   ├── cadastro.vue          # Escolha de tipo de cadastro
│   ├── cadastro-comercio.vue # Formulário comerciante
│   ├── cadastro-morador.vue  # Formulário morador
│   ├── login.vue             # Página de login
│   └── dashboard/
│       ├── index.vue         # Redirecionador
│       ├── comerciante.vue   # Dashboard comerciante
│       └── morador.vue       # Dashboard morador
├── server/
│   └── api/
│       ├── categorias.get.ts # Lista categorias
│       └── auth/
│           ├── cadastro-comercio.post.ts
│           ├── cadastro-morador.post.ts
│           └── login.post.ts
├── types/
│   └── index.ts              # Definições TypeScript
├── utils/
│   └── validators.ts         # Funções de validação
├── .env                      # Variáveis de ambiente (não commitar)
├── .env.example              # Exemplo de .env
├── nuxt.config.ts            # Configuração Nuxt
├── package.json              # Dependências
├── supabase-schema.sql       # Script SQL do banco
└── tailwind.config.js        # Configuração Tailwind
```

## 🐛 Resolução de Problemas

### Erro de autenticação
- Verifique se as credenciais do Supabase estão corretas no `.env`
- Confirme que o script SQL foi executado completamente
- Verifique se as políticas RLS estão ativas

### Erro ao criar usuário
- Certifique-se de usar CPF/CNPJ válidos
- A senha deve ter no mínimo 6 caracteres
- Cada CPF/CNPJ só pode ser cadastrado uma vez

### Cupons não aparecem
- Verifique se o cupom está dentro do período de validade
- Confirme que a data de início não é futura
- Verifique as políticas RLS no Supabase

### Erro de CORS no deploy
- As configurações do Nuxt já incluem o necessário para Vercel
- Verifique se as variáveis de ambiente estão configuradas na Vercel

## 📝 Notas Importantes

- **Adaptação de Autenticação**: O Supabase exige email/senha, mas o sistema usa CPF/CNPJ. A solução implementada adiciona "@app.com" ao documento para criar um email fake internamente.

- **Validação de Datas**: O sistema valida automaticamente se cupons estão dentro do período de validade antes de permitir reservas.

- **Campo auth_user_id**: Adicionado às tabelas COMERCIO e ASSOCIADO para vincular com o sistema de autenticação do Supabase.

## 👥 Requisitos Funcionais Implementados

- ✅ **RF001**: Cadastro de Associados e Comerciantes
- ✅ **RF002**: Gerenciamento de Perfis (Login/Logout)
- ✅ **RF003**: Cadastro de Cupons de Desconto
- ✅ **RF004**: Registrar Uso de Cupom
- ✅ **RF005**: Consultar Cupons de Desconto (Filtros e Ordenação)
- ✅ **RF006**: Consultar Histórico de Cupons Não Usados
- ✅ **RF007**: Consultar Histórico de Cupons Utilizados

## 🎓 Projeto de Extensão Universitária

Este sistema foi desenvolvido como parte de um projeto de extensão universitária com o objetivo de conectar comerciantes locais e moradores através de cupons de desconto, promovendo o comércio local e beneficiando a comunidade.

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique a seção de Resolução de Problemas acima
2. Consulte a documentação do [Nuxt 3](https://nuxt.com)
3. Consulte a documentação do [Supabase](https://supabase.com/docs)

---

**Desenvolvido com Nuxt 3, Supabase e Tailwind CSS** 🚀
