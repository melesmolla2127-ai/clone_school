import { useMemo, useState } from 'react'
import { ArrowRight, Check, CheckCircle2, ClipboardList, RotateCcw, X, XCircle } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/courses/EmptyState'
import PageHeader from '../components/courses/PageHeader'
import ProgressBar from '../components/courses/ProgressBar'
import Button from '../components/common/Button'
import { getCourseContext, getSubject, getUnit } from '../data/courses/courseCatalog'
import { getQuestionsForUnit } from '../data/questions/questionBank'
import useAuth from '../hooks/useAuth'
import { recordQuestionResult, recordUnitCompleted } from '../services/learningProgress'
import './QuestionPracticePage.css'

function PracticePage() {
  const { subjectId, unitId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { student } = useAuth()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const grade = searchParams.get('grade') || student?.grade || ''
  const stream = searchParams.get('stream') || student?.stream || ''
  const context = useMemo(() => getCourseContext(student, grade, stream), [student, grade, stream])
  const subject = getSubject(context, subjectId)
  const unit = getUnit(subject, unitId)
  const questions = useMemo(
    () => getQuestionsForUnit(context, subject, unit),
    [context, subject, unit],
  )

  if (!subject || !unit || questions.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Practice is not available"
        message="Choose a subject and unit from your course to start practising."
        actionLabel="Back to Courses"
        onAction={() => navigate('/courses')}
      />
    )
  }

  const question = questions[index]
  const score = answers.filter(Boolean).length
  const progress = Math.round((index / questions.length) * 100)
  const isCorrect = checked && selected === question.correctIndex

  const handleCheck = () => {
    if (selected === null || checked) return
    const correct = selected === question.correctIndex
    setChecked(true)
    setAnswers((current) => [...current, correct])
    recordQuestionResult(correct)
  }

  const handleNext = () => {
    if (index + 1 < questions.length) {
      setIndex((current) => current + 1)
      setSelected(null)
      setChecked(false)
      return
    }

    if (score >= Math.ceil(questions.length / 2)) {
      recordUnitCompleted({ grade, stream, subjectId: subject.id, unitId: unit.id })
    }
    setFinished(true)
  }

  const handleRetry = () => {
    setIndex(0)
    setSelected(null)
    setChecked(false)
    setAnswers([])
    setFinished(false)
  }

  const suffix = new URLSearchParams(searchParams).toString()
  const backTo = `/courses/${subject.id}/${unit.id}${suffix ? `?${suffix}` : ''}`

  if (finished) {
    const perfect = score === questions.length
    return (
      <div className="practice-page">
        <PageHeader
          kicker={`${subject.title} · Unit ${unit.number}`}
          title="Practice complete"
          description="Here is how you did in this short practice session."
          backTo={backTo}
        />

        <section className="practice-summary">
          <span className={`practice-summary__icon ${perfect ? 'practice-summary__icon--perfect' : ''}`} aria-hidden="true">
            {perfect ? <CheckCircle2 size={32} /> : <ClipboardList size={32} />}
          </span>
          <h2>{score} / {questions.length} correct</h2>
          <p>
            {perfect
              ? 'Excellent work — a perfect practice round!'
              : score >= Math.ceil(questions.length / 2)
                ? 'Well done. This unit is marked complete.'
                : 'Keep practising to complete this unit.'}
          </p>
          <ProgressBar value={Math.round((score / questions.length) * 100)} label="Accuracy" />
          <div className="practice-summary__actions">
            <Button type="button" icon={RotateCcw} onClick={handleRetry}>
              Try again
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(backTo)}>
              Back to unit
            </Button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="practice-page">
      <PageHeader
        kicker={`${subject.title} · Unit ${unit.number}`}
        title="Practice questions"
        description="Read each question, choose an answer, and check your understanding."
        backTo={backTo}
      />

      <section className="practice-session">
        <div className="practice-session__meta">
          <span>Question {index + 1} of {questions.length}</span>
          <strong>Score {score}</strong>
        </div>
        <ProgressBar value={progress} showValue={false} />

        <article className="practice-question">
          <span className="practice-question__type">{question.type}</span>
          <h2>{question.prompt}</h2>

          <div className="practice-question__choices">
            {question.choices.map((choice, choiceIndex) => {
              const isSelected = selected === choiceIndex
              const isRight = checked && choiceIndex === question.correctIndex
              const isWrong = checked && isSelected && choiceIndex !== question.correctIndex
              const className = [
                'practice-choice',
                isSelected && 'practice-choice--selected',
                isRight && 'practice-choice--right',
                isWrong && 'practice-choice--wrong',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <button
                  className={className}
                  key={`${question.id}-${choiceIndex}`}
                  type="button"
                  disabled={checked}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(choiceIndex)}
                >
                  <span className="practice-choice__letter">{String.fromCharCode(65 + choiceIndex)}</span>
                  <span>{choice}</span>
                  {isRight && <Check size={16} aria-hidden="true" />}
                  {isWrong && <X size={16} aria-hidden="true" />}
                </button>
              )
            })}
          </div>

          {checked && (
            <div className={`practice-feedback ${isCorrect ? 'practice-feedback--correct' : 'practice-feedback--incorrect'}`}>
              <span aria-hidden="true">
                {isCorrect ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
              </span>
              <div>
                <strong>{isCorrect ? 'Correct!' : 'Not quite'}</strong>
                <p>{question.explanation}</p>
              </div>
            </div>
          )}

          <div className="practice-question__actions">
            {!checked ? (
              <Button type="button" disabled={selected === null} onClick={handleCheck}>
                Check answer
              </Button>
            ) : (
              <Button type="button" icon={ArrowRight} onClick={handleNext}>
                {index + 1 === questions.length ? 'Finish practice' : 'Next question'}
              </Button>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}

export default PracticePage
