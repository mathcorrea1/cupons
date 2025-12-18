<template>
  <span :class="badgeClasses">
    <Icon v-if="icon" :name="icon" :size="iconSize" class="mr-1" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  dot: false
})

const baseClasses = 'inline-flex items-center font-medium rounded-full'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-100 text-blue-800'
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'danger':
      return 'bg-red-100 text-red-800'
    case 'info':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs'
    case 'md':
      return 'px-2.5 py-1 text-sm'
    case 'lg':
      return 'px-3 py-1.5 text-base'
    default:
      return 'px-2.5 py-1 text-sm'
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 12
    case 'md':
      return 14
    case 'lg':
      return 16
    default:
      return 14
  }
})

const badgeClasses = computed(() => {
  return [baseClasses, variantClasses.value, sizeClasses.value].join(' ')
})
</script>
