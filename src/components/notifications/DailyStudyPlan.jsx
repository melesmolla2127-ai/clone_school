import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Flame,
  Gamepad2,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ProgressBar from '../courses/ProgressBar'
import useNotifications from '../../hooks/useNotifications'
import { getDailySummary } from '../../services/dailyProgressService'
import { getEueeDashboardStats } from '../../services/eueeProgress'
import { getGameProgress, getRecentlyPlayed } from '../../services/gameProgress'
import { getLastStudied, getQuestionAccuracy } from '../../services/learningProgress'
import './DailyStudyPlan.css'

function buildCoursePath(lastStudied) {
  if (!lastStudied?.subjectId) return '/courses'

  const params = new URLSearchParams()
  if (lastStudied.grade) params.set('grade', lastStudied.grade)
  if (lastStudied.stream) params.set('stream', lastStudied.stream)
  const query = params.toString()

  return `/courses/${lastStudied.subjectId}${lastStudied.unitId ? `/${lastStudied.unitId}` : ''}${query ? `?${query}` : ''}`
}

function buildPlan() {
  const rawSummary = getDailySummary()
  const summary = {
    actions: Math.max(0, Number(rawSummary.actions) || 0),
    goal: Math.max(1, Number(rawSummary.goal) || 5),
    percent: Math.max(0, Math.min(100, Number(rawSummary.percent) || 0)),
    streak: Math.max(0, Number(rawSummary.streak) || 0),
    goalCompleted: Boolean(rawSummary.goalCompleted),
  }

  const lastStudied = getLastStudied()
  const accuracy = Math.max(0, Math.min(100, Number(getQuestionAccuracy()) || 0))
  const gameProgress = getGameProgress()
  const recentGame = getRecentlyPlayed(1)[0]
  const bestScore = Math.max(0, Number(gameProgress.highScores?.['math-challenge']) || 0)
  const eueeStats = getEueeDashboardStats()
  const weakTopic = eueeStats.weakTopics?.[0]
  const lowestSubject = weakTopic
    ? null
    : [...(eueeStats.subjectStats ?? [])].sort((first, second) => (Number(first.percent) || 0) - (Number(second.percent) || 0))[0]

  const course = {
    id: 'course',
    icon: BookOpen,
    title: lastStudied?.subjectId ? `Continue ${lastStudied.subjectTitle || 'your course'}` : 'Start a course',
    description: lastStudied?.unitTitle
      ? `Resume ${lastStudied.unitTitle}`
      : lastStudied?.subjectId
        ? 'Pick up where you left off'
        : 'Choose a subject to begin',
    path: buildCoursePath(lastStudied),
  }

  const practice = {
    id: 'practice',
    icon: ClipboardList,
    title: 'Complete 10 practice questions',
    description: accuracy ? `Build on your ${accuracy}% accuracy.` : 'Answer 10 questions to build accuracy.',
    path: '/practice',
  }

  const game = {
    id: 'game',
    icon: Gamepad2,
    title: 'Play a short educational game',
    description: bestScore
      ? `Math Challenge · best score ${bestScore}`
      : recentGame?.title
        ? `Try Math Challenge after ${recentGame.title}`
        : 'A quick 5-minute Math Challenge session.',
    path: '/games/math-challenge',
  }

  const euee = weakTopic
    ? {
        id: 'euee',
        icon: GraduationCap,
        title: `Review ${weakTopic.topic || 'a weak EUEE topic'}`,
        description: `${eueeStats.subjectStats?.find((subject) => subject.id === weakTopic.subjectId)?.name ? `${eueeStats.subjectStats.find((subject) => subject.id === weakTopic.subjectId).name} · ` : ''}${Math.max(0, Math.min(100, Number(weakTopic.accuracy) || 0))}% accuracy · short practice set`,
        path: '/euee',
      }
    : {
        id: 'euee',
        icon: GraduationCap,
        title: `Review ${lowestSubject?.name || 'EUEE'}`,
        description: lowestSubject?.practiced
          ? `${Math.max(0, Math.min(100, Number(lowestSubject.percent) || 0))}% accuracy · start a practice set`
          : 'Start with a short EUEE practice set',
        path: '/euee',
      }

  return { summary, steps: [course, practice, game, euee] }
}

function DailyStudyPlan() {
  const [plan, setPlan] = useState(buildPlan)
  const { unreadCount } = useNotifications()

  useEffect(() => {
    const handleUpdate = () => setPlan(buildPlan())
    window.addEventListener('clone-school:progress-updated', handleUpdate)
    return () => window.removeEventListener('clone-school:progress-updated', handleUpdate)
  }, [])

  return (
    <section className="daily-study-plan" aria-labelledby="daily-study-plan-title">
      <div className="daily-study-plan__header">
        <div>
          <span className="daily-study-plan__kicker">
            <Sparkles size={12} aria-hidden="true" />
            Today
          </span>
          <h2 className="daily-study-plan__title" id="daily-study-plan-title">Daily study plan</h2>
        </div>
        <span className="daily-study-plan__streak">
          <Flame size={14} aria-hidden="true" />
          {plan.summary.streak} day streak
        </span>
      </div>

      <div className="daily-study-plan__goal">
        <ProgressBar
          className="daily-study-plan__progress"
          value={plan.summary.percent}
          label={`${plan.summary.actions}/${plan.summary.goal} daily actions`}
        />
        {plan.summary.goalCompleted && (
          <span className="daily-study-plan__complete">
            <CheckCircle2 size={13} aria-hidden="true" />
            Goal complete
          </span>
        )}
      </div>

      <ol className="daily-study-plan__steps">
        {plan.steps.map((step, index) => {
          const Icon = step.icon
          return (
            <li key={step.id}>
              <Link className="daily-study-plan__step" to={step.path}>
                <span className="daily-study-plan__step-index" aria-hidden="true">{index + 1}</span>
                <span className="daily-study-plan__step-icon" aria-hidden="true">
                  <Icon size={15} strokeWidth={2} />
                </span>
                <span className="daily-study-plan__step-copy">
                  <strong>{step.title}</strong>
                  <small>{step.description}</small>
                </span>
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ol>

      <Link
        className="daily-study-plan__link"
        to="/notifications"
        aria-label={unreadCount > 0 ? `View notifications, ${unreadCount} unread` : 'View notifications'}
      >
        <span>View notifications</span>
        {unreadCount > 0 && <span className="daily-study-plan__unread">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </section>
  )
}

export default DailyStudyPlan
