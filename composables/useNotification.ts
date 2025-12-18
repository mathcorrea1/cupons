import { ref } from 'vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'danger'

interface NotificationOptions {
  title?: string
  message: string
  variant: NotificationType
  duration?: number
}

const notificationHandler = ref<any>(null)

export const useNotification = () => {
  const setHandler = (handler: any) => {
    notificationHandler.value = handler
  }

  const notify = (options: NotificationOptions) => {
    if (notificationHandler.value) {
      notificationHandler.value.add(options)
    }
  }

  const success = (message: string, title = 'Sucesso') => {
    notify({ message, title, variant: 'success' })
  }

  const error = (message: string, title = 'Erro') => {
    notify({ message, title, variant: 'danger' })
  }

  const warning = (message: string, title = 'Atenção') => {
    notify({ message, title, variant: 'warning' })
  }

  const info = (message: string, title = 'Informação') => {
    notify({ message, title, variant: 'info' })
  }

  return {
    setHandler,
    notify,
    success,
    error,
    warning,
    info
  }
}
