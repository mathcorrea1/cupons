<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <BaseCard
      v-for="cupom in cupons"
      :key="cupom.id"
      padding="none"
      hoverable
      clickable
      @click="$emit('select', cupom)"
    >
      <div class="p-4 space-y-3">
        <!-- Header com Badge -->
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-lg font-semibold text-gray-900 flex-1">
            {{ cupom.titulo }}
          </h3>
          <BaseBadge variant="success" size="lg">
            {{ cupom.percentual_desconto }}% OFF
          </BaseBadge>
        </div>

        <!-- Descrição -->
        <p v-if="cupom.descricao" class="text-sm text-gray-600 line-clamp-2">
          {{ cupom.descricao }}
        </p>

        <!-- Informações do Comerciante -->
        <div v-if="cupom.comercio" class="pt-3 border-t border-gray-100">
          <div class="flex items-center gap-2 text-sm">
            <Icon name="store" :size="16" class="text-gray-400" />
            <span class="font-medium text-gray-900">{{ cupom.comercio.nome_fantasia }}</span>
          </div>
          
          <div v-if="cupom.comercio.endereco" class="flex items-start gap-2 text-xs text-gray-500 mt-2">
            <Icon name="map-pin" :size="14" class="mt-0.5 flex-shrink-0" />
            <span>{{ cupom.comercio.endereco }}, {{ cupom.comercio.bairro }} - {{ cupom.comercio.cidade }}/{{ cupom.comercio.uf }}</span>
          </div>
          
          <div v-if="cupom.comercio.telefone" class="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Icon name="phone" :size="14" />
            <span>{{ cupom.comercio.telefone }}</span>
          </div>
        </div>

        <!-- Data de Validade -->
        <div class="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <Icon name="calendar" :size="14" />
          <span>Válido até {{ formatarData(cupom.data_fim) }}</span>
        </div>
      </div>

      <!-- Footer com ação -->
      <div class="px-4 pb-4">
        <BaseButton
          variant="primary"
          full-width
          icon="ticket"
          :loading="loading && selectedCupomId === cupom.id"
          @click.stop="$emit('reserve', cupom)"
        >
          Reservar Cupom
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Empty State -->
    <div
      v-if="cupons.length === 0 && !loading"
      class="col-span-full text-center py-12"
    >
      <Icon name="ticket" :size="48" class="mx-auto text-gray-300 mb-4" />
      <p class="text-gray-500">Nenhum cupom disponível no momento</p>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="col-span-full flex items-center justify-center py-12"
    >
      <Icon name="loader" :size="32" class="animate-spin text-blue-600" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CupomWithDetails } from '~/types'
import { formatarData } from '~/utils/validators'

interface Props {
  cupons: CupomWithDetails[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<{
  select: [cupom: CupomWithDetails]
  reserve: [cupom: CupomWithDetails]
}>()

const selectedCupomId = ref<string | null>(null)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
