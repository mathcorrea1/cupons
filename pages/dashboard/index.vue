<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card text-center py-12">
        <Icon name="loader" :size="64" class="text-primary-600 mx-auto mb-4 animate-spin" />
        <p class="text-gray-600 text-lg">Carregando...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

onMounted(async () => {
  if (!user.value) {
    router.push('/login');
    return;
  }

  // Verificar se é comerciante ou morador
  const { data: comercio } = await client
    .from('comercio')
    .select('cnpj_comercio')
    .eq('auth_user_id', user.value.id)
    .single();

  if (comercio) {
    router.push('/dashboard/comerciante');
  } else {
    const { data: morador } = await client
      .from('associado')
      .select('cpf_associado')
      .eq('auth_user_id', user.value.id)
      .single();

    if (morador) {
      router.push('/dashboard/morador');
    } else {
      router.push('/');
    }
  }
});
</script>
