const STORAGE_KEY = 'clone-school.game-progress.v1'
const XP_PER_LEVEL = 300

export const ACHIEVEMENTS = [
  { id: 'first-game', title: 'First Game', description: 'Play your first educational game.' },
  { id: 'five-games', title: '5 Games Completed', description: 'Finish five game sessions.' },
  { id: 'math-master', title: 'Math Master', description: 'Score 80% or higher in Math Challenge.' },
  { id: 'perfect-score', title: 'Perfect Score', description: 'Finish a game with every answer correct.' },
  { id: 'three-day-streak', title: '3-Day Streak', description: 'Play games on three consecutive days.' },
]

function createDefaultProgress() {
  return {
    version: 1,
    totalGamesPlayed: 0,
    gamesCompleted: 0,
    xp: 0,
    highScores: {},
    history: [],
    badges: [],
    streak: 1,
    lastPlayedDate: null,
    updatedAt: null,
  }
}

function getStorage() {
  return globalThis.localStorage
}

function readProgress() {
  try {
    const rawValue = getStorage()?.getItem(STORAGE_KEY)
    if (!rawValue) return createDefaultProgress()
    const parsed = JSON.parse(rawValue)
    return {
      ...createDefaultProgress(),
      ...parsed,
      highScores: parsed.highScores && typeof parsed.highScores === 'object' ? parsed.highScores : {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
    }
  } catch {
    return createDefaultProgress()
  }
}

function writeProgress(progress) {
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }))
    globalThis.dispatchEvent?.(new CustomEvent('clone-school:progress-updated', { detail: { source: 'games' } }))
  } catch {
    return false
  }
  return true
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function advanceStreak(lastPlayedDate, currentStreak) {
  const today = dateKey()
  if (!lastPlayedDate) return 1
  if (lastPlayedDate === today) return Math.max(1, Number(currentStreak) || 1)
  const difference = Date.parse(today) - Date.parse(lastPlayedDate)
  if (difference === 86400000) return (Number(currentStreak) || 1) + 1
  return 1
}

export function getLevelInfo(xp) {
  const safeXp = Math.max(0, Number(xp) || 0)
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1
  const currentXp = safeXp % XP_PER_LEVEL
  return {
    level,
    currentXp,
    nextLevelXp: XP_PER_LEVEL,
    percent: Math.round((currentXp / XP_PER_LEVEL) * 100),
  }
}

export function getAchievementStates(progress = readProgress()) {
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: progress.badges.includes(achievement.id),
  }))
}

export function getGameProgress() {
  const progress = readProgress()
  return {
    ...progress,
    levelInfo: getLevelInfo(progress.xp),
    achievements: getAchievementStates(progress),
  }
}

export function getGameHighScore(gameId) {
  return Number(readProgress().highScores[gameId] || 0)
}

export function getRecentlyPlayed(limit = 3) {
  const seen = new Set()
  return readProgress()
    .history.filter((entry) => {
      if (!entry?.gameId || seen.has(entry.gameId)) return false
      seen.add(entry.gameId)
      return true
    })
    .slice(0, limit)
}

export function recordGameResult({
  gameId,
  title,
  score = 0,
  total = 0,
  completed = true,
  category = 'Learning',
  xpEarned,
}) {
  const progress = readProgress()
  const safeScore = Math.max(0, Number(score) || 0)
  const safeTotal = Math.max(0, Number(total) || 0)
  const ratio = safeTotal > 0 ? safeScore / safeTotal : 0
  const earned = Math.max(1, Number(xpEarned) || Math.round(safeScore * 12 + (completed ? 30 : 0)))
  const newBadgeIds = []
  const unlock = (id) => {
    if (!progress.badges.includes(id)) {
      progress.badges = [...progress.badges, id]
      newBadgeIds.push(id)
    }
  }

  progress.streak = advanceStreak(progress.lastPlayedDate, progress.streak)
  progress.lastPlayedDate = dateKey()
  progress.totalGamesPlayed += 1
  if (completed) progress.gamesCompleted += 1
  progress.xp += earned
  progress.highScores = {
    ...progress.highScores,
    [gameId]: Math.max(Number(progress.highScores[gameId] || 0), safeScore),
  }
  progress.history = [
    {
      gameId,
      title,
      score: safeScore,
      total: safeTotal,
      completed: Boolean(completed),
      category,
      xpEarned: earned,
      playedAt: new Date().toISOString(),
    },
    ...progress.history,
  ].slice(0, 20)

  unlock('first-game')
  if (progress.gamesCompleted >= 5) unlock('five-games')
  if (progress.streak >= 3) unlock('three-day-streak')
  if (safeTotal > 0 && ratio >= 1) unlock('perfect-score')
  if (gameId === 'math-challenge' && ratio >= 0.8) unlock('math-master')

  writeProgress(progress)
  const badgeLookup = ACHIEVEMENTS.filter((achievement) => newBadgeIds.includes(achievement.id))

  return {
    ...getGameProgress(),
    xpEarned: earned,
    newBadges: badgeLookup,
  }
}

export function awardBonusXp(amount, _reason = 'Achievement') {
  const safeAmount = Math.max(0, Math.round(Number(amount) || 0))
  if (!safeAmount) return getGameProgress()
  const progress = readProgress()
  progress.xp += safeAmount
  writeProgress(progress)
  return getGameProgress()
}

export function resetGameProgress() {
  try {
    getStorage()?.removeItem(STORAGE_KEY)
  } catch {
    return false
  }
  return true
}
