import { ACHIEVEMENT_MAP, UNIFIED_ACHIEVEMENTS } from '../data/achievements/achievementCatalog.js'
import { getLearningProgress } from './learningProgress.js'
import { getGameProgress, awardBonusXp } from './gameProgress.js'
import { getEueeProgress } from './eueeProgress.js'
import { getDailySummary } from './dailyProgressService.js'
import { addNotification } from './notificationService.js'

const STORAGE_KEY = 'clone-school.achievements.v1'

function createDefaults() {
  return {
    version: 1,
    unlockedIds: [],
    history: [],
    totalXpAwarded: 0,
    initialized: false,
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
      unlockedIds: Array.isArray(parsed.unlockedIds) ? parsed.unlockedIds : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
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

function getEligibleIds() {
  const learning = getLearningProgress()
  const games = getGameProgress()
  const euee = getEueeProgress()
  const daily = getDailySummary()
  const eligible = []

  if ((learning.completedUnits ?? []).length >= 1) eligible.push('first-course')
  if ((games.totalGamesPlayed ?? 0) >= 1) eligible.push('first-game')
  if ((games.gamesCompleted ?? 0) >= 5) eligible.push('five-games')
  if ((learning.answeredQuestions ?? 0) + (euee.questionsAnswered ?? 0) >= 100) eligible.push('hundred-questions')
  if ((euee.examsCompleted ?? 0) >= 1) eligible.push('first-euee-exam')
  if ((euee.history ?? []).some((session) => session.type === 'exam' && session.percent === 100)) eligible.push('perfect-euee-exam')
  if ((euee.questionsAnswered ?? 0) >= 10 && Math.round((euee.correctAnswers / euee.questionsAnswered) * 100) >= 80) {
    eligible.push('euee-sharp-shooter')
  }
  if (Math.max(games.streak ?? 0, euee.streak ?? 0, daily.streak ?? 0) >= 3) eligible.push('study-streak')
  if (daily.goalCompleted) eligible.push('daily-goal')

  return [...new Set(eligible)]
}

export function getAchievementProgress() {
  const store = readStore()
  const eligible = getEligibleIds()
  return {
    ...store,
    unlockedIds: store.initialized ? store.unlockedIds : eligible,
    achievements: UNIFIED_ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: (store.initialized ? store.unlockedIds : eligible).includes(achievement.id),
    })),
  }
}

export function evaluateAchievements({ emit = true } = {}) {
  const store = readStore()
  const eligible = getEligibleIds()
  const known = store.initialized ? store.unlockedIds : eligible
  const newlyUnlocked = eligible.filter((id) => !known.includes(id))
  const unlockedIds = [...new Set([...known, ...eligible])]

  if (!store.initialized) {
    writeStore({ ...store, unlockedIds, initialized: true })
    return { newAchievements: [], achievements: getAchievementProgress().achievements }
  }

  const history = [...store.history]
  const totalXpAwarded = store.totalXpAwarded + newlyUnlocked.reduce((sum, id) => sum + (ACHIEVEMENT_MAP[id]?.xp ?? 0), 0)

  newlyUnlocked.forEach((id) => {
    const achievement = ACHIEVEMENT_MAP[id]
    if (!achievement) return
    history.unshift({ id, title: achievement.title, xp: achievement.xp, unlockedAt: new Date().toISOString() })
  })

  writeStore({
    ...store,
    unlockedIds,
    history: history.slice(0, 40),
    totalXpAwarded,
    initialized: true,
  })

  newlyUnlocked.forEach((id) => {
    const achievement = ACHIEVEMENT_MAP[id]
    if (!achievement) return
    if (achievement.xp > 0 && achievement.source !== 'game') awardBonusXp(achievement.xp, achievement.title)
    if (emit && achievement.source !== 'game') {
      addNotification({
        category: 'achievements',
        title: `Achievement unlocked: ${achievement.title}`,
        message: achievement.description,
        actionPath: '/profile',
        iconName: achievement.iconName,
        eventKey: `achievement-${id}`,
      })
      globalThis.dispatchEvent?.(new CustomEvent('clone-school:achievement', { detail: achievement }))
    }
  })

  return { newAchievements: newlyUnlocked.map((id) => ACHIEVEMENT_MAP[id]).filter(Boolean), achievements: getAchievementProgress().achievements }
}

export function resetAchievements() {
  try {
    getStorage()?.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
