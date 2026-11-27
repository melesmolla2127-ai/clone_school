import { getGameProgress } from './gameProgress.js'
import { getEueeProgress } from './eueeProgress.js'
import { getLearningProgress } from './learningProgress.js'
import { getSettings } from './settingsService.js'

const STORAGE_KEY = 'clone-school.daily-progress.v1'

function createDefaults() {
  return {
    version: 1,
    byDate: {},
    derived: { gameIds: [], eueeIds: [], learningStamp: null },
    streak: 0,
    lastActiveDate: null,
    updatedAt: null,
  }
}

function emptyDay() {
  return { units: 0, questions: 0, games: 0, euee: 0, exams: 0, actions: 0, goalCompleted: false }
}

function getStorage() {
  return globalThis.localStorage
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function readStore() {
  try {
    const rawValue = getStorage()?.getItem(STORAGE_KEY)
    if (!rawValue) return createDefaults()
    const parsed = JSON.parse(rawValue)
    return {
      ...createDefaults(),
      ...parsed,
      byDate: parsed.byDate && typeof parsed.byDate === 'object' ? parsed.byDate : {},
      derived: {
        ...createDefaults().derived,
        ...(parsed.derived ?? {}),
        gameIds: Array.isArray(parsed.derived?.gameIds) ? parsed.derived.gameIds : [],
        eueeIds: Array.isArray(parsed.derived?.eueeIds) ? parsed.derived.eueeIds : [],
      },
    }
  } catch {
    return createDefaults()
  }
}

function writeStore(store) {
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify({ ...store, updatedAt: new Date().toISOString() }))
  } catch {
    return false
  }
  return true
}

function advanceStreak(store, today) {
  if (store.lastActiveDate === today) return store.streak
  if (!store.lastActiveDate || Date.parse(today) - Date.parse(store.lastActiveDate) === 86400000) {
    return (Number(store.streak) || 0) + 1
  }
  return 1
}

export function syncDailyActivity() {
  const store = readStore()
  const today = dateKey()
  const goal = Math.max(1, Number(getSettings().learning?.dailyGoal) || 5)
  const day = { ...emptyDay(), ...(store.byDate[today] ?? {}) }
  let changed = false

  const gameEntries = (getGameProgress().history ?? []).filter((entry) => dateKey(new Date(entry.playedAt)) === today)
  const newGames = gameEntries.filter((entry) => !store.derived.gameIds.includes(entry.id ?? `${entry.gameId}:${entry.playedAt}`))
  if (newGames.length) {
    store.derived.gameIds = [...gameEntries.map((entry) => entry.id ?? `${entry.gameId}:${entry.playedAt}`)].slice(-60)
    day.games += newGames.length
    changed = true
  }

  const eueeEntries = (getEueeProgress().history ?? []).filter((entry) => dateKey(new Date(entry.completedAt)) === today)
  const newEuee = eueeEntries.filter((entry) => !store.derived.eueeIds.includes(entry.id))
  if (newEuee.length) {
    store.derived.eueeIds = eueeEntries.map((entry) => entry.id).slice(-60)
    day.euee += newEuee.length
    day.exams += newEuee.filter((entry) => entry.type === 'exam').length
    day.questions += newEuee.reduce((sum, entry) => sum + (Number(entry.total) || 0), 0)
    changed = true
  }

  const lastStudied = getLearningProgress().lastStudied
  const learningStamp = lastStudied?.visitedAt && dateKey(new Date(lastStudied.visitedAt)) === today ? lastStudied.visitedAt : null
  if (learningStamp && learningStamp !== store.derived.learningStamp) {
    store.derived.learningStamp = learningStamp
    day.units += 1
    changed = true
  }

  day.actions = day.units + day.games + day.euee + (day.questions > 0 ? 1 : 0)
  if (!day.goalCompleted && day.actions >= goal) day.goalCompleted = true

  if (changed) {
    store.streak = advanceStreak(store, today)
    store.lastActiveDate = today
  }
  store.byDate[today] = day
  writeStore(store)
  return { ...store, today, day }
}

export function getDailySummary() {
  const synced = syncDailyActivity()
  const goal = Math.max(1, Number(getSettings().learning?.dailyGoal) || 5)
  return {
    date: synced.today,
    ...synced.day,
    goal,
    percent: Math.min(100, Math.round((synced.day.actions / goal) * 100)),
    streak: synced.streak,
  }
}

export function getDailyActivityByDate(days = 7) {
  const store = syncDailyActivity()
  const result = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date()
    date.setUTCDate(date.getUTCDate() - offset)
    const key = date.toISOString().slice(0, 10)
    result.push({ date: key, ...emptyDay(), ...(store.byDate[key] ?? {}) })
  }
  return result
}

export function resetDailyProgress() {
  try {
    getStorage()?.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
