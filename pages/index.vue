<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="flex justify-center mb-6">
          <Icon name="ticket" :size="80" class="text-primary-600" />
        </div>
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          CuponsFácil
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Conectando comerciantes e moradores através de cupons de desconto
        </p>
        
        <div class="flex justify-center gap-4">
          <BaseButton variant="primary" size="lg" @click="$router.push('/cadastro')">
            Começar Agora
          </BaseButton>
          <BaseButton variant="secondary" size="lg" @click="$router.push('/login')">
            Fazer Login
          </BaseButton>
        </div>
      </div>

      <!-- Features -->
      <div class="grid md:grid-cols-2 gap-8 mt-20">
        <BaseCard>
          <div class="flex items-start space-x-4">
            <div class="bg-blue-100 p-3 rounded-lg">
              <Icon name="store" :size="32" class="text-blue-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">Para Comerciantes</h3>
              <p class="text-gray-600 mb-4">
                Crie e gerencie cupons de desconto para atrair mais clientes para o seu negócio. 
                Acompanhe o uso e valide cupons facilmente.
              </p>
              <BaseButton variant="outline" size="sm" @click="$router.push('/cadastro-comercio')">
                Cadastrar Comércio →
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-start space-x-4">
            <div class="bg-green-100 p-3 rounded-lg">
              <Icon name="users" :size="32" class="text-green-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">Para Moradores</h3>
              <p class="text-gray-600 mb-4">
                Descubra cupons de desconto exclusivos em comércios da sua região. 
                Reserve e utilize cupons de forma simples e rápida.
              </p>
              <BaseButton variant="outline" size="sm" @click="$router.push('/cadastro-morador')">
                Cadastrar como Morador →
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- How it works -->
      <div class="mt-20">
        <h2 class="text-3xl font-bold text-center mb-12">Como Funciona</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <span class="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h4 class="font-bold mb-2">Cadastre-se</h4>
            <p class="text-gray-600 text-sm">
              Escolha seu perfil: Comerciante ou Morador
            </p>
          </div>
          <div class="text-center">
            <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <span class="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h4 class="font-bold mb-2">Crie ou Busque Cupons</h4>
            <p class="text-gray-600 text-sm">
              Comerciantes criam, moradores encontram cupons
            </p>
          </div>
          <div class="text-center">
            <div class="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <span class="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h4 class="font-bold mb-2">Utilize e Economize</h4>
            <p class="text-gray-600 text-sm">
              Reserve e utilize cupons em comércios locais
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});
</script>
