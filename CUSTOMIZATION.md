# 🎨 Guia de Customização e Extensão

## 🎯 Personalizando o Visual

### Alterar Cores do Tema

Edite `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#fff0f0',   // Mais claro
        100: '#ffe0e0',
        200: '#ffc0c0',
        300: '#ff9999',
        400: '#ff6666',
        500: '#ff3333',  // Cor principal
        600: '#cc0000',  // Hover
        700: '#990000',
        800: '#660000',
        900: '#330000',  // Mais escuro
      }
    }
  },
}
```

### Alterar Logo e Nome

Em `layouts/default.vue`:

```vue
<NuxtLink to="/" class="flex items-center space-x-2">
  <Ticket class="w-8 h-8 text-primary-600" />
  <span class="text-2xl font-bold text-primary-600">
    Seu Nome Aqui
  </span>
</NuxtLink>
```

### Adicionar Imagens de Fundo

Em `pages/index.vue`:

```vue
<div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 
            bg-[url('/background.jpg')]">
```

## 🔧 Funcionalidades Extras

### 1. Adicionar Imagem ao Cupom

**Schema SQL:**
```sql
ALTER TABLE public.CUPOM 
ADD COLUMN img_cupom TEXT;
```

**Componente de Upload:**
```vue
<input 
  type="file" 
  accept="image/*"
  @change="uploadImagem"
/>
```

### 2. Limitar Quantidade de Cupons

**Schema SQL:**
```sql
ALTER TABLE public.CUPOM 
ADD COLUMN qtd_disponivel INTEGER DEFAULT NULL;
```

**Lógica no Backend:**
```typescript
// Verificar antes de reservar
const { count } = await client
  .from('CUPOM_ASSOCIADO')
  .select('*', { count: 'exact' })
  .eq('num_cupom', cupom.num_cupom);

if (cupom.qtd_disponivel && count >= cupom.qtd_disponivel) {
  throw createError({ message: 'Cupom esgotado' });
}
```

### 3. Sistema de Notificações

**Instalar:**
```powershell
npm install @nuxtjs/toast
```

**Configurar `nuxt.config.ts`:**
```typescript
modules: [
  '@nuxtjs/toast'
],
toast: {
  position: 'top-right',
  duration: 3000
}
```

**Usar:**
```typescript
const toast = useToast();
toast.success('Cupom reservado!');
toast.error('Erro ao reservar');
```

### 4. QR Code para Cupons

**Instalar:**
```powershell
npm install qrcode.vue
```

**Componente:**
```vue
<template>
  <QRCodeVue 
    :value="cupom.num_cupom" 
    :size="200" 
  />
</template>

<script setup>
import QRCodeVue from 'qrcode.vue';
</script>
```

### 5. Busca Geográfica

**Schema SQL:**
```sql
ALTER TABLE public.COMERCIO 
ADD COLUMN lat_comercio NUMERIC(10, 8),
ADD COLUMN lng_comercio NUMERIC(11, 8);
```

**Integrar Google Maps:**
```powershell
npm install @nuxtjs/google-maps
```

### 6. Avaliações de Comércios

**Schema SQL:**
```sql
CREATE TABLE public.AVALIACAO (
  id_avaliacao SERIAL PRIMARY KEY,
  cnpj_comercio VARCHAR(14) REFERENCES COMERCIO(cnpj_comercio),
  cpf_associado VARCHAR(11) REFERENCES ASSOCIADO(cpf_associado),
  nota INTEGER CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  dta_avaliacao DATE DEFAULT CURRENT_DATE
);
```

### 7. Email de Confirmação

**Server Route:**
```typescript
// Usar Resend ou SendGrid
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@seusistema.com',
  to: email,
  subject: 'Cupom Reservado!',
  html: `<p>Você reservou o cupom: ${cupom.tit_cupom}</p>`
});
```

### 8. Dashboard Administrativo

**Nova página: `pages/admin/index.vue`**
```vue
<template>
  <div>
    <h1>Painel Administrativo</h1>
    <!-- Estatísticas gerais -->
    <!-- Gestão de usuários -->
    <!-- Moderação de cupons -->
  </div>
</template>
```

### 9. Relatórios em PDF

**Instalar:**
```powershell
npm install jspdf jspdf-autotable
```

**Gerar relatório:**
```typescript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function gerarRelatorio() {
  const doc = new jsPDF();
  doc.text('Relatório de Cupons', 14, 15);
  
  doc.autoTable({
    head: [['Cupom', 'Desconto', 'Reservas']],
    body: cupons.value.map(c => [
      c.tit_cupom, 
      formatarPercentual(c.per_desc_cupom),
      c.reservas?.length || 0
    ])
  });
  
  doc.save('relatorio-cupons.pdf');
}
```

### 10. Chat de Suporte

**Integrar Tawk.to (gratuito):**

Em `app.vue`:
```vue
<script setup>
onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://embed.tawk.to/YOUR_ID/default';
  document.body.appendChild(script);
});
</script>
```

## 🎨 Componentes Reutilizáveis

### Criar Componente de Card de Cupom

