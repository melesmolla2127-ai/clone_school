import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import LoginForm from '../components/auth/LoginForm'
import AuthLayout from '../layouts/AuthLayout'
import './LoginPage.css'

function LoginPage() {
  return (
    <AuthLayout>
      <div className="login-page">
        <AuthCard
          badge="Demo student access"
          badgeIcon={ShieldCheck}
          title="Welcome back"
          subtitle="Sign in to continue your learning journey."
          titleId="login-title"
          footer={
            <p>
              New to Clone School?{' '}
              <Link className="auth-footer__link" to="/register">
                Create a student account
              </Link>
              <span className="auth-footer__note">Demo only — data stays in this browser.</span>
            </p>
          }
        >
          <LoginForm />
        </AuthCard>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
