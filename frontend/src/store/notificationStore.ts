import { create } from 'zustand'

export interface Notification {
  id: string
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
  autoHideDuration?: number
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now().toString()
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }]
    }))
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
  }
}))