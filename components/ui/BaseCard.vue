<template>
  <div :class="cardClasses">
    <div v-if="title || $slots.header" :class="headerClasses">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </slot>
    </div>
    
    <div :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  variant?: 'default' | 'bordered' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
  clickable: false
})

const cardClasses = computed(() => {
  const classes = ['bg-white rounded-lg']
  
  switch (props.variant) {
    case 'bordered':
      classes.push('border border-gray-200')
      break
    case 'elevated':
      classes.push('shadow-lg')
      break
    default:
      classes.push('shadow')
  }
  
  if (props.hoverable) {
    classes.push('transition-shadow hover:shadow-lg')
  }
  
  if (props.clickable) {
    classes.push('cursor-pointer transition-transform hover:scale-[1.02]')
  }
  
  return classes.join(' ')
})

const paddingClasses = computed(() => {
  switch (props.padding) {
    case 'none':
      return ''
    case 'sm':
      return 'p-3'
    case 'md':
      return 'p-4'
    case 'lg':
      return 'p-6'
    default:
      return 'p-4'
  }
})

const headerClasses = computed(() => {
  const classes = [paddingClasses.value, 'border-b border-gray-200']
  return classes.join(' ')
})

const bodyClasses = computed(() => {
  return paddingClasses.value
})

const footerClasses = computed(() => {
  const classes = [paddingClasses.value, 'border-t border-gray-200 bg-gray-50']
  return classes.join(' ')
})
</script>
