<template>
  <Transition name="alert">
    <div v-if="modelValue" :class="alertClasses" role="alert">
      <div class="flex items-start">
        <Icon v-if="icon" :name="icon" :size="20" class="flex-shrink-0 mt-0.5" />
        
        <div class="flex-1 ml-3">
          <h4 v-if="title" class="font-semibold mb-1">{{ title }}</h4>
          <div class="text-sm">
            <slot />
          </div>
        </div>
        
        <button
          v-if="closable"
          type="button"
          :class="closeButtonClasses"
          @click="handleClose"
        >
          <Icon name="x" :size="18" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  variant: 'info',
  closable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const icon = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'check-circle'
    case 'warning':
      return 'x'
    case 'danger':
      return 'x'
    default:
      return 'check-circle'
  }
})

const alertClasses = computed(() => {
  const baseClasses = 'rounded-lg p-4 border'
  
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800'
  }
  
  return `${baseClasses} ${variantClasses[props.variant]}`
})

const closeButtonClasses = computed(() => {
  const variantClasses = {
    info: 'text-blue-500 hover:text-blue-700',
    success: 'text-green-500 hover:text-green-700',
    warning: 'text-yellow-500 hover:text-yellow-700',
    danger: 'text-red-500 hover:text-red-700'
  }
  
  return `ml-3 flex-shrink-0 focus:outline-none ${variantClasses[props.variant]}`
})
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.alert-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
