import { useMemo, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Target } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/courses/EmptyState'
import PageHeader from '../components/courses/PageHeader'
import ProgressBar from '../components/courses/ProgressBar'
import ResourceTabs from '../components/courses/ResourceTabs'
import Button from '../components/common/Button'
import {
  getCourseContext,
  getKgResources,
  getSubject,
  getUnit,
  getUnitResources,
} from '../data/courses/courseCatalog'
import { getQuestionsForUnit } from '../data/questions/questionBank'
import useAuth from '../hooks/useAuth'
import {
  getLearningProgress,
  makeUnitKey,
  recordUnitCompleted,
  recordUnitOpened,
} from '../services/learningProgress'
import './UnitPage.css'

function buildSuffix(grade, stream) {
  const params = new URLSearchParams()
  if (grade) params.set('grade', grade)
  if (stream) params.set('stream', stream)
  const value = params.toString()
  return value ? `?${value}` : ''
}

function UnitPage() {
  const { subjectId, unitId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { student } = useAuth()

  const grade = searchParams.get('grade') || student?.grade || ''
  const stream = searchParams.get('stream') || student?.stream || ''
  const context = useMemo(() => getCourseContext(student, grade, stream), [student, grade, stream])
  const subject = getSubject(context, subjectId)
  const unit = getUnit(subject, unitId)
  const suffix = buildSuffix(grade, stream)

  const key = useMemo(
    () => makeUnitKey({ grade, stream, subjectId, unitId }),
    [grade, stream, subjectId, unitId],
  )

  const [completed, setCompleted] = useState(() => {
    if (!subject || !unit) return false
    recordUnitOpened({
      grade,
      stream,
      subjectId: subject.id,
      subjectTitle: subject.title,
      unitId: unit.id,
      unitTitle: unit.title,
    })
    return getLearningProgress().completedUnits.includes(key)
  })

  if (!subject || !unit) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        title="Unit not found"
        message="This unit is not available for the selected subject."
        actionLabel="Back to Courses"
        onAction={() => navigate('/courses')}
      />
    )
  }

  const resources = subject.id === 'kg-explorer' ? getKgResources() : getUnitResources(subject, unit)
  const questions = getQuestionsForUnit(context, subject, unit)
  const practicePath = `/courses/${subject.id}/${unit.id}/practice${suffix}`
  const unitProgress = completed ? 100 : 35

  const handleComplete = () => {
    recordUnitCompleted({ grade, stream, subjectId: subject.id, unitId: unit.id })
    setCompleted(true)
  }

  return (
    <div className="unit-page">
      <PageHeader
        kicker={`${subject.title} · Unit ${unit.number}`}
        title={unit.title}
        description={unit.description}
        backTo={`/courses/${subject.id}${suffix}`}
        action={
          completed ? (
            <span className="unit-page__complete-badge">
              <CheckCircle2 size={15} aria-hidden="true" />
              Completed
            </span>
          ) : null
        }
      />

      <section className="unit-progress-card">
        <div className="unit-progress-card__copy">
          <span className="unit-progress-card__kicker">Learning progress</span>
          <h2>{completed ? 'Unit complete' : 'Keep going'}</h2>
          <p>
            {completed
              ? 'Nice work. You can review the resources or try the practice questions again.'
              : 'Explore the resources below, then mark this unit complete when you are ready.'}
          </p>
        </div>
        <ProgressBar value={unitProgress} label="Unit progress" />
        {!completed && (
          <Button type="button" variant="secondary" onClick={handleComplete}>
            Mark unit complete
          </Button>
        )}
      </section>

      <section className="unit-objectives" aria-labelledby="unit-objectives-title">
        <div className="unit-objectives__heading">
          <span className="unit-objectives__icon" aria-hidden="true">
            <Target size={20} />
          </span>
          <div>
            <span className="unit-objectives__kicker">What you will learn</span>
            <h2 id="unit-objectives-title">Learning objectives</h2>
          </div>
        </div>
        <ul>
          {unit.objectives.map((objective) => (
            <li key={objective}>
              <CheckCircle2 size={15} aria-hidden="true" />
              {objective}
            </li>
          ))}
        </ul>
      </section>

      <ResourceTabs resources={resources} questions={questions} practicePath={practicePath} />
    </div>
  )
}

export default UnitPage
