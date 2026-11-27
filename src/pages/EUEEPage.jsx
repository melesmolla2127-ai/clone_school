import { useMemo } from 'react'
import { Archive, ArrowRight, BookOpenCheck, Clock3, Flame, GraduationCap, History, Target, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import EmptyState from '../components/courses/EmptyState'
import PageHeader from '../components/courses/PageHeader'
import ProgressBar from '../components/courses/ProgressBar'
import { EUEE_SUBJECTS } from '../data/euee/eueeSubjects.js'
import useAuth from '../hooks/useAuth'
import { getEueeDashboardStats } from '../services/eueeProgress.js'
import './EUEEPage.css'

function formatDate(value) {
  if (!value) return 'No sessions yet'
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function getPerformanceLabel(percent) {
  if (percent >= 85) return 'Excellent'
  if (percent >= 70) return 'Strong'
  if (percent >= 50) return 'Developing'
  return 'Needs focus'
}

function EUEEPage() {
  const navigate = useNavigate()
  const { student } = useAuth()
  const stats = useMemo(() => getEueeDashboardStats(), [])
  const hasActivity = stats.totalSessions > 0

  const recommendedSubjects = useMemo(() => {
    const weakSubjectIds = new Set(stats.weakTopics.map((item) => item.subjectId))
    return [...stats.subjectStats]
      .sort((a, b) => {
        const aWeak = weakSubjectIds.has(a.id) ? 1 : 0
        const bWeak = weakSubjectIds.has(b.id) ? 1 : 0
        if (aWeak !== bWeak) return bWeak - aWeak
        if (a.practiced !== b.practiced) return a.practiced - b.practiced
        return a.percent - b.percent
      })
      .slice(0, 3)
  }, [stats.subjectStats, stats.weakTopics])

  const statCards = [
    { label: 'Exams completed', value: stats.examsCompleted, caption: 'Timed mock exams', icon: GraduationCap },
    { label: 'Practice sessions', value: stats.practiceSessions, caption: 'Focused practice', icon: BookOpenCheck },
    { label: 'Questions answered', value: stats.questionsAnswered, caption: `${stats.correctAnswers} correct`, icon: Target },
    { label: 'Average score', value: `${stats.averageScore}%`, caption: 'Across all sessions', icon: TrendingUp },
    { label: 'Best score', value: `${stats.bestScore}%`, caption: getPerformanceLabel(stats.bestScore), icon: AwardIcon },
    { label: 'Accuracy', value: `${stats.accuracy}%`, caption: `${stats.streak} day streak`, icon: Flame },
  ]

  return (
    <div className="euee-page">
      <PageHeader
        kicker="EUEE preparation"
        title="EUEE Exam Dashboard"
        description={`${student?.firstName || 'Student'}, prepare with focused practice, timed mock exams, and clear progress tracking${student?.grade ? ` for Grade ${student.grade}` : ''}${student?.stream ? ` ${student.stream}` : ''}.`}
        backTo="/home"
        action={(
          <div className="euee-page__header-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/euee/practice')}>
              Start practice
            </Button>
            <Button type="button" onClick={() => navigate('/euee/exam')}>
              Start mock exam
            </Button>
          </div>
        )}
      />

      <section className="euee-hero">
        <div className="euee-hero__copy">
          <span className="euee-hero__eyebrow">Serious exam preparation</span>
          <h2>Build confidence before exam day</h2>
          <p>
            Track your performance, target weak topics, and practice with real exam-style questions. All progress is saved on this device.
          </p>
          <div className="euee-hero__meta">
            <span><Clock3 size={15} aria-hidden="true" /> Last exam: {formatDate(stats.lastExamDate)}</span>
            <span><Flame size={15} aria-hidden="true" /> {stats.streak} day streak</span>
          </div>
        </div>
        <div className="euee-hero__ring" style={{ '--progress': `${stats.accuracy}%` }} aria-label={`Overall accuracy ${stats.accuracy}%`}>
          <div className="euee-hero__ring-inner">
            <strong>{stats.accuracy}%</strong>
            <span>Accuracy</span>
          </div>
        </div>
      </section>

      <section className="euee-section euee-archive-entry" aria-labelledby="euee-archive-title">
        <div className="euee-archive-entry__card">
          <div>
            <span className="euee-section__kicker">Historical exams</span>
            <h2 id="euee-archive-title">EUEE Historical Archive</h2>
            <p>Browse Ethiopian University Entrance Examination papers by year from 2000 E.C. to the current Ethiopian year. Practice by stream and subject, review answers, and track archive progress.</p>
          </div>
          <div className="euee-archive-entry__actions">
            <Button type="button" icon={Archive} onClick={() => navigate('/euee/archive')}>Open archive</Button>
            <Button type="button" variant="secondary" icon={History} onClick={() => navigate('/euee/archive')}>Browse years</Button>
          </div>
        </div>
      </section>

      <section className="euee-stats" aria-label="EUEE statistics">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.label} className="euee-stat-card">
              <span className="euee-stat-card__icon" aria-hidden="true"><Icon size={18} /></span>
              <div className="euee-stat-card__copy">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.caption}</small>
              </div>
            </article>
          )
        })}
      </section>

      <section className="euee-section" aria-labelledby="euee-subjects-title">
        <div className="euee-section__heading">
          <div>
            <span className="euee-section__kicker">Subjects</span>
            <h2 id="euee-subjects-title">Available subjects</h2>
          </div>
          <Button type="button" variant="secondary" onClick={() => navigate('/euee/practice')}>
            Start practice
          </Button>
        </div>
        <div className="euee-subjects-grid">
          {stats.subjectStats.map((subject) => {
            const Icon = subject.icon
            return (
              <article key={subject.id} className={`euee-subject-card euee-subject-card--${subject.tone}`}>
                <div className="euee-subject-card__top">
                  <span className="euee-subject-card__icon" aria-hidden="true"><Icon size={20} /></span>
                  <span className="euee-subject-card__score">{subject.percent}%</span>
                </div>
                <h3>{subject.name}</h3>
                <p>{subject.description}</p>
                <ProgressBar value={subject.percent} label={`${subject.practiced}/${subject.totalQuestions} practiced`} />
                <div className="euee-subject-card__meta">
                  <span>Best {subject.bestScore}%</span>
                  <span>{subject.exams} exams</span>
                </div>
                <Button type="button" variant="secondary" onClick={() => navigate(`/euee/practice?subjects=${subject.id}`)}>
                  Start practice
                </Button>
              </article>
            )
          })}
        </div>
      </section>

      <section className="euee-section" aria-labelledby="euee-recommended-title">
        <div className="euee-section__heading">
          <div>
            <span className="euee-section__kicker">Recommended study</span>
            <h2 id="euee-recommended-title">Focus where it matters</h2>
          </div>
        </div>
        <div className="euee-recommended">
          <div className="euee-recommended__topics">
            <h3>Weak topics</h3>
            {stats.weakTopics.length ? (
              <ul className="euee-topic-list">
                {stats.weakTopics.slice(0, 6).map((topic) => {
                  const subject = EUEE_SUBJECTS.find((item) => item.id === topic.subjectId)
                  return (
                    <li key={`${topic.subjectId}-${topic.topic}`}>
                      <div>
                        <strong>{topic.topic}</strong>
                        <span>{subject?.name || topic.subjectId}</span>
                      </div>
                      <span className="euee-topic-list__accuracy">{topic.accuracy}%</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="euee-recommended__empty">Complete a few practice sessions and weak topics will appear here.</p>
            )}
          </div>
          <div className="euee-recommended__subjects">
            <h3>Recommended subjects</h3>
            <div className="euee-recommended__cards">
              {recommendedSubjects.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  className="euee-recommended-card"
                  onClick={() => navigate(`/euee/practice?subjects=${subject.id}`)}
                >
                  <div>
                    <strong>{subject.name}</strong>
                    <span>{subject.practiced ? `${subject.percent}% accuracy` : 'Not practiced yet'}</span>
                  </div>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="euee-section" aria-labelledby="euee-history-title">
        <div className="euee-section__heading">
          <div>
            <span className="euee-section__kicker">Recent activity</span>
            <h2 id="euee-history-title">Recent exam history</h2>
          </div>
          <div className="euee-page__header-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/euee/practice')}>
              Start practice
            </Button>
            <Button type="button" onClick={() => navigate('/euee/exam')}>
              Start mock exam
            </Button>
          </div>
        </div>
        {hasActivity ? (
          <div className="euee-history-list">
            {stats.recent.map((session) => (
              <article key={session.id} className="euee-history-item">
                <div className="euee-history-item__main">
                  <span className={`euee-history-item__type euee-history-item__type--${session.type}`}>{session.type === 'exam' ? 'Exam' : 'Practice'}</span>
                  <div>
                    <h3>{session.title}</h3>
                    <p>{formatDate(session.completedAt)} · {session.subjects.join(', ') || 'Mixed subjects'}</p>
                  </div>
                </div>
                <div className="euee-history-item__score">
                  <strong>{session.percent}%</strong>
                  <span>{session.score}/{session.total}</span>
                </div>
                <Button type="button" variant="secondary" onClick={() => navigate(`/euee/results/${session.id}`)}>
                  Review results
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={GraduationCap}
            title="No EUEE sessions yet"
            message="Start a practice session or a mock exam to build your performance history."
            actionLabel="Start practice"
            onAction={() => navigate('/euee/practice')}
          />
        )}
      </section>
    </div>
  )
}

function AwardIcon(props) {
  return <GraduationCap {...props} />
}

export default EUEEPage
