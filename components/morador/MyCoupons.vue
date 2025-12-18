<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-900">Meus Cupons Reservados</h2>

    <BaseAlert v-if="reservas.length === 0" variant="info">
      <p>Você ainda não tem cupons reservados. Explore o marketplace e reserve cupons com desconto!</p>
    </BaseAlert>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseCard
        v-for="reserva in reservas"
        :key="reserva.id"
        padding="none"
      >
        <div class="p-4 space-y-3">
          <!-- Status Badge -->
          <div class="flex items-center justify-between">
            <BaseBadge
              :variant="reserva.usado ? 'default' : 'success'"
              size="sm"
            >
              {{ reserva.usado ? 'Utilizado' : 'Ativo' }}
            </BaseBadge>
            <span class="text-xs text-gray-500">
              Reservado em {{ formatarData(reserva.data_reserva) }}
            </span>
          </div>

          <!-- Cupom Info -->
          <div v-if="reserva.cupom">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ reserva.cupom.titulo }}
            </h3>
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Icon name="ticket" :size="16" />
              <span class="font-semibold text-green-600">
                {{ reserva.cupom.percentual_desconto }}% de desconto
              </span>
            </div>
            <p v-if="reserva.cupom.descricao" class="text-sm text-gray-600">
              {{ reserva.cupom.descricao }}
            </p>
          </div>

          <!-- Comercio Info -->
          <div v-if="reserva.cupom?.comercio" class="pt-3 border-t border-gray-100">
            <div class="flex items-center gap-2 text-sm mb-2">
              <Icon name="store" :size="16" class="text-gray-400" />
              <span class="font-medium">{{ reserva.cupom.comercio.nome_fantasia }}</span>
            </div>
            
            <div v-if="reserva.cupom.comercio.telefone" class="flex items-center gap-2 text-xs text-gray-500">
              <Icon name="phone" :size="14" />
              <span>{{ reserva.cupom.comercio.telefone }}</span>
            </div>
          </div>

          <!-- ID de Validação -->
          <div v-if="!reserva.usado" class="pt-3 border-t border-gray-100 bg-gray-50 -mx-4 -mb-4 mt-3 p-4 rounded-b-lg">
            <p class="text-xs text-gray-600 mb-2 font-medium">Código de Validação:</p>
            <div class="flex items-center gap-2">
              <code class="flex-1 bg-white px-3 py-2 rounded border border-gray-200 text-sm font-mono">
                {{ reserva.id }}
              </code>
              <BaseButton
                icon="ticket"
                variant="outline"
                size="sm"
                icon-only
                @click="$emit('showQRCode', reserva)"
              />
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Apresente este código no estabelecimento para validar o cupom
            </p>
          </div>

          <!-- Data de Uso -->
          <div v-else class="pt-3 border-t border-gray-100">
            <p class="text-xs text-gray-500">
              <Icon name="check-circle" :size="14" class="inline mr-1" />
              Utilizado em {{ formatarData(reserva.data_uso!) }}
            </p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-12"
    >
      <Icon name="loader" :size="32" class="animate-spin text-blue-600" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReservaWithDetails } from '~/types'
import { formatarData } from '~/utils/validators'

interface Props {
  reservas: ReservaWithDetails[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<{
  showQRCode: [reserva: ReservaWithDetails]
}>()
</script>
