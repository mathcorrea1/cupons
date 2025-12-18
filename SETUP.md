# 🚀 Início Rápido - Sistema de Cupons

## ⚡ Setup em 5 Minutos

### 1️⃣ Configurar Supabase (2 min)
```
1. Acesse: https://supabase.com
2. Crie novo projeto
3. Vá em SQL Editor
4. Cole e execute todo o conteúdo de: supabase-schema.sql
5. Copie URL e Key (Project Settings > API)
```

### 2️⃣ Instalar Dependências (1 min)
```powershell
npm install
```

### 3️⃣ Configurar Variáveis (30 seg)
```powershell
# Copiar arquivo de exemplo
Copy-Item .env.example .env

# Editar .env e adicionar:
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-aqui
```

### 4️⃣ Rodar o Projeto (30 seg)
```powershell
npm run dev
```

Acesse: http://localhost:3000

---

## 🌐 Deploy na Vercel (2 min)

### Opção A: Via GitHub
```powershell
# Criar repo
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/repo.git
git push -u origin main

# Na Vercel:
1. Importar repositório
2. Adicionar variáveis de ambiente
3. Deploy!
```

### Opção B: Via CLI
```powershell
npm i -g vercel
vercel
```

---

## 🧪 Teste Rápido

### Comerciante
```
URL: /cadastro-comercio
CNPJ: 12345678000190 (válido para teste)
Senha: teste123
```

### Morador
```
URL: /cadastro-morador
CPF: 12345678900 (válido para teste)
Senha: teste123
```

---

## 📋 Checklist de Validação

- [ ] Supabase configurado e tabelas criadas
- [ ] Variáveis de ambiente configuradas
- [ ] `npm install` executado com sucesso
- [ ] Servidor rodando em localhost:3000
- [ ] Consegue acessar página inicial
- [ ] Consegue fazer cadastro de comerciante
- [ ] Consegue fazer cadastro de morador
- [ ] Consegue fazer login
- [ ] Comerciante consegue criar cupom
- [ ] Morador consegue reservar cupom
- [ ] Comerciante consegue validar uso

---

## ❗ Problemas Comuns

**Erro ao instalar:**
```powershell
npm cache clean --force
npm install
```

**Erro de autenticação:**
- Verifique se o script SQL foi executado completamente
- Confirme que as credenciais do .env estão corretas

**Página em branco:**
- Limpe o cache do navegador
- Verifique o console do navegador (F12)

---

## 📚 Documentação Completa
Ver: README.md

## 🔗 Links Úteis
- Nuxt 3: https://nuxt.com
- Supabase: https://supabase.com
- Vercel: https://vercel.com
- Tailwind CSS: https://tailwindcss.com
