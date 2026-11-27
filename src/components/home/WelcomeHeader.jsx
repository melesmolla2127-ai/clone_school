import { GraduationCap, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NotificationBell from '../notifications/NotificationBell'
import { getGradeLabel } from '../../data/options'
import useAuth from '../../hooks/useAuth'
import { requiresStream } from '../../utils/validation'
import './WelcomeHeader.css'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getInitial(name) {
  return String(name || 'S').trim().charAt(0).toUpperCase() || 'S'
}

function WelcomeHeader() {
  const { student } = useAuth()
  const navigate = useNavigate()
  const firstName = student?.firstName || 'there'
  const gradeLabel = student?.grade ? getGradeLabel(student.grade) : 'Grade not set'
  const showStream = Boolean(student && requiresStream(student.grade))
  const streamLabel = student?.stream || 'Stream not set'

  return (
    <header className="welcome-header">
      <div className="welcome-header__glow" aria-hidden="true" />

      <div className="welcome-header__copy">
        <span className="welcome-header__eyebrow">
          <Sparkles size={13} aria-hidden="true" />
          Clone School student space
        </span>
        <h1 className="welcome-header__title">
          {getGreeting()}, {firstName}
        </h1>
        <p className="welcome-header__subtitle">Ready to make today count?</p>

        <div className="welcome-header__meta">
          <span className="welcome-header__meta-pill">
            <GraduationCap size={14} aria-hidden="true" />
            {gradeLabel}
          </span>
          {showStream && (
            <span className="welcome-header__meta-pill welcome-header__meta-pill--soft">
              {streamLabel}
            </span>
          )}
        </div>
      </div>

      <div className="welcome-header__actions">
        <NotificationBell className="welcome-header__icon-button" />
        <button
          className="welcome-header__avatar"
          type="button"
          aria-label="Open profile"
          onClick={() => navigate('/profile')}
        >
          {getInitial(student?.firstName)}
        </button>
      </div>
    </header>
  )
}

export default WelcomeHeader
