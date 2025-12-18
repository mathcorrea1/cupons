<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <TransitionGroup name="toast">
        <BaseAlert
          v-for="notification in notifications"
          :key="notification.id"
          v-model="notification.visible"
          :variant="notification.variant"
          :title="notification.title"
          closable
          @close="remove(notification.id)"
        >
          {{ notification.message }}
        </BaseAlert>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface Notification {
  id: string
  title?: string
  message: string
  variant: 'info' | 'success' | 'warning' | 'danger'
  visible: boolean
  duration?: number
}

const notifications = ref<Notification[]>([])

const add = (notification: Omit<Notification, 'id' | 'visible'>) => {
  const id = Math.random().toString(36).substring(7)
  const newNotification: Notification = {
    ...notification,
    id,
    visible: true
  }
  
  notifications.value.push(newNotification)

  // Auto-remove após duração
  const duration = notification.duration || 5000
  setTimeout(() => {
    remove(id)
  }, duration)
}

const remove = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value[index].visible = false
    setTimeout(() => {
      notifications.value.splice(index, 1)
    }, 300)
  }
}

// Expor métodos
defineExpose({
  add,
  remove
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
