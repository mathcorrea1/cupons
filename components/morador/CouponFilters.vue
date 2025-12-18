<template>
  <BaseCard padding="md">
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Icon name="shopping-bag" :size="20" />
        Filtros
      </h3>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            :value="modelValue.categoriaId"
            @change="updateFilter('categoriaId', ($event.target as HTMLSelectElement).value)"
            class="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as categorias</option>
            <option
              v-for="categoria in categorias"
              :key="categoria.id"
              :value="categoria.id"
            >
              {{ categoria.nome }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Desconto mínimo
          </label>
          <input
            type="range"
            :value="modelValue.descontoMinimo"
            @input="updateFilter('descontoMinimo', ($event.target as HTMLInputElement).value)"
            min="0"
            max="100"
            step="5"
            class="w-full"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span class="font-semibold text-blue-600">{{ modelValue.descontoMinimo }}%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <BaseInput
            :model-value="modelValue.busca"
            placeholder="Buscar por título..."
            icon="shopping-bag"
            @update:model-value="updateFilter('busca', $event)"
          />
        </div>

        <BaseButton
          variant="outline"
          full-width
          @click="$emit('reset')"
        >
          Limpar Filtros
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Categoria } from '~/types'

interface Filters {
  categoriaId: number | string
  descontoMinimo: number
  busca: string
}

interface Props {
  modelValue: Filters
  categorias: Categoria[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Filters]
  reset: []
}>()

const updateFilter = (key: keyof Filters, value: string | number) => {
  const filters = { ...props.modelValue, [key]: value }
  emit('update:modelValue', filters)
}
</script>
