<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900">Meus Cupons</h2>
      <BaseButton icon="plus" @click="$emit('create')">
        Novo Cupom
      </BaseButton>
    </div>

    <BaseAlert v-if="cupons.length === 0" variant="info">
      <p>Você ainda não criou nenhum cupom. Clique em "Novo Cupom" para começar!</p>
    </BaseAlert>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CouponCard
        v-for="cupom in cupons"
        :key="cupom.id"
        :cupom="cupom"
        show-actions
        show-reservas
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>

    <div
      v-if="loading"
      class="flex items-center justify-center py-12"
    >
      <Icon name="loader" :size="32" class="animate-spin text-blue-600" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CupomWithDetails } from '~/types'

interface Props {
  cupons: CupomWithDetails[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<{
  create: []
  view: [cupom: CupomWithDetails]
  edit: [cupom: CupomWithDetails]
  delete: [cupom: CupomWithDetails]
}>()
</script>
