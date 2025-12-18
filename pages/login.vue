<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <BaseCard class="w-full max-w-md" padding="lg">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <Icon name="ticket" :size="48" class="mx-auto text-blue-600 mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Sistema de Cupons</h1>
        <p class="text-gray-600">Entre com sua conta</p>
      </div>

      <!-- Alert de Erro -->
      <BaseAlert
        v-if="error"
        v-model="showError"
        variant="danger"
        title="Erro no login"
        closable
        class="mb-4"
      >
        {{ error }}
      </BaseAlert>

      <!-- Tipo de Login -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Conta
        </label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            :class="[
              'flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all',
              tipoLogin === 'morador'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            ]"
            @click="tipoLogin = 'morador'"
          >
            <Icon name="users" :size="20" />
            <span class="font-medium">Morador</span>
          </button>
          
          <button
            type="button"
            :class="[
              'flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all',
              tipoLogin === 'comerciante'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            ]"
            @click="tipoLogin = 'comerciante'"
          >
            <Icon name="store" :size="20" />
            <span class="font-medium">Comerciante</span>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <BaseInput
          v-model="documento"
          :label="tipoLogin === 'morador' ? 'CPF' : 'CNPJ'"
          :placeholder="tipoLogin === 'morador' ? '000.000.000-00' : '00.000.000/0000-00'"
          icon="users"
          required
          :error="errors.documento"
          :mask="tipoLogin === 'morador' ? formatarCPF : formatarCNPJ"
        />

        <BaseInput
          v-model="senha"
          type="password"
          label="Senha"
          placeholder="Digite sua senha"
          required
          :error="errors.senha"
        />

        <BaseButton
          type="submit"
          variant="primary"
          full-width
          :loading="loading"
        >
          Entrar
        </BaseButton>
      </form>

      <!-- Links -->
      <div class="mt-6 text-center text-sm">
        <p class="text-gray-600">
          Não tem uma conta?
          <NuxtLink to="/cadastro" class="text-blue-600 hover:text-blue-700 font-medium">
            Cadastre-se
          </NuxtLink>
        </p>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotification } from '~/composables/useNotification'
import { validarCPF, validarCNPJ, formatarCPF, formatarCNPJ, docToEmail, limparFormatacao } from '~/utils/validators'

const { success, error: notifyError } = useNotification()

const tipoLogin = ref<'morador' | 'comerciante'>('morador')
const documento = ref('')
const senha = ref('')
const loading = ref(false)
const error = ref('')
const showError = ref(false)
const errors = ref<Record<string, string>>({})

// Limpar documento ao mudar tipo
watch(tipoLogin, () => {
  documento.value = ''
  errors.value = {}
})

const validateForm = (): boolean => {
  errors.value = {}

  const docLimpo = limparFormatacao(documento.value)
  
  if (tipoLogin.value === 'morador') {
    if (!validarCPF(docLimpo)) {
      errors.value.documento = 'CPF inválido'
    }
  } else {
    if (!validarCNPJ(docLimpo)) {
      errors.value.documento = 'CNPJ inválido'
    }
  }

  if (!senha.value) {
    errors.value.senha = 'Senha é obrigatória'
  }

  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''
  showError.value = false

  try {
    const docLimpo = limparFormatacao(documento.value)

    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        documento: docLimpo,
        senha: senha.value,
        tipo: tipoLogin.value
      }
    })

    console.log('Response do login:', response)

    if (response.success) {
      success('Login realizado com sucesso!')
      
      // Redirecionar para dashboard
      const dashboardUrl = tipoLogin.value === 'morador' 
        ? '/dashboard/morador' 
        : '/dashboard/comerciante'
      
      console.log('Redirecionando para:', dashboardUrl)
      await navigateTo(dashboardUrl)
    } else if (response.error) {
      notifyError(response.error)
      error.value = response.error
      showError.value = true
    }
  } catch (e: any) {
    const errorMsg = e.message || 'Erro ao fazer login. Tente novamente.'
    notifyError(errorMsg)
    error.value = errorMsg
    showError.value = true
  } finally {
    loading.value = false
  }
}
</script>
