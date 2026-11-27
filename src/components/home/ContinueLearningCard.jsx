import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { continueLearning } from '../../data/homeData'
import { getLastStudied, getSubjectProgress } from '../../services/learningProgress'
import Button from '../common/Button'
import HomeSectionHeading from './HomeSectionHeading'
import './ContinueLearningCard.css'

function buildPath(lastStudied) {
  const params = new URLSearchParams()
  if (lastStudied.grade) params.set('grade', lastStudied.grade)
  if (lastStudied.stream) params.set('stream', lastStudied.stream)
  const suffix = params.toString()
  return `/courses/${lastStudied.subjectId}${lastStudied.unitId ? `/${lastStudied.unitId}` : ''}${suffix ? `?${suffix}` : ''}`
}

function ContinueLearningCard() {
  const navigate = useNavigate()
  const lastStudied = getLastStudied()
  const hasProgress = Boolean(lastStudied?.subjectId)
  const progress = hasProgress
    ? getSubjectProgress({
        grade: lastStudied.grade,
        stream: lastStudied.stream,
        subjectId: lastStudied.subjectId,
        totalUnits: lastStudied.totalUnits || 8,
      }).percent
    : 0

  const card = hasProgress
    ? {
        subject: lastStudied.subjectTitle,
        topic: lastStudied.unitTitle ? `Unit · ${lastStudied.unitTitle}` : 'Course in progress',
        nextLesson: lastStudied.unitTitle || 'Continue where you left off',
        path: buildPath(lastStudied),
      }
    : {
        subject: continueLearning.subject,
        topic: 'No course started yet',
        nextLesson: 'Choose a subject to begin',
        path: '/courses',
      }
  const Icon = continueLearning.icon

  return (
    <section className="continue-card" aria-labelledby="continue-learning-title">
      <HomeSectionHeading
        kicker="Keep the momentum"
        title="Continue Learning"
        id="continue-learning-title"
      />

      <div className="continue-card__body">
        <div className="continue-card__copy">
          <span className="continue-card__subject">{card.subject}</span>
          <p className="continue-card__topic">{card.topic}</p>

          <div className="continue-card__progress-label">
            <span>{hasProgress ? 'Course progress' : 'Ready when you are'}</span>
            <strong>{progress}%</strong>
          </div>
          <div className="continue-card__track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          <Button
            className="continue-card__button"
            type="button"
            icon={ArrowRight}
            onClick={() => navigate(card.path)}
          >
            {hasProgress ? 'Continue lesson' : 'Browse courses'}
          </Button>
        </div>

        <div className="continue-card__visual" aria-hidden="true">
          <div
            className="continue-card__ring"
            style={{ '--progress': `${progress}%` }}
          >
            <span className="continue-card__ring-icon">
              <Icon size={27} strokeWidth={1.9} />
            </span>
          </div>
          <span className="continue-card__next">{card.nextLesson}</span>
        </div>
      </div>
    </section>
  )
}

export default ContinueLearningCard
