import { useCallback, useEffect, useMemo, useState } from 'react'
import NotificationsContext from './notificationsContextDefinition.js'
import {
  addNotification,
  clearNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  seedNotificationsIfEmpty,
} from '../services/notificationService.js'

export default function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => seedNotificationsIfEmpty())

  const refresh = useCallback(() => setNotifications(getNotifications()), [])

  useEffect(() => {
    const handler = () => refresh()
    globalThis.addEventListener?.('clone-school:progress-updated', handler)
    return () => globalThis.removeEventListener?.('clone-school:progress-updated', handler)
  }, [refresh])

  const notify = useCallback((options) => {
    const next = addNotification(options)
    setNotifications(next)
    return next
  }, [])

  const markRead = useCallback((id) => setNotifications(markNotificationRead(id)), [])
  const markAllRead = useCallback(() => setNotifications(markAllNotificationsRead()), [])
  const remove = useCallback((id) => setNotifications(deleteNotification(id)), [])
  const clearAll = useCallback(() => setNotifications(clearNotifications()), [])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      notify,
      markRead,
      markAllRead,
      remove,
      clearAll,
      refresh,
    }),
    [notifications, notify, markRead, markAllRead, remove, clearAll, refresh],
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
