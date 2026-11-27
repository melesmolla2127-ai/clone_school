import LoadingIndicator from '../components/common/LoadingIndicator'
import Logo from '../components/common/Logo'
import useAuth from '../hooks/useAuth'
import useDelayedNavigate from '../hooks/useDelayedNavigate'
import './SplashPage.css'

function SplashPage() {
  const { isAuthenticated } = useAuth()
  useDelayedNavigate(isAuthenticated ? '/home' : '/login', 3000)

  return (
    <main className="splash">
      <div className="splash__grid" aria-hidden="true" />
      <span className="splash__glow splash__glow--one" aria-hidden="true" />
      <span className="splash__glow splash__glow--two" aria-hidden="true" />

      <div className="splash__content">
        <div className="splash__logo">
          <Logo size="large" showWordmark={false} />
        </div>

        <h1 className="splash__name">Clone School</h1>
        <p className="splash__tagline">Learn. Grow. Achieve.</p>

        <LoadingIndicator label="Preparing your classroom" />
      </div>

      <span className="splash__progress" aria-hidden="true" />
      <span className="splash__footer">Made for focused learning</span>
      <span className="splash__home-indicator" aria-hidden="true" />
    </main>
  )
}

export default SplashPage
