import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import SelectField from '../components/common/SelectField'
import TextField from '../components/common/TextField'
import EmptyState from '../components/courses/EmptyState'
import PageHeader from '../components/courses/PageHeader'
import ProgressBar from '../components/courses/ProgressBar'
import QuestionCard from '../components/euee/QuestionCard'
import SubjectSelector from '../components/euee/SubjectSelector'
import { EUEE_DIFFICULTIES, EUEE_SUBJECTS } from '../data/euee/eueeSubjects.js'
import { getEueeQuestions, getTopicsForSubjects } from '../data/euee/eueeQuestions.js'
import { getEueeHistory, recordEueeSession } from '../services/eueeProgress.js'
import './EUEEPracticePage.css'

function parseSubjects(value) {
  if (!value) return []
  const allowed = new Set(EUEE_SUBJECTS.map((subject) => subject.id))
  return value.split(',').map((item) => item.trim()).filter((item) => allowed.has(item))
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function EUEEPracticePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialSubjects = parseSubjects(searchParams.get('subjects'))
  const initialDifficulty = EUEE_DIFFICULTIES.some((item) => item.id === searchParams.get('difficulty')) ? searchParams.get('difficulty') : ''
  const initialCount = Math.max(1, Math.min(30, Number(searchParams.get('count')) || 5))

  const [subjectIds, setSubjectIds] = useState(initialSubjects.length ? initialSubjects : [EUEE_SUBJECTS[0].id])
  const [difficulty, setDifficulty] = useState(initialDifficulty)
  const [topic, setTopic] = useState(searchParams.get('topic') || '')
  const [count, setCount] = useState(String(initialCount))
  const [phase, setPhase] = useState('setup')
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [saved, setSaved] = useState(false)

  const topics = useMemo(() => getTopicsForSubjects(subjectIds), [subjectIds])
  const history = useMemo(() => (phase === 'setup' ? getEueeHistory('practice').slice(0, 5) : []), [phase])
  const current = questions[index]
  const answeredCount = Object.keys(checked).length
  const score = questions.filter((question) => checked[question.id] && answers[question.id] === question.answer).length
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0

  const startPractice = () => {
    const selectedSubjects = subjectIds.length ? subjectIds : EUEE_SUBJECTS.map((subject) => subject.id)
    const nextQuestions = getEueeQuestions({
      subjectIds: selectedSubjects,
      topics: topic ? [topic] : [],
      difficulties: difficulty ? [difficulty] : [],
      count: Number(count) || 5,
    })
    setQuestions(nextQuestions)
    setIndex(0)
    setAnswers({})
    setChecked({})
    setSaved(false)
    setPhase(nextQuestions.length ? 'session' : 'empty')
  }

  const selectAnswer = (option) => {
    if (!current || checked[current.id]) return
    setAnswers((prev) => ({ ...prev, [current.id]: option }))
  }

  const checkAnswer = () => {
    if (!current || !answers[current.id] || checked[current.id]) return
    setChecked((prev) => ({ ...prev, [current.id]: true }))
  }

  const finishSession = () => {
    if (!saved) {
      recordEueeSession({
        type: 'practice',
        title: 'EUEE Practice Session',
        subjectIds: subjectIds.length ? subjectIds : EUEE_SUBJECTS.map((subject) => subject.id),
        difficulty: difficulty || 'mixed',
        topics: topic ? [topic] : [],
        questions,
        answers,
      })
      setSaved(true)
    }
    setPhase('complete')
  }

  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex((value) => value + 1)
      return
    }
    finishSession()
  }

  const retry = () => {
    setPhase('setup')
    setQuestions([])
    setIndex(0)
    setAnswers({})
    setChecked({})
    setSaved(false)
  }

  return (
    <div className="euee-practice-page">
      <PageHeader
        kicker="EUEE practice"
        title="Practice session"
        description="Build confidence with focused practice questions, instant feedback, and clear explanations."
        backTo="/euee"
      />

      {phase === 'setup' && (
        <section className="euee-panel euee-practice-setup">
          <div className="euee-practice-setup__grid">
            <SubjectSelector selectedIds={subjectIds} onChange={setSubjectIds} />
            <div className="euee-practice-setup__fields">
              <SelectField
                id="practice-topic"
                label="Topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                options={[{ value: '', label: 'All topics' }, ...topics.map((item) => ({ value: item, label: item }))]}
                placeholder="All topics"
              />
              <SelectField
                id="practice-difficulty"
                label="Difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                options={[{ value: '', label: 'Mixed difficulty' }, ...EUEE_DIFFICULTIES.map((item) => ({ value: item.id, label: item.label }))]}
                placeholder="Mixed difficulty"
              />
              <TextField
                id="practice-count"
                label="Question count"
                type="number"
                min="1"
                max="30"
                value={count}
                onChange={(event) => setCount(event.target.value)}
              />
            </div>
          </div>
          <div className="euee-practice-setup__actions">
            <Button type="button" onClick={startPractice}>Start practice</Button>
          </div>

          <div className="euee-practice-history">
            <div className="euee-section__heading">
              <div>
                <span className="euee-section__kicker">Practice history</span>
                <h2>Recent practice sessions</h2>
              </div>
            </div>
            {history.length ? (
              <div className="euee-history-list">
                {history.map((session) => (
                  <article key={session.id} className="euee-history-item">
                    <div className="euee-history-item__main">
                      <span className="euee-history-item__type euee-history-item__type--practice">Practice</span>
                      <div>
                        <h3>{session.title}</h3>
                        <p>{formatDate(session.completedAt)} · {session.subjects.join(', ') || 'Mixed subjects'}</p>
                      </div>
                    </div>
                    <div className="euee-history-item__score">
                      <strong>{session.percent}%</strong>
                      <span>{session.score}/{session.total}</span>
                    </div>
                    <Button type="button" variant="secondary" onClick={() => navigate(`/euee/results/${session.id}`)}>Review results</Button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="euee-recommended__empty">No practice sessions yet. Start your first practice session above.</p>
            )}
          </div>
        </section>
      )}

      {phase === 'empty' && (
        <EmptyState
          icon={CheckCircle2}
          title="No questions found"
          message="Try selecting different subjects, topic, or difficulty."
          actionLabel="Back to EUEE dashboard"
          onAction={() => navigate('/euee')}
        />
      )}

      {phase === 'session' && current && (
        <section className="euee-practice-session">
          <div className="euee-session-meta">
            <span>Question {index + 1} of {questions.length}</span>
            <strong>Score {score}</strong>
          </div>
          <ProgressBar value={progress} showValue={false} />
          <QuestionCard
            question={current}
            selected={answers[current.id]}
            onSelect={selectAnswer}
            checked={Boolean(checked[current.id])}
          />
          <div className="euee-session-actions">
            <Button type="button" variant="secondary" icon={ArrowLeft} onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>
              Previous
            </Button>
            {!checked[current.id] ? (
              <Button type="button" onClick={checkAnswer} disabled={!answers[current.id]}>Check answer</Button>
            ) : (
              <Button type="button" icon={ArrowRight} onClick={nextQuestion}>
                {index + 1 === questions.length ? 'Finish practice' : 'Next'}
              </Button>
            )}
          </div>
        </section>
      )}

      {phase === 'complete' && (
        <section className="euee-panel euee-practice-complete">
          <span className="euee-practice-complete__icon" aria-hidden="true"><CheckCircle2 size={30} /></span>
          <h2>Practice complete</h2>
          <p>You scored {score} out of {questions.length}.</p>
          <ProgressBar value={questions.length ? Math.round((score / questions.length) * 100) : 0} label="Accuracy" />
          <div className="euee-practice-complete__actions">
            <Button type="button" icon={RotateCcw} onClick={retry}>Retry</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/euee')}>Back to EUEE dashboard</Button>
          </div>
        </section>
      )}
    </div>
  )
}

export default EUEEPracticePage
