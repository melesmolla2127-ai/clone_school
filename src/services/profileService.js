import { getLearningProgress } from './learningProgress.js'
import { getGameProgress, getRecentlyPlayed } from './gameProgress.js'
import { getEueeDashboardStats, getEueeHistory } from './eueeProgress.js'
import { getAchievementProgress } from './achievementService.js'
import { getDailyActivityByDate, getDailySummary } from './dailyProgressService.js'
import { updateStudentAccount } from './authService.js'

export function getFullName(student) {
  if (!student) return 'Student'
  return [student.firstName, student.fatherName, student.grandfatherName].filter(Boolean).join(' ')
}

export function getInitial(name) {
  return String(name || 'S').trim().charAt(0).toUpperCase() || 'S'
}

export function getProfileSummary() {
  const learning = getLearningProgress()
  const games = getGameProgress()
  const euee = getEueeDashboardStats()
  const achievements = getAchievementProgress()
  const daily = getDailySummary()

  return {
    subjectsStudied: new Set(learning.openedSubjects ?? []).size,
    courseProgress: learning.completedUnits.length ? Math.min(100, learning.completedUnits.length * 12) : 0,
    unitsCompleted: learning.completedUnits.length,
    questionsAnswered: (learning.answeredQuestions ?? 0) + (euee.questionsAnswered ?? 0),
    gamesPlayed: games.totalGamesPlayed,
    xp: games.xp,
    level: games.levelInfo.level,
    achievementsUnlocked: achievements.unlockedIds.length,
    achievementsTotal: achievements.achievements.length,
    eueeExams: euee.examsCompleted,
    eueeAccuracy: euee.accuracy,
    streak: Math.max(games.streak ?? 0, euee.streak ?? 0, daily.streak ?? 0),
    dailyGoal: daily.goal,
    dailyActions: daily.actions,
  }
}

export function getProfileActivity() {
  const learning = getLearningProgress()
  const courses = learning.lastStudied
    ? [
        {
          id: 'last-course',
          title: learning.lastStudied.unitTitle || learning.lastStudied.subjectTitle || 'Course lesson',
          detail: `${learning.lastStudied.subjectTitle || 'Course'} · ${learning.lastStudied.unitTitle || 'Open unit'}`,
          at: learning.lastStudied.visitedAt,
          path: '/continue-learning',
          iconName: 'BookOpen',
        },
      ]
    : []

  const games = getRecentlyPlayed(5).map((entry) => ({
    id: `game-${entry.gameId}-${entry.playedAt}`,
    title: entry.title,
    detail: `Score ${entry.score}/${entry.total} · +${entry.xpEarned} XP`,
    at: entry.playedAt,
    path: `/games/${entry.gameId}`,
    iconName: 'Gamepad2',
  }))

  const euee = getEueeHistory().slice(0, 5).map((entry) => ({
    id: `euee-${entry.id}`,
    title: entry.title,
    detail: `${entry.type === 'exam' ? 'Mock exam' : 'Practice'} · ${entry.percent}%`,
    at: entry.completedAt,
    path: `/euee/results/${entry.id}`,
    iconName: 'GraduationCap',
  }))

  const achievements = getAchievementProgress().history.slice(0, 5).map((entry) => ({
    id: `achievement-${entry.id}-${entry.unlockedAt}`,
    title: entry.title,
    detail: entry.xp ? `+${entry.xp} XP` : 'Achievement unlocked',
    at: entry.unlockedAt,
    path: '/profile',
    iconName: 'Trophy',
  }))

  const activity = [...courses, ...games, ...euee, ...achievements]
    .filter((item) => item.at)
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .slice(0, 12)

  return {
    courses,
    games,
    euee,
    achievements,
    activity,
    daily: getDailyActivityByDate(7),
  }
}

export function saveProfile(accountId, details) {
  return updateStudentAccount(accountId, details)
}
