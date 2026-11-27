import { useMemo, useState } from 'react'
import { Award, Clock3, RotateCcw, Target } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/common/Button'
import EmptyState from '../components/courses/EmptyState'
import PageHeader from '../components/courses/PageHeader'
import ProgressBar from '../components/courses/ProgressBar'
import AnswerReview from '../components/euee/AnswerReview'
import PerformancePanel from '../components/euee/PerformancePanel'
import { getEueeSessionById } from '../services/eueeProgress.js'
import './EUEEResultsPage.css'

function formatDuration(seconds) {
  const safe = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safe / 60)
  const secs = safe % 60
  if (!minutes) return `${secs}s`
  return `${minutes}m ${secs}s`
}

function performanceLevel(percent) {
  if (percent >= 85) return 'Excellent'
  if (percent >= 70) return 'Strong'
  if (percent >= 50) return 'Developing'
  return 'Needs improvement'
}

function EUEEResultsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const session = useMemo(() => getEueeSessionById(id), [id])
  const [reviewIndex, setReviewIndex] = useState(0)
  const [showReview, setShowReview] = useState(false)

  if (!session) {
    return (
      <div className="euee-results-page">
        <PageHeader kicker="EUEE results" title="Results not found" description="This session could not be found in your saved EUEE history." backTo="/euee" />
        <EmptyState
          icon={Target}
          title="Session unavailable"
          message="The exam or practice session you are looking for is missing or was removed from this device."
          actionLabel="Back to EUEE dashboard"
          onAction={() => navigate('/euee')}
        />
      </div>
    )
  }

  const unanswered = session.unanswered ?? session.answers.filter((item) => !item.selected).length
  const incorrect = session.incorrect ?? session.answers.filter((item) => item.selected && !item.correct).length
  const accuracy = session.total ? Math.round((session.correct / session.total) * 100) : 0
  const weakTopics = [...new Set(session.answers.filter((item) => !item.correct).map((item) => item.topic))]
  const weakSubjects = [...new Set(session.answers.filter((item) => !item.correct).map((item) => item.subjectName || item.subjectId))]
  const recommendation = weakTopics[0]
    ? `Start practice on ${weakTopics[0]} to improve your next score.`
    : 'Great work. Try a harder mock exam to keep improving.'

  const retake = () => {
    const params = new URLSearchParams()
    if (session.subjectIds?.length) params.set('subjects', session.subjectIds.join(','))
    if (session.total) params.set('count', String(session.total))
    if (session.difficulty && session.difficulty !== 'mixed') params.set('difficulty', session.difficulty)
    if (session.durationSeconds) params.set('duration', String(Math.max(1, Math.round(session.durationSeconds / 60))))
    navigate(`/euee/exam?${params.toString()}`)
  }

  return (
    <div className="euee-results-page">
      <PageHeader
        kicker={session.type === 'exam' ? 'Exam results' : 'Practice results'}
        title={session.title}
        description="Review your performance, understand mistakes, and plan your next EUEE study step."
        backTo="/euee"
      />

      <section className="euee-results-summary">
        <div className="euee-results-summary__score">
          <span className="euee-results-summary__icon" aria-hidden="true"><Award size={28} /></span>
          <div>
            <span className="euee-section__kicker">Performance</span>
            <h2>{session.percent}%</h2>
            <p>{performanceLevel(session.percent)} · {session.score}/{session.total} correct</p>
          </div>
        </div>
        <div className="euee-results-summary__stats">
          <div className="euee-results-stat"><span>Correct</span><strong>{session.correct}</strong></div>
          <div className="euee-results-stat"><span>Incorrect</span><strong>{incorrect}</strong></div>
          <div className="euee-results-stat"><span>Unanswered</span><strong>{unanswered}</strong></div>
          <div className="euee-results-stat"><span>Time spent</span><strong>{formatDuration(session.durationSeconds)}</strong></div>
          <div className="euee-results-stat"><span>Accuracy</span><strong>{accuracy}%</strong></div>
          <div className="euee-results-stat"><span>Level</span><strong>{performanceLevel(session.percent)}</strong></div>
        </div>
      </section>

      <section className="euee-panel">
        <ProgressBar value={session.percent} label="Overall score" />
        <div className="euee-results-recommendation">
          <Clock3 size={16} aria-hidden="true" />
          <div>
            <strong>Recommended next practice</strong>
            <p>{recommendation}</p>
          </div>
        </div>
        <div className="euee-results-actions">
          <Button type="button" onClick={() => { setShowReview(true); setReviewIndex(0) }}>Review answers</Button>
          <Button type="button" variant="secondary" icon={RotateCcw} onClick={retake}>Retake exam</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/euee')}>Back to EUEE dashboard</Button>
        </div>
      </section>

      <PerformancePanel session={session} />

      <section className="euee-panel euee-results-lists">
        <div>
          <h3>Strong topics</h3>
          <p>{[...new Set(session.answers.filter((item) => item.correct).map((item) => item.topic))].slice(0, 6).join(', ') || 'No strong topics yet.'}</p>
        </div>
        <div>
          <h3>Weak topics</h3>
          <p>{weakTopics.slice(0, 6).join(', ') || 'No weak topics identified.'}</p>
        </div>
        <div>
          <h3>Subjects needing improvement</h3>
          <p>{weakSubjects.join(', ') || 'All subjects are on track.'}</p>
        </div>
      </section>

      {showReview && (
        <AnswerReview answers={session.answers} currentIndex={reviewIndex} onJump={setReviewIndex} />
      )}
    </div>
  )
}

export default EUEEResultsPage
