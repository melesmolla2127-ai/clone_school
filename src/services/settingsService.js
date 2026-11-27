import { translate } from '../data/i18n/translations.js'

const STORAGE_KEY = 'clone-school.settings.v1'

const STUDY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function createDefaults() {
  return {
    version: 1,
    theme: 'system',
    language: 'en',
    notifications: {
      studyReminders: true,
      dailyChallenges: true,
      courseUpdates: true,
      gameAchievements: true,
      examReminders: true,
      announcements: true,
    },
    learning: {
      dailyGoal: 5,
      reminderTime: '18:00',
      studyDays: [...STUDY_DAYS],
      contentPreference: 'mixed',
      soundEffects: true,
      reducedMotion: false,
    },
    reminders: {
      enabled: true,
      time: '18:00',
      days: [...STUDY_DAYS],
      goal: 5,
      message: 'A short study session today keeps your streak alive.',
      permissionRequested: false,
    },
    updatedAt: null,
  }
}

export const STUDY_DAY_OPTIONS = STUDY_DAYS

function getStorage() {
  return globalThis.localStorage
}

function readSettings() {
  try {
    const rawValue = getStorage()?.getItem(STORAGE_KEY)
    if (!rawValue) return createDefaults()
    const parsed = JSON.parse(rawValue)
    const defaults = createDefaults()
    return {
      ...defaults,
      ...parsed,
      notifications: { ...defaults.notifications, ...(parsed.notifications ?? {}) },
      learning: { ...defaults.learning, ...(parsed.learning ?? {}) },
      reminders: { ...defaults.reminders, ...(parsed.reminders ?? {}) },
    }
  } catch {
    return createDefaults()
  }
}

function writeSettings(settings) {
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify({ ...settings, updatedAt: new Date().toISOString() }))
    globalThis.dispatchEvent?.(new CustomEvent('clone-school:progress-updated', { detail: { source: 'settings' } }))
    return true
  } catch {
    return false
  }
}

export function getSettings() {
  return readSettings()
}

export function updateSettings(patch = {}) {
  const current = readSettings()
  const next = {
    ...current,
    ...patch,
    notifications: { ...current.notifications, ...(patch.notifications ?? {}) },
    learning: { ...current.learning, ...(patch.learning ?? {}) },
    reminders: { ...current.reminders, ...(patch.reminders ?? {}) },
  }
  writeSettings(next)
  applySettings(next)
  return getSettings()
}

export function resetSettings() {
  const defaults = createDefaults()
  writeSettings(defaults)
  applySettings(defaults)
  return getSettings()
}

export function resolveTheme(theme = 'system') {
  if (theme === 'light' || theme === 'dark') return theme
  if (globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function applySettings(settings = readSettings()) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.theme = resolveTheme(settings.theme)
  root.dataset.language = settings.language || 'en'
  root.dataset.reducedMotion = settings.learning?.reducedMotion ? 'true' : 'false'
}

export function subscribeToSystemTheme(callback) {
  const query = globalThis.matchMedia?.('(prefers-color-scheme: dark)')
  if (!query) return () => {}
  const handler = () => callback(query.matches)
  query.addEventListener?.('change', handler)
  return () => query.removeEventListener?.('change', handler)
}

export function translateSetting(language, key) {
  return translate(language, key)
}

export function notificationCategoryEnabled(settings, category) {
  const map = {
    announcements: settings.notifications.announcements,
    courses: settings.notifications.courseUpdates,
    study: settings.notifications.studyReminders,
    games: settings.notifications.gameAchievements,
    achievements: settings.notifications.gameAchievements,
    euee: settings.notifications.examReminders,
    system: true,
  }
  return map[category] !== false
}
