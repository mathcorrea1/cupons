<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="getHeaderClasses(column)"
            scope="col"
          >
            {{ column.label }}
          </th>
          <th v-if="$slots.actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading" class="text-center">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-12">
            <Icon name="loader" :size="32" class="animate-spin mx-auto text-gray-400" />
          </td>
        </tr>
        <tr v-else-if="!data || data.length === 0" class="text-center">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-12 text-gray-500">
            <slot name="empty">
              Nenhum registro encontrado
            </slot>
          </td>
        </tr>
        <tr
          v-else
          v-for="(row, index) in data"
          :key="getRowKey(row, index)"
          :class="hoverable ? 'hover:bg-gray-50 transition-colors' : ''"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="getCellClasses(column)"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ formatValue(row[column.key], column) }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any) => string
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  hoverable?: boolean
  rowKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hoverable: true,
  rowKey: 'id'
})

const getHeaderClasses = (column: Column) => {
  const align = column.align || 'left'
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  return `px-6 py-3 ${alignClasses[align]} text-xs font-medium text-gray-500 uppercase tracking-wider`
}

const getCellClasses = (column: Column) => {
  const align = column.align || 'left'
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  return `px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${alignClasses[align]}`
}

const getRowKey = (row: any, index: number) => {
  return row[props.rowKey] || index
}

const formatValue = (value: any, column: Column) => {
  if (column.format) {
    return column.format(value)
  }
  return value
}
</script>
