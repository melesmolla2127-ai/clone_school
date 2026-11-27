const STORAGE_KEY = 'clone-school.learning-progress.v1'

function createDefaultProgress() {
  return {
    version: 1,
    openedSubjects: [],
    completedUnits: [],
    answeredQuestions: 0,
    correctAnswers: 0,
    lastStudied: null,
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
      openedSubjects: Array.isArray(parsed.openedSubjects) ? parsed.openedSubjects : [],
      completedUnits: Array.isArray(parsed.completedUnits) ? parsed.completedUnits : [],
    }
  } catch {
    return createDefaultProgress()
  }
}

function writeProgress(progress) {
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }))
    globalThis.dispatchEvent?.(new CustomEvent('clone-school:progress-updated', { detail: { source: 'courses' } }))
  } catch {
    return false
  }
  return true
}

export function makeSubjectKey({ grade, stream, subjectId }) {
  return [grade || 'unknown', stream || 'general', subjectId].join(':')
}

export function makeUnitKey({ grade, stream, subjectId, unitId }) {
  return `${makeSubjectKey({ grade, stream, subjectId })}:${unitId}`
}

export function getLearningProgress() {
  return readProgress()
}

export function recordSubjectOpened({ grade, stream, subjectId, subjectTitle, unitCount }) {
  const progress = readProgress()
  const key = makeSubjectKey({ grade, stream, subjectId })

  if (!progress.openedSubjects.includes(key)) {
    progress.openedSubjects = [...progress.openedSubjects, key]
  }

  progress.lastStudied = {
    ...progress.lastStudied,
    grade: grade || progress.lastStudied?.grade || '',
    stream: stream || progress.lastStudied?.stream || '',
    subjectId,
    subjectTitle,
    totalUnits: unitCount,
    visitedAt: new Date().toISOString(),
  }

  writeProgress(progress)
  return progress
}

export function recordUnitOpened({ grade, stream, subjectId, subjectTitle, unitId, unitTitle }) {
  const progress = readProgress()
  const subjectKey = makeSubjectKey({ grade, stream, subjectId })

  if (!progress.openedSubjects.includes(subjectKey)) {
    progress.openedSubjects = [...progress.openedSubjects, subjectKey]
  }

  progress.lastStudied = {
    grade: grade || '',
    stream: stream || '',
    subjectId,
    subjectTitle,
    unitId,
    unitTitle,
    visitedAt: new Date().toISOString(),
  }

  writeProgress(progress)
  return progress
}

export function recordUnitCompleted({ grade, stream, subjectId, unitId }) {
  const progress = readProgress()
  const key = makeUnitKey({ grade, stream, subjectId, unitId })

  if (!progress.completedUnits.includes(key)) {
    progress.completedUnits = [...progress.completedUnits, key]
  }

  writeProgress(progress)
  return progress
}

export function recordQuestionResult(isCorrect) {
  const progress = readProgress()
  progress.answeredQuestions += 1
  if (isCorrect) progress.correctAnswers += 1
  writeProgress(progress)
  return progress
}

export function getSubjectProgress({ grade, stream, subjectId, totalUnits }) {
  const prefix = `${makeSubjectKey({ grade, stream, subjectId })}:`
  const completed = readProgress().completedUnits.filter((key) => key.startsWith(prefix)).length
  const safeTotal = Math.max(1, Number(totalUnits) || 1)
  return {
    completed: Math.min(completed, safeTotal),
    total: safeTotal,
    percent: Math.min(100, Math.round((completed / safeTotal) * 100)),
  }
}

export function getCourseCompletion(totalUnits) {
  const safeTotal = Math.max(1, Number(totalUnits) || 1)
  const completed = readProgress().completedUnits.length
  return {
    completed: Math.min(completed, safeTotal),
    total: safeTotal,
    percent: Math.min(100, Math.round((completed / safeTotal) * 100)),
  }
}

export function getLastStudied() {
  return readProgress().lastStudied
}

export function getQuestionAccuracy() {
  const { answeredQuestions, correctAnswers } = readProgress()
  if (!answeredQuestions) return 0
  return Math.round((correctAnswers / answeredQuestions) * 100)
}

export function resetLearningProgress() {
  try {
    getStorage()?.removeItem(STORAGE_KEY)
  } catch {
    return false
  }
  return true
}
