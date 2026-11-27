import {
  ARCHIVE_STREAMS,
  ARCHIVE_VERIFICATION,
  CURRENT_EUEE_EC_YEAR,
  EUEE_ARCHIVE_YEARS,
  formatEcYear,
  getArchiveStream,
  getArchiveSubject,
  getSubjectsForStream,
} from './archiveCatalog.js'
import { IMPORTED_ARCHIVE_EXAMS } from './importedArchive.js'

function buildExamIndex() {
  const index = new Map()
  for (const exam of IMPORTED_ARCHIVE_EXAMS) {
    index.set(`${exam.year}:${exam.stream}:${exam.subject}`, exam)
  }
  return index
}

const EXAM_INDEX = buildExamIndex()

export function getArchiveYears() {
  return [...EUEE_ARCHIVE_YEARS].reverse()
}

export function getArchiveStreams() {
  return ARCHIVE_STREAMS
}

export function getExamRecord(year, streamId, subjectId) {
  const exam = EXAM_INDEX.get(`${year}:${streamId}:${subjectId}`)
  if (exam) {
    return {
      ...exam,
      available: true,
      questionCount: exam.questions.length,
      examYearLabel: formatEcYear(year),
      streamName: getArchiveStream(streamId)?.name ?? streamId,
      subjectName: getArchiveSubject(subjectId)?.name ?? subjectId,
    }
  }

  const stream = getArchiveStream(streamId)
  const subject = getArchiveSubject(subjectId)
  return {
    id: `${streamId}-${year}-${subjectId}`,
    year,
    stream: streamId,
    subject: subjectId,
    title: `${subject?.name ?? subjectId} Entrance Exam`,
    examYearLabel: formatEcYear(year),
    streamName: stream?.name ?? streamId,
    subjectName: subject?.name ?? subjectId,
    available: false,
    questionCount: 0,
    questions: [],
    answerKeyAvailable: false,
    source: null,
    verificationStatus: ARCHIVE_VERIFICATION.UNAVAILABLE,
    unavailableReason: 'No verified historical question data has been imported for this exam yet.',
  }
}

export function getArchiveYearSummary(year) {
  const streams = ARCHIVE_STREAMS.map((stream) => {
    const subjects = stream.subjects.map((subjectId) => {
      const record = getExamRecord(year, stream.id, subjectId)
      return {
        subjectId,
        subjectName: getArchiveSubject(subjectId)?.name ?? subjectId,
        available: record.available,
        questionCount: record.questionCount,
        verificationStatus: record.verificationStatus,
      }
    })
    return {
      ...stream,
      subjects,
      availableCount: subjects.filter((s) => s.available).length,
      totalCount: subjects.length,
    }
  })

  return {
    year,
    yearLabel: formatEcYear(year),
    streams,
    availableExams: streams.reduce((sum, s) => sum + s.availableCount, 0),
    totalExams: streams.reduce((sum, s) => sum + s.totalCount, 0),
  }
}

export function getAvailableArchiveExams() {
  return IMPORTED_ARCHIVE_EXAMS.map((exam) => getExamRecord(exam.year, exam.stream, exam.subject))
}

export function getArchiveCoverage() {
  const years = getArchiveYears()
  const totalSlots = years.length * ARCHIVE_STREAMS.reduce((sum, stream) => sum + stream.subjects.length, 0)
  const available = IMPORTED_ARCHIVE_EXAMS.length
  return {
    startYear: 2000,
    endYear: CURRENT_EUEE_EC_YEAR,
    yearCount: years.length,
    totalSlots,
    available,
    unavailable: totalSlots - available,
  }
}

export function getArchiveSubjectsForStream(streamId) {
  return getSubjectsForStream(streamId)
}

export function searchArchiveExams({ year, streamId, subjectId } = {}) {
  return getArchiveYears()
    .filter((y) => !year || y === Number(year))
    .flatMap((y) => {
      const streams = streamId ? [getArchiveStream(streamId)].filter(Boolean) : ARCHIVE_STREAMS
      return streams.flatMap((stream) => {
        const subjectIds = subjectId ? [subjectId] : stream.subjects
        return subjectIds
          .filter((sid) => stream.subjects.includes(sid))
          .map((sid) => getExamRecord(y, stream.id, sid))
      })
    })
}

export function validateArchiveImport(data) {
  const errors = []
  if (!data || typeof data !== 'object') return { ok: false, errors: ['Import data must be an object.'] }
  const required = ['year', 'stream', 'subject', 'questions']
  for (const key of required) {
    if (data[key] == null) errors.push(`Missing required field: ${key}`)
  }
  if (!Number.isInteger(data.year) || data.year < 2000 || data.year > 2100) errors.push('year must be a valid E.C. year.')
  if (data.stream && !getArchiveStream(data.stream)) errors.push(`Unknown stream: ${data.stream}`)
  if (data.subject && !getArchiveSubject(data.subject)) errors.push(`Unknown subject: ${data.subject}`)
  if (!Array.isArray(data.questions)) errors.push('questions must be an array.')
  else {
    data.questions.forEach((question, i) => {
      if (!question.text) errors.push(`Question ${i + 1}: missing text`)
      if (!Array.isArray(question.options) || question.options.length < 2) errors.push(`Question ${i + 1}: options must have at least 2 items`)
      if (question.answer == null) errors.push(`Question ${i + 1}: missing answer`)
    })
  }
  return { ok: errors.length === 0, errors }
}
