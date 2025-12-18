<template>
  <div class="min-h-screen flex flex-col">
    <!-- Notification Container -->
    <NotificationContainer ref="notificationContainer" />
    
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <Icon name="ticket" :size="32" class="text-primary-600" />
            <span class="text-2xl font-bold text-primary-600">CuponsFácil</span>
          </NuxtLink>
          
          <div class="flex items-center space-x-4">
            <template v-if="user">
              <NuxtLink 
                :to="dashboardLink" 
                class="text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Icon name="layout-dashboard" :size="20" />
              </NuxtLink>
              <button 
                @click="handleLogout" 
                class="btn-secondary flex items-center space-x-2"
              >
                <Icon name="log-out" :size="16" />
                <span>Sair</span>
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn-secondary">
                Entrar
              </NuxtLink>
              <NuxtLink to="/cadastro" class="btn-primary">
                Cadastrar
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-gray-800 text-white py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-sm text-gray-400">
            © 2025 CuponsFácil - Sistema de Cupons para Comunidade
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Projeto de Extensão Universitária
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotification } from '~/composables/useNotification'

const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()
const notificationContainer = ref<any>(null)
const { setHandler } = useNotification()

// Registrar o handler de notificações
onMounted(() => {
  if (notificationContainer.value) {
    setHandler(notificationContainer.value)
  }
})

// Determina o link do dashboard baseado no tipo de usuário
const dashboardLink = computed(() => {
  // Por enquanto, vamos verificar na sessão do lado do cliente
  return '/dashboard'
})

async function handleLogout() {
  await client.auth.signOut()
  router.push('/')
}
</script>
