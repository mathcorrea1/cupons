<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <Icon v-if="loading" name="loader" :size="16" class="animate-spin mr-2" />
    <Icon v-else-if="icon" :name="icon" :size="iconSize" :class="iconClasses" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconOnly?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  iconOnly: false,
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
    case 'secondary':
      return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'
    case 'success':
      return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300'
    case 'outline':
      return 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  if (props.iconOnly) {
    switch (props.size) {
      case 'sm':
        return 'p-1.5'
      case 'md':
        return 'p-2'
      case 'lg':
        return 'p-3'
      default:
        return 'p-2'
    }
  }
  
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'md':
      return 'px-4 py-2 text-base'
    case 'lg':
      return 'px-6 py-3 text-lg'
    default:
      return 'px-4 py-2 text-base'
  }
})

const buttonClasses = computed(() => {
  return [
    baseClasses,
    variantClasses.value,
    sizeClasses.value,
    props.fullWidth ? 'w-full' : '',
    (props.disabled || props.loading) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
  ].join(' ')
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 14
    case 'md':
      return 16
    case 'lg':
      return 20
    default:
      return 16
  }
})

const iconClasses = computed(() => {
  return props.iconOnly ? '' : 'mr-2'
})
</script>