`components/CupomCard.vue`:
```vue
<template>
  <div class="card">
    <h3>{{ cupom.tit_cupom }}</h3>
    <p>{{ formatarPercentual(cupom.per_desc_cupom) }}</p>
    <button @click="$emit('reservar')">Reservar</button>
  </div>
</template>

<script setup>
import { formatarPercentual } from '~/utils/validators';

defineProps<{
  cupom: Cupom
}>();

defineEmits<{
  reservar: []
}>();
</script>
```

**Usar:**
```vue
<CupomCard 
  v-for="cupom in cupons" 
  :cupom="cupom"
  @reservar="reservarCupom(cupom)"
/>
```

## 📱 PWA (Progressive Web App)

**Instalar:**
```powershell
npm install @vite-pwa/nuxt
```

**Configurar `nuxt.config.ts`:**
```typescript
modules: [
  '@vite-pwa/nuxt'
],
pwa: {
  manifest: {
    name: 'CuponsFácil',
    short_name: 'Cupons',
    description: 'Sistema de Cupons de Desconto',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      }
    ]
  }
}
```

## 🌐 Internacionalização (i18n)

**Instalar:**
```powershell
npm install @nuxtjs/i18n
```

**Configurar:**
```typescript
modules: [
  '@nuxtjs/i18n'
],
i18n: {
  locales: [
    { code: 'pt', file: 'pt-BR.json' },
    { code: 'en', file: 'en-US.json' }
  ],
  defaultLocale: 'pt'
}
```

## 📊 Analytics

### Google Analytics

**Instalar:**
```powershell
npm install @nuxtjs/google-analytics
```

**Configurar:**
```typescript
modules: [
  '@nuxtjs/google-analytics'
],
googleAnalytics: {
  id: 'G-XXXXXXXXXX'
}
```

## 🔔 Push Notifications

**Usando Firebase Cloud Messaging:**

1. Configurar projeto no Firebase
2. Adicionar service worker
3. Solicitar permissão do usuário
4. Enviar notificações quando cupom for validado

## 🎭 Modo Escuro

**Adicionar toggle:**
```vue
<button @click="toggleDarkMode">
  <Moon v-if="!isDark" />
  <Sun v-else />
</button>

<script setup>
const isDark = ref(false);

function toggleDarkMode() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark');
}
</script>
```

**Tailwind dark mode em `tailwind.config.js`:**
```js
module.exports = {
  darkMode: 'class',
  // ...
}
```

## 🔒 Melhorias de Segurança

### 1. Rate Limiting

**Server Route:**
```typescript
const attempts = new Map();

export default defineEventHandler((event) => {
  const ip = getRequestIP(event);
  const now = Date.now();
  
  if (attempts.has(ip)) {
    const lastAttempt = attempts.get(ip);
    if (now - lastAttempt < 60000) { // 1 minuto
      throw createError({
        statusCode: 429,
        message: 'Muitas tentativas'
      });
    }
  }
  
  attempts.set(ip, now);
});
```

### 2. CAPTCHA

**Integrar hCaptcha:**
```vue
<vue-hcaptcha 
  :sitekey="siteKey"
  @verify="onVerify"
/>
```

### 3. Logs de Auditoria

**Schema SQL:**
```sql
CREATE TABLE public.AUDIT_LOG (
  id_log SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(50),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📈 Otimizações

### 1. Cache de Dados

```typescript
// Usar useFetch com cache
const { data: categorias } = await useFetch('/api/categorias', {
  key: 'categorias',
  getCachedData: key => nuxtApp.static.data[key]
});
```

### 2. Imagens Otimizadas

**Usar Nuxt Image:**
```powershell
npm install @nuxt/image
```

```vue
<NuxtImg 
  src="/comercio.jpg" 
  width="400" 
  height="300"
  format="webp"
/>
```

### 3. Lazy Loading de Componentes

```vue
<script setup>
const ModalDetalhes = defineAsyncComponent(
  () => import('~/components/ModalDetalhes.vue')
);
</script>
```

## 🧪 Testes

### Testes Unitários com Vitest

```powershell
npm install -D vitest @vue/test-utils
```

**Exemplo de teste:**
```typescript
import { describe, it, expect } from 'vitest';
import { validarCPF } from '~/utils/validators';

describe('validarCPF', () => {
  it('deve validar CPF correto', () => {
    expect(validarCPF('12345678900')).toBe(true);
  });
  
  it('deve rejeitar CPF inválido', () => {
    expect(validarCPF('11111111111')).toBe(false);
  });
});
```

### Testes E2E com Playwright

```powershell
npm install -D @playwright/test
```

```typescript
import { test, expect } from '@playwright/test';

test('deve fazer login com sucesso', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="text"]', '12345678900');
  await page.fill('input[type="password"]', 'teste123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
});
```

## 💡 Ideias de Novos Recursos

1. **Programa de Fidelidade**: Pontos por uso de cupons
2. **Cupons em Grupo**: Descontos progressivos
3. **Social Login**: Login com Google/Facebook
4. **Marketplace Público**: Sem necessidade de login para ver
5. **App Mobile**: Versão React Native/Flutter
6. **API Pública**: Para integrações externas
7. **Gamificação**: Badges e conquistas
8. **Cashback**: Sistema de reembolso
9. **Assinatura Premium**: Para comerciantes
10. **Marketplace de Parceiros**: Rede de estabelecimentos

---

**Dica:** Sempre teste localmente antes de fazer deploy em produção!
