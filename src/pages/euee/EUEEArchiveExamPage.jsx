import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import EmptyState from '../../components/courses/EmptyState'
import PageHeader from '../../components/courses/PageHeader'
import ConfirmModal from '../../components/euee/ConfirmModal'
import ExamNavigation from '../../components/euee/ExamNavigation'
import QuestionCard from '../../components/euee/QuestionCard'
import { getArchiveStream, getArchiveSubject } from '../../data/euee/archive/archiveCatalog.js'
import { getExamRecord } from '../../data/euee/archive/eueeArchive.js'
import { recordArchiveAttempt } from '../../services/eueeArchiveService.js'
import './EUEEArchiveExamPage.css'

function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function EUEEArchiveExamPage() {
  const { year: yearParam, streamId, subjectId } = useParams()
  const year = Number(yearParam)
  const navigate = useNavigate()
  const exam = useMemo(() => getExamRecord(year, streamId, subjectId), [year, streamId, subjectId])
  const stream = getArchiveStream(streamId)
  const subject = getArchiveSubject(subjectId)

  const [phase, setPhase] = useState(exam.available ? 'intro' : 'unavailable')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState(new Set())
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [timeLeft, setTimeLeft] = useState(30 * 60)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const startedAtRef = useRef(null)
  const submitRef = useRef(() => {})

  const questions = exam.questions ?? []
  const current = questions[index]
  const answeredCount = Object.keys(answers).length
  const unanswered = Math.max(0, questions.length - answeredCount)

  const submitExam = (auto = false) => {
    if (submitted || !questions.length) return
    setSubmitted(true)
    setConfirmOpen(false)
    const elapsed = startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : 0
    const attempt = recordArchiveAttempt({
      year,
      streamId,
      subjectId,
      examTitle: exam.title,
      questions,
      answers,
      durationSeconds: timerEnabled ? Math.max(1, elapsed) : elapsed,
    })
    navigate(`/euee/archive/results/${attempt.id}`, {
      replace: true,
      state: { autoSubmitted: auto, year, streamId, subjectId },
    })
  }

  useEffect(() => {
    submitRef.current = submitExam
  })

  useEffect(() => {
    if (phase !== 'exam' || !timerEnabled || submitted) return undefined
    const timer = globalThis.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          globalThis.clearInterval(timer)
          globalThis.setTimeout(() => submitRef.current?.(true), 0)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => globalThis.clearInterval(timer)
  }, [phase, timerEnabled, submitted])

  const startExam = () => {
    setPhase('exam')
    setIndex(0)
    setAnswers({})
    setMarked(new Set())
    setSubmitted(false)
    setTimeLeft(Math.max(5, questions.length * 2) * 60)
    startedAtRef.current = Date.now()
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

  const backToArchive = () => navigate('/euee/archive')

  if (!stream || !subject || !Number.isInteger(year)) {
    return (
      <div className="archive-exam-page">
        <PageHeader kicker="Historical archive" title="Exam not found" description="The requested archive exam could not be found." backTo="/euee/archive" />
        <EmptyState icon={AlertTriangle} title="Invalid archive exam" message="Check the year, stream, and subject." actionLabel="Back to archive" onAction={backToArchive} />
      </div>
    )
  }

  if (!exam.available) {
    return (
      <div className="archive-exam-page">
        <PageHeader kicker="Historical archive" title={`${subject.name} ${exam.examYearLabel}`} description={`${stream.name} ? ${exam.verificationStatus}`} backTo="/euee/archive" />
        <EmptyState
          icon={AlertTriangle}
          title="Archive unavailable"
          message={`This ${exam.examYearLabel} ${subject.name} exam has no verified imported questions yet. The year remains visible so it can be populated when trustworthy data is available.`}
          actionLabel="Back to archive"
          onAction={backToArchive}
        />
      </div>
    )
  }

  return (
    <div className="archive-exam-page">
      <PageHeader
        kicker="Historical archive"
        title={`${subject.name} ${exam.examYearLabel}`}
        description={`${stream.name} ? ${exam.verificationStatus}`}
        backTo="/euee/archive"
      />

      {phase === 'intro' && (
        <section className="euee-panel archive-exam-intro">
          <div className="archive-exam-intro__grid">
            <div>
              <span className="euee-section__kicker">Exam details</span>
              <h2>{exam.title}</h2>
              <dl className="archive-exam-details">
                <div><dt>Exam year</dt><dd>{exam.examYearLabel}</dd></div>
                <div><dt>Stream</dt><dd>{stream.name}</dd></div>
                <div><dt>Subject</dt><dd>{subject.name}</dd></div>
                <div><dt>Questions</dt><dd>{questions.length}</dd></div>
                <div><dt>Verification</dt><dd>{exam.verificationStatus}</dd></div>
                <div><dt>Answer key</dt><dd>{exam.answerKeyAvailable ? 'Available' : 'Not available'}</dd></div>
              </dl>
              {exam.source && (
                <p className="archive-exam-source">Source: {exam.source.name}{exam.source.url ? ` (${exam.source.url})` : ''}. {exam.source.note}</p>
              )}
            </div>
            <div className="archive-exam-start">
              <h3>Ready to practice?</h3>
              <p>Answer questions, navigate freely, mark questions for review, and submit when finished.</p>
              <label className="archive-timer-toggle">
                <input type="checkbox" checked={timerEnabled} onChange={(e) => setTimerEnabled(e.target.checked)} />
                Enable timer
              </label>
              <Button type="button" onClick={startExam}>Start exam</Button>
            </div>
          </div>
        </section>
      )}

      {phase === 'exam' && current && (
        <section className="euee-exam-session">
          <div className="euee-exam-topbar">
            <div>
              <span className="euee-section__kicker">{exam.examYearLabel} ? {subject.name}</span>
              <h2>Question {index + 1} of {questions.length}</h2>
            </div>
            <div className={`euee-exam-timer ${timerEnabled && timeLeft <= 300 ? 'euee-exam-timer--warning' : ''}`} aria-live="polite">
              <Clock3 size={16} aria-hidden="true" />
              <div>
                <span>{timerEnabled ? 'Time remaining' : 'Timer'}</span>
                <strong>{timerEnabled ? formatTime(timeLeft) : 'Off'}</strong>
              </div>
            </div>
          </div>

          <div className="euee-exam-layout">
            <div className="euee-exam-main">
              <QuestionCard question={current} selected={answers[current.id]} onSelect={selectAnswer} disabled={submitted} />
              <div className="euee-exam-actions">
                <Button type="button" variant="secondary" icon={ArrowLeft} onClick={() => setIndex((v) => Math.max(0, v - 1))} disabled={index === 0}>Previous</Button>
                <Button type="button" variant="secondary" onClick={toggleMark}>{marked.has(current.id) ? 'Marked for review' : 'Mark for review'}</Button>
                <Button type="button" icon={ArrowRight} onClick={() => setIndex((v) => Math.min(questions.length - 1, v + 1))} disabled={index === questions.length - 1}>Next</Button>
              </div>
              <div className="euee-exam-submit">
                <Button type="button" onClick={() => setConfirmOpen(true)}><CheckCircle2 size={16} aria-hidden="true" /> Submit exam</Button>
              </div>
            </div>
            <ExamNavigation questions={questions} currentIndex={index} answers={answers} marked={marked} onJump={setIndex} />
          </div>

          <ConfirmModal
            open={confirmOpen}
            title="Submit archive exam?"
            message="Review your status before submitting. You can retake the exam later."
            details={[
              { label: 'Answered', value: answeredCount },
              { label: 'Unanswered', value: unanswered },
              { label: 'Marked for review', value: marked.size },
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

export default EUEEArchiveExamPage
