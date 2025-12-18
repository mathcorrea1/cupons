<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Overlay -->
          <div
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="handleClose"
          ></div>
          
          <!-- Modal -->
          <div
            :class="modalClasses"
            class="relative bg-white rounded-lg shadow-xl transform transition-all"
            @click.stop
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-gray-200">
              <slot name="header">
                <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
              </slot>
              <button
                v-if="closable"
                type="button"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="handleClose"
              >
                <Icon name="x" :size="24" />
              </button>
            </div>
            
            <!-- Body -->
            <div :class="bodyPaddingClass">
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  noPadding: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const handleClose = () => {
  if (props.closeOnOverlay && props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const modalClasses = computed(() => {
  const sizeClasses = {
    sm: 'max-w-md w-full',
    md: 'max-w-lg w-full',
    lg: 'max-w-2xl w-full',
    xl: 'max-w-4xl w-full',
    full: 'max-w-full w-full mx-4'
  }
  
  return sizeClasses[props.size]
})

const bodyPaddingClass = computed(() => {
  return props.noPadding ? '' : 'p-6'
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
