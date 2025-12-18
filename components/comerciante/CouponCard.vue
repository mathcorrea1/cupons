<template>
  <BaseCard :padding="noPadding ? 'none' : 'md'" :hoverable="clickable" :clickable="clickable">
    <div class="flex items-start justify-between gap-4" :class="noPadding ? 'p-4' : ''">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-semibold text-gray-900 truncate">
            {{ cupom.titulo }}
          </h3>
          <BaseBadge :variant="cupom.ativo ? 'success' : 'default'" size="sm">
            {{ cupom.ativo ? 'Ativo' : 'Inativo' }}
          </BaseBadge>
        </div>

        <p v-if="cupom.descricao" class="text-sm text-gray-600 mb-3 line-clamp-2">
          {{ cupom.descricao }}
        </p>

        <div class="flex flex-wrap gap-4 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <Icon name="ticket" :size="16" />
            <span>{{ cupom.percentual_desconto }}% OFF</span>
          </div>

          <div class="flex items-center gap-1">
            <Icon name="calendar" :size="16" />
            <span>{{ formatDateRange(cupom.data_inicio, cupom.data_fim) }}</span>
          </div>

          <div v-if="showReservas" class="flex items-center gap-1">
            <Icon name="users" :size="16" />
            <span>{{ reservasCount }} reserva{{ reservasCount !== 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>

      <div v-if="showActions" class="flex items-center gap-2">
        <BaseButton
          icon="eye"
          variant="outline"
          size="sm"
          icon-only
          @click="$emit('view', cupom)"
        />
        <BaseButton
          icon="edit"
          variant="outline"
          size="sm"
          icon-only
          @click="$emit('edit', cupom)"
        />
        <BaseButton
          icon="trash-2"
          variant="danger"
          size="sm"
          icon-only
          @click="$emit('delete', cupom)"
        />
      </div>
    </div>

    <div
      v-if="cupom.categoria"
      :class="noPadding ? 'px-4 pb-4' : 'pt-3 border-t border-gray-100'"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="layout-dashboard" :size="14" class="text-gray-400" />
          <span class="text-xs text-gray-600">{{ cupom.categoria.nome }}</span>
        </div>

        <span class="text-xs text-gray-500">
          ID: {{ cupom.id.substring(0, 8) }}...
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CupomWithDetails } from '~/types'
import { formatarData } from '~/utils/validators'

interface Props {
  cupom: CupomWithDetails
  showActions?: boolean
  showReservas?: boolean
  clickable?: boolean
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  showReservas: true,
  clickable: false,
  noPadding: false
})

defineEmits<{
  view: [cupom: CupomWithDetails]
  edit: [cupom: CupomWithDetails]
  delete: [cupom: CupomWithDetails]
}>()

const reservasCount = computed(() => {
  return props.cupom.reservas?.count || 0
})

const formatDateRange = (inicio: string, fim: string) => {
  const dataInicio = formatarData(inicio)
  const dataFim = formatarData(fim)
  return `${dataInicio} - ${dataFim}`
}
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
