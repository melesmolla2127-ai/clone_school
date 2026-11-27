import { EUEE_SUBJECTS, getEueeSubject } from '../data/euee/eueeSubjects.js'
import { countQuestionsForSubject } from '../data/euee/eueeQuestions.js'

const STORAGE_KEY = 'clone-school.euee-progress.v1'
const HISTORY_LIMIT = 30

function createDefaults() {
  return {
    version: 1,
    examsCompleted: 0,
    practiceSessions: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    totalScore: 0,
    bestScore: 0,
    lastExamDate: null,
    lastActivityDate: null,
    streak: 0,
    subjectStats: {},
    weakTopics: [],
    history: [],
    updatedAt: null,
  }
}

function getStorage() {
  return globalThis.localStorage
}

function readProgress() {
  try {
    const rawValue = getStorage()?.getItem(STORAGE_KEY)
    if (!rawValue) return createDefaults()
    const parsed = JSON.parse(rawValue)
    return {
      ...createDefaults(),
      ...parsed,
      subjectStats: parsed.subjectStats && typeof parsed.subjectStats === 'object' ? parsed.subjectStats : {},
      weakTopics: Array.isArray(parsed.weakTopics) ? parsed.weakTopics : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    }
  } catch {
    return createDefaults()
  }
}

function writeProgress(progress) {
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }))
    globalThis.dispatchEvent?.(new CustomEvent('clone-school:progress-updated', { detail: { source: 'euee' } }))
    return true
  } catch {
    return false
  }
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function advanceStreak(lastActivityDate, currentStreak) {
  const today = dateKey()
  if (!lastActivityDate || lastActivityDate === today) return Math.max(1, Number(currentStreak) || 1)
  if (Date.parse(today) - Date.parse(lastActivityDate) === 86400000) return (Number(currentStreak) || 1) + 1
  return 1
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `euee-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function getEueeProgress() {
  return readProgress()
}

export function recordEueeSession({
  type = 'practice',
  title = 'EUEE Practice',
  subjectIds = [],
  difficulty = 'mixed',
  topics = [],
  questions = [],
  answers = {},
  durationSeconds = 0,
} = {}) {
  const progress = readProgress()
  const safeQuestions = Array.isArray(questions) ? questions : []
  const reviewed = safeQuestions.map((question) => {
    const selected = answers[question.id] ?? null
    return {
      questionId: question.id,
      subjectId: question.subjectId,
      subjectName: getEueeSubject(question.subjectId)?.name ?? question.subjectId,
      topic: question.topic,
      difficulty: question.difficulty,
      type: question.type,
      text: question.text,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
      image: question.image ?? null,
      selected,
      correct: selected === question.answer,
    }
  })

  const correct = reviewed.filter((item) => item.correct).length
  const total = reviewed.length
  const percent = total ? Math.round((correct / total) * 100) : 0
  const now = new Date().toISOString()

  const session = {
    id: createId(),
    type: type === 'exam' ? 'exam' : 'practice',
    title,
    subjectIds: [...new Set(subjectIds)],
    subjects: [...new Set(subjectIds)].map((id) => getEueeSubject(id)?.name ?? id),
    difficulty,
    topics: [...new Set(topics)],
    total,
    score: correct,
    percent,
    correct,
    incorrect: reviewed.filter((item) => item.selected && !item.correct).length,
    unanswered: reviewed.filter((item) => !item.selected).length,
    durationSeconds: Math.max(0, Number(durationSeconds) || 0),
    answers: reviewed,
    startedAt: now,
    completedAt: now,
  }

  progress.streak = advanceStreak(progress.lastActivityDate, progress.streak)
  progress.lastActivityDate = dateKey()
  progress.questionsAnswered += total
  progress.correctAnswers += correct
  progress.totalScore += percent
  progress.bestScore = Math.max(Number(progress.bestScore) || 0, percent)
  if (session.type === 'exam') {
    progress.examsCompleted += 1
    progress.lastExamDate = now
  } else {
    progress.practiceSessions += 1
  }

  reviewed.forEach((item) => {
    const current = progress.subjectStats[item.subjectId] ?? {
      practiced: 0,
      correct: 0,
      exams: 0,
      bestScore: 0,
      topics: {},
    }
    current.practiced += 1
    if (item.correct) current.correct += 1
    if (session.type === 'exam') current.exams += 1
    const topic = current.topics[item.topic] ?? { practiced: 0, correct: 0 }
    topic.practiced += 1
    if (item.correct) topic.correct += 1
    current.topics[item.topic] = topic
    progress.subjectStats[item.subjectId] = current
  })

  Object.entries(progress.subjectStats).forEach(([subjectId, stats]) => {
    const subjectSessions = session.answers.filter((item) => item.subjectId === subjectId)
    if (subjectSessions.length) {
      const subjectPercent = Math.round((subjectSessions.filter((item) => item.correct).length / subjectSessions.length) * 100)
      stats.bestScore = Math.max(Number(stats.bestScore) || 0, subjectPercent)
    }
  })

  progress.weakTopics = Object.entries(progress.subjectStats).flatMap(([subjectId, stats]) =>
    Object.entries(stats.topics || {})
      .filter(([, topic]) => topic.practiced >= 2 && topic.correct / topic.practiced < 0.6)
      .map(([topic]) => ({ subjectId, topic, accuracy: Math.round((topic.correct / topic.practiced) * 100) })),
  )

  progress.history = [session, ...progress.history].slice(0, HISTORY_LIMIT)
  writeProgress(progress)

  return { ...getEueeDashboardStats(), session }
}

export function getEueeHistory(type = null) {
  const history = readProgress().history
  return type ? history.filter((session) => session.type === type) : history
}

export function getEueeSessionById(id) {
  return readProgress().history.find((session) => session.id === id) ?? null
}

export function getEueeDashboardStats(progress = readProgress()) {
  const sessionCount = progress.history.length
  const averageScore = sessionCount ? Math.round(progress.totalScore / sessionCount) : 0
  const accuracy = progress.questionsAnswered ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100) : 0

  const subjectStats = EUEE_SUBJECTS.map((subject) => {
    const stats = progress.subjectStats[subject.id] ?? {
      practiced: 0,
      correct: 0,
      exams: 0,
      bestScore: 0,
      topics: {},
    }
    return {
      ...subject,
      totalQuestions: countQuestionsForSubject(subject.id),
      practiced: stats.practiced,
      correct: stats.correct,
      exams: stats.exams,
      bestScore: stats.bestScore || 0,
      percent: stats.practiced ? Math.round((stats.correct / stats.practiced) * 100) : 0,
      topics: stats.topics ?? {},
    }
  })

  return {
    examsCompleted: progress.examsCompleted,
    practiceSessions: progress.practiceSessions,
    questionsAnswered: progress.questionsAnswered,
    correctAnswers: progress.correctAnswers,
    accuracy,
    averageScore,
    bestScore: progress.bestScore,
    streak: progress.streak,
    lastExamDate: progress.lastExamDate,
    subjectStats,
    weakTopics: progress.weakTopics,
    recent: progress.history.slice(0, 5),
    totalSessions: sessionCount,
  }
}

export function resetEueeProgress() {
  try {
    getStorage()?.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
