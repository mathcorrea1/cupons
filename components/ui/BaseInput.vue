<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon :name="icon" :size="18" class="text-gray-400" />
      </div>
      
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :maxlength="maxLength"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Icon name="x" :size="18" class="text-red-500" />
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date'
  placeholder?: string
  icon?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  maxLength?: number
  mask?: (value: string) => string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)
const isFocused = ref(false)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  
  if (props.mask) {
    value = props.mask(value)
    target.value = value
  }
  
  emit('update:modelValue', props.type === 'number' ? Number(value) : value)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const baseClasses = 'block w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1'

const inputClasses = computed(() => {
  const classes = [baseClasses]
  
  if (props.icon) {
    classes.push('pl-10')
  }
  
  if (props.error) {
    classes.push('border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 pr-10')
  } else if (isFocused.value) {
    classes.push('border-blue-500 focus:ring-blue-500')
  } else {
    classes.push('border-gray-300 focus:ring-blue-500 focus:border-blue-500')
  }
  
  if (props.disabled) {
    classes.push('bg-gray-100 cursor-not-allowed opacity-60')
  } else {
    classes.push('bg-white')
  }
  
  return classes.join(' ')
})
</script>
