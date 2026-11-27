import { createSeedNotifications } from '../data/notifications/notificationSeed.js'

const STORAGE_KEY = 'clone-school.notifications.v1'
const NOTIFICATION_LIMIT = 60

export const NOTIFICATION_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'courses', label: 'Courses' },
  { id: 'study', label: 'Study reminders' },
  { id: 'games', label: 'Games' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'euee', label: 'EUEE' },
  { id: 'system', label: 'System' },
]

function createDefaults() {
  return {
    version: 1,
    notifications: [],
    eventKeys: [],
    seeded: false,
    updatedAt: null,
  }
}

function getStorage() {
  return globalThis.localStorage
}

function readStore() {
  try {
    const rawValue = getStorage()?.getItem(STORAGE_KEY)
    if (!rawValue) return createDefaults()
    const parsed = JSON.parse(rawValue)
    return {
      ...createDefaults(),
      ...parsed,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
      eventKeys: Array.isArray(parsed.eventKeys) ? parsed.eventKeys : [],
    }
  } catch {
    return createDefaults()
  }
}

function writeStore(store) {
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify({ ...store, updatedAt: new Date().toISOString() }))
    globalThis.dispatchEvent?.(new CustomEvent('clone-school:progress-updated', { detail: { source: 'notifications' } }))
    return true
  } catch {
    return false
  }
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `notification-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function seedNotificationsIfEmpty() {
  const store = readStore()
  if (store.seeded || store.notifications.length) return getNotifications()
  writeStore({
    ...store,
    seeded: true,
    notifications: createSeedNotifications(),
  })
  return getNotifications()
}

export function getNotifications() {
  return readStore().notifications
}

export function getUnreadCount() {
  return readStore().notifications.filter((item) => !item.read).length
}

export function addNotification({
  category = 'system',
  title,
  message,
  actionPath = null,
  iconName = 'Bell',
  eventKey = null,
} = {}) {
  const store = readStore()
  if (eventKey && store.eventKeys.includes(eventKey)) return getNotifications()

  const notification = {
    id: createId(),
    category,
    title: String(title ?? 'Notification'),
    message: String(message ?? ''),
    createdAt: new Date().toISOString(),
    read: false,
    actionPath,
    iconName,
  }

  writeStore({
    ...store,
    notifications: [notification, ...store.notifications].slice(0, NOTIFICATION_LIMIT),
    eventKeys: eventKey ? [...store.eventKeys, eventKey].slice(-80) : store.eventKeys,
  })
  return getNotifications()
}

export function markNotificationRead(id) {
  const store = readStore()
  writeStore({
    ...store,
    notifications: store.notifications.map((item) => (item.id === id ? { ...item, read: true } : item)),
  })
  return getNotifications()
}

export function markAllNotificationsRead() {
  const store = readStore()
  writeStore({
    ...store,
    notifications: store.notifications.map((item) => ({ ...item, read: true })),
  })
  return getNotifications()
}

export function deleteNotification(id) {
  const store = readStore()
  writeStore({
    ...store,
    notifications: store.notifications.filter((item) => item.id !== id),
  })
  return getNotifications()
}

export function clearNotifications() {
  const store = readStore()
  writeStore({
    ...store,
    notifications: [],
    eventKeys: [],
    seeded: true,
  })
  return getNotifications()
}
