import { useMemo } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Flame,
  Gamepad2,
  GraduationCap,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProgressBar from '../components/courses/ProgressBar'
import ActivityTabs from '../components/profile/ActivityTabs'
import ProfileHero from '../components/profile/ProfileHero'
import ProfileStatCard from '../components/profile/ProfileStatCard'
import { DEFAULT_SCHOOL_NAME, GRADE_OPTIONS } from '../data/options.js'
import useAuth from '../hooks/useAuth'
import {
  getFullName,
  getInitial,
  getProfileActivity,
  getProfileSummary,
} from '../services/profileService.js'
import { requiresStream } from '../utils/validation.js'
import './ProfilePage.css'

function ProfilePage() {
  const { student, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const fullName = getFullName(student)
  const gradeLabel = GRADE_OPTIONS.find((grade) => grade.value === student?.grade)?.label ?? 'Grade not set'
  const stream = requiresStream(student?.grade) && student?.stream ? student.stream : ''
  const school = student?.schoolName || DEFAULT_SCHOOL_NAME
  const summary = useMemo(() => getProfileSummary(), [])
  const activity = useMemo(() => getProfileActivity(), [])

  const stats = [
    {
      id: 'subjects',
      icon: BookOpen,
      label: 'Subjects studied',
      value: summary.subjectsStudied,
      detail: 'Subjects opened so far',
    },
    {
      id: 'course-progress',
      icon: GraduationCap,
      label: 'Course progress',
      value: `${summary.courseProgress}%`,
      detail: `${summary.unitsCompleted} units completed`,
      progress: summary.courseProgress,
    },
    {
      id: 'units',
      icon: ClipboardList,
      label: 'Units completed',
      value: summary.unitsCompleted,
      detail: `${summary.questionsAnswered} questions answered`,
    },
    {
      id: 'games',
      icon: Gamepad2,
      label: 'Games played',
      value: summary.gamesPlayed,
      detail: 'Learning games completed',
    },
    {
      id: 'xp',
      icon: Sparkles,
      label: 'XP / level',
      value: `${summary.xp} XP`,
      detail: `Level ${summary.level}`,
    },
    {
      id: 'achievements',
      icon: Trophy,
      label: 'Achievements',
      value: `${summary.achievementsUnlocked}/${summary.achievementsTotal}`,
      detail: 'Badges unlocked',
    },
    {
      id: 'euee',
      icon: Target,
      label: 'EUEE progress',
      value: `${summary.eueeExams} exams`,
      detail: `${summary.eueeAccuracy}% accuracy`,
    },
    {
      id: 'streak',
      icon: Flame,
      label: 'Learning streak',
      value: `${summary.streak} days`,
      detail: `Daily goal ${summary.dailyGoal} actions`,
    },
  ]

  const handleLogout = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="profile-page">
      {location.state?.flash && (
        <div className="profile-page__feedback" role="status">
          <CheckCircle2 size={17} aria-hidden="true" />
          {location.state.flash}
        </div>
      )}

      <ProfileHero
        name={fullName}
        initial={getInitial(fullName)}
        gradeLabel={gradeLabel}
        stream={stream}
        school={school}
        status="Active demo account"
        onEdit={() => navigate('/profile/edit')}
        onSettings={() => navigate('/settings')}
        onLogout={handleLogout}
      />

      <section className="profile-overview" aria-labelledby="profile-overview-title">
        <div className="profile-overview__heading">
          <span className="profile-overview__kicker">At a glance</span>
          <h2 id="profile-overview-title">Academic overview</h2>
          <p>Your progress is saved in this browser as you learn.</p>
        </div>
        <div className="profile-overview__grid">
          {stats.map((stat) => (
            <ProfileStatCard
              key={stat.id}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              detail={stat.detail}
            >
              {stat.progress !== undefined && (
                <ProgressBar value={stat.progress} label="Completion" showValue={false} />
              )}
            </ProfileStatCard>
          ))}
        </div>
      </section>

      <ActivityTabs activity={activity} dailyGoal={summary.dailyGoal} />
    </div>
  )
}

export default ProfilePage
