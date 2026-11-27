const ARCHIVE_PROGRESS_KEY = 'clone-school.euee-archive.v1'

function getStorage() {
  return globalThis.localStorage
}

function createDefaults() {
  return {
    version: 1,
    attempts: {},
    updatedAt: null,
  }
}

function readStore() {
  try {
    const raw = getStorage()?.getItem(ARCHIVE_PROGRESS_KEY)
    if (!raw) return createDefaults()
    const parsed = JSON.parse(raw)
    return {
      ...createDefaults(),
      ...parsed,
      attempts: parsed.attempts && typeof parsed.attempts === 'object' ? parsed.attempts : {},
    }
  } catch {
    return createDefaults()
  }
}

function writeStore(store) {
  try {
    getStorage()?.setItem(ARCHIVE_PROGRESS_KEY, JSON.stringify({ ...store, updatedAt: new Date().toISOString() }))
    globalThis.dispatchEvent?.(new CustomEvent('clone-school:progress-updated', { detail: { source: 'euee-archive' } }))
    return true
  } catch {
    return false
  }
}

function makeExamKey(year, streamId, subjectId) {
  return `${year}:${streamId}:${subjectId}`
}

export function getArchiveAttempt(year, streamId, subjectId) {
  const store = readStore()
  return store.attempts[makeExamKey(year, streamId, subjectId)] ?? null
}

export function getArchiveAttemptById(attemptId) {
  const store = readStore()
  for (const attempt of Object.values(store.attempts)) {
    if (attempt?.lastAttemptId === attemptId || attempt?.history?.some((h) => h.id === attemptId)) {
      const historyItem = attempt.history?.find((h) => h.id === attemptId)
      return historyItem ? { ...attempt, ...historyItem } : attempt
    }
  }
  return null
}

export function recordArchiveAttempt({
  year,
  streamId,
  subjectId,
  examTitle,
  questions = [],
  answers = {},
  durationSeconds = 0,
}) {
  const store = readStore()
  const key = makeExamKey(year, streamId, subjectId)
  const reviewed = questions.map((question) => {
    const selected = answers[question.id] ?? null
    return {
      questionId: question.id,
      number: question.number,
      text: question.text,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
      topic: question.topic,
      difficulty: question.difficulty,
      selected,
      correct: selected === question.answer,
    }
  })

  const correct = reviewed.filter((r) => r.correct).length
  const total = reviewed.length
  const percent = total ? Math.round((correct / total) * 100) : 0
  const now = new Date().toISOString()
  const attemptId = `archive-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

  const attempt = {
    id: attemptId,
    year,
    streamId,
    subjectId,
    examTitle,
    total,
    correct,
    incorrect: reviewed.filter((r) => r.selected && !r.correct).length,
    unanswered: reviewed.filter((r) => !r.selected).length,
    percent,
    durationSeconds: Math.max(0, Number(durationSeconds) || 0),
    completedAt: now,
    answers: reviewed,
  }

  const previous = store.attempts[key]
  store.attempts[key] = {
    year,
    streamId,
    subjectId,
    examTitle,
    lastAttemptId: attemptId,
    lastScore: percent,
    lastCompletedAt: now,
    bestScore: Math.max(previous?.bestScore ?? 0, percent),
    attemptCount: (previous?.attemptCount ?? 0) + 1,
    history: [attempt, ...(previous?.history ?? [])].slice(0, 10),
  }

  writeStore(store)
  return attempt
}

export function getArchiveProgressSummary() {
  const store = readStore()
  const attempts = Object.values(store.attempts)
  return {
    attemptedExams: attempts.length,
    completedExams: attempts.filter((a) => a.attemptCount > 0).length,
    averageScore: attempts.length
      ? Math.round(attempts.reduce((sum, a) => sum + (a.lastScore || 0), 0) / attempts.length)
      : 0,
    bestScore: attempts.reduce((max, a) => Math.max(max, a.bestScore || 0), 0),
  }
}

export function clearArchiveProgress() {
  try {
    getStorage()?.removeItem(ARCHIVE_PROGRESS_KEY)
    return true
  } catch {
    return false
  }
}
