import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Clock3, Flag } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import SelectField from '../components/common/SelectField'
import TextField from '../components/common/TextField'
import EmptyState from '../components/courses/EmptyState'
import PageHeader from '../components/courses/PageHeader'
import ConfirmModal from '../components/euee/ConfirmModal'
import ExamNavigation from '../components/euee/ExamNavigation'
import QuestionCard from '../components/euee/QuestionCard'
import SubjectSelector from '../components/euee/SubjectSelector'
import { EXAM_PRESETS, getExamPreset } from '../data/euee/examPresets.js'
import { EUEE_DIFFICULTIES, EUEE_SUBJECTS } from '../data/euee/eueeSubjects.js'
import { getEueeQuestions } from '../data/euee/eueeQuestions.js'
import useNotifications from '../hooks/useNotifications.js'
import { recordEueeSession } from '../services/eueeProgress.js'
import './EUEEExamPage.css'

function parseSubjects(value) {
  if (!value) return []
  const allowed = new Set(EUEE_SUBJECTS.map((subject) => subject.id))
  return value.split(',').map((item) => item.trim()).filter((item) => allowed.has(item))
}

function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function EUEEExamPage() {
  const navigate = useNavigate()
  const { notify } = useNotifications()
  const [searchParams] = useSearchParams()
  const preset = getExamPreset(searchParams.get('preset'))
  const initialSubjects = parseSubjects(searchParams.get('subjects'))
  const initialDifficulty = EUEE_DIFFICULTIES.some((item) => item.id === searchParams.get('difficulty'))
    ? searchParams.get('difficulty')
    : (preset.difficulty === 'mixed' ? '' : preset.difficulty)
  const initialCount = Math.max(1, Math.min(30, Number(searchParams.get('count')) || preset.questionCount || 10))
  const initialDuration = Math.max(1, Math.min(120, Number(searchParams.get('duration')) || preset.durationMinutes || 10))

  const [selectedPreset, setSelectedPreset] = useState(preset.id)
  const [subjectIds, setSubjectIds] = useState(initialSubjects.length ? initialSubjects : (preset.subjectIds.length ? preset.subjectIds : [EUEE_SUBJECTS[0].id]))
  const [difficulty, setDifficulty] = useState(initialDifficulty)
  const [count, setCount] = useState(String(initialCount))
  const [durationMinutes, setDurationMinutes] = useState(String(initialDuration))
  const [phase, setPhase] = useState('setup')
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(initialDuration * 60)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const startedAtRef = useRef(null)

  const current = questions[index]
  const answeredCount = Object.keys(answers).length
  const markedCount = marked.size
  const unansweredCount = Math.max(0, questions.length - answeredCount)
  const warning = phase === 'exam' && timeLeft <= Math.max(60, Math.floor((Number(durationMinutes) || 1) * 60 * 0.25))

  const submitExamRef = useRef(() => {})

  const submitExam = useCallback((auto = false) => {
    if (submitted || !questions.length) return
    setSubmitted(true)
    setConfirmOpen(false)
    const elapsed = startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : (Number(durationMinutes) || 10) * 60
    const durationSeconds = Math.max(1, Math.min((Number(durationMinutes) || 10) * 60, elapsed))
    const selectedSubjects = subjectIds.length ? subjectIds : EUEE_SUBJECTS.map((subject) => subject.id)
    const result = recordEueeSession({
      type: 'exam',
      title: EXAM_PRESETS.find((item) => item.id === selectedPreset)?.title || 'EUEE Mock Exam',
      subjectIds: selectedSubjects,
      difficulty: difficulty || 'mixed',
      topics: [...new Set(questions.map((question) => question.topic))],
      questions,
      answers,
      durationSeconds,
    })
    notify({
      category: 'euee',
      title: auto ? 'Exam auto-submitted' : 'Exam submitted',
      message: `You scored ${result.session.percent}% on ${result.session.title}.`,
      actionPath: `/euee/results/${result.session.id}`,
      iconName: 'GraduationCap',
      eventKey: `euee-exam-${result.session.id}`,
    })
    navigate(`/euee/results/${result.session.id}`, { replace: true })
  }, [answers, difficulty, durationMinutes, navigate, notify, questions, selectedPreset, subjectIds, submitted])

  useEffect(() => {
    submitExamRef.current = submitExam
  }, [submitExam])

  useEffect(() => {
    if (phase !== 'exam' || submitted) return undefined
    const timer = globalThis.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          globalThis.clearInterval(timer)
          globalThis.setTimeout(() => submitExamRef.current(true), 0)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => globalThis.clearInterval(timer)
  }, [phase, submitted])

  const applyPreset = (presetId) => {
    const next = getExamPreset(presetId)
    setSelectedPreset(next.id)
    setSubjectIds(next.subjectIds.length ? next.subjectIds : [EUEE_SUBJECTS[0].id])
    setDifficulty(next.difficulty === 'mixed' ? '' : next.difficulty)
    setCount(String(next.questionCount))
    setDurationMinutes(String(next.durationMinutes))
  }

  const startExam = () => {
    const selectedSubjects = subjectIds.length ? subjectIds : EUEE_SUBJECTS.map((subject) => subject.id)
    const nextQuestions = getEueeQuestions({
      subjectIds: selectedSubjects,
      difficulties: difficulty ? [difficulty] : [],
      count: Number(count) || 10,
    })
    if (!nextQuestions.length) {
      setPhase('empty')
      return
    }
    setQuestions(nextQuestions)
    setIndex(0)
    setAnswers({})
    setMarked(new Set())
    setSubmitted(false)
    setConfirmOpen(false)
    setTimeLeft(Math.max(60, (Number(durationMinutes) || 10) * 60))
    startedAtRef.current = Date.now()
    setPhase('exam')
  }

  const selectAnswer = (option) => {
    if (!current || submitted) return
    setAnswers((prev) => ({ ...prev, [current.id]: option }))
  }

  const toggleMark = () => {
    if (!current) return
    setMarked((prev) => {
      const next = new Set(prev)
      if (next.has(current.id)) next.delete(current.id)
      else next.add(current.id)
      return next
    })
  }

  const examTitle = useMemo(() => EXAM_PRESETS.find((item) => item.id === selectedPreset)?.title || 'Mock Exam', [selectedPreset])

  return (
    <div className="euee-exam-page">
      <PageHeader
        kicker="EUEE exam"
        title="Mock exam"
        description="Take a timed exam simulation with realistic navigation, review marking, and automatic submission."
        backTo="/euee"
      />

      {phase === 'setup' && (
        <section className="euee-panel euee-exam-setup">
          <div className="euee-exam-presets">
            {EXAM_PRESETS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`euee-exam-preset ${selectedPreset === item.id ? 'euee-exam-preset--active' : ''}`}
                onClick={() => applyPreset(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.description}</span>
                <small>{item.questionCount} questions · {item.durationMinutes} min</small>
              </button>
            ))}
          </div>
          <div className="euee-practice-setup__grid">
            <SubjectSelector selectedIds={subjectIds} onChange={setSubjectIds} />
            <div className="euee-practice-setup__fields">
              <SelectField
                id="exam-difficulty"
                label="Difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                options={[{ value: '', label: 'Mixed difficulty' }, ...EUEE_DIFFICULTIES.map((item) => ({ value: item.id, label: item.label }))]}
                placeholder="Mixed difficulty"
              />
              <TextField id="exam-count" label="Question count" type="number" min="1" max="30" value={count} onChange={(event) => setCount(event.target.value)} />
              <TextField id="exam-duration" label="Duration (minutes)" type="number" min="1" max="120" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} />
            </div>
          </div>
          <div className="euee-practice-setup__actions">
            <Button type="button" onClick={startExam}>Start exam</Button>
          </div>
        </section>
      )}

      {phase === 'empty' && (
        <EmptyState
          icon={Clock3}
          title="No exam questions found"
          message="Try selecting different subjects or difficulty."
          actionLabel="Back to EUEE dashboard"
          onAction={() => navigate('/euee')}
        />
      )}

      {phase === 'exam' && current && (
        <section className="euee-exam-session">
          <div className="euee-exam-topbar">
            <div>
              <span className="euee-section__kicker">{examTitle}</span>
              <h2>Question {index + 1} of {questions.length}</h2>
            </div>
            <div className={`euee-exam-timer ${warning ? 'euee-exam-timer--warning' : ''}`} aria-live="polite">
              <Clock3 size={16} aria-hidden="true" />
              <div>
                <span>Time remaining</span>
                <strong>{formatTime(timeLeft)}</strong>
              </div>
            </div>
          </div>

          <div className="euee-exam-layout">
            <div className="euee-exam-main">
              <QuestionCard question={current} selected={answers[current.id]} onSelect={selectAnswer} disabled={submitted} />
              <div className="euee-exam-actions">
                <Button type="button" variant="secondary" icon={ArrowLeft} onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>Previous</Button>
                <Button type="button" variant="secondary" icon={Flag} onClick={toggleMark}>
                  {marked.has(current.id) ? 'Marked for review' : 'Mark for review'}
                </Button>
                <Button type="button" icon={ArrowRight} onClick={() => setIndex((value) => Math.min(questions.length - 1, value + 1))} disabled={index === questions.length - 1}>Next</Button>
              </div>
              <div className="euee-exam-submit">
                <Button type="button" onClick={() => setConfirmOpen(true)}>Submit exam</Button>
              </div>
            </div>
            <ExamNavigation questions={questions} currentIndex={index} answers={answers} marked={marked} onJump={setIndex} />
          </div>

          <ConfirmModal
            open={confirmOpen}
            title="Confirm submission"
            message="Review your exam status before submitting. After submission, answers will be locked."
            details={[
              { label: 'Answered', value: answeredCount },
              { label: 'Unanswered', value: unansweredCount },
              { label: 'Marked for review', value: markedCount },
            ]}
            confirmLabel="Submit exam"
            cancelLabel="Return to exam"
            onConfirm={() => submitExam(false)}
            onCancel={() => setConfirmOpen(false)}
          />
        </section>
      )}
    </div>
  )
}

export default EUEEExamPage
