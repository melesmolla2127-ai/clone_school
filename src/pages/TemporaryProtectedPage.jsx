import { useNavigate } from 'react-router-dom'
import { BookOpen, GraduationCap, LogOut } from 'lucide-react'
import Button from '../components/common/Button'
import Logo from '../components/common/Logo'
import { getGradeLabel } from '../data/options'
import useAuth from '../hooks/useAuth'
import { requiresStream } from '../utils/validation'
import './TemporaryProtectedPage.css'

function TemporaryProtectedPage() {
  const { student, signOut } = useAuth()
  const navigate = useNavigate()

  if (!student) return null

  const handleLogout = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <main className="demo-page">
      <div className="demo-page__glow" aria-hidden="true" />
      <div className="demo-page__content">
        <header className="demo-page__header">
          <Logo size="small" />
          <span className="demo-page__badge">Temporary demo access</span>
        </header>

        <section className="demo-card" aria-labelledby="demo-title">
          <span className="demo-card__eyebrow">Signed in as a student</span>
          <h1 id="demo-title">Welcome, {student.firstName}!</h1>
          <p className="demo-card__subtitle">
            Your demo student session is active and ready for testing.
          </p>

          <div className="demo-card__details">
            <div className="demo-detail">
              <span className="demo-detail__icon">
                <GraduationCap size={19} strokeWidth={1.8} />
              </span>
              <span className="demo-detail__text">
                <small>Grade</small>
                <strong>{getGradeLabel(student.grade)}</strong>
              </span>
            </div>

            {requiresStream(student.grade) && (
              <div className="demo-detail">
                <span className="demo-detail__icon">
                  <BookOpen size={19} strokeWidth={1.8} />
                </span>
                <span className="demo-detail__text">
                  <small>Stream</small>
                  <strong>{student.stream || 'Not selected'}</strong>
                </span>
              </div>
            )}
          </div>

          <Button
            className="demo-card__logout"
            type="button"
            variant="secondary"
            icon={LogOut}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </section>

        <p className="demo-page__note">The full learning dashboard will be added in a later stage.</p>
      </div>

      <span className="demo-page__home-indicator" aria-hidden="true" />
    </main>
  )
}

export default TemporaryProtectedPage
