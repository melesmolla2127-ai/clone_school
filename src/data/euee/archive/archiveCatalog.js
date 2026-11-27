function getCurrentEcYear() {
  const now = new Date()
  const gcYear = now.getFullYear()
  const gcMonth = now.getMonth() + 1
  const gcDay = now.getDate()
  // Ethiopian New Year is around Sep 11/12; EC = GC - 7 or -8 depending on date.
  const isAfterNewYear = gcMonth > 9 || (gcMonth === 9 && gcDay >= 11)
  return isAfterNewYear ? gcYear - 7 : gcYear - 8
}

export const CURRENT_EUEE_EC_YEAR = getCurrentEcYear()

export const EUEE_ARCHIVE_YEARS = Array.from(
  { length: Math.max(1, CURRENT_EUEE_EC_YEAR - 2000 + 1) },
  (_, index) => 2000 + index,
)

export const ARCHIVE_STREAMS = [
  {
    id: 'natural-science',
    name: 'Natural Science',
    description: 'Practice historical entrance exams for Natural Science subjects.',
    subjects: ['mathematics', 'english', 'physics', 'chemistry', 'biology'],
  },
  {
    id: 'social-science',
    name: 'Social Science',
    description: 'Practice historical entrance exams for Social Science subjects.',
    subjects: ['mathematics', 'english', 'history', 'geography', 'economics'],
  },
]

export const ARCHIVE_SUBJECTS = {
  mathematics: { id: 'mathematics', name: 'Mathematics', short: 'Math' },
  english: { id: 'english', name: 'English', short: 'English' },
  physics: { id: 'physics', name: 'Physics', short: 'Physics' },
  chemistry: { id: 'chemistry', name: 'Chemistry', short: 'Chemistry' },
  biology: { id: 'biology', name: 'Biology', short: 'Biology' },
  history: { id: 'history', name: 'History', short: 'History' },
  geography: { id: 'geography', name: 'Geography', short: 'Geography' },
  economics: { id: 'economics', name: 'Economics', short: 'Economics' },
}

export const ARCHIVE_VERIFICATION = {
  VERIFIED_OFFICIAL: 'Verified official source',
  VERIFIED_PUBLIC: 'Verified public source',
  IMPORTED_UNVERIFIED: 'Imported but not fully verified',
  DEMO: 'Demo questions',
  UNAVAILABLE: 'Archive unavailable',
}

export function formatEcYear(year) {
  return `${year} E.C.`
}

export function getArchiveStream(streamId) {
  return ARCHIVE_STREAMS.find((stream) => stream.id === streamId) ?? null
}

export function getArchiveSubject(subjectId) {
  return ARCHIVE_SUBJECTS[subjectId] ?? null
}

export function getSubjectsForStream(streamId) {
  const stream = getArchiveStream(streamId)
  return (stream?.subjects ?? []).map((id) => ARCHIVE_SUBJECTS[id]).filter(Boolean)
}
