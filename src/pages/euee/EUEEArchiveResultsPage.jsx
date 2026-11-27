import { useMemo, useState } from 'react'
import { Award, Clock3, RotateCcw } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import EmptyState from '../../components/courses/EmptyState'
import PageHeader from '../../components/courses/PageHeader'
import ProgressBar from '../../components/courses/ProgressBar'
import AnswerReview from '../../components/euee/AnswerReview'
import { getArchiveStream, getArchiveSubject } from '../../data/euee/archive/archiveCatalog.js'
import { getArchiveAttemptById } from '../../services/eueeArchiveService.js'
import './EUEEArchiveResultsPage.css'

function formatDuration(seconds) {
  const safe = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safe / 60)
  const secs = safe % 60
  if (!minutes) return `${secs}s`
  return `${minutes}m ${secs}s`
}

function EUEEArchiveResultsPage() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const attempt = useMemo(() => getArchiveAttemptById(attemptId), [attemptId])
  const [reviewIndex, setReviewIndex] = useState(0)
  const [showReview, setShowReview] = useState(false)

  if (!attempt) {
    return (
      <div className="archive-results-page">
        <PageHeader kicker="Archive results" title="Results not found" description="This archive attempt was not found on this device." backTo="/euee/archive" />
        <EmptyState icon={Award} title="Attempt unavailable" message="The archive exam result may have been removed from local storage." actionLabel="Back to archive" onAction={() => navigate('/euee/archive')} />
      </div>
    )
  }

  const stream = getArchiveStream(attempt.streamId)
  const subject = getArchiveSubject(attempt.subjectId)
  const answers = attempt.answers ?? []
  const accuracy = attempt.total ? Math.round((attempt.correct / attempt.total) * 100) : 0
  const autoSubmitted = location.state?.autoSubmitted

  return (
    <div className="archive-results-page">
      <PageHeader
        kicker="Archive results"
        title={`${subject?.name ?? attempt.subjectId} ${attempt.year} E.C.`}
        description={`${stream?.name ?? attempt.streamId} ? ${autoSubmitted ? 'Auto-submitted when time ended.' : 'Exam submitted successfully.'}`}
        backTo="/euee/archive"
      />

      <section className="euee-results-summary">
        <div className="euee-results-summary__score">
          <span className="euee-results-summary__icon" aria-hidden="true"><Award size={28} /></span>
          <div>
            <span className="euee-section__kicker">Archive exam score</span>
            <h2>{attempt.percent}%</h2>
            <p>{attempt.correct}/{attempt.total} correct</p>
          </div>
        </div>
        <div className="euee-results-summary__stats">
          <div className="euee-results-stat"><span>Correct</span><strong>{attempt.correct}</strong></div>
          <div className="euee-results-stat"><span>Incorrect</span><strong>{attempt.incorrect}</strong></div>
          <div className="euee-results-stat"><span>Unanswered</span><strong>{attempt.unanswered}</strong></div>
          <div className="euee-results-stat"><span>Time used</span><strong>{formatDuration(attempt.durationSeconds)}</strong></div>
          <div className="euee-results-stat"><span>Accuracy</span><strong>{accuracy}%</strong></div>
          <div className="euee-results-stat"><span>Year</span><strong>{attempt.year} E.C.</strong></div>
        </div>
      </section>

      <section className="euee-panel">
        <ProgressBar value={attempt.percent} label="Overall score" />
        <div className="euee-results-recommendation">
          <Clock3 size={16} aria-hidden="true" />
          <div>
            <strong>Next step</strong>
            <p>Review explanations, then retake this archive exam or choose another year/subject from the archive.</p>
          </div>
        </div>
        <div className="euee-results-actions">
          <Button type="button" onClick={() => { setShowReview(true); setReviewIndex(0) }}>Review answers</Button>
          <Button type="button" variant="secondary" icon={RotateCcw} onClick={() => navigate(`/euee/archive/${attempt.year}/${attempt.streamId}/${attempt.subjectId}`)}>Retake exam</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/euee/archive')}>Back to archive</Button>
        </div>
      </section>

      {showReview && (
        <AnswerReview answers={answers} currentIndex={reviewIndex} onJump={setReviewIndex} />
      )}
    </div>
  )
}

export default EUEEArchiveResultsPage
