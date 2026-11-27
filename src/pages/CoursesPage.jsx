import { useMemo, useState } from 'react'
import { BookOpen, CircleHelp, ClipboardList, Lock, Search, Sparkles, TrendingUp } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/courses/EmptyState'
import ProgressBar from '../components/courses/ProgressBar'
import SubjectCard from '../components/courses/SubjectCard'
import Button from '../components/common/Button'
import SelectField from '../components/common/SelectField'
import TextField from '../components/common/TextField'
import { getCourseContext, getLevelBadge } from '../data/courses/courseCatalog'
import { GRADE_OPTIONS, STREAM_OPTIONS, getGradeLabel } from '../data/options.js'
import useAuth from '../hooks/useAuth'
import {
  getCourseCompletion,
  getLastStudied,
  getQuestionAccuracy,
  getSubjectProgress,
} from '../services/learningProgress'
import './CoursesPage.css'

function buildPathParams(grade, stream) {
  const params = new URLSearchParams()
  if (grade) params.set('grade', grade)
  if (stream) params.set('stream', stream)
  const value = params.toString()
  return value ? `?${value}` : ''
}

function CoursesPage() {
  const { student } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')

  const selectedGrade = searchParams.get('grade') || student?.grade || ''
  const selectedStream = searchParams.get('stream') || student?.stream || ''
  const context = useMemo(
    () => getCourseContext(student, selectedGrade, selectedStream),
    [student, selectedGrade, selectedStream],
  )

  const overall = useMemo(() => getCourseCompletion(context.totalUnits), [context.totalUnits])
  const accuracy = getQuestionAccuracy()
  const lastStudied = getLastStudied()
  const pathSuffix = buildPathParams(context.grade, context.stream)
  const filteredSubjects = context.subjects.filter((subject) =>
    subject.title.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key === 'grade') next.delete('stream')
    setSearchParams(next)
  }

  const openSubject = (subject) => navigate(`/courses/${subject.id}${pathSuffix}`)
  const openLastStudied = () => {
    if (!lastStudied?.subjectId) return
    const unit = lastStudied.unitId ? `/${lastStudied.unitId}` : ''
    navigate(
      `/courses/${lastStudied.subjectId}${unit}${buildPathParams(lastStudied.grade, lastStudied.stream)}`,
    )
  }

  return (
    <div className="courses-page">
      <header className="courses-hero">
        <div>
          <span className="courses-hero__kicker">Your learning path</span>
          <h1>Welcome back, {student?.firstName || 'Student'}</h1>
          <p>
            {context.grade
              ? `${getGradeLabel(context.grade)}${context.stream ? ` · ${context.stream}` : ''}`
              : 'Choose your grade to see the right courses.'}
          </p>
        </div>
        <span className="courses-hero__badge">
          <Sparkles size={14} aria-hidden="true" />
          {getLevelBadge(context.level)}
        </span>
      </header>

      {context.level === 'secondary' && (
        <div className="grade-switcher" aria-label="Choose grade">
          <span>Viewing</span>
          {['9', '10'].map((grade) => (
            <button
              key={grade}
              type="button"
              className={context.grade === grade ? 'grade-switcher__option grade-switcher__option--active' : 'grade-switcher__option'}
              onClick={() => updateParam('grade', grade)}
            >
              Grade {grade}
            </button>
          ))}
        </div>
      )}

      {!context.level && (
        <EmptyState
          icon={CircleHelp}
          title="We could not detect your grade"
          message="Select a grade below and we will show the courses that match your learning level."
        >
          <div className="courses-selection">
            <SelectField
              id="courses-grade"
              label="Your grade"
              options={GRADE_OPTIONS}
              placeholder="Select grade"
              value={selectedGrade}
              onChange={(event) => updateParam('grade', event.target.value)}
            />
          </div>
        </EmptyState>
      )}

      {context.needsStreamSelection && (
        <EmptyState
          icon={BookOpen}
          title="Choose your stream"
          message={`Grade ${context.grade} courses depend on your academic stream. Select one to continue.`}
        >
          <div className="courses-selection">
            <SelectField
              id="courses-stream"
              label="Academic stream"
              options={STREAM_OPTIONS}
              placeholder="Select stream"
              value={selectedStream}
              onChange={(event) => updateParam('stream', event.target.value)}
            />
          </div>
        </EmptyState>
      )}

      {context.level && !context.needsStreamSelection && (
        <>
          <section className="courses-overview" aria-labelledby="courses-overview-title">
            <div className="courses-overview__ring" style={{ '--progress': `${overall.percent}%` }}>
              <span>{overall.percent}%</span>
            </div>
            <div className="courses-overview__copy">
              <span className="courses-overview__kicker">Course progress</span>
              <h2 id="courses-overview-title">You are building steady momentum</h2>
              <p>
                {overall.completed} of {overall.total} units completed across {context.subjects.length} subjects.
              </p>
              <ProgressBar value={overall.percent} showValue={false} />
            </div>
            <div className="courses-overview__stats">
              <span><BookOpen size={16} aria-hidden="true" /> {context.subjects.length} subjects</span>
              <span><ClipboardList size={16} aria-hidden="true" /> {accuracy}% accuracy</span>
              <span><TrendingUp size={16} aria-hidden="true" /> {overall.completed} units done</span>
            </div>
          </section>

          <section className="courses-recent" aria-labelledby="courses-recent-title">
            <div className="courses-section-heading">
              <div>
                <span className="courses-section-heading__kicker">Jump back in</span>
                <h2 id="courses-recent-title">Recently studied</h2>
              </div>
              {lastStudied?.subjectId && (
                <Button type="button" variant="secondary" onClick={openLastStudied}>
                  Continue
                </Button>
              )}
            </div>

            {lastStudied?.subjectId ? (
              <button className="courses-recent__card" type="button" onClick={openLastStudied}>
                <span className="courses-recent__icon" aria-hidden="true">
                  <BookOpen size={21} />
                </span>
                <span className="courses-recent__copy">
                  <strong>{lastStudied.subjectTitle}</strong>
                  <small>{lastStudied.unitTitle || 'Open your last subject'}</small>
                </span>
                <span className="courses-recent__meta">
                  {getSubjectProgress({
                    grade: lastStudied.grade,
                    stream: lastStudied.stream,
                    subjectId: lastStudied.subjectId,
                    totalUnits: lastStudied.totalUnits || 8,
                  }).percent}%
                </span>
              </button>
            ) : (
              <div className="courses-recent__empty">
                Start a subject and it will appear here so you can continue quickly.
              </div>
            )}
          </section>

          <section className="courses-subjects" aria-labelledby="courses-subjects-title">
            <div className="courses-section-heading">
              <div>
                <span className="courses-section-heading__kicker">{context.title}</span>
                <h2 id="courses-subjects-title">Subjects</h2>
              </div>
              <TextField
                id="course-search"
                className="courses-search"
                icon={Search}
                label="Search subjects"
                placeholder="Search subjects"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {filteredSubjects.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No subjects found"
                message="Try a different search term. Your subjects are organized by grade and stream."
              />
            ) : (
              <div className="courses-subjects__grid">
                {filteredSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    progress={getSubjectProgress({
                      grade: context.grade,
                      stream: context.stream,
                      subjectId: subject.id,
                      totalUnits: subject.units.length,
                    })}
                    onClick={() => openSubject(subject)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="courses-scholar" aria-labelledby="scholar-course-title">
            <div className="courses-section-heading">
              <div>
                <span className="courses-section-heading__kicker">Advanced opportunity</span>
                <h2 id="scholar-course-title">Scholar Course</h2>
              </div>
              <span className="courses-scholar__status"><Lock size={13} aria-hidden="true" /> Locked</span>
            </div>
            <button type="button" className="courses-scholar__card" onClick={() => navigate('/courses/scholar')}>
              <span className="courses-scholar__glow" aria-hidden="true" />
              <span className="courses-scholar__icon" aria-hidden="true"><Sparkles size={24} /></span>
              <span className="courses-scholar__copy">
                <strong>Scholar Course</strong>
                <span className="courses-scholar__label">Advanced Academic Learning</span>
                <small>Take your learning beyond the classroom. Explore advanced topics, challenge your thinking, and develop deeper academic knowledge.</small>
                <span className="courses-scholar__tags">
                  <span>Advanced topics</span>
                  <span>Critical thinking</span>
                  <span>Coming soon</span>
                </span>
              </span>
              <span className="courses-scholar__lock" aria-hidden="true"><Lock size={20} /></span>
            </button>
          </section>
        </>
      )}
    </div>
  )
}

export default CoursesPage
