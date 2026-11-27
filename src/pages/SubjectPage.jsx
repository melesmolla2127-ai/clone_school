import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/courses/EmptyState'
import PageHeader from '../components/courses/PageHeader'
import ProgressBar from '../components/courses/ProgressBar'
import UnitCard from '../components/courses/UnitCard'
import Button from '../components/common/Button'
import { getCourseContext, getSubject } from '../data/courses/courseCatalog'
import useAuth from '../hooks/useAuth'
import {
  getLearningProgress,
  getSubjectProgress,
  makeUnitKey,
  recordSubjectOpened,
} from '../services/learningProgress'
import './SubjectPage.css'

function buildSuffix(grade, stream) {
  const params = new URLSearchParams()
  if (grade) params.set('grade', grade)
  if (stream) params.set('stream', stream)
  const value = params.toString()
  return value ? `?${value}` : ''
}

function SubjectPage() {
  const { subjectId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { student } = useAuth()

  const grade = searchParams.get('grade') || student?.grade || ''
  const stream = searchParams.get('stream') || student?.stream || ''
  const context = useMemo(() => getCourseContext(student, grade, stream), [student, grade, stream])
  const subject = getSubject(context, subjectId)
  const suffix = buildSuffix(grade, stream)
  const [progress] = useState(() => {
    if (!subject) return { completed: 0, total: 8, percent: 0 }
    recordSubjectOpened({
      grade,
      stream,
      subjectId: subject.id,
      subjectTitle: subject.title,
      unitCount: subject.units.length,
    })
    return getSubjectProgress({ grade, stream, subjectId: subject.id, totalUnits: subject.units.length })
  })

  if (!subject) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Subject not found"
        message="This subject is not available for the selected grade and stream."
        actionLabel="Back to Courses"
        onAction={() => navigate('/courses')}
      />
    )
  }

  const Icon = subject.icon
  const completed = getLearningProgress().completedUnits
  const isUnitComplete = (unit) =>
    completed.includes(makeUnitKey({ grade, stream, subjectId: subject.id, unitId: unit.id }))
  const nextUnit = subject.units.find((unit) => !isUnitComplete(unit)) || subject.units[0]

  return (
    <div className="subject-page">
      <PageHeader
        kicker={context.title}
        title={subject.title}
        description={subject.description}
        action={
          <span className={`subject-page__badge subject-page__badge--${subject.tone}`} aria-hidden="true">
            <Icon size={20} />
          </span>
        }
      />

      <section className={`subject-overview subject-overview--${subject.tone}`}>
        <div className="subject-overview__copy">
          <span className="subject-overview__kicker">Subject progress</span>
          <h2>{progress.percent}% complete</h2>
          <p>
            {progress.completed} of {progress.total} units finished. Continue with the next unit whenever you are ready.
          </p>
          <ProgressBar value={progress.percent} label="Course completion" />
        </div>

        <div className="subject-overview__stats">
          <span>
            <CheckCircle2 size={16} aria-hidden="true" />
            {progress.completed} completed
          </span>
          <span>
            <BookOpen size={16} aria-hidden="true" />
            {progress.total} total units
          </span>
        </div>

        <Button
          className="subject-overview__button"
          type="button"
          icon={ArrowRight}
          onClick={() => navigate(`/courses/${subject.id}/${nextUnit.id}${suffix}`)}
        >
          Continue learning
        </Button>
      </section>

      <section className="subject-units" aria-labelledby="subject-units-title">
        <div className="subject-units__heading">
          <span className="subject-units__kicker">Learning path</span>
          <h2 id="subject-units-title">All units</h2>
          <p>Choose a unit to open notes, videos, and practice questions.</p>
        </div>

        <div className="subject-units__grid">
          {subject.units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              tone={subject.tone}
              completed={isUnitComplete(unit)}
              onOpen={() => navigate(`/courses/${subject.id}/${unit.id}${suffix}`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default SubjectPage
