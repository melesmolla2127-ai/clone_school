import { BookOpen, Flame, TrendingUp } from 'lucide-react'
import Logo from '../components/common/Logo'
import './AuthLayout.css'

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-layout__brand" aria-hidden="true">
        <div className="auth-layout__brand-header">
          <Logo size="small" />
          <span className="auth-layout__stage-pill">Student demo</span>
        </div>

        <div className="auth-layout__brand-copy">
          <span className="auth-layout__eyebrow">Learn anywhere</span>
          <h2>
            Your classroom,
            <br />
            reimagined.
          </h2>
          <p>
            Beautiful lessons, focused practice, and steady progress in one calm learning space.
          </p>
        </div>

        <div className="auth-layout__visual">
          <span className="auth-layout__orb auth-layout__orb--one" />
          <span className="auth-layout__orb auth-layout__orb--two" />

          <div className="auth-layout__card auth-layout__card--lesson">
            <span className="auth-layout__card-icon">
              <BookOpen size={20} strokeWidth={1.8} />
            </span>
            <span className="auth-layout__card-text">
              <strong>Today's lesson</strong>
              <small>Introduction to algebra</small>
            </span>
          </div>

          <div className="auth-layout__card auth-layout__card--streak">
            <Flame size={18} strokeWidth={1.9} />
            <span className="auth-layout__card-text">
              <strong>7 day streak</strong>
              <small>Keep it going</small>
            </span>
          </div>

          <div className="auth-layout__card auth-layout__card--progress">
            <TrendingUp size={18} strokeWidth={1.9} />
            <span className="auth-layout__card-text">
              <strong>82% complete</strong>
              <small>Course progress</small>
            </span>
          </div>
        </div>
      </aside>

      <main className="auth-layout__main">
        <header className="auth-layout__mobile-header">
          <Logo size="small" tone="dark" />
          <span className="auth-layout__mobile-pill">Preview</span>
        </header>

        <div className="auth-layout__content">{children}</div>

        <span className="auth-layout__home-indicator" aria-hidden="true" />
      </main>
    </div>
  )
}

export default AuthLayout
