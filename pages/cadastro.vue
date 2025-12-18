<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
    <div class="max-w-md mx-auto px-4">
      <BaseCard>
        <div class="text-center mb-8">
          <Icon name="ticket" :size="48" class="text-blue-600 mx-auto mb-4" />
          <h1 class="text-3xl font-bold mb-2">Cadastro</h1>
          <p class="text-gray-600">Escolha seu tipo de cadastro</p>
        </div>

        <div class="space-y-4">
          <NuxtLink 
            to="/cadastro-comercio" 
            class="block p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <div class="flex items-start space-x-4">
              <div class="bg-blue-100 p-3 rounded-lg">
                <Icon name="store" :size="32" class="text-blue-600" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-2">Sou Comerciante</h3>
                <p class="text-gray-600 text-sm">
                  Cadastre seu comércio e comece a oferecer cupons de desconto para atrair mais clientes
                </p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink 
            to="/cadastro-morador" 
            class="block p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer"
          >
            <div class="flex items-start space-x-4">
              <div class="bg-green-100 p-3 rounded-lg">
                <Icon name="users" :size="32" class="text-green-600" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-2">Sou Morador</h3>
                <p class="text-gray-600 text-sm">
                  Cadastre-se para encontrar e utilizar cupons de desconto em comércios da sua região
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-8 text-center">
          <p class="text-gray-600">
            Já tem uma conta?
            <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
              Fazer login
            </NuxtLink>
          </p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});
</script>
