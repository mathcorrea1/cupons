<template>
  <BaseCard>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        v-for="stat in statistics"
        :key="stat.label"
        class="flex items-center gap-4 p-4 rounded-lg"
        :class="stat.bgColor"
      >
        <div :class="`p-3 rounded-full ${stat.iconBg}`">
          <Icon :name="stat.icon" :size="24" :class="stat.iconColor" />
        </div>
        <div>
          <p class="text-sm text-gray-600">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  totalCupons: number
  cuponsAtivos: number
  totalReservas: number
  cuponsUsados: number
}

const props = defineProps<Props>()

const statistics = computed(() => [
  {
    label: 'Total de Cupons',
    value: props.totalCupons,
    icon: 'ticket',
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    label: 'Cupons Ativos',
    value: props.cuponsAtivos,
    icon: 'check-circle',
    bgColor: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    label: 'Total Reservas',
    value: props.totalReservas,
    icon: 'users',
    bgColor: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    label: 'Cupons Usados',
    value: props.cuponsUsados,
    icon: 'check-circle',
    bgColor: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  }
])
</script>
