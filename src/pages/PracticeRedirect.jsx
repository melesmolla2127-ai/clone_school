import { Navigate } from 'react-router-dom'
import { getCourseContext } from '../data/courses/courseCatalog'
import useAuth from '../hooks/useAuth'
import { getLastStudied } from '../services/learningProgress'

function buildPracticePath(grade, stream, subjectId, unitId) {
  const params = new URLSearchParams()
  if (grade) params.set('grade', grade)
  if (stream) params.set('stream', stream)
  const suffix = params.toString()
  return `/courses/${subjectId}/${unitId}/practice${suffix ? `?${suffix}` : ''}`
}

function PracticeRedirect() {
  const { student } = useAuth()
  const lastStudied = getLastStudied()

  if (lastStudied?.subjectId && lastStudied?.unitId) {
    return <Navigate to={buildPracticePath(lastStudied.grade, lastStudied.stream, lastStudied.subjectId, lastStudied.unitId)} replace />
  }

  const context = getCourseContext(student)
  if (!context.level || context.needsStreamSelection || context.subjects.length === 0) {
    return <Navigate to="/courses" replace />
  }

  const subject = context.subjects[0]
  const unit = subject.units[0]
  return <Navigate to={buildPracticePath(context.grade, context.stream, subject.id, unit.id)} replace />
}

export default PracticeRedirect
